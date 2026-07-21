#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const cp = require("child_process")

const runtimePackages = ["@nuxt/ui", "tailwindcss"]
const devPackages = ["@iconify-json/lucide"]

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

function hasPackage(name) {
  const manifest = readJson("package.json")
  return Boolean((manifest.dependencies || {})[name] || (manifest.devDependencies || {})[name])
}

function installCommand(packageManager, packages, dev) {
  if (packageManager === "npm") return ["npm", ["install", ...(dev ? ["--save-dev"] : []), ...packages]]
  if (packageManager === "yarn") return ["yarn", ["add", ...(dev ? ["-D"] : []), ...packages]]
  if (packageManager === "bun") return ["bun", ["add", ...(dev ? ["-d"] : []), ...packages]]
  return ["pnpm", ["add", ...(dev ? ["-D"] : []), ...packages]]
}

function run(command, args) {
  const result = cp.spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with code ${result.status || 1}`)
  }
}

function runPnpmAllowBuilds() {
  const script = path.join(__dirname, "pnpm-allow-builds.cjs")
  if (exists(script)) run(process.execPath, [script])
}

function installPackages(packageManager, packages, dev) {
  const missing = packages.filter((name) => !hasPackage(name))
  if (!missing.length) return

  const [command, args] = installCommand(packageManager, missing, dev)
  console.log(`nuxt-ui: installing ${missing.join(" ")} with ${packageManager}.`)
  run(command, args)
}

function main() {
  if (!exists("package.json")) {
    console.log("nuxt-ui: package.json not found; skipped dependency install.")
    return
  }

  const packageManager = detectPackageManager()
  if (packageManager === "pnpm") runPnpmAllowBuilds()

  installPackages(packageManager, runtimePackages, false)
  installPackages(packageManager, devPackages, true)
}

main()
