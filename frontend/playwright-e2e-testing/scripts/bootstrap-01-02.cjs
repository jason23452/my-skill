#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/u, ""))
  } catch {
    return fallback
  }
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, contents)
}

function writeFileIfMissing(filePath, contents) {
  if (fs.existsSync(filePath)) {
    console.log(`playwright-e2e-testing: kept existing ${filePath}`)
    return
  }
  writeFile(filePath, contents)
}

function hasPackage(pkg, name) {
  return Boolean((pkg.dependencies || {})[name] || (pkg.devDependencies || {})[name])
}

function detectFramework(pkg) {
  if (hasPackage(pkg, "nuxt")) return "nuxt"
  if (hasPackage(pkg, "vite") || hasPackage(pkg, "@vitejs/plugin-react")) return "vite"
  return "generic"
}

const pkg = readJson("package.json", {})
pkg.scripts = {
  ...(pkg.scripts || {}),
  e2e: "playwright test",
  "e2e:list": "playwright test --list",
}
fs.writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`)

const framework = detectFramework(pkg)

writeFileIfMissing("playwright.config.ts", `import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "5173";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? \`http://127.0.0.1:\${port}\`;
const detectedFramework = ${JSON.stringify(framework)};

function defaultWebServerCommand() {
  if (process.env.PLAYWRIGHT_WEB_SERVER_COMMAND) return process.env.PLAYWRIGHT_WEB_SERVER_COMMAND;
  if (detectedFramework === "nuxt") return \`pnpm exec nuxt dev --host 127.0.0.1 --port \${port} --no-fork\`;
  if (detectedFramework === "vite") return \`pnpm exec vite --host 127.0.0.1 --port \${port} --strictPort\`;
  return \`pnpm dev -- --host 127.0.0.1 --port \${port}\`;
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: defaultWebServerCommand(),
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
`)

writeFileIfMissing("tests/home.spec.ts", `import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).not.toHaveText(/^\\s*$/);
});
`)
