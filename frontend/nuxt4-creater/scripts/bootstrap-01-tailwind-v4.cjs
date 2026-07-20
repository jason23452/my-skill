const fs = require("fs")
const path = require("path")

const cwd = process.cwd()
const cssPath = path.join(cwd, "app", "assets", "css", "main.css")
const cssAlias = "~/assets/css/main.css"
const configCandidates = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"]

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function ensureCssEntry() {
  ensureDir(path.dirname(cssPath))

  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, '@import "tailwindcss";\n')
    return
  }

  const current = fs.readFileSync(cssPath, "utf8").replace(/^\uFEFF/u, "")
  if (!/@import\s+["']tailwindcss["']\s*;?/u.test(current)) {
    fs.writeFileSync(cssPath, `@import "tailwindcss";\n${current.replace(/^\s*/u, "")}`)
  }
}

function findConfigPath() {
  const existing = configCandidates.find((file) => fs.existsSync(path.join(cwd, file)))
  return path.join(cwd, existing || "nuxt.config.ts")
}

function findMatchingClose(source, openIndex, openChar, closeChar) {
  let depth = 0
  let quote = null
  let escaped = false

  for (let i = openIndex; i < source.length; i += 1) {
    const char = source[i]

    if (quote) {
      if (escaped) {
        escaped = false
      } else if (char === "\\") {
        escaped = true
      } else if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char
      continue
    }

    if (char === openChar) depth += 1
    if (char === closeChar) depth -= 1
    if (depth === 0) return i
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

function findObjectProperty(source, objectRange, name) {
  const bodyStart = objectRange.open + 1
  const body = source.slice(bodyStart, objectRange.close)
  const re = new RegExp(`\\b${name}\\s*:\\s*\\{`, "u")
  const match = re.exec(body)
  if (!match) return null
  const open = bodyStart + match.index + match[0].lastIndexOf("{")
  const close = findMatchingClose(source, open, "{", "}")
  if (close === -1 || close > objectRange.close) return null
  return { open, close }
}

function findArrayProperty(source, objectRange, name) {
  const bodyStart = objectRange.open + 1
  const body = source.slice(bodyStart, objectRange.close)
  const re = new RegExp(`\\b${name}\\s*:\\s*\\[`, "u")
  const match = re.exec(body)
  if (!match) return null
  const open = bodyStart + match.index + match[0].lastIndexOf("[")
  const close = findMatchingClose(source, open, "[", "]")
  if (close === -1 || close > objectRange.close) return null
  return { open, close }
}

function insertTopLevelProperty(source, propertyText) {
  const config = findConfigObject(source)
  if (!config) {
    throw new Error("Could not find defineNuxtConfig object in nuxt.config.")
  }

  return `${source.slice(0, config.open + 1)}\n  ${propertyText}${source.slice(config.open + 1)}`
}

function ensureImport(source) {
  if (/from\s+["']@tailwindcss\/vite["']/u.test(source)) return source
  return `import tailwindcss from '@tailwindcss/vite'\n${source}`
}

function ensureGlobalCss(source) {
  if (
    new RegExp(cssAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u").test(source) ||
    /\.\/app\/assets\/css\/main\.css/u.test(source)
  ) {
    return source
  }

  const config = findConfigObject(source)
  const cssArray = config && findArrayProperty(source, config, "css")

  if (!cssArray) {
    return insertTopLevelProperty(source, `css: ['${cssAlias}'],`)
  }

  const beforeClose = source.slice(0, cssArray.close).replace(/\s*$/u, "")
  const afterClose = source.slice(cssArray.close)
  const needsComma = !beforeClose.endsWith("[")
  return `${beforeClose}${needsComma ? "," : ""}\n    '${cssAlias}'\n  ${afterClose}`
}

function ensureVitePlugin(source) {
  if (/tailwindcss\s*\(/u.test(source)) return source

  const config = findConfigObject(source)
  if (!config) {
    throw new Error("Could not find defineNuxtConfig object in nuxt.config.")
  }

  const vite = findObjectProperty(source, config, "vite")
  if (!vite) {
    return insertTopLevelProperty(source, "vite: {\n    plugins: [tailwindcss()]\n  },")
  }

  const plugins = findArrayProperty(source, vite, "plugins")
  if (!plugins) {
    return `${source.slice(0, vite.open + 1)}\n    plugins: [tailwindcss()],${source.slice(vite.open + 1)}`
  }

  const beforeClose = source.slice(0, plugins.close).replace(/\s*$/u, "")
  const afterClose = source.slice(plugins.close)
  const needsComma = !beforeClose.endsWith("[")
  return `${beforeClose}${needsComma ? "," : ""}\n      tailwindcss()\n    ${afterClose}`
}

function ensureNuxtConfig() {
  const configPath = findConfigPath()
  let source = fs.existsSync(configPath)
    ? fs.readFileSync(configPath, "utf8")
    : "export default defineNuxtConfig({\n})\n"

  source = source.replace(/^\uFEFF/u, "")
  source = ensureImport(source)
  source = ensureGlobalCss(source)
  source = ensureVitePlugin(source)
  fs.writeFileSync(configPath, source)
}

ensureCssEntry()
ensureNuxtConfig()
