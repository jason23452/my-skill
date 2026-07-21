#!/usr/bin/env node

const fs = require("fs")
const { spawnSync } = require("child_process")

function exists(filePath) {
  return fs.existsSync(filePath)
}

function isNuxtProject() {
  if (exists("nuxt.config.ts") || exists("nuxt.config.js") || exists("nuxt.config.mjs")) return true
  if (!exists("package.json")) return false

  try {
    const manifest = JSON.parse(fs.readFileSync("package.json", "utf8"))
    return Boolean(manifest.dependencies?.nuxt || manifest.devDependencies?.nuxt)
  } catch {
    return false
  }
}

if (isNuxtProject()) {
  console.log("axios-token-baseurl-error: Nuxt detected; using built-in $fetch.")
  process.exit(0)
}

const result = spawnSync("pnpm", ["add", "axios"], {
  stdio: "inherit",
  shell: process.platform === "win32",
})

process.exit(result.status ?? 1)
