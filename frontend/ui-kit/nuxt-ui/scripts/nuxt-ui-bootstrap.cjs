const fs = require("fs")
const path = require("path")

const cwd = process.cwd()
const cssAlias = "~/assets/css/main.css"
const cssPath = path.join(cwd, "app", "assets", "css", "main.css")
const configCandidates = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"]

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
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

    if (char === '"' || char === "'" || char === "`") {
      quote = char
      continue
    }

    if (char === openChar) depth += 1
    if (char === closeChar) depth -= 1
    if (depth === 0) return index
  }

  return -1
}

function findConfigPath() {
  const existing = configCandidates.find((fileName) => fs.existsSync(path.join(cwd, fileName)))
  return path.join(cwd, existing || "nuxt.config.ts")
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

function ensureArrayValue(source, propertyName, value) {
  const config = findConfigObject(source)
  if (!config) return insertTopLevelProperty(source, `${propertyName}: ['${value}'],`)

  const arrayRange = findArrayProperty(source, config, propertyName)
  if (!arrayRange) return insertTopLevelProperty(source, `${propertyName}: ['${value}'],`)

  const existing = source.slice(arrayRange.open, arrayRange.close)
  if (new RegExp(`["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "u").test(existing)) {
    return source
  }

  const beforeClose = source.slice(0, arrayRange.close).replace(/\s*$/u, "")
  const afterClose = source.slice(arrayRange.close)
  const needsComma = !beforeClose.endsWith("[")
  return `${beforeClose}${needsComma ? "," : ""}\n    '${value}'\n  ${afterClose}`
}

function ensureNuxtConfig() {
  const configPath = findConfigPath()
  let source = fs.existsSync(configPath)
    ? fs.readFileSync(configPath, "utf8").replace(/^\uFEFF/u, "")
    : "export default defineNuxtConfig({\n})\n"

  source = ensureArrayValue(source, "modules", "@nuxt/ui")
  source = ensureArrayValue(source, "css", cssAlias)
  fs.writeFileSync(configPath, source)
}

function ensureCssEntry() {
  ensureDir(path.dirname(cssPath))
  const current = fs.existsSync(cssPath)
    ? fs.readFileSync(cssPath, "utf8").replace(/^\uFEFF/u, "")
    : ""

  const lines = current.split(/\r?\n/u).filter((line, index, array) => index < array.length - 1 || line)
  if (!/@import\s+["']tailwindcss["']\s*;?/u.test(current)) {
    lines.unshift('@import "tailwindcss";')
  }
  if (!/@import\s+["']@nuxt\/ui["']\s*;?/u.test(current)) {
    const tailwindIndex = lines.findIndex((line) => /@import\s+["']tailwindcss["']\s*;?/u.test(line))
    lines.splice(tailwindIndex >= 0 ? tailwindIndex + 1 : 0, 0, '@import "@nuxt/ui";')
  }

  fs.writeFileSync(cssPath, `${lines.join("\n").replace(/\s*$/u, "")}\n`)
}

ensureNuxtConfig()
ensureCssEntry()
