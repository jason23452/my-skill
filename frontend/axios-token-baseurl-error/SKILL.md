---
name: axios-token-baseurl-error
description: "Framework-agnostic frontend Axios/API client skill. Use when a frontend project needs axios, an API client, dynamic parameter-based HTTP method calls, exported method helper functions, baseURL configuration, token or Authorization/Bearer headers, request interceptors, or normalized API error handling. Keep this skill independent of a fixed folder structure: adapt to the repository's existing API/http/lib/service conventions and do not create business endpoint wrappers unless explicitly requested."
---

# Axios Token BaseURL Error

## OpenCode Greenfield Bootstrap Metadata

```opencode-bootstrap-json
{
  "role": "frontend",
  "category": "frontend-addon",
  "frameworks": ["frontend", "react", "react-vite", "vue", "nuxt", "nuxt4"],
  "order": 20,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm add axios",
    "if test -f .opencode/skills/axios-token-baseurl-error/scripts/bootstrap-01-02.cjs; then node .opencode/skills/axios-token-baseurl-error/scripts/bootstrap-01-02.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/axios-token-baseurl-error/scripts/bootstrap-01-02.cjs; fi"
  ],
  "verificationCommands": []
}
```

## Purpose

Use this skill to add or repair the frontend HTTP foundation only:

- create or update one shared Axios client
- expose dynamic parameter-based HTTP methods such as `api.request({ method, url, query, body })`
- expose exported method helper functions such as `getApi(endpoint, body, query, config, headers)`
- configure `baseURL`
- attach a token through `Authorization: Bearer <token>`
- normalize Axios errors into one predictable app error shape
- keep endpoint calls inside the feature, page, store, composable, or domain module that owns the business behavior

When this Axios skill is selected, custom API wrappers created by this skill must stay Axios-backed across React, Next, Vue, and Nuxt. Do not switch this skill's transport to native `fetch`, `$fetch`, `ofetch`, or another client unless the user explicitly changes the project standard. Nuxt projects that do not select this skill should keep using Nuxt's official data fetching helpers from their framework scaffold.

Do not create a global endpoint registry, generic CRUD layer, service factory, or feature-specific business API wrapper unless the user explicitly asks for that abstraction.

## Folder-Agnostic Rule

Never force a fixed structure such as `src/shared/api` or `src/features`.

Before editing, inspect the repository and choose the smallest location that matches the project:

1. Reuse an existing Axios/http/request client file if one already exists.
2. Otherwise reuse an existing `api`, `http`, `lib`, `services`, `utils`, `composables`, or framework-local folder.
3. If no convention exists, create a minimal API folder under the current source root as bootstrap fallback. Treat that fallback as implementation detail, not an architecture mandate.

When documenting the result, report the chosen folder as "API client location" instead of claiming the project uses a required folder structure.

## File Responsibilities

The chosen API client folder should contain only transport-level concerns:

- `client`: Axios instance, base URL, default JSON headers, request interceptor.
- `token`: a replaceable token provider; safe for browser-only token storage and SSR environments.
- `errors`: Axios error detection and app-level error normalization.
- `methods`: dynamic parameter-based generic HTTP methods for `request`, `response`, `get`, `post`, `put`, `patch`, and `delete`.
- `helpers`: exported method helper functions for framework scripts, hooks, composables, stores, or feature modules.
- `useAxiosData`: Nuxt-only composable generated when a Nuxt project is detected; wraps Axios helper calls with `useAsyncData`.
- `types`: transport error payload and normalized error class/type.
- `index`: convenience exports for the transport modules.

Endpoint functions belong where the feature already lives. The dynamic method helpers are for transport calls only; they are not a global endpoint registry. Examples:

- a React hook can call `api.request<Resource[]>({ method: 'GET', url: '/resources', query: { page: 1 } })` from the hook or feature API file
- a Nuxt composable can call Axios-backed helpers directly for event-driven calls, or use `useAxiosData`/`useAsyncData` for SSR-aware setup or route data
- a store action can call `apiClient` from the store
- any framework script can import `getApi`, `postApi`, `putApi`, `patchApi`, or `deleteApi` and pass `endpoint`, `body`, `query`, `config`, and `headers` dynamically

