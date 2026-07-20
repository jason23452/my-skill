---
name: axios-token-baseurl-error
description: "Framework-agnostic frontend Axios/API client skill. Use when a frontend project needs axios, an API client, baseURL configuration, token or Authorization/Bearer headers, request interceptors, or normalized API error handling. Keep this skill independent of a fixed folder structure: adapt to the repository's existing API/http/lib/service conventions and do not create endpoint wrappers unless explicitly requested."
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
- configure `baseURL`
- attach a token through `Authorization: Bearer <token>`
- normalize Axios errors into one predictable app error shape
- keep endpoint calls inside the feature, page, store, composable, or domain module that owns the business behavior

Do not create a global endpoint registry, generic CRUD layer, service factory, or feature-specific API wrapper unless the user explicitly asks for that abstraction.

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
- `types`: transport error payload and normalized error class/type.

Endpoint functions belong where the feature already lives. Examples:

- a React hook can call `apiClient.get('/resources')` from the hook or feature API file
- a Nuxt composable can call `apiClient.get('/resources')` from the composable
- a store action can call `apiClient` from the store

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

## Reporting

After applying this skill, report:

1. API client location.
2. How `baseURL` is resolved.
3. How the token provider can be replaced by the app's auth source.
4. How errors are normalized.
5. Build/lint/typecheck result when available.

Do not report that endpoints were globally wrapped unless endpoint wrappers were explicitly requested.

## Verification

Run the existing project checks first:

```bash
pnpm build
pnpm lint
```

If the project has no lint script, use the closest existing typecheck/test/build command.
