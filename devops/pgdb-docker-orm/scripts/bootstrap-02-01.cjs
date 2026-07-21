#!/usr/bin/env node

const fs = require("fs")
const net = require("net")
const os = require("os")
const path = require("path")

const RESERVATION_FILE = process.env.OPENCODE_PORT_RESERVATION_FILE || path.join(os.tmpdir(), "opencode-compose-port-reservations.json")
const RESERVATION_TTL_MS = 12 * 60 * 60 * 1000
const PORT_SCAN_LIMIT = 2000

function readReservations() {
  const now = Date.now()
  try {
    const payload = JSON.parse(fs.readFileSync(RESERVATION_FILE, "utf8"))
    const entries = Array.isArray(payload.entries) ? payload.entries : []
    return entries.filter((entry) => {
      return (
        entry &&
        typeof entry.cwd === "string" &&
        Number.isInteger(entry.port) &&
        Number.isInteger(entry.reservedAt) &&
        now - entry.reservedAt < RESERVATION_TTL_MS
      )
    })
  } catch {
    return []
  }
}

function writeReservations(entries) {
  try {
    fs.writeFileSync(RESERVATION_FILE, JSON.stringify({ entries }, null, 2))
  } catch {
    // Port probing remains authoritative; reservation persistence only reduces scaffold collisions.
  }
}

function reserveHostPort(service, hostPort, containerPort) {
  const cwd = path.resolve(process.cwd())
  const entries = readReservations().filter((entry) => !(entry.cwd === cwd && entry.service === service))
  entries.push({
    cwd,
    service,
    port: hostPort,
    containerPort,
    reservedAt: Date.now(),
  })
  writeReservations(entries)
}

function reservedPortsForOtherRepos() {
  const cwd = path.resolve(process.cwd())
  return new Set(readReservations().filter((entry) => entry.cwd !== cwd).map((entry) => entry.port))
}

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.unref()
    server.once("error", () => resolve(false))
    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolve(true))
    })
  })
}

async function allocateHostPort(preferredPort, service, containerPort = preferredPort) {
  const preferred = Number(preferredPort)
  if (!Number.isInteger(preferred) || preferred <= 0) {
    throw new Error(`Invalid preferred port for ${service}: ${preferredPort}`)
  }

  for (let hostPort = preferred; hostPort < preferred + PORT_SCAN_LIMIT; hostPort += 1) {
    if (reservedPortsForOtherRepos().has(hostPort)) continue
    if (await canListen(hostPort)) {
      reserveHostPort(service, hostPort, containerPort)
      return hostPort
    }
  }

  throw new Error(`Could not find an available host port for ${service} near ${preferred}`)
}

function composeFile() {
  return ["compose.yaml", "compose.yml", "docker-compose.yml", "docker-compose.yaml"].find((file) => fs.existsSync(file)) || "compose.yaml"
}

function dbService(hostPort) {
  return [
    "  db:",
    "    image: postgres:17-alpine",
    "    environment:",
    "      POSTGRES_USER: postgres",
    "      POSTGRES_PASSWORD: postgres",
    "      POSTGRES_DB: app_db",
    `      POSTGRES_HOST_PORT: "${hostPort}"`,
    "    ports:",
    `      - "${hostPort}:5432"`,
    "    volumes:",
    "      - postgres_data:/var/lib/postgresql/data",
    "    healthcheck:",
    '      test: ["CMD-SHELL", "pg_isready -U postgres -d app_db"]',
    "      interval: 5s",
    "      timeout: 5s",
    "      retries: 10",
    "",
  ].join("\n")
}

function hasDbService(source) {
  return /\n  db:|^  db:/m.test(source)
}

function findHostPortForContainer(source, containerPort) {
  const match = source.match(new RegExp(`-\\s*["']?(\\d+):${containerPort}["']?`))
  return match ? Number(match[1]) : null
}

function ensurePostgresVolume(source) {
  if (!/^volumes:/m.test(source)) return `${source.trimEnd()}\n\nvolumes:\n  postgres_data:\n`
  if (/\n  postgres_data:|^  postgres_data:/m.test(source)) return source
  return `${source.trimEnd()}\n  postgres_data:\n`
}

function replaceHostPortForContainer(source, hostPort, containerPort) {
  return source.replace(new RegExp(`-\\s*["']?\\d+:${containerPort}["']?`), `- "${hostPort}:${containerPort}"`)
}

async function canUseExistingHostPort(hostPort) {
  return !reservedPortsForOtherRepos().has(hostPort) && (await canListen(hostPort))
}

async function main() {
  const file = composeFile()
  let source = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""
  if (!source.trim()) source = "services:\n"

  if (!hasDbService(source)) {
    const dbHostPort = await allocateHostPort(5432, "db", 5432)
    source = /^volumes:/m.test(source)
      ? source.replace(/\nvolumes:/, `\n${dbService(dbHostPort)}\nvolumes:`)
      : `${source.trimEnd()}\n${dbService(dbHostPort)}`
    console.log(`pgdb-docker-orm: allocated db host port ${dbHostPort} -> container port 5432`)
  } else {
    const existingHostPort = findHostPortForContainer(source, 5432)
    if (existingHostPort && (await canUseExistingHostPort(existingHostPort))) {
      reserveHostPort("db", existingHostPort, 5432)
      console.log(`pgdb-docker-orm: using existing db host port ${existingHostPort} -> container port 5432`)
    } else if (existingHostPort) {
      const dbHostPort = await allocateHostPort(5432, "db", 5432)
      source = replaceHostPortForContainer(source, dbHostPort, 5432)
      console.log(`pgdb-docker-orm: replaced occupied db host port ${existingHostPort} with ${dbHostPort} -> container port 5432`)
    } else {
      console.log("pgdb-docker-orm: db service already exists without a host port mapping")
    }
  }

  source = ensurePostgresVolume(source)
  fs.writeFileSync(file, source.endsWith("\n") ? source : `${source}\n`)
}

main().catch((error) => {
  console.error(`pgdb-docker-orm: ${error.message}`)
  process.exit(1)
})
