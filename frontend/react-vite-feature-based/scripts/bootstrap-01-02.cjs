#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

function stripJsonc(source) {
  return source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "")
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
packageJson.scripts = {
  ...(packageJson.scripts || {}),
  dev: "vite --host 0.0.0.0",
  build: "tsc -b && vite build",
  preview: "vite preview --host 0.0.0.0",
}
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))

writeFile(
  "vite.config.ts",
  'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nimport { fileURLToPath, URL } from "node:url";\n\nexport default defineConfig({\n  plugins: [react()],\n  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },\n});\n',
)

const tsconfigApp = JSON.parse(stripJsonc(fs.readFileSync("tsconfig.app.json", "utf8")))
tsconfigApp.compilerOptions = {
  ...(tsconfigApp.compilerOptions || {}),
  ignoreDeprecations: "6.0",
  paths: {
    ...((tsconfigApp.compilerOptions || {}).paths || {}),
    "@/*": ["./src/*"],
  },
}
fs.writeFileSync("tsconfig.app.json", JSON.stringify(tsconfigApp, null, 2))

writeFile(
  "public/__opencode_health.txt",
  "ok\n",
)

writeFile(
  "src/index.css",
  ':root {\n  color: #0f172a;\n  background: #f8fafc;\n  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  min-width: 320px;\n  background: #f8fafc;\n}\n\n.app-page {\n  min-height: 100vh;\n  padding: 3rem 1.5rem;\n}\n\n.app-panel {\n  max-width: 48rem;\n  margin: 0 auto;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.75rem;\n  background: #ffffff;\n  padding: 2rem;\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);\n}\n\n.app-title {\n  margin: 0;\n  color: #0f172a;\n  font-size: clamp(2rem, 5vw, 3rem);\n  line-height: 1;\n}\n',
)
writeFile(
  "src/features/home/router/HomePage.tsx",
  'export function HomePage() {\n  return (\n    <main className="app-page">\n      <section className="app-panel">\n        <h1 className="app-title">Greenfield App</h1>\n      </section>\n    </main>\n  )\n}\n',
)
writeFile(
  "src/app/AppRouter.tsx",
  'import { HomePage } from "@/features/home/router/HomePage";\n\nexport function AppRouter() {\n  return <HomePage />;\n}\n',
)
writeFile(
  "src/App.tsx",
  'import { AppRouter } from "./app/AppRouter";\n\nexport default function App() {\n  return <AppRouter />;\n}\n',
)

for (const dir of [
  "src/features/home/components",
  "src/features/home/hooks",
  "src/features/home/types",
  "src/features/home/assets",
  "src/shared/components",
  "src/shared/hooks",
  "src/shared/types",
  "src/shared/assets",
]) {
  fs.mkdirSync(dir, { recursive: true })
  writeFile(path.join(dir, ".gitkeep"), "")
}
