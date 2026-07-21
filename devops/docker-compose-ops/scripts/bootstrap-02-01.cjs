#!/usr/bin/env node

const fs = require("fs")

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

const hasPkg = exists("package.json")
const hasPy = exists("pyproject.toml") || exists("requirements.txt")
let lines

if (hasPkg) {
  const manifest = readJson("package.json")
  const port = detectFrontendPort(manifest)
  lines = [
    "services:",
    "  frontend:",
    "    build:",
    "      context: .",
    "      dockerfile: Dockerfile",
    "    ports:",
    `      - "${port}:${port}"`,
    "    environment:",
    "      VITE_API_BASE_URL: /api",
    `    command: ${devCommand(detectPackageManager(), port)}`,
  ]
} else if (hasPy) {
  lines = [
    "services:",
    "  backend:",
    "    build:",
    "      context: .",
    "      dockerfile: Dockerfile",
    "    ports:",
    '      - "8000:8000"',
    "    environment:",
    "      DATABASE_URL: postgresql+asyncpg://postgres:postgres@db:5432/app_db",
    "    depends_on:",
    "      db:",
    "        condition: service_healthy",
    "  db:",
    "    image: postgres:17-alpine",
    "    environment:",
    "      POSTGRES_USER: postgres",
    "      POSTGRES_PASSWORD: postgres",
    "      POSTGRES_DB: app_db",
    "    ports:",
    '      - "5432:5432"',
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
} else {
  lines = [
    "services:",
    "  app:",
    "    build:",
    "      context: .",
    "      dockerfile: Dockerfile",
    "    ports:",
    '      - "8080:8080"',
  ]
}

fs.writeFileSync("compose.yaml", `${lines.join("\n")}\n`)
