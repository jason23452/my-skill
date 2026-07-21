#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const cwd = process.cwd()
const nuxtConfigCandidates = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"]
const viteConfigCandidates = ["vite.config.ts", "vite.config.js", "vite.config.mts", "vite.config.mjs"]
const viteMainCandidates = [
  path.join("src", "main.ts"),
  path.join("src", "main.js"),
  path.join("main.ts"),
  path.join("main.js"),
]
const nuxtStoreDirCandidates = [
  path.join("app", "store"),
  path.join("src", "shared", "store"),
  path.join("src", "store"),
  "store",
]
const vueViteStoreDirCandidates = [
  path.join("src", "shared", "store"),
  path.join("src", "store"),
  "store",
]

function abs(filePath) {
  return path.join(cwd, filePath)
}

function exists(filePath) {
  return fs.existsSync(abs(filePath))
}

function read(filePath) {
  return fs.readFileSync(abs(filePath), "utf8").replace(/^\uFEFF/u, "")
}

function readJson(filePath, fallback = {}) {
  try {
    return JSON.parse(read(filePath))
  } catch {
    return fallback
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

function fail(message) {
  console.error(`pinia verification failed: ${message}`)
  process.exit(1)
}

function firstExisting(candidates) {
  return candidates.find(exists)
}

function featureStoreDirs() {
  const featureRoot = path.join("src", "features")
  if (!exists(featureRoot)) return []

  return fs.readdirSync(abs(featureRoot), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(featureRoot, entry.name, "store"))
}

function detectTarget(manifest) {
  const hasNuxtConfig = nuxtConfigCandidates.some(exists)
  const hasNuxt = hasNuxtConfig || hasDependency(manifest, "nuxt")
  const hasVue = hasDependency(manifest, "vue") || exists(path.join("src", "App.vue"))
  const hasVite = hasDependency(manifest, "vite") || viteConfigCandidates.some(exists)

  if (hasNuxt) return "nuxt"
  if (hasVue && hasVite) return "vue-vite"

  fail("expected a Nuxt or Vue SPA Vite project; no Vue target was detected.")
}

function verifyNuxt(manifest) {
  if (!hasDependency(manifest, "pinia")) fail("pinia is missing from package dependencies.")
  if (!hasDependency(manifest, "@pinia/nuxt")) fail("@pinia/nuxt is missing from package dependencies.")

  const configPath = nuxtConfigCandidates.find(exists)
  if (!configPath) fail("nuxt.config file is missing.")

  const configSource = read(configPath)
  if (!/modules\s*:\s*\[[\s\S]*["']@pinia\/nuxt["'][\s\S]*\]/u.test(configSource)) {
    fail("@pinia/nuxt is missing from nuxt.config modules.")
  }

  const storeDir = firstExisting([...nuxtStoreDirCandidates, ...featureStoreDirs()])
  if (!storeDir) fail("store directory is missing. Expected app/store, src/shared/store, src/features/<feature>/store, src/store, or store.")

  console.log(`pinia verification passed: Nuxt dependencies, @pinia/nuxt module, and store directory ${storeDir} are configured.`)
}

function verifyVueVite(manifest) {
  if (!hasDependency(manifest, "pinia")) fail("pinia is missing from package dependencies.")

  const mainPath = viteMainCandidates.find(exists)
  if (!mainPath) fail("Vue Vite app entry is missing.")

  const source = read(mainPath)
  if (!/import\s*\{[^}]*\bcreatePinia\b[^}]*\}\s*from\s*["']pinia["']/u.test(source)) {
    fail("createPinia import is missing from the Vue app entry.")
  }
  if (!/\.use\s*\(\s*(createPinia\s*\(\s*\)|pinia)\s*\)/u.test(source)) {
    fail("Pinia is not registered with app.use(...) in the Vue app entry.")
  }

  const storeDir = firstExisting([...vueViteStoreDirCandidates, ...featureStoreDirs()])
  if (!storeDir) fail("store directory is missing. Expected src/shared/store, src/features/<feature>/store, src/store, or store.")

  console.log(`pinia verification passed: Vue Vite dependency, app entry ${mainPath}, and store directory ${storeDir} are configured.`)
}

function main() {
  if (!exists("package.json")) fail("package.json is missing.")

  const manifest = readJson("package.json")
  const target = detectTarget(manifest)

  if (target === "nuxt") verifyNuxt(manifest)
  else verifyVueVite(manifest)
}

main()
