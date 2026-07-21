#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const cwd = process.cwd()
const nextConfigCandidates = ["next.config.ts", "next.config.js", "next.config.mjs"]
const viteConfigCandidates = ["vite.config.ts", "vite.config.js", "vite.config.mts", "vite.config.mjs"]
const reactEntryCandidates = [
  path.join("src", "main.tsx"),
  path.join("src", "main.jsx"),
  path.join("main.tsx"),
  path.join("main.jsx"),
]
const appLayoutCandidates = [
  path.join("src", "app", "layout.tsx"),
  path.join("src", "app", "layout.jsx"),
  path.join("src", "app", "layout.ts"),
  path.join("src", "app", "layout.js"),
  path.join("app", "layout.tsx"),
  path.join("app", "layout.jsx"),
  path.join("app", "layout.ts"),
  path.join("app", "layout.js"),
]
const pagesAppCandidates = [
  path.join("src", "pages", "_app.tsx"),
  path.join("src", "pages", "_app.jsx"),
  path.join("src", "pages", "_app.ts"),
  path.join("src", "pages", "_app.js"),
  path.join("pages", "_app.tsx"),
  path.join("pages", "_app.jsx"),
  path.join("pages", "_app.ts"),
  path.join("pages", "_app.js"),
]

function abs(filePath) {
  return path.join(cwd, filePath)
}

function exists(filePath) {
  return fs.existsSync(abs(filePath))
}

function read(filePath) {
  return fs.readFileSync(abs(filePath), "utf8").replace(/^\uFEFF/u, "")
}

function write(filePath, source) {
  fs.mkdirSync(path.dirname(abs(filePath)), { recursive: true })
  fs.writeFileSync(abs(filePath), source)
}

function ensureDir(filePath) {
  fs.mkdirSync(abs(filePath), { recursive: true })
}

function readJson(filePath, fallback = {}) {
  try {
    return JSON.parse(read(filePath))
  } catch {
    return fallback
  }
}

function dependencyMap(manifest) {
  return {
    ...(manifest.dependencies || {}),
    ...(manifest.devDependencies || {}),
    ...(manifest.optionalDependencies || {}),
  }
}

function hasDependency(manifest, name) {
  return Boolean(dependencyMap(manifest)[name])
}

function detectTarget(manifest) {
  const hasNext = hasDependency(manifest, "next") ||
    nextConfigCandidates.some(exists) ||
    appLayoutCandidates.some(exists) ||
    pagesAppCandidates.some(exists)
  const hasReact = hasDependency(manifest, "react") ||
    reactEntryCandidates.some(exists) ||
    hasNext
  const hasVite = hasDependency(manifest, "vite") || viteConfigCandidates.some(exists)

  if (hasNext) return "next"
  if (hasReact && hasVite) return "react-vite"

  throw new Error("zustand: expected a React SPA Vite or Next.js project; no supported React target was detected.")
}

function usesTypeScript(seedPath = "") {
  return seedPath.endsWith(".ts") ||
    seedPath.endsWith(".tsx") ||
    exists("tsconfig.json") ||
    reactEntryCandidates.some((candidate) => exists(candidate) && candidate.endsWith(".tsx")) ||
    appLayoutCandidates.some((candidate) => exists(candidate) && candidate.endsWith(".tsx")) ||
    pagesAppCandidates.some((candidate) => exists(candidate) && candidate.endsWith(".tsx"))
}

function extensionFor(kind, isTs) {
  if (kind === "component") return isTs ? ".tsx" : ".jsx"
  return isTs ? ".ts" : ".js"
}

function withoutExtension(filePath) {
  return filePath.replace(/\.(tsx|ts|jsx|js)$/u, "")
}

function toImportPath(fromFile, toFile) {
  let relative = path.relative(path.dirname(fromFile), toFile).replace(/\\/gu, "/")
  relative = withoutExtension(relative)
  if (!relative.startsWith(".")) relative = `./${relative}`
  return relative
}

function insertImport(source, statement) {
  if (source.includes(statement.trim())) return source

  const imports = [...source.matchAll(/^import\b[^\n]*(?:\n|$)/gmu)]
  if (!imports.length) return `${statement}${source}`

  const last = imports[imports.length - 1]
  const insertAt = last.index + last[0].length
  return `${source.slice(0, insertAt)}${statement}${source.slice(insertAt)}`
}

