#!/usr/bin/env node

const fs = require("fs")
const net = require("net")
const os = require("os")
const path = require("path")

const RESERVATION_FILE = process.env.OPENCODE_PORT_RESERVATION_FILE || path.join(os.tmpdir(), "opencode-compose-port-reservations.json")
const RESERVATION_TTL_MS = 12 * 60 * 60 * 1000
const PORT_SCAN_LIMIT = 2000

function exists(filePath) {
  return fs.existsSync(filePath)
}

function readJson(filePath, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"))
  } catch {
    return fallback
  }
}

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

async function allocateHostPort(preferredPort, localReservations, service, containerPort = preferredPort) {
  const preferred = Number(preferredPort)
  if (!Number.isInteger(preferred) || preferred <= 0) {
    throw new Error(`Invalid preferred port for ${service}: ${preferredPort}`)
  }

  for (let hostPort = preferred; hostPort < preferred + PORT_SCAN_LIMIT; hostPort += 1) {
    if (localReservations.has(hostPort) || reservedPortsForOtherRepos().has(hostPort)) continue
    if (await canListen(hostPort)) {
      localReservations.add(hostPort)
      reserveHostPort(service, hostPort, containerPort)
      return hostPort
    }
  }

  throw new Error(`Could not find an available host port for ${service} near ${preferred}`)
}

function detectPackageManager() {
  if (exists("pnpm-lock.yaml")) return "pnpm"
  if (exists("bun.lock") || exists("bun.lockb")) return "bun"
  if (exists("yarn.lock")) return "yarn"
  if (exists("package-lock.json")) return "npm"
  return "pnpm"
}

function detectFrontendPort(manifest) {
  const deps = { ...(manifest.dependencies || {}), ...(manifest.devDependencies || {}) }
  if (deps.nuxt || exists("nuxt.config.ts") || exists("nuxt.config.js") || exists("nuxt.config.mjs")) return 3000
  if (deps.next || exists("next.config.ts") || exists("next.config.js") || exists("next.config.mjs")) return 3000
  if (deps["@angular/core"] || exists("angular.json")) return 4200
  if (deps.astro || exists("astro.config.ts") || exists("astro.config.mjs")) return 4321
  return 5173
}

function devCommand(packageManager, port) {
  if (packageManager === "npm") return `npm run dev -- --host 0.0.0.0 --port ${port}`
  if (packageManager === "bun") return `bun run dev --host 0.0.0.0 --port ${port}`
  return `${packageManager} dev --host 0.0.0.0 --port ${port}`
}

async function main() {
  const localReservations = new Set()
  const hasPkg = exists("package.json")
  const hasPy = exists("pyproject.toml") || exists("requirements.txt")
  let lines

  if (hasPkg) {
    const manifest = readJson("package.json")
    const containerPort = detectFrontendPort(manifest)
    const hostPort = await allocateHostPort(containerPort, localReservations, "frontend", containerPort)
    const packageManager = detectPackageManager()

    lines = [
      "services:",
      "  frontend:",
      "    build:",
      "      context: .",
      "      dockerfile: Dockerfile",
      "    ports:",
      `      - "${hostPort}:${containerPort}"`,
      "    environment:",
      "      VITE_API_BASE_URL: /api",
      `      HOST_PORT: "${hostPort}"`,
      `      CONTAINER_PORT: "${containerPort}"`,
      `    command: ${devCommand(packageManager, containerPort)}`,
    ]

    console.log(`docker-compose-ops: allocated frontend host port ${hostPort} -> container port ${containerPort}`)
  } else if (hasPy) {
    const backendHostPort = await allocateHostPort(8000, localReservations, "backend", 8000)
    const dbHostPort = await allocateHostPort(5432, localReservations, "db", 5432)

    lines = [
      "services:",
      "  backend:",
      "    build:",
      "      context: .",
      "      dockerfile: Dockerfile",
      "    ports:",
      `      - "${backendHostPort}:8000"`,
      "    environment:",
      "      DATABASE_URL: postgresql+asyncpg://postgres:postgres@db:5432/app_db",
      `      BACKEND_HOST_PORT: "${backendHostPort}"`,
      `      POSTGRES_HOST_PORT: "${dbHostPort}"`,
      "    depends_on:",
      "      db:",
      "        condition: service_healthy",
      "  db:",
      "    image: postgres:17-alpine",
      "    environment:",
      "      POSTGRES_USER: postgres",
      "      POSTGRES_PASSWORD: postgres",
      "      POSTGRES_DB: app_db",
      `      POSTGRES_HOST_PORT: "${dbHostPort}"`,
      "    ports:",
      `      - "${dbHostPort}:5432"`,
      "    volumes:",
      "      - postgres_data:/var/lib/postgresql/data",
      "    healthcheck:",
      '      test: ["CMD-SHELL", "pg_isready -U postgres -d app_db"]',
      "      interval: 5s",
      "      timeout: 5s",
      "      retries: 10",
      "",
      "volumes:",
      "  postgres_data:",
    ]

    console.log(`docker-compose-ops: allocated backend host port ${backendHostPort} -> container port 8000`)
    console.log(`docker-compose-ops: allocated db host port ${dbHostPort} -> container port 5432`)
  } else {
    const hostPort = await allocateHostPort(8080, localReservations, "app", 8080)
    lines = [
      "services:",
      "  app:",
      "    build:",
      "      context: .",
      "      dockerfile: Dockerfile",
      "    ports:",
      `      - "${hostPort}:8080"`,
      "    environment:",
      `      HOST_PORT: "${hostPort}"`,
      '      CONTAINER_PORT: "8080"',
    ]

    console.log(`docker-compose-ops: allocated app host port ${hostPort} -> container port 8080`)
  }

  fs.writeFileSync("compose.yaml", `${lines.join("\n")}\n`)
}

main().catch((error) => {
  console.error(`docker-compose-ops: ${error.message}`)
  process.exit(1)
})
