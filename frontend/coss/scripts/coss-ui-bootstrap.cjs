#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const cp = require("child_process")

const at = String.fromCharCode(64)
const bs = String.fromCharCode(92)
const slash = String.fromCharCode(47)
const colon = String.fromCharCode(58)

const REQUIRED_RUNTIME_DEPENDENCIES = [
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
]

const DEFAULT_UI_COMPONENTS = [
  "accordion",
  "alert",
  "alert-dialog",
  "autocomplete",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "checkbox",
  "checkbox-group",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "empty",
  "field",
  "fieldset",
  "form",
  "frame",
  "group",
  "input",
  "otp-field",
  "input-group",
  "kbd",
  "label",
  "menu",
  "meter",
  "number-field",
  "pagination",
  "popover",
  "preview-card",
  "progress",
  "radio-group",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
]

function logStatus(message) {
  console.warn(message)
  if (process.platform === "win32") return
  try {
    fs.appendFileSync("/proc/1/fd/2", `${message}\n`)
  } catch {}
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"))
  } catch {
    return fallback
  }
}

function stripJsonc(value) {
  return String(value || "").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "")
}

function readJsonc(file, fallback) {
  try {
    return JSON.parse(stripJsonc(fs.readFileSync(file, "utf8")))
  } catch {
    return fallback
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function normalizePath(value) {
  let output = String(value || "").split(bs).join("/")
  while (output.endsWith("/")) output = output.slice(0, -1)
  return output
}

function aliasToPath(alias) {
  const normalized = normalizePath(alias)
  return normalized.startsWith(`${at}/`) ? `src/${normalized.slice(2)}` : normalized
}

function pathToAlias(dir) {
  const normalized = normalizePath(dir)
  return normalized.startsWith("src/") ? `${at}/${normalized.slice(4)}` : normalized
}

function withoutTs(file) {
  return file.endsWith(".ts") ? file.slice(0, -3) : file
}

function hasDependency(name) {
  const pkg = readJson("package.json", {})
  return Boolean((pkg.dependencies || {})[name] || (pkg.devDependencies || {})[name])
}

function pnpmEnv() {
  const env = { ...process.env, PNPM_CONFIG_IGNORE_SCRIPTS: "true", CI: "1" }
  try {
    const modules = fs.readFileSync(path.join("node_modules", ".modules.yaml"), "utf8")
    const match = modules.match(/["']?virtualStoreDirMaxLength["']?\s*:\s*(\d+)/)
    if (match) env.npm_config_virtual_store_dir_max_length = match[1]
  } catch {}
  return env
}

function ensureRuntimeDependencies() {
  const missing = REQUIRED_RUNTIME_DEPENDENCIES.filter((name) => !hasDependency(name))
  if (!missing.length) return

  logStatus(`coss installing missing runtime dependencies: ${missing.join(" ")}`)
  const result = cp.spawnSync("pnpm", ["add", ...missing], {
    stdio: "inherit",
    env: pnpmEnv(),
    shell: process.platform === "win32",
  })

  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`pnpm add ${missing.join(" ")} exited with code ${result.status || 1}`)
}

function ensureTsconfigAlias(file) {
  const config = readJsonc(file, null)
  if (!config) return
  config.compilerOptions = {
    ...(config.compilerOptions || {}),
    baseUrl: (config.compilerOptions || {}).baseUrl || ".",
    paths: {
      ...((config.compilerOptions || {}).paths || {}),
      "@/*": ["./src/*"],
    },
  }
  writeJson(file, config)
}

function ensureProjectAliases() {
  for (const file of ["tsconfig.json", "tsconfig.app.json"]) {
    if (fs.existsSync(file)) ensureTsconfigAlias(file)
  }
}

function ensureComponentsConfig() {
  const shared = fs.existsSync("src/shared") || fs.existsSync("src/shared/components") || fs.existsSync("src/shared/hooks")
  const ui = shared ? "src/shared/components/ui" : "src/components/ui"
  const utils = shared ? "src/shared/utils/cn" : "src/lib/utils"
  const hooks = shared ? "src/shared/hooks" : "src/hooks"

  for (const dir of [ui, path.dirname(`${withoutTs(utils)}.ts`), hooks]) fs.mkdirSync(dir, { recursive: true })

  const utilsFile = `${withoutTs(utils)}.ts`
  if (!fs.existsSync(utilsFile)) {
    fs.writeFileSync(utilsFile, [
      "import { clsx, type ClassValue } from 'clsx';",
      "import { twMerge } from 'tailwind-merge';",
      "",
      "export function cn(...inputs: ClassValue[]) {",
      "  return twMerge(clsx(inputs));",
      "}",
      "",
    ].join("\n"))
  }

  const config = readJson("components.json", {
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      css: fs.existsSync("src/app/global.css") ? "src/app/global.css" : "src/index.css",
      baseColor: "neutral",
      cssVariables: true,
    },
    iconLibrary: "lucide",
    aliases: {},
  })

  config.$schema = config.$schema || "https://ui.shadcn.com/schema.json"
  config.aliases = {
    ...(config.aliases || {}),
    components: pathToAlias(path.dirname(ui)),
    ui: pathToAlias(ui),
    utils: pathToAlias(withoutTs(utils)),
    hooks: pathToAlias(hooks),
  }
  config.registries = {
    ...(config.registries || {}),
    [at + "coss"]: "https://coss.com/ui/r/{name}.json",
  }

  writeJson("components.json", config)
}

function moveDirContents(source, target) {
  if (!fs.existsSync(source)) return false
  fs.mkdirSync(target, { recursive: true })
  let moved = false
  for (const name of fs.readdirSync(source)) {
    const from = path.join(source, name)
    const to = path.join(target, name)
    if (fs.existsSync(to)) {
      logStatus(`coss repair kept existing ${normalizePath(to)}; leaving ${normalizePath(from)} in place`)
      continue
    }
    fs.renameSync(from, to)
    moved = true
  }
  return moved
}

function removeEmptyParents(dir, stopAt) {
  let current = normalizePath(dir)
  const stop = normalizePath(stopAt)
  while (current && current !== stop && fs.existsSync(current)) {
    try {
      if (fs.readdirSync(current).length) return
      fs.rmdirSync(current)
    } catch {
      return
    }
    current = normalizePath(path.dirname(current))
  }
  if (current === stop && fs.existsSync(current)) {
    try {
      if (!fs.readdirSync(current).length) fs.rmdirSync(current)
    } catch {}
  }
}

function repairMisplacedAliasArtifacts() {
  const config = readJson("components.json", { aliases: {} })
  const aliases = config.aliases || {}
  const repairs = [
    [aliases.ui || `${at}/components/ui`, aliasToPath(aliases.ui || "src/components/ui")],
    [aliases.utils || `${at}/lib/utils`, aliasToPath(aliases.utils || "src/lib/utils")],
    [aliases.hooks || `${at}/hooks`, aliasToPath(aliases.hooks || "src/hooks")],
  ]
  for (const [alias, target] of repairs) {
    const source = normalizePath(alias)
    if (!source.startsWith(`${at}/`) || source === target) continue
    if (moveDirContents(source, target)) {
      logStatus(`coss repair moved ${source} -> ${target}`)
      removeEmptyParents(path.dirname(source), at)
    }
  }
}

function cleanComponent(value) {
  let name = String(value || "").trim().toLowerCase()
  const coss = "coss"
  const cut = (prefix) => {
    if (!name.startsWith(prefix)) return false
    name = name.slice(prefix.length)
    return true
  }
  cut(at + coss + slash) || cut(coss + slash) || cut(at + coss + colon) || cut(coss + colon)
  if (name.startsWith(at)) name = name.slice(1)
  return name.split("").filter((ch) => "abcdefghijklmnopqrstuvwxyz0123456789-".includes(ch)).join("")
}

function requestedComponents() {
  return String(process.env.COSS_COMPONENTS || "")
    .replaceAll(",", " ")
    .split(" ")
    .map(cleanComponent)
    .filter(Boolean)
}

function installSpecs(requested) {
  const mode = String(process.env.COSS_BOOTSTRAP_MODE || "fast").toLowerCase()
  if (mode === "full-style" || mode === "style" || mode === "full") return [at + "coss/style"]
  if (requested.length) return [...new Set(requested.map((name) => at + "coss/" + name).concat(at + "coss/colors-neutral"))]
  return [at + "coss/ui", at + "coss/colors-neutral"]
}

function expectedUiComponents(requested) {
  const names = requested.filter((name) => name !== "colors-neutral" && name !== "style")
  if (!names.length || names.includes("ui")) return DEFAULT_UI_COMPONENTS
  return names
}

function componentFileExists(ui, name) {
  return fs.existsSync(path.join(ui, `${name}.tsx`)) || fs.existsSync(path.join(ui, `${name}.ts`))
}

function cossArtifactsReady(requested) {
  const config = readJson("components.json", { aliases: {} })
  const ui = aliasToPath((config.aliases || {}).ui || "src/components/ui")
  const utils = aliasToPath((config.aliases || {}).utils || "src/lib/utils")
  if (!fs.existsSync(ui)) return false

  const expected = expectedUiComponents(requested)
  const registry = (config.registries || {})[at + "coss"] || JSON.stringify(config).includes("coss.com/ui/r/{name}.json")

  return Boolean(registry)
    && hasDependency("class-variance-authority")
    && hasDependency("clsx")
    && hasDependency("tailwind-merge")
    && (fs.existsSync(utils) || fs.existsSync(`${utils}.ts`))
    && expected.every((name) => componentFileExists(ui, name))
}

function writeUiIndex() {
  const config = readJson("components.json", { aliases: {} })
  const ui = aliasToPath((config.aliases || {}).ui || "src/components/ui")
  if (!fs.existsSync(ui)) return

  const output = fs.readdirSync(ui)
    .filter((name) => (name.endsWith(".ts") || name.endsWith(".tsx")) && name !== "index.ts")
    .sort()
    .map((name) => {
      const base = name.endsWith(".tsx") ? name.slice(0, -4) : name.slice(0, -3)
      return `export * from "./${base}";`
    })
    .join("\n")

  fs.writeFileSync(path.join(ui, "index.ts"), `${output}\n`)
}

function installCossUi() {
  const requested = requestedComponents()
  ensureRuntimeDependencies()
  if (cossArtifactsReady(requested)) {
    logStatus("coss ui artifacts already present; skipping shadcn add")
    return Promise.resolve()
  }

  const env = pnpmEnv()
  const specs = installSpecs(requested)
  const timeout = Number(process.env.COSS_SHADCN_TIMEOUT_MS || 1200000)
  const idle = Number(process.env.COSS_SHADCN_IDLE_MS || 10000)
  const stable = Number(process.env.COSS_SHADCN_STABLE_MS || 15000)
  const poll = Number(process.env.COSS_SHADCN_POLL_MS || 2000)

  return new Promise((resolve, reject) => {
    logStatus(`coss shadcn install starting: ${specs.join(" ")}`)
    const child = cp.spawn("pnpm", ["dlx", "shadcn@latest", "add", ...specs, "--yes", "--overwrite"], {
      stdio: ["ignore", "pipe", "pipe"],
      env,
      shell: process.platform === "win32",
    })

    let lastOutputAt = Date.now()
    let firstReadyAt = 0
    let done = false
    let early = false
    let force = null

    const finish = (error) => {
      if (done) return
      done = true
      clearInterval(ticker)
      clearInterval(heartbeat)
      clearTimeout(timer)
      if (force) clearTimeout(force)
      if (error) reject(error)
      else resolve()
    }

    const stopEarly = (message) => {
      if (done || early) return
      early = true
      logStatus(message)
      child.kill("SIGTERM")
      force = setTimeout(() => {
        if (!done) child.kill("SIGKILL")
      }, 5000)
      if (force.unref) force.unref()
    }

    const pipe = (stream, output) => stream && stream.on("data", (chunk) => {
      lastOutputAt = Date.now()
      output.write(chunk)
    })
    pipe(child.stdout, process.stdout)
    pipe(child.stderr, process.stderr)

    const ticker = setInterval(() => {
      const ready = cossArtifactsReady(requested)
      const now = Date.now()
      if (ready && !firstReadyAt) firstReadyAt = now
      if (!ready) firstReadyAt = 0
      if (ready && (now - lastOutputAt >= idle || now - firstReadyAt >= stable)) stopEarly("coss ui artifacts are stable; continuing bootstrap")
    }, poll)
    if (ticker.unref) ticker.unref()

    const heartbeat = setInterval(() => {
      logStatus(`coss shadcn install still running: ${specs.join(" ")}`)
    }, Number(process.env.COSS_SHADCN_HEARTBEAT_MS || 10000))
    if (heartbeat.unref) heartbeat.unref()

    const timer = setTimeout(() => {
      repairMisplacedAliasArtifacts()
      writeUiIndex()
      if (cossArtifactsReady(requested)) {
        stopEarly("coss shadcn timed out after generating artifacts; continuing bootstrap")
        return
      }
      child.kill("SIGTERM")
      finish(new Error(`coss shadcn timeout after ${timeout}ms`))
    }, timeout)
    if (timer.unref) timer.unref()

    child.on("close", (code) => {
      if (early || code === 0 || cossArtifactsReady(requested)) finish()
      else finish(new Error(`coss shadcn exited with code ${code || 1}`))
    })
    child.on("error", finish)
  })
}

async function main() {
  ensureProjectAliases()
  ensureComponentsConfig()
  repairMisplacedAliasArtifacts()
  await installCossUi()
  repairMisplacedAliasArtifacts()
  writeUiIndex()
}

main().catch((error) => {
  console.error(error && error.message ? error.message : error)
  process.exit(1)
})
