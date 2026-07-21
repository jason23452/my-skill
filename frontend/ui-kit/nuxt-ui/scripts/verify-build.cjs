#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const cwd = process.cwd()
const configCandidates = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"]
const cssCandidates = [
  path.join("app", "assets", "css", "main.css"),
  path.join("assets", "css", "main.css"),
]

function exists(filePath) {
  return fs.existsSync(path.join(cwd, filePath))
}

function read(filePath) {
  return fs.readFileSync(path.join(cwd, filePath), "utf8").replace(/^\uFEFF/u, "")
}

function readJson(filePath) {
  return JSON.parse(read(filePath))
}

function hasDependency(manifest, name) {
  return Boolean((manifest.dependencies || {})[name] || (manifest.devDependencies || {})[name])
}

function fail(message) {
  console.error(`nuxt-ui verification failed: ${message}`)
  process.exit(1)
}

if (!exists("package.json")) fail("package.json is missing.")

const manifest = readJson("package.json")
for (const name of ["nuxt", "@nuxt/ui", "tailwindcss"]) {
  if (!hasDependency(manifest, name)) fail(`${name} is missing from package dependencies.`)
}

if (!hasDependency(manifest, "@iconify-json/lucide")) {
  fail("@iconify-json/lucide is missing from package dependencies.")
}

const configPath = configCandidates.find(exists)
if (!configPath) fail("nuxt.config file is missing.")

const configSource = read(configPath)
if (!/modules\s*:\s*\[[\s\S]*['"]@nuxt\/ui['"][\s\S]*\]/u.test(configSource)) {
  fail("@nuxt/ui is missing from nuxt.config modules.")
}

const cssPath = cssCandidates.find(exists)
if (!cssPath) fail("Nuxt CSS entry is missing.")

const cssSource = read(cssPath)
if (!/@import\s+["']tailwindcss["']\s*;?/u.test(cssSource)) {
  fail("Tailwind CSS import is missing from the CSS entry.")
}
if (!/@import\s+["']@nuxt\/ui["']\s*;?/u.test(cssSource)) {
  fail("@nuxt/ui import is missing from the CSS entry.")
}

console.log("nuxt-ui verification passed: package, Nuxt module, CSS imports, and local icon package are configured.")
