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

function abs(filePath) {
  return path.join(cwd, filePath)
}

function exists(filePath) {
  return fs.existsSync(abs(filePath))
}

function read(filePath) {
  return fs.readFileSync(abs(filePath), "utf8").replace(/^\uFEFF/u, "")
}

function write(filePath, source) {
  fs.writeFileSync(abs(filePath), source)
}

function ensureDir(filePath) {
  fs.mkdirSync(abs(filePath), { recursive: true })
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

function detectTarget(manifest) {
  const hasNuxtConfig = nuxtConfigCandidates.some(exists)
  const hasNuxt = hasNuxtConfig || hasDependency(manifest, "nuxt")
  const hasVue = hasDependency(manifest, "vue") || exists(path.join("src", "App.vue"))
  const hasVite = hasDependency(manifest, "vite") || viteConfigCandidates.some(exists)

  if (hasNuxt) return "nuxt"
  if (hasVue && hasVite) return "vue-vite"

  throw new Error("pinia: expected a Nuxt or Vue SPA Vite project; no Vue target was detected.")
}

function findMatchingClose(source, openIndex, openChar, closeChar) {
  let depth = 0
  let quote = null
  let escaped = false

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]

    if (quote) {
      if (escaped) escaped = false
      else if (char === "\\") escaped = true
      else if (char === quote) quote = null
      continue
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char
      continue
    }

    if (char === openChar) depth += 1
    if (char === closeChar) depth -= 1
    if (depth === 0) return index
  }

  return -1
}

function findConfigObject(source) {
  const match = /defineNuxtConfig\s*\(\s*\{/u.exec(source)
  if (!match) return null

  const open = source.indexOf("{", match.index)
  const close = findMatchingClose(source, open, "{", "}")
  if (close === -1) return null

  return { open, close }
}

function findArrayProperty(source, objectRange, name) {
  const bodyStart = objectRange.open + 1
  const body = source.slice(bodyStart, objectRange.close)
  const match = new RegExp(`\\b${name}\\s*:\\s*\\[`, "u").exec(body)
  if (!match) return null

  const open = bodyStart + match.index + match[0].lastIndexOf("[")
  const close = findMatchingClose(source, open, "[", "]")
  if (close === -1 || close > objectRange.close) return null

  return { open, close }
}

function insertTopLevelProperty(source, propertyText) {
  const config = findConfigObject(source)
  if (!config) {
    return `export default defineNuxtConfig({\n  ${propertyText}\n})\n`
  }

  return `${source.slice(0, config.open + 1)}\n  ${propertyText}${source.slice(config.open + 1)}`
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function ensureArrayValue(source, propertyName, value) {
  const config = findConfigObject(source)
  if (!config) return insertTopLevelProperty(source, `${propertyName}: ['${value}'],`)

  const arrayRange = findArrayProperty(source, config, propertyName)
  if (!arrayRange) return insertTopLevelProperty(source, `${propertyName}: ['${value}'],`)

  const existing = source.slice(arrayRange.open, arrayRange.close)
  if (new RegExp(`["']${escapeRegExp(value)}["']`, "u").test(existing)) return source

  const beforeClose = source.slice(0, arrayRange.close).replace(/\s*$/u, "")
  const afterClose = source.slice(arrayRange.close)
  const needsComma = !beforeClose.endsWith("[")

  return `${beforeClose}${needsComma ? "," : ""}\n    '${value}'\n  ${afterClose}`
}

function findNuxtConfigPath() {
  return nuxtConfigCandidates.find(exists) || "nuxt.config.ts"
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

function ensureNuxtStoreDir() {
  const storeDir = firstExisting([
    path.join("app", "store"),
    path.join("src", "shared", "store"),
    ...featureStoreDirs(),
    path.join("src", "store"),
    "store",
  ]) || (exists("app") ? path.join("app", "store") : "store")

  ensureDir(storeDir)
  const keepFile = path.join(storeDir, ".gitkeep")
  if (!exists(keepFile)) write(keepFile, "")

  return storeDir
}

function configureNuxt() {
  const configPath = findNuxtConfigPath()
  const current = exists(configPath) ? read(configPath) : "export default defineNuxtConfig({\n})\n"
  const next = ensureArrayValue(current, "modules", "@pinia/nuxt")
  const storeDir = ensureNuxtStoreDir()

  if (next !== current || !exists(configPath)) write(configPath, next)
  console.log(`pinia: configured Nuxt Pinia module; store directory: ${storeDir}.`)
}

function insertPiniaImport(source) {
  if (/import\s*\{[^}]*\bcreatePinia\b[^}]*\}\s*from\s*["']pinia["']/u.test(source)) {
    return source
  }

  const importLine = "import { createPinia } from 'pinia'\n"
  const imports = [...source.matchAll(/^import\b[^\n]*\n/gm)]
  if (!imports.length) return `${importLine}${source}`

  const last = imports[imports.length - 1]
  const insertAt = last.index + last[0].length
  return `${source.slice(0, insertAt)}${importLine}${source.slice(insertAt)}`
}

function ensurePiniaRegistration(source) {
  if (/\.use\s*\(\s*(createPinia\s*\(\s*\)|pinia)\s*\)/u.test(source)) return source

  const chainedCreateApp = /(createApp\s*\([^)]*\)(?:\s*\.\s*use\s*\([^)]*\))*)\s*\.mount\s*\(/u
  if (chainedCreateApp.test(source)) {
    return source.replace(chainedCreateApp, "$1\n  .use(createPinia())\n  .mount(")
  }

  const appDeclaration = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*createApp\s*\(/u.exec(source)
  if (!appDeclaration) {
    throw new Error("pinia: could not find createApp() in the Vue app entry.")
  }

  const appName = appDeclaration[1]
  const mountPattern = new RegExp(`(^\\s*)${escapeRegExp(appName)}\\.mount\\s*\\(`, "mu")
  const mountMatch = mountPattern.exec(source)

  if (!mountMatch) {
    throw new Error(`pinia: found ${appName} = createApp(...), but could not find ${appName}.mount(...).`)
  }

  return `${source.slice(0, mountMatch.index)}${mountMatch[1]}${appName}.use(createPinia())\n${source.slice(mountMatch.index)}`
}

function configureVueVite() {
  const mainPath = viteMainCandidates.find(exists)
  if (!mainPath) {
    throw new Error("pinia: Vue Vite app entry not found. Expected src/main.ts or src/main.js.")
  }

  const current = read(mainPath)
  const withImport = insertPiniaImport(current)
  const next = ensurePiniaRegistration(withImport)
  const storeDir = firstExisting([
    path.join("src", "shared", "store"),
    ...featureStoreDirs(),
    path.join("src", "store"),
    "store",
  ]) || path.join("src", "store")

  write(mainPath, next.endsWith("\n") ? next : `${next}\n`)
  ensureDir(storeDir)
  const keepFile = path.join(storeDir, ".gitkeep")
  if (!exists(keepFile)) write(keepFile, "")

  console.log(`pinia: configured Vue Vite app entry ${mainPath}; store directory: ${storeDir}.`)
}

function main() {
  if (!exists("package.json")) {
    throw new Error("pinia: package.json not found.")
  }

  const manifest = readJson("package.json")
  const target = detectTarget(manifest)

  if (target === "nuxt") configureNuxt()
  else configureVueVite()
}

main()