function createReactViteStoreSource(isTs) {
  if (!isTs) {
    return `import { create } from 'zustand'

export const useAppStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))
`
  }

  return `import { create } from 'zustand'

type AppState = {
  count: number
  increment: () => void
  reset: () => void
}

export const useAppStore = create<AppState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))
`
}

function createNextStoreSource(isTs) {
  if (!isTs) {
    return `import { createStore } from 'zustand/vanilla'

export const defaultInitState = {
  count: 0,
}

export const createAppStore = (initState = defaultInitState) => {
  return createStore((set) => ({
    ...initState,
    increment: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set(defaultInitState),
  }))
}
`
  }

  return `import { createStore } from 'zustand/vanilla'

export type AppState = {
  count: number
}

export type AppActions = {
  increment: () => void
  reset: () => void
}

export type AppStore = AppState & AppActions

export const defaultInitState: AppState = {
  count: 0,
}

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    increment: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set(defaultInitState),
  }))
}

export type AppStoreApi = ReturnType<typeof createAppStore>
`
}

function createNextProviderSource(isTs, storeImportPath) {
  if (!isTs) {
    return `'use client'

import { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'
import { createAppStore } from '${storeImportPath}'

const AppStoreContext = createContext(undefined)

export function AppStoreProvider({ children }) {
  const storeRef = useRef(null)
  let store = storeRef.current

  if (store === null) {
    store = createAppStore()
    storeRef.current = store
  }

  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore(selector) {
  const store = useContext(AppStoreContext)

  if (!store) {
    throw new Error('useAppStore must be used within AppStoreProvider')
  }

  return useStore(store, selector)
}
`
  }

  return `'use client'

import { createContext, useContext, useRef } from 'react'
import type { ReactNode } from 'react'
import { useStore } from 'zustand'
import { createAppStore } from '${storeImportPath}'
import type { AppStore, AppStoreApi } from '${storeImportPath}'

const AppStoreContext = createContext<AppStoreApi | undefined>(undefined)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStoreApi | null>(null)
  let store = storeRef.current

  if (store === null) {
    store = createAppStore()
    storeRef.current = store
  }

  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore<T>(selector: (store: AppStore) => T): T {
  const store = useContext(AppStoreContext)

  if (!store) {
    throw new Error('useAppStore must be used within AppStoreProvider')
  }

  return useStore(store, selector)
}
`
}

function findExistingStore(storeDir) {
  const candidates = [
    path.join(storeDir, "app-store.ts"),
    path.join(storeDir, "app-store.js"),
    path.join(storeDir, "app-store.tsx"),
    path.join(storeDir, "app-store.jsx"),
  ]

  return candidates.find(exists)
}

function isReactFeatureBasedLayout() {
  return exists(path.join("src", "app")) &&
    exists(path.join("src", "features")) &&
    exists(path.join("src", "shared"))
}

function selectReactViteStoreDir(mainPath) {
  const existingStoreDir = [
    path.join("src", "app", "stores"),
    path.join("src", "stores"),
    "stores",
  ].find((storeDir) => exists(storeDir))

  if (existingStoreDir) return existingStoreDir
  if (isReactFeatureBasedLayout()) return path.join("src", "app", "stores")
  return exists("src") || mainPath.startsWith("src") ? path.join("src", "stores") : "stores"
}

function configureReactVite() {
  const mainPath = reactEntryCandidates.find(exists) || ""
  const isTs = usesTypeScript(mainPath)
  const storeDir = selectReactViteStoreDir(mainPath)
  const storePath = findExistingStore(storeDir) || path.join(storeDir, `app-store${extensionFor("module", isTs)}`)

  ensureDir(storeDir)
  if (!exists(storePath)) write(storePath, createReactViteStoreSource(isTs))

  console.log(`zustand: configured React Vite store ${storePath}; no root provider is required.`)
}

function findAppLayoutPath() {
  return appLayoutCandidates.find(exists)
}

function findPagesAppPath() {
  return pagesAppCandidates.find(exists)
}

function findPagesDir() {
  return [path.join("src", "pages"), "pages"].find(exists)
}

