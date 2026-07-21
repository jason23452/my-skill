---
name: axios-token-baseurl-error
description: "Framework-aware frontend API client skill for Vite-based React SPA, Vite-based Vue SPA, and Nuxt. Use when a frontend project needs axios for Vite, Nuxt $fetch wrappers, an API client, dynamic parameter-based HTTP method calls, exported method helper functions, baseURL configuration, token or Authorization/Bearer headers, request hooks/interceptors, or normalized API error handling. Treat react-spa and vue-spa as Vite SPA aliases; add Next.js support only when the user explicitly requests it."
---

# Axios Token BaseURL Error

## OpenCode Greenfield Bootstrap Metadata

```opencode-bootstrap-json
{
  "role": "frontend",
  "category": "frontend-addon",
  "frameworks": ["frontend", "vite", "vite-spa", "react-spa", "react-vite", "vue-spa", "vue-vite", "nuxt", "nuxt4"],
  "order": 20,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "if test -f .opencode/skills/axios-token-baseurl-error/scripts/bootstrap-00-01.cjs; then node .opencode/skills/axios-token-baseurl-error/scripts/bootstrap-00-01.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/axios-token-baseurl-error/scripts/bootstrap-00-01.cjs; fi",
    "if test -f .opencode/skills/axios-token-baseurl-error/scripts/bootstrap-01-02.cjs; then node .opencode/skills/axios-token-baseurl-error/scripts/bootstrap-01-02.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/axios-token-baseurl-error/scripts/bootstrap-01-02.cjs; fi"
  ],
  "verificationCommands": []
}
```

## Purpose

Use this skill to add or repair the frontend HTTP foundation only:

- create or update one shared API transport client
- expose dynamic parameter-based HTTP methods such as `api.request({ method, url, query, body })`
- expose exported method helper functions such as `getApi(endpoint, query, body, config)`
- configure `baseURL`
- attach a token through `Authorization: Bearer <token>`
- normalize transport errors into one predictable app error shape
- keep endpoint calls inside the feature, page, store, composable, or domain module that owns the business behavior

Use Axios for Vite-based React SPA and Vue SPA projects. Use Nuxt's built-in `$fetch` for Nuxt projects; do not add axios to Nuxt unless the user explicitly asks to standardize Nuxt on axios. Treat `react-spa` and `vue-spa` as Vite SPA aliases. Add Next.js conventions only when the user explicitly asks for Next support.

Do not create a global endpoint registry, generic CRUD layer, service factory, or feature-specific business API wrapper unless the user explicitly asks for that abstraction.

## Folder-Agnostic Rule

Never force a fixed structure such as `src/shared/api` or `src/features`.

Before editing, inspect the repository and choose the smallest location that matches the project:

1. Reuse an existing Axios, `$fetch`, http, or request client file if one already exists.
2. Otherwise reuse an existing `api`, `http`, `lib`, `services`, `utils`, `composables`, or framework-local folder.
3. If no convention exists, create a minimal API folder under the current source root as bootstrap fallback. Treat that fallback as implementation detail, not an architecture mandate.

When documenting the result, report the chosen folder as "API client location" instead of claiming the project uses a required folder structure.

## File Responsibilities

The chosen API client folder should contain only transport-level concerns:

- `client`: Axios instance for Vite projects, or `$fetch` wrapper for Nuxt projects; base URL, default JSON headers, and token hook.
- `token`: a replaceable token provider; safe for browser-only token storage and SSR environments.
- `errors`: Axios or `$fetch` error detection and app-level error normalization.
- `methods`: dynamic parameter-based generic HTTP methods for `request`, `response`, `get`, `post`, `put`, `patch`, and `delete`.
- `helpers`: exported method helper functions for framework scripts, hooks, composables, stores, or feature modules.
- `types`: transport error payload and normalized error class/type.
- `index`: convenience exports for the transport modules.

Endpoint functions belong where the feature already lives. The dynamic method helpers are for transport calls only; they are not a global endpoint registry. Examples:

- a React Vite SPA hook can call `api.request<Resource[]>({ method: 'GET', url: '/resources', query: { page: 1 } })` from the hook or feature API file
- a React Vite SPA component, hook, Zustand store, Redux thunk, or TanStack Query function can import `getApi`/`postApi` and pass dynamic arguments
- a Vue Vite SPA component, composable, or Pinia action can import `getApi`/`postApi` and pass dynamic arguments
- a Nuxt page or composable can call business-named API wrappers directly inside `useAsyncData`
- a store action can call `apiClient` from the store
- any framework script can import `getApi`, `postApi`, `putApi`, `patchApi`, or `deleteApi` and pass `endpoint`, `query`, `body`, and `config` dynamically

