#!/usr/bin/env node

const cp = require("node:child_process")
const crypto = require("node:crypto")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")

const DEFAULT_ROOT = path.join(os.tmpdir(), "opencode-runtime-smoke")
const OUTPUT_EXCLUDES = new Set([
  ".git",
  ".venv",
  "__pycache__",
  ".pytest_cache",
  ".mypy_cache",
  ".ruff_cache",
  "dist",
  "build",
  "htmlcov",
  ".opencode-task-worktrees",
])
const RELATIVE_EXCLUDES = [
  ".opencode/state",
  ".opencode/outputs",
  ".opencode/local",
  ".opencode-runtime",
]

function usage() {
  console.error("Usage: runtime-smoke-sandbox.cjs [--cwd <repo>] [--port <port>] [--host <host>] [--mode auto|always|never]")
  process.exit(2)
}

function parseArgs(argv) {
  const parsed = {
    cwd: process.cwd(),
    host: process.env.HOST || "127.0.0.1",
    mode: process.env.OPENCODE_FASTAPI_RUNTIME_SMOKE_SANDBOX || "auto",
    port: process.env.PORT || "",
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === "--cwd") parsed.cwd = argv[++index] || ""
    else if (arg === "--host") parsed.host = argv[++index] || ""
    else if (arg === "--mode") parsed.mode = argv[++index] || "auto"
    else if (arg === "--port") parsed.port = argv[++index] || ""
    else usage()
  }

  parsed.cwd = path.resolve(parsed.cwd || process.cwd())
  parsed.mode = ["auto", "always", "never"].includes(parsed.mode) ? parsed.mode : "auto"
  if (!parsed.port) usage()
  return parsed
}

function safeSegment(value, fallback) {
  return (value || fallback)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80) || fallback
}

function pathInside(parent, child) {
  const relative = path.relative(path.resolve(parent), path.resolve(child))
  return relative === "" || Boolean(relative && !relative.startsWith("..") && !path.isAbsolute(relative))
}

function filesystemType(directory) {
  if (process.platform === "win32") return "unknown"
  const result = cp.spawnSync("stat", ["-f", "-c", "%T", directory], { encoding: "utf8" })
  return result.status === 0 ? result.stdout.trim() : "unknown"
}

function shouldUseSandbox(cwd, mode, fsType, root) {
  if (mode === "always") return true
  if (mode === "never") return false
  const normalized = path.resolve(cwd).replace(/\\/g, "/")
  const rootPrefix = `${path.resolve(root).replace(/\\/g, "/")}/`
  if (normalized.startsWith(rootPrefix)) return false
  if (["9p", "v9fs", "drvfs", "fuseblk", "fuse.osxfs"].includes(fsType)) return true
  return normalized === "/workspace" || normalized.startsWith("/workspace/")
}

function sandboxPath(root, cwd) {
  const hash = crypto.createHash("sha256").update(path.resolve(cwd)).digest("hex").slice(0, 12)
  return path.join(root, `${safeSegment(path.basename(cwd), "repo")}-${hash}`)
}

function shouldExclude(sourceRoot, sourcePath) {
  const relative = path.relative(sourceRoot, sourcePath).replace(/\\/g, "/")
  if (!relative) return false
  const parts = relative.split("/")
  if (parts.some((part) => OUTPUT_EXCLUDES.has(part))) return true
  return RELATIVE_EXCLUDES.some((item) => relative === item || relative.startsWith(`${item}/`))
}

function cleanSandbox(directory) {
  fs.mkdirSync(directory, { recursive: true })
  for (const entry of fs.readdirSync(directory)) {
    if (entry === ".venv" || entry === ".opencode-runtime-smoke") continue
    fs.rmSync(path.join(directory, entry), { recursive: true, force: true })
  }
}

function copySource(sourceRoot, destinationRoot) {
  cleanSandbox(destinationRoot)
  fs.cpSync(sourceRoot, destinationRoot, {
    recursive: true,
    force: true,
    errorOnExist: false,
    filter: (sourcePath) => !shouldExclude(sourceRoot, sourcePath),
  })
}

function readIfExists(filePath) {
  try {
    return fs.readFileSync(filePath)
  } catch {
    return Buffer.alloc(0)
  }
}

function syncHash(cwd) {
  const hash = crypto.createHash("sha256")
  for (const name of ["pyproject.toml", "uv.lock", "requirements.txt", "requirements-dev.txt"]) {
    hash.update(name)
    hash.update(readIfExists(path.join(cwd, name)))
  }
  return hash.digest("hex")
}

