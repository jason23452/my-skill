#!/usr/bin/env node

const fs = require("fs")
const cp = require("child_process")

function exists(filePath) {
  return fs.existsSync(filePath)
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/u, ""))
  } catch (error) {
    throw new Error(`pinia: could not read ${filePath}: ${error.message}`)
  }
}

function dependencyMap(manifest) {
  return {
    ...(manifest.dependencies || {}),
    ...(manifest.devDependencies || {}),
    ...(manifest.optionalDependencies || {}),
  }
}

function hasDependency(manifest, name) {
  return Boolean(dependencyMap(manifest)[name])
}

function detectPackageManager(manifest) {
  const declared = typeof manifest.packageManager === "string"
    ? manifest.packageManager.split("@")[0]
    : ""

  if (["pnpm", "npm", "yarn", "bun"].includes(declared)) return declared
  if (exists("pnpm-lock.yaml")) return "pnpm"
  if (exists("bun.lock") || exists("bun.lockb")) return "bun"
  if (exists("yarn.lock")) return "yarn"
  if (exists("package-lock.json")) return "npm"
  return "pnpm"
}

function detectTarget(manifest) {
  const hasNuxtConfig = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"].some(exists)
  const hasNuxt = hasNuxtConfig || hasDependency(manifest, "nuxt")
  const hasVue = hasDependency(manifest, "vue") || exists("src/App.vue")
  const hasVite = hasDependency(manifest, "vite") ||
    ["vite.config.ts", "vite.config.js", "vite.config.mts", "vite.config.mjs"].some(exists)

  if (hasNuxt) return "nuxt"
  if (hasVue && hasVite) return "vue-vite"

  throw new Error("pinia: expected a Nuxt or Vue SPA Vite project; no Vue target was detected.")
}

function installCommand(packageManager, packages) {
  if (packageManager === "npm") return ["npm", ["install", ...packages]]
  if (packageManager === "yarn") return ["yarn", ["add", ...packages]]
  if (packageManager === "bun") return ["bun", ["add", ...packages]]
  return ["pnpm", ["add", ...packages]]
}

function run(command, args) {
  const executable = process.platform === "win32" && !/\.(cmd|exe|bat)$/iu.test(command)
    ? `${command}.cmd`
    : command
  const result = cp.spawnSync(executable, args, {
    stdio: "inherit",
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${executable} ${args.join(" ")} exited with code ${result.status || 1}`)
  }
}

function main() {
  if (!exists("package.json")) {
    throw new Error("pinia: package.json not found.")
  }

  const manifest = readJson("package.json")
  const target = detectTarget(manifest)
  const packageManager = detectPackageManager(manifest)
  const required = target === "nuxt" ? ["pinia", "@pinia/nuxt"] : ["pinia"]
  const missing = required.filter((name) => !hasDependency(manifest, name))

  if (!missing.length) {
    console.log(`pinia: dependencies already present for ${target}.`)
    return
  }

  const [command, args] = installCommand(packageManager, missing)
  console.log(`pinia: installing ${missing.join(" ")} with ${packageManager}.`)
  run(command, args)
}

main()