Keep endpoints close to the consumer unless the repository already has a domain API convention.

## Base URL

Prefer the project's existing runtime configuration. Common sources include:

- Vite env values such as `VITE_API_BASE_URL`
- Nuxt public runtime/env values such as `NUXT_PUBLIC_API_BASE`
- an existing app config module
- fallback `/api` for same-origin proxy/server routes

Do not hard-code production hostnames or secrets into the client.

## Token Handling

The Axios client should depend on a token provider, not a specific auth implementation.

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

UI decisions such as toast, redirect, retry, loading state, or form error mapping should stay outside this skill unless the user asks for them.

## Axios Client Shape

Keep the client small and composable:

```ts
import axios, { AxiosHeaders } from 'axios'
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

  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  config.headers = headers
  return config
})
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

const created = await api.post<User>('/users', {
  body: { name: 'Ada' },
})
```

Use `api.response<T>({ method, url, ... })` or `api.getResponse<T>(url, options)` when callers need the full Axios response. Use `config` for per-request Axios options such as `signal`, `timeout`, or `withCredentials`.

Use exported method helpers when a framework script, hook, composable, store, or feature API file should import a function and pass dynamic arguments:

```ts
import { getApi, putApi } from './helpers'

const users = await getApi<User[]>('/users', undefined, { page: 1 }, { signal }, {
  'X-Request-Source': 'dashboard',
})

const updated = await putApi<User, Partial<User>>('/users/1', { name: 'Ada' })
```

If a feature wants business-named wrappers, define them in the owning feature module and keep the arguments dynamic:

```ts
import type { AxiosRequestConfig } from 'axios'
import { getApi, putApi, type HeaderParams, type QueryParams } from '@/api'

export function GetUser<TResponse = User>(
  endpoint: string,
  body?: unknown,
  query?: QueryParams,
  config?: AxiosRequestConfig,
  headers?: HeaderParams,
) {
  return getApi<TResponse>(endpoint, body, query, config, headers)
}

export function UpdateUser<TResponse = User, TBody = Partial<User>>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  config?: AxiosRequestConfig,
  headers?: HeaderParams,
) {
  return putApi<TResponse, TBody>(endpoint, body, query, config, headers)
}
```

Do not add named business endpoint methods such as `getUsers()` or `createOrder()` globally unless the user explicitly asks for endpoint wrappers. The scaffolded helper layer must stay framework-agnostic and transport-level.

## Nuxt Data Fetching Integration

When this skill runs in a Nuxt project, generate `app/composables/useAxiosData.ts` or `.js`. This composable mirrors Nuxt's official `useAsyncData` pattern while keeping Axios as the transport.

Use direct Axios helpers for event-driven calls:

```ts
import { postApi } from '~/utils/api'

await postApi('/users', { name: 'Ada' })
```

Use `useAxiosData` for SSR-aware setup or route data:

```ts
const { data, error, status } = await useAxiosData<User[]>('users', {
  method: 'GET',
  url: '/users',
  query: { page: 1 }
})
```

Provide a stable key for route data. Pass per-request cancellation through `config.signal`; the generated `useAxiosData` injects Nuxt's `useAsyncData` signal into Axios config.

## Reporting

After applying this skill, report:

1. API client location.
2. How `baseURL` is resolved.
3. How the token provider can be replaced by the app's auth source.
4. How errors are normalized.
5. How to use the dynamic parameter-based HTTP methods and exported method helper functions.
6. For Nuxt projects, whether `useAxiosData` was generated and how setup data should call it.
7. Build/lint/typecheck result when available.

Do not report that business endpoints were globally wrapped unless endpoint wrappers were explicitly requested.

## Verification

Run the existing project checks first:

```bash
pnpm build
pnpm lint
```

If the project has no lint script, use the closest existing typecheck/test/build command.