function syncIfNeeded(cwd) {
  if (!fs.existsSync(path.join(cwd, "pyproject.toml"))) {
    return { status: "skipped", command: "" }
  }

  const markerDir = path.join(cwd, ".opencode-runtime-smoke")
  const markerPath = path.join(markerDir, "uv-sync-stamp.json")
  const hash = syncHash(cwd)
  const previous = (() => {
    try { return JSON.parse(fs.readFileSync(markerPath, "utf8")) } catch { return null }
  })()

  if (previous?.hash === hash && fs.existsSync(path.join(cwd, ".venv"))) {
    return { status: "reused", command: "uv sync" }
  }

  const env = { ...process.env, UV_CACHE_DIR: process.env.UV_CACHE_DIR || path.join(os.tmpdir(), "opencode-uv-cache") }
  const command = "uv sync"
  console.log(`OPENCODE_FASTAPI_RUNTIME_SMOKE_SYNC=${command}`)
  const result = cp.spawnSync("uv", ["sync"], { cwd, stdio: "inherit", env, shell: false })
  if (result.error) throw result.error
  if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1)

  fs.mkdirSync(markerDir, { recursive: true })
  fs.writeFileSync(markerPath, `${JSON.stringify({ hash, updatedAt: new Date().toISOString() }, null, 2)}\n`)
  return { status: "synced", command }
}

function forwardSignals(child) {
  let stopping = false
  const stop = (signal) => {
    if (stopping) return
    stopping = true
    try { child.kill(signal) } catch {}
  }
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(signal, () => stop(signal))
  }
}

function main() {
  const parsed = parseArgs(process.argv.slice(2))
  if (!fs.existsSync(parsed.cwd) || !fs.statSync(parsed.cwd).isDirectory()) {
    throw new Error(`cwd is not a directory: ${parsed.cwd}`)
  }

  const fsType = filesystemType(parsed.cwd)
  const root = path.resolve(process.env.OPENCODE_FASTAPI_RUNTIME_SMOKE_ROOT || DEFAULT_ROOT)
  const useSandbox = shouldUseSandbox(parsed.cwd, parsed.mode, fsType, root)
  const runCwd = useSandbox ? sandboxPath(root, parsed.cwd) : parsed.cwd
  if (useSandbox && !pathInside(root, runCwd)) throw new Error(`sandbox path escaped root: ${runCwd}`)

  console.log(`OPENCODE_FASTAPI_RUNTIME_SMOKE_SOURCE=${parsed.cwd}`)
  console.log(`OPENCODE_FASTAPI_RUNTIME_SMOKE_SOURCE_FS=${fsType}`)
  console.log(`OPENCODE_FASTAPI_RUNTIME_SMOKE_MODE=${useSandbox ? "sandbox" : "in-place"}`)
  console.log(`OPENCODE_FASTAPI_RUNTIME_SMOKE_CWD=${runCwd}`)

  if (useSandbox) copySource(parsed.cwd, runCwd)
  const sync = syncIfNeeded(runCwd)
  console.log(`OPENCODE_FASTAPI_RUNTIME_SMOKE_SYNC_STATUS=${sync.status}`)

  const env = { ...process.env, HOST: parsed.host, PORT: String(parsed.port), UV_CACHE_DIR: process.env.UV_CACHE_DIR || path.join(os.tmpdir(), "opencode-uv-cache") }
  const args = ["run", "uvicorn", "app.main:app", "--host", parsed.host, "--port", String(parsed.port)]
  console.log(`OPENCODE_FASTAPI_RUNTIME_SMOKE_DEV_COMMAND=uv ${args.join(" ")}`)

  const child = cp.spawn("uv", args, {
    cwd: runCwd,
    env,
    shell: false,
    stdio: "inherit",
  })
  forwardSignals(child)
  child.on("error", (error) => {
    console.error(`OPENCODE_FASTAPI_RUNTIME_SMOKE_FAILED=${error?.message || String(error)}`)
    process.exit(1)
  })
  child.on("exit", (code, signal) => {
    if (signal) process.exit(1)
    process.exit(code ?? 0)
  })
}

try {
  main()
} catch (error) {
  console.error(`OPENCODE_FASTAPI_RUNTIME_SMOKE_FAILED=${error?.message || String(error)}`)
  process.exit(1)
}
