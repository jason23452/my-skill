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

function moduleImportFrom(fromDir, targetDir) {
  let relativePath = toPosix(path.relative(fromDir, targetDir))
  if (!relativePath.startsWith(".")) relativePath = `./${relativePath}`
  return relativePath
}

const apiDir = chooseApiDir()
const ext = usesTypeScript() ? "ts" : "js"
const nuxtComposablesDir = path.join("app", "composables")
const nuxtApiImportPath = moduleImportFrom(nuxtComposablesDir, apiDir)

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

const methodsModule = ext === "ts"
  ? `import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { apiClient } from './client'
import { normalizeApiError } from './errors'

export type QueryValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryValue | QueryValue[]>
export type HeaderValue = string | number | boolean | null | undefined
export type HeaderParams = Record<string, HeaderValue>

export type ApiRequestOptions<TBody = unknown> = {
  method: Method
  url: string
  query?: QueryParams
  params?: QueryParams
  body?: TBody
  data?: TBody
  headers?: HeaderParams
  config?: AxiosRequestConfig
}

export type ApiMethodOptions<TBody = unknown> = Omit<ApiRequestOptions<TBody>, 'method' | 'url'>

function hasOwn(object: object, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(object, key)
}

function mergeHeaders(
  configHeaders: AxiosRequestConfig['headers'],
  headers?: HeaderParams,
): AxiosRequestConfig['headers'] {
  const output: Record<string, string> = {
    ...((configHeaders && typeof configHeaders === 'object') ? configHeaders as Record<string, string> : {}),
  }

  for (const [name, value] of Object.entries(headers || {})) {
    if (value === null || value === undefined) {
      delete output[name]
    } else {
      output[name] = String(value)
    }
  }

  return output
}

function buildRequestConfig<TBody>(options: ApiRequestOptions<TBody>): AxiosRequestConfig {
  const config = options.config || {}
  const data = hasOwn(options, 'body')
    ? options.body
    : hasOwn(options, 'data')
      ? options.data
      : config.data

  return {
    ...config,
    method: options.method,
    url: options.url,
    params: options.query || options.params || config.params,
    data,
    headers: mergeHeaders(config.headers, options.headers),
  }
}

export async function apiResponse<TResponse = unknown, TBody = unknown>(
  options: ApiRequestOptions<TBody>,
): Promise<AxiosResponse<TResponse>> {
  try {
    return await apiClient.request<TResponse>(buildRequestConfig(options))
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export async function apiRequest<TResponse = unknown, TBody = unknown>(
  options: ApiRequestOptions<TBody>,
): Promise<TResponse> {
  const response = await apiResponse<TResponse, TBody>(options)
  return response.data
}

function requestWithMethod(method: Method) {
  return <TResponse = unknown, TBody = unknown>(
    url: string,
    options: ApiMethodOptions<TBody> = {},
  ) => apiRequest<TResponse, TBody>({ ...options, method, url })
}

function responseWithMethod(method: Method) {
  return <TResponse = unknown, TBody = unknown>(
    url: string,
    options: ApiMethodOptions<TBody> = {},
  ) => apiResponse<TResponse, TBody>({ ...options, method, url })
}

export const api = {
  request: apiRequest,
  response: apiResponse,
  get: requestWithMethod('GET'),
  post: requestWithMethod('POST'),
  put: requestWithMethod('PUT'),
  patch: requestWithMethod('PATCH'),
  delete: requestWithMethod('DELETE'),
  getResponse: responseWithMethod('GET'),
  postResponse: responseWithMethod('POST'),
  putResponse: responseWithMethod('PUT'),
  patchResponse: responseWithMethod('PATCH'),
  deleteResponse: responseWithMethod('DELETE'),
}
`
  : `import { apiClient } from './client'
import { normalizeApiError } from './errors'

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key)
}

function mergeHeaders(configHeaders, headers) {
  const output = {
    ...((configHeaders && typeof configHeaders === 'object') ? configHeaders : {}),
  }

  for (const [name, value] of Object.entries(headers || {})) {
    if (value === null || value === undefined) {
      delete output[name]
    } else {
      output[name] = String(value)
    }
  }

  return output
}

function buildRequestConfig(options) {
  const config = options.config || {}
  const data = hasOwn(options, 'body')
    ? options.body
    : hasOwn(options, 'data')
      ? options.data
      : config.data

  return {
    ...config,
    method: options.method,
    url: options.url,
    params: options.query || options.params || config.params,
    data,
    headers: mergeHeaders(config.headers, options.headers),
  }
}

export async function apiResponse(options) {
  try {
    return await apiClient.request(buildRequestConfig(options))
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export async function apiRequest(options) {
  const response = await apiResponse(options)
  return response.data
}

function requestWithMethod(method) {
  return (url, options = {}) => apiRequest({ ...options, method, url })
}

function responseWithMethod(method) {
  return (url, options = {}) => apiResponse({ ...options, method, url })
}

export const api = {
  request: apiRequest,
  response: apiResponse,
  get: requestWithMethod('GET'),
  post: requestWithMethod('POST'),
  put: requestWithMethod('PUT'),
  patch: requestWithMethod('PATCH'),
  delete: requestWithMethod('DELETE'),
  getResponse: responseWithMethod('GET'),
  postResponse: responseWithMethod('POST'),
  putResponse: responseWithMethod('PUT'),
  patchResponse: responseWithMethod('PATCH'),
  deleteResponse: responseWithMethod('DELETE'),
}
`