Keep endpoints close to the consumer unless the repository already has a domain API convention.

## Base URL

Prefer the project's existing runtime configuration. Common sources include:

- Vite env values such as `VITE_API_BASE_URL`
- Nuxt public runtime config values such as `runtimeConfig.public.apiBase`
- an existing app config module
- fallback `/api` for same-origin proxy/server routes

Do not hard-code production hostnames or secrets into the client.

## Token Handling

The transport client should depend on a token provider, not a specific auth implementation.

Use a default provider only as a safe bootstrap fallback:

```ts
export type AccessTokenProvider = () => string | null | undefined

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
```

When the project has auth state, cookies, session providers, Pinia/Zustand stores, or framework runtime auth, wire `setAccessTokenProvider` to that source.

## Error Handling

Normalize transport errors at the boundary:

```ts
import axios from 'axios'
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
```

For Nuxt `$fetch`, normalize the thrown fetch error shape in the same boundary. Prefer `response._data` or `data` as the API payload, and map `status`, `statusCode`, `message`, and `code` into `ApiError`.

UI decisions such as toast, redirect, retry, loading state, or form error mapping should stay outside this skill unless the user asks for them.

## Client Shape

For Vite React/Vue projects, keep the Axios client small and composable:

```ts
import axios, { AxiosHeaders } from 'axios'
import { getAccessToken } from './token'

function resolveApiBaseUrl() {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
  return env?.VITE_API_BASE_URL || '/api'
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

  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  config.headers = headers
  return config
})
```

For Nuxt projects, wrap `$fetch` instead of axios:

```ts
import { getAccessToken } from './token'

export type ApiFetchConfig = {
  headers?: HeadersInit
  signal?: AbortSignal
  timeout?: number
  credentials?: RequestCredentials
  baseURL?: string
  [key: string]: unknown
}

export function resolveApiBaseUrl() {
  const runtimeConfig = useRuntimeConfig()
  const publicConfig = runtimeConfig.public as Record<string, unknown>

  return String(publicConfig.apiBase || publicConfig.apiBaseUrl || '/api')
}

function withApiDefaults(config: ApiFetchConfig = {}) {
  const headers = new Headers(config.headers)
  const accessToken = getAccessToken()

  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  return {
    ...config,
    baseURL: config.baseURL || resolveApiBaseUrl(),
    headers,
  }
}

export function apiClient<TResponse = unknown>(endpoint: string, config: ApiFetchConfig = {}) {
  return $fetch<TResponse>(endpoint, withApiDefaults(config))
}
```

## Dynamic Method Shape

Provide two transport-level call shapes.

Use parameter-object methods when the call site benefits from named fields:

```ts
import { api } from './methods'

const users = await api.request<User[]>({
  method: 'GET',
  url: '/users',
  query: { page: 1, status: 'active' },
  headers: { 'X-Request-Source': 'dashboard' },
})

const created = await api.post<User, { name: string }>('/users', undefined, {
  name: 'Ada',
})
```

Use `api.get<TResponse, TBody>(endpoint, query, body, config)` and the matching `post`, `put`, `patch`, and `delete` methods when call sites should pass arguments positionally. Use `api.response<T>({ method, url, ... })` or `api.getResponse<TResponse, TBody>(endpoint, query, body, config)` when callers need the full transport response. Use `config` for per-request options such as `signal`, `timeout`, `withCredentials`, `credentials`, or `headers`.

Use exported method helpers when a framework script, hook, composable, store, or feature API file should import a function and pass dynamic arguments:

```ts
import { getApi, putApi } from './helpers'

const users = await getApi<User[]>('/users', { page: 1 }, undefined, {
  signal,
  headers: { 'X-Request-Source': 'dashboard' },
})

const updated = await putApi<User, Partial<User>>('/users/1', undefined, { name: 'Ada' })
```

If a feature wants business-named wrappers, define them in the owning feature module and keep the arguments dynamic:

```ts
import { api, type ApiRequestConfig, type QueryParams } from '@/api'

export function getUser<TResponse = User>(
  endpoint: string,
  query?: QueryParams,
  body?: unknown,
  config?: ApiRequestConfig,
) {
  return api.get<TResponse, unknown>(endpoint, query, body, config)
}

export function updateUser<TResponse = User, TBody = Partial<User>>(
  endpoint: string,
  query?: QueryParams,
  body?: TBody,
  config?: ApiRequestConfig,
) {
  return api.put<TResponse, TBody>(endpoint, query, body, config)
}
```

