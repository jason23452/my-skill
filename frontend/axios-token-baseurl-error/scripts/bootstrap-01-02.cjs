#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

function exists(filePath) {
  return fs.existsSync(filePath)
}

function isDirectory(filePath) {
  return exists(filePath) && fs.statSync(filePath).isDirectory()
}

function mkdirp(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function writeIfMissing(filePath, content) {
  if (exists(filePath)) {
    console.log(`axios-token-baseurl-error: kept existing ${toPosix(filePath)}`)
    return
  }
  mkdirp(path.dirname(filePath))
  fs.writeFileSync(filePath, content)
  console.log(`axios-token-baseurl-error: wrote ${toPosix(filePath)}`)
}

function toPosix(filePath) {
  return filePath.replace(/\\/g, "/")
}

function hasAnyFile(dirPath) {
  if (!isDirectory(dirPath)) return false
  return fs.readdirSync(dirPath).some((name) => /\.(ts|tsx|js|jsx|vue)$/u.test(name))
}

function usesTypeScript() {
  return exists("tsconfig.json") || exists("tsconfig.app.json") || exists("tsconfig.node.json")
}

function detectSourceRoot() {
  if (isDirectory("src")) return "src"
  if (isDirectory("app")) return "app"
  return "."
}

function chooseApiDir() {
  const candidates = [
    "src/shared/api",
    "src/lib/api",
    "src/api",
    "src/services/api",
    "src/utils/api",
    "app/utils/api",
    "app/lib/api",
    "app/composables/api",
    "app/api",
    "lib/api",
    "services/api",
    "utils/api",
    "api",
  ]

  for (const candidate of candidates) {
    if (hasAnyFile(candidate)) return candidate
  }

  for (const candidate of candidates) {
    if (isDirectory(candidate)) return candidate
  }

  const root = detectSourceRoot()
  if (root === "src") return path.join("src", "api")
  if (root === "app") return path.join("app", "utils", "api")
  return "api"
}

const apiDir = chooseApiDir()
const ext = usesTypeScript() ? "ts" : "js"

const typeModule = ext === "ts"
  ? `export type ApiErrorPayload = { message?: string; code?: string; details?: unknown }

export class ApiError extends Error {
  status?: number
  code?: string
  details?: unknown

  constructor(input: { message: string; status?: number; code?: string; details?: unknown }) {
    super(input.message)
    this.status = input.status
    this.code = input.code
    this.details = input.details
  }
}
`
  : `export class ApiError extends Error {
  constructor(input) {
    super(input.message)
    this.status = input.status
    this.code = input.code
    this.details = input.details
  }
}
`

const tokenModule = ext === "ts"
  ? `export type AccessTokenProvider = () => string | null | undefined

let accessTokenProvider: AccessTokenProvider = () => {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem('accessToken')
}

export function setAccessTokenProvider(provider: AccessTokenProvider) {
  accessTokenProvider = provider
}

export function getAccessToken() {
  return accessTokenProvider() || ''
}
`
  : `let accessTokenProvider = () => {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem('accessToken')
}

export function setAccessTokenProvider(provider) {
  accessTokenProvider = provider
}

export function getAccessToken() {
  return accessTokenProvider() || ''
}
`

const errorsModule = ext === "ts"
  ? `import axios from 'axios'
import { ApiError, type ApiErrorPayload } from './types'

export function normalizeApiError(error: unknown) {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const status = error.response?.status ?? 0
    const payload = error.response?.data

    return new ApiError({
      message: payload?.message ?? error.message ?? 'Request failed.',
      status,
      code: payload?.code ?? 'UNKNOWN_ERROR',
      details: payload ?? error.message,
    })
  }

  return new ApiError({
    message: 'Request failed.',
    details: error,
  })
}
`
  : `import axios from 'axios'
import { ApiError } from './types'

export function normalizeApiError(error) {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0
    const payload = error.response?.data

    return new ApiError({
      message: payload?.message ?? error.message ?? 'Request failed.',
      status,
      code: payload?.code ?? 'UNKNOWN_ERROR',
      details: payload ?? error.message,
    })
  }

  return new ApiError({
    message: 'Request failed.',
    details: error,
  })
}
`

const clientModule = ext === "ts"
  ? `import axios, { AxiosHeaders } from 'axios'
import { getAccessToken } from './token'

function resolveApiBaseUrl() {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
  return env?.VITE_API_BASE_URL || env?.NUXT_PUBLIC_API_BASE || '/api'
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers)
  const accessToken = getAccessToken()

  if (accessToken) headers.set('Authorization', \`Bearer \${accessToken}\`)

  config.headers = headers
  return config
})
`
  : `import axios, { AxiosHeaders } from 'axios'
import { getAccessToken } from './token'

function resolveApiBaseUrl() {
  const env = import.meta.env || {}
  return env.VITE_API_BASE_URL || env.NUXT_PUBLIC_API_BASE || '/api'
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers)
  const accessToken = getAccessToken()

  if (accessToken) headers.set('Authorization', \`Bearer \${accessToken}\`)

  config.headers = headers
  return config
})
`

writeIfMissing(path.join(apiDir, `types.${ext}`), typeModule)
writeIfMissing(path.join(apiDir, `token.${ext}`), tokenModule)
writeIfMissing(path.join(apiDir, `errors.${ext}`), errorsModule)
writeIfMissing(path.join(apiDir, `client.${ext}`), clientModule)

console.log(`axios-token-baseurl-error: API client location ${toPosix(apiDir)}`)