function ensureAppLayoutWrapped(layoutPath, providerPath) {
  const importPath = toImportPath(layoutPath, providerPath)
  const current = read(layoutPath)
  const withImport = insertImport(current, `import { AppStoreProvider } from '${importPath}'\n`)

  if (/<AppStoreProvider\b/u.test(withImport)) {
    write(layoutPath, withImport.endsWith("\n") ? withImport : `${withImport}\n`)
    return
  }

  if (!/\{children\}/u.test(withImport)) {
    throw new Error(`zustand: could not find {children} in ${layoutPath} to wrap with AppStoreProvider.`)
  }

  const next = withImport.replace(/\{children\}/u, "<AppStoreProvider>{children}</AppStoreProvider>")
  write(layoutPath, next.endsWith("\n") ? next : `${next}\n`)
}

function ensurePagesAppWrapped(appPath, providerPath) {
  const importPath = toImportPath(appPath, providerPath)
  const current = read(appPath)
  const withImport = insertImport(current, `import { AppStoreProvider } from '${importPath}'\n`)

  if (/<AppStoreProvider\b/u.test(withImport)) {
    write(appPath, withImport.endsWith("\n") ? withImport : `${withImport}\n`)
    return
  }

  const componentPattern = /<Component\s+\{\.\.\.pageProps\}\s*\/>/u
  if (!componentPattern.test(withImport)) {
    throw new Error(`zustand: could not find <Component {...pageProps} /> in ${appPath} to wrap with AppStoreProvider.`)
  }

  const next = withImport.replace(
    componentPattern,
    "<AppStoreProvider><Component {...pageProps} /></AppStoreProvider>",
  )
  write(appPath, next.endsWith("\n") ? next : `${next}\n`)
}

function createPagesApp(appPath, providerPath, isTs) {
  const importPath = toImportPath(appPath, providerPath)
  const source = isTs
    ? `import type { AppProps } from 'next/app'
import { AppStoreProvider } from '${importPath}'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppStoreProvider>
      <Component {...pageProps} />
    </AppStoreProvider>
  )
}
`
    : `import { AppStoreProvider } from '${importPath}'

export default function App({ Component, pageProps }) {
  return (
    <AppStoreProvider>
      <Component {...pageProps} />
    </AppStoreProvider>
  )
}
`

  write(appPath, source)
}

function configureNext() {
  const existingLayoutPath = findAppLayoutPath()
  const existingPagesAppPath = findPagesAppPath()
  const pagesDir = findPagesDir()
  const entryPath = existingLayoutPath || existingPagesAppPath || ""
  const isTs = usesTypeScript(entryPath)
  const usesSrcRoot = entryPath.startsWith("src") || (!entryPath && exists("src"))
  const rootPrefix = usesSrcRoot ? "src" : ""
  const storeDir = rootPrefix ? path.join(rootPrefix, "stores") : "stores"
  const providerDir = rootPrefix ? path.join(rootPrefix, "providers") : "providers"
  const storePath = findExistingStore(storeDir) || path.join(storeDir, `app-store${extensionFor("module", isTs)}`)
  const providerPath = path.join(providerDir, `app-store-provider${extensionFor("component", isTs)}`)

  ensureDir(storeDir)
  ensureDir(providerDir)
  if (!exists(storePath)) write(storePath, createNextStoreSource(isTs))
  if (!exists(providerPath)) write(providerPath, createNextProviderSource(isTs, toImportPath(providerPath, storePath)))

  if (existingLayoutPath) {
    ensureAppLayoutWrapped(existingLayoutPath, providerPath)
    console.log(`zustand: configured Next.js App Router provider ${providerPath}; wrapped ${existingLayoutPath}.`)
    return
  }

  if (existingPagesAppPath) {
    ensurePagesAppWrapped(existingPagesAppPath, providerPath)
    console.log(`zustand: configured Next.js Pages Router provider ${providerPath}; wrapped ${existingPagesAppPath}.`)
    return
  }

  if (pagesDir) {
    const appPath = path.join(pagesDir, `_app${extensionFor("component", isTs)}`)
    createPagesApp(appPath, providerPath, isTs)
    console.log(`zustand: configured Next.js Pages Router provider ${providerPath}; created ${appPath}.`)
    return
  }

  throw new Error("zustand: Next.js project detected, but no App Router layout or Pages Router directory was found.")
}

function main() {
  if (!exists("package.json")) {
    throw new Error("zustand: package.json not found.")
  }

  const manifest = readJson("package.json")
  const target = detectTarget(manifest)

  if (target === "next") configureNext()
  else configureReactVite()
}

main()
