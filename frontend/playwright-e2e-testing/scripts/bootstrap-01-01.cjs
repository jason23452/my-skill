const fs = require("fs")
const path = require("path")
const childProcess = require("child_process")

function commandOutput(command, args) {
  try {
    return childProcess.execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
  } catch {
    return ""
  }
}

function resolvePlaywright() {
  const cwd = process.cwd()
  const globalRoot = commandOutput("npm", ["root", "-g"])
  const bases = [
    cwd,
    path.join(cwd, "node_modules"),
    globalRoot ? path.join(globalRoot, "@playwright", "test") : "",
    globalRoot || "",
  ].filter(Boolean)

  for (const base of bases) {
    try {
      return require.resolve("playwright", { paths: [base] })
    } catch {
      // Try the next resolution base.
    }
  }
  return ""
}

function runPlaywrightInstall() {
  childProcess.execFileSync("pnpm", ["exec", "playwright", "install", "chromium"], {
    stdio: "inherit",
    env: {
      ...process.env,
      PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || "/root/.cache/ms-playwright",
    },
  })
}

const resolved = resolvePlaywright()
if (!resolved) {
  console.log("Playwright package was not resolvable; installing Chromium with repo-local pnpm.")
  runPlaywrightInstall()
  process.exit(0)
}

const playwright = require(resolved)
const chromiumPath = playwright.chromium.executablePath()
if (chromiumPath && fs.existsSync(chromiumPath)) {
  console.log(`Playwright Chromium already available: ${chromiumPath}`)
  process.exit(0)
}

console.log(`Playwright Chromium missing at expected path: ${chromiumPath || "unknown"}`)
runPlaywrightInstall()
