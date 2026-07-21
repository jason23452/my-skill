#!/usr/bin/env node

const fs = require("fs")
const cp = require("child_process")

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

function scriptCommand(packageManager, scriptName) {
  if (packageManager === "npm") return ["npm", ["run", scriptName]]
  if (packageManager === "bun") return ["bun", ["run", scriptName]]
  return [packageManager, [scriptName]]
}

const manifest = readJson("package.json")
if (!manifest.scripts?.build) {
  console.log("nuxt-ui: package.json has no build script; skipped build verification.")
  process.exit(0)
}

const packageManager = detectPackageManager()
const [command, args] = scriptCommand(packageManager, "build")
const result = cp.spawnSync(command, args, {
  stdio: "inherit",
  shell: process.platform === "win32",
})

if (result.error) throw result.error
process.exit(result.status ?? 1)