const helpersModule = ext === "ts"
  ? `import type { AxiosRequestConfig, Method } from 'axios'
import { api, type HeaderParams, type QueryParams } from './methods'

export type ApiFunction<TResponse = unknown, TBody = unknown> = (
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  config?: AxiosRequestConfig,
  headers?: HeaderParams,
) => Promise<TResponse>

export function callApi<TResponse = unknown, TBody = unknown>(
  method: Method,
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  config?: AxiosRequestConfig,
  headers?: HeaderParams,
) {
  return api.request<TResponse, TBody>({
    method,
    url: endpoint,
    body,
    query,
    config,
    headers,
  })
}

export function createApiFunction(method: Method) {
  return <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    query?: QueryParams,
    config?: AxiosRequestConfig,
    headers?: HeaderParams,
  ) => callApi<TResponse, TBody>(method, endpoint, body, query, config, headers)
}

export function getApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  config?: AxiosRequestConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('GET', endpoint, body, query, config, headers)
}

export function postApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  config?: AxiosRequestConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('POST', endpoint, body, query, config, headers)
}

export function putApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  config?: AxiosRequestConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('PUT', endpoint, body, query, config, headers)
}

export function patchApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  config?: AxiosRequestConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('PATCH', endpoint, body, query, config, headers)
}

export function deleteApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  config?: AxiosRequestConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('DELETE', endpoint, body, query, config, headers)
}
`
  : `import { api } from './methods'

export function callApi(method, endpoint, body, query, config, headers) {
  return api.request({
    method,
    url: endpoint,
    body,
    query,
    config,
    headers,
  })
}

export function createApiFunction(method) {
  return (endpoint, body, query, config, headers) => callApi(method, endpoint, body, query, config, headers)
}

export function getApi(endpoint, body, query, config, headers) {
  return callApi('GET', endpoint, body, query, config, headers)
}

export function postApi(endpoint, body, query, config, headers) {
  return callApi('POST', endpoint, body, query, config, headers)
}

export function putApi(endpoint, body, query, config, headers) {
  return callApi('PUT', endpoint, body, query, config, headers)
}

export function patchApi(endpoint, body, query, config, headers) {
  return callApi('PATCH', endpoint, body, query, config, headers)
}

export function deleteApi(endpoint, body, query, config, headers) {
  return callApi('DELETE', endpoint, body, query, config, headers)
}
`

const nuxtAxiosDataModule = ext === "ts"
  ? `import { useAsyncData } from '#imports'
import type { ApiRequestOptions } from '${nuxtApiImportPath}'
import { apiRequest } from '${nuxtApiImportPath}'

type AxiosDataRequest<TBody = unknown> = ApiRequestOptions<TBody> | (() => ApiRequestOptions<TBody>)
type UseAxiosDataOptions<TResponse> = Parameters<typeof useAsyncData<TResponse>>[2]

export function useAxiosData<TResponse = unknown, TBody = unknown>(
  key: string,
  request: AxiosDataRequest<TBody>,
  options?: UseAxiosDataOptions<TResponse>,
) {
  return useAsyncData<TResponse>(key, (_nuxtApp, { signal }) => {
    const resolved = typeof request === 'function' ? request() : request

    return apiRequest<TResponse, TBody>({
      ...resolved,
      config: {
        ...resolved.config,
        signal,
      },
    })
  }, options)
}
`
  : `import { useAsyncData } from '#imports'
import { apiRequest } from '${nuxtApiImportPath}'

export function useAxiosData(key, request, options) {
  return useAsyncData(key, (_nuxtApp, { signal }) => {
    const resolved = typeof request === 'function' ? request() : request

    return apiRequest({
      ...resolved,
      config: {
        ...resolved.config,
        signal,
      },
    })
  }, options)
}
`

const indexModule = `export * from './client'
export * from './token'
export * from './errors'
export * from './types'
export * from './methods'
export * from './helpers'
`

writeIfMissing(path.join(apiDir, `types.${ext}`), typeModule)
writeIfMissing(path.join(apiDir, `token.${ext}`), tokenModule)
writeIfMissing(path.join(apiDir, `errors.${ext}`), errorsModule)
writeIfMissing(path.join(apiDir, `client.${ext}`), clientModule)
writeIfMissing(path.join(apiDir, `methods.${ext}`), methodsModule)
writeIfMissing(path.join(apiDir, `helpers.${ext}`), helpersModule)
writeIfMissing(path.join(apiDir, `index.${ext}`), indexModule)

if (isNuxtProject()) {
  writeIfMissing(path.join(nuxtComposablesDir, `useAxiosData.${ext}`), nuxtAxiosDataModule)
}

console.log(`axios-token-baseurl-error: API client location ${toPosix(apiDir)}`)
