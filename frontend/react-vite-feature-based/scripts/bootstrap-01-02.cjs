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
packageJson.devDependencies = {
  ...(packageJson.devDependencies || {}),
  "@tailwindcss/vite": "latest",
  tailwindcss: "latest",
}
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))

writeFile(
  "vite.config.ts",
  'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nimport tailwindcss from "@tailwindcss/vite";\nimport { fileURLToPath, URL } from "node:url";\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },\n});\n',
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

writeFile("src/index.css", '@import "tailwindcss";\n')
writeFile(
  "src/features/home/router/HomePage.tsx",
  'export function HomePage() {\n  return <main className="min-h-screen p-8"><h1 className="text-3xl font-bold">Greenfield App</h1></main>;\n}\n',
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
  "src/features/home/api",
  "src/features/home/assets",
  "src/shared/components",
  "src/shared/hooks",
  "src/shared/types",
  "src/shared/api",
  "src/shared/assets",
]) {
  fs.mkdirSync(dir, { recursive: true })
  writeFile(path.join(dir, ".gitkeep"), "")
}