Do not add named business endpoint methods such as `getUsers()` or `createOrder()` globally unless the user explicitly asks for endpoint wrappers. The scaffolded helper layer must stay framework-agnostic and transport-level.

## React And Vue Vite SPA Usage

For `react-spa`, `react-vite`, `vue-spa`, and `vue-vite`, treat the project as Vite-based. Keep the generated API client in the repository's existing source convention, usually `src/api`, `src/lib/api`, `src/services/api`, or a matching existing folder. Do not introduce server-framework conventions.

React hook or query function example:

```ts
import { api, type ApiRequestConfig, type QueryParams } from '@/api'

export function getUser<TResponse = User>(
  endpoint: string,
  query?: QueryParams,
  body?: unknown,
  config?: ApiRequestConfig,
) {
  return api.get<TResponse, unknown>(endpoint, query, body, config)
}

export function createUser<TResponse = User, TBody = Partial<User>>(
  endpoint: string,
  query?: QueryParams,
  body?: TBody,
  config?: ApiRequestConfig,
) {
  return api.post<TResponse, TBody>(endpoint, query, body, config)
}
```

Vue composable or Pinia action example:

```ts
import { api, type ApiRequestConfig, type QueryParams } from '@/api'

export function useUsersApi() {
  const getUser = <TResponse = User>(
    endpoint: string,
    query?: QueryParams,
    body?: unknown,
    config?: ApiRequestConfig,
  ) => api.get<TResponse, unknown>(endpoint, query, body, config)

  const updateUser = <TResponse = User, TBody = Partial<User>>(
    endpoint: string,
    query?: QueryParams,
    body?: TBody,
    config?: ApiRequestConfig,
  ) => api.put<TResponse, TBody>(endpoint, query, body, config)

  return { getUser, updateUser }
}
```

Use `config` for SPA request cancellation, timeout, credentials, and adapter-specific options. Keep loading state, retry, query cache, toast, and form error mapping in the hook/composable/store layer rather than the transport module.

## Nuxt Data Fetching Integration

When this skill runs in a Nuxt project, generate `$fetch`-backed transport files. Do not install axios and do not generate a request-object composable such as `useAxiosData('users', { method, url, query })`.

For Nuxt, keep business-named API wrappers in the owning API, service, or composable module:

```ts
import { api, type ApiRequestConfig, type QueryParams } from '~/utils/api'

export function getUser<TResponse = User>(
  endpoint: string,
  query?: QueryParams,
  body?: unknown,
  config?: ApiRequestConfig,
) {
  return api.get<TResponse, unknown>(endpoint, query, body, config)
}
```

Use direct `$fetch`-backed helpers for event-driven calls:

```ts
import { postApi } from '~/utils/api'

await postApi('/users', undefined, { name: 'Ada' })
```

Use Nuxt's `useAsyncData` directly for page initialization or SSR-aware route data:

```ts
const query = { page: 1 }

const { data, error, status, refresh } = await useAsyncData('users', () =>
  getUser<User[]>('/users', query)
)
```

When request cancellation matters, pass Nuxt's signal through the normal `config` argument:

```ts
const { data, error, status } = await useAsyncData('users', (_nuxtApp, { signal }) =>
  getUser<User[]>('/users', { page: 1 }, undefined, { signal })
)
```

Provide a stable key for route data. Keep `useAsyncData` visible at the page or composable boundary, and keep the API wrapper shape as `api.get(endpoint, query, body, config)`. This follows Nuxt's official pattern of using `useAsyncData` with `$fetch` for setup data so SSR payload hydration does not refetch the same data on the client.

## Reporting

After applying this skill, report:

1. API client location.
2. How `baseURL` is resolved.
3. How the token provider can be replaced by the app's auth source.
4. How errors are normalized.
5. How to use the dynamic parameter-based HTTP methods and exported method helper functions.
6. For Nuxt projects, how pages should call `useAsyncData('key', () => apiWrapper(...))`.
7. Build/lint/typecheck result when available.

Do not report that business endpoints were globally wrapped unless endpoint wrappers were explicitly requested.

## Verification

Run the existing project checks first:

```bash
pnpm build
pnpm lint
```

If the project has no lint script, use the closest existing typecheck/test/build command.
