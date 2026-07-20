const fs = require("fs")
const path = require("path")

const cwd = process.cwd()
const configCandidates = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"]

function ensureDir(relativePath) {
  fs.mkdirSync(path.join(cwd, relativePath), { recursive: true })
}

function writeFile(relativePath, content, options = {}) {
  const filePath = path.join(cwd, relativePath)
  ensureDir(path.dirname(relativePath))

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content)
    return
  }

  const current = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/u, "")
  const canReplace = (options.replaceWhen || []).some((pattern) => pattern.test(current))

  if (canReplace) {
    fs.writeFileSync(filePath, content)
  }
}

function removeGeneratedFile(relativePath, markers) {
  const filePath = path.join(cwd, relativePath)
  if (!fs.existsSync(filePath)) return

  const current = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/u, "")
  const isGenerated = markers.every((marker) => current.includes(marker))

  if (isGenerated) {
    fs.unlinkSync(filePath)
  }
}

function findMatchingClose(source, openIndex, openChar, closeChar) {
  let depth = 0
  let quote = null
  let escaped = false

  for (let i = openIndex; i < source.length; i += 1) {
    const char = source[i]

    if (quote) {
      if (escaped) {
        escaped = false
      } else if (char === "\\") {
        escaped = true
      } else if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char
      continue
    }

    if (char === openChar) depth += 1
    if (char === closeChar) depth -= 1
    if (depth === 0) return i
  }

  return -1
}

function findConfigPath() {
  const existing = configCandidates.find((file) => fs.existsSync(path.join(cwd, file)))
  return path.join(cwd, existing || "nuxt.config.ts")
}

function findConfigObject(source) {
  const match = /defineNuxtConfig\s*\(\s*\{/u.exec(source)
  if (!match) return null
  const open = source.indexOf("{", match.index)
  const close = findMatchingClose(source, open, "{", "}")
  if (close === -1) return null
  return { open, close }
}

function findArrayProperty(source, objectRange, name) {
  const bodyStart = objectRange.open + 1
  const body = source.slice(bodyStart, objectRange.close)
  const re = new RegExp(`\\b${name}\\s*:\\s*\\[`, "u")
  const match = re.exec(body)
  if (!match) return null
  const open = bodyStart + match.index + match[0].lastIndexOf("[")
  const close = findMatchingClose(source, open, "[", "]")
  if (close === -1 || close > objectRange.close) return null
  return { open, close }
}

function findObjectProperty(source, objectRange, name) {
  const bodyStart = objectRange.open + 1
  const body = source.slice(bodyStart, objectRange.close)
  const re = new RegExp(`\\b${name}\\s*:\\s*\\{`, "u")
  const match = re.exec(body)
  if (!match) return null
  const open = bodyStart + match.index + match[0].lastIndexOf("{")
  const close = findMatchingClose(source, open, "{", "}")
  if (close === -1 || close > objectRange.close) return null
  return { open, close }
}

function insertTopLevelProperty(source, propertyText) {
  const config = findConfigObject(source)
  if (!config) {
    return source
  }

  return `${source.slice(0, config.open + 1)}\n  ${propertyText}${source.slice(config.open + 1)}`
}

function ensureComponentsAutoImport() {
  const configPath = findConfigPath()
  let source = fs.existsSync(configPath)
    ? fs.readFileSync(configPath, "utf8").replace(/^\uFEFF/u, "")
    : "export default defineNuxtConfig({\n})\n"

  source = source.replace(
    /\bcomponents\s*:\s*true\b/u,
    "components: [\n    { path: '~/components', pathPrefix: false },\n    { path: '~/content', pathPrefix: false }\n  ]",
  )

  const config = findConfigObject(source)
  if (!config) {
    fs.writeFileSync(configPath, source)
    return
  }

  const components = findArrayProperty(source, config, "components")
  if (!components) {
    source = insertTopLevelProperty(
      source,
      "components: [\n    { path: '~/components', pathPrefix: false },\n    { path: '~/content', pathPrefix: false }\n  ],",
    )
    fs.writeFileSync(configPath, source)
    return
  }

  const existing = source.slice(components.open, components.close)
  const missing = []
  if (!/["']~\/components["']/u.test(existing)) {
    missing.push("{ path: '~/components', pathPrefix: false }")
  }
  if (!/["']~\/content["']/u.test(existing)) {
    missing.push("{ path: '~/content', pathPrefix: false }")
  }

  if (missing.length) {
    const beforeClose = source.slice(0, components.close).replace(/\s*$/u, "")
    const afterClose = source.slice(components.close)
    const needsComma = !beforeClose.endsWith("[")
    source = `${beforeClose}${needsComma ? "," : ""}\n    ${missing.join(",\n    ")}\n  ${afterClose}`
    fs.writeFileSync(configPath, source)
  }
}

function ensureRuntimeConfig() {
  const configPath = findConfigPath()
  let source = fs.existsSync(configPath)
    ? fs.readFileSync(configPath, "utf8").replace(/^\uFEFF/u, "")
    : "export default defineNuxtConfig({\n})\n"

  if (/\bapiBase\s*:/u.test(source)) {
    return
  }

  let config = findConfigObject(source)
  if (!config) {
    fs.writeFileSync(configPath, source)
    return
  }

  const runtimeConfig = findObjectProperty(source, config, "runtimeConfig")
  if (!runtimeConfig) {
    source = insertTopLevelProperty(
      source,
      "runtimeConfig: {\n    public: {\n      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'\n    }\n  },",
    )
    fs.writeFileSync(configPath, source)
    return
  }

  const publicConfig = findObjectProperty(source, runtimeConfig, "public")
  if (!publicConfig) {
    source = `${source.slice(0, runtimeConfig.open + 1)}\n    public: {\n      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'\n    },${source.slice(runtimeConfig.open + 1)}`
    fs.writeFileSync(configPath, source)
    return
  }

  const beforeClose = source.slice(0, publicConfig.close).replace(/\s*$/u, "")
  const afterClose = source.slice(publicConfig.close)
  const needsComma = !beforeClose.endsWith("{")
  source = `${beforeClose}${needsComma ? "," : ""}\n      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'\n    ${afterClose}`
  fs.writeFileSync(configPath, source)
}

function ensureDirectories() {
  [
    "app/assets/css",
    "app/components/app",
    "app/components/seo",
    "app/components/ui",
    "app/constants",
    "app/content/home",
    "app/composables",
    "app/layouts",
    "app/middleware",
    "app/pages",
    "app/plugins",
    "app/stores",
    "app/types",
    "app/utils",
    "app/utils/api",
    "public",
    "server/api",
    "server/routes",
    "server/utils",
    "shared/types",
    "shared/utils",
  ].forEach(ensureDir)
}

ensureDirectories()
ensureComponentsAutoImport()
ensureRuntimeConfig()

removeGeneratedFile("app/components/app/AppLayout.vue", [
  "min-h-screen bg-slate-50 text-slate-950 antialiased",
  "<AppHeader />",
  "<AppFooter />",
])
removeGeneratedFile("app/utils/api/client.ts", ["axios.create", "createApiClient", "getAccessToken"])
removeGeneratedFile("app/utils/api/errors.ts", ["axios.isAxiosError", "normalizeApiError", "ApiErrorPayload"])
removeGeneratedFile("app/utils/api/token.ts", ["AccessTokenProvider", "accessToken", "localStorage"])

writeFile(
  "app/constants/site.ts",
  `export const SITE_CONFIG = {
  name: 'Site',
  title: 'Home',
  description: 'A Nuxt 4 page built from reusable content sections.',
  copyright: 'All rights reserved.',
} as const

export const SITE_NAV_ITEMS = [
  { label: 'Home', to: '/' },
] as const

export const HOME_CONTENT = {
  hero: {
    eyebrow: 'Nuxt 4 Starter',
    title: 'Build pages from reusable content sections.',
    description: 'Keep route pages focused on SEO and composition while shared UI components handle layout and styling.',
    ctaLabel: 'Get started',
    ctaTo: '/',
  },
  features: [
    {
      title: 'Components',
      description: 'Shared UI primitives live in app/components and stay reusable across pages.',
    },
    {
      title: 'Content',
      description: 'Page-specific sections live in app/content and compose shared components.',
    },
    {
      title: 'Pages',
      description: 'Route pages assemble sections and keep SEO, layout, and route data easy to scan.',
    },
  ],
  contact: {
    title: 'Ready for your content',
    description: 'Add more sections under app/content/home or create a new page folder under app/content.',
    ctaLabel: 'View home',
    ctaTo: '/',
  },
} as const
`,
)

writeFile(
  "app/utils/api/types.ts",
  `export type QueryValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryValue | QueryValue[]>
export type HeaderValue = string | number | boolean | null | undefined
export type HeaderParams = Record<string, HeaderValue>

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiFetchConfig = Record<string, unknown> & {
  query?: QueryParams
  params?: QueryParams
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}
`,
  { replaceWhen: [/ApiErrorPayload/u, /class ApiError/u] },
)

writeFile(
  "app/utils/api/methods.ts",
  `import { $fetch, useRuntimeConfig } from '#imports'
import type { ApiFetchConfig, ApiMethod, HeaderParams, QueryParams } from './types'

export type { ApiFetchConfig, ApiMethod, HeaderParams, QueryParams } from './types'

export type ApiRequestOptions<TBody = unknown> = {
  method?: ApiMethod
  endpoint?: string
  url?: string
  query?: QueryParams
  params?: QueryParams
  body?: TBody
  data?: TBody
  headers?: HeaderParams
  options?: ApiFetchConfig
}

export type ApiMethodOptions<TBody = unknown> = Omit<ApiRequestOptions<TBody>, 'method' | 'endpoint' | 'url'>

function hasOwn(object: object, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(object, key)
}

function resolveUrl<TBody>(options: ApiRequestOptions<TBody>) {
  const url = options.endpoint || options.url
  if (!url) throw new Error('API request requires endpoint or url.')
  return url
}

function mergeHeaders(
  configHeaders?: HeadersInit,
  headers?: HeaderParams,
): HeadersInit | undefined {
  const output: Record<string, string> = {}

  if (configHeaders instanceof Headers) {
    configHeaders.forEach((value, name) => {
      output[name] = value
    })
  } else if (Array.isArray(configHeaders)) {
    for (const [name, value] of configHeaders) {
      output[name] = value
    }
  } else if (configHeaders && typeof configHeaders === 'object') {
    Object.assign(output, configHeaders)
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

function resolveApiBaseUrl() {
  const config = useRuntimeConfig()
  return config.public.apiBase || '/api'
}

function buildRequestOptions<TBody>(options: ApiRequestOptions<TBody>): ApiFetchConfig {
  const requestOptions = options.options || {}
  const data = hasOwn(options, 'body')
    ? options.body
    : hasOwn(options, 'data')
      ? options.data
      : requestOptions.body

  return {
    ...requestOptions,
    method: options.method || 'GET',
    baseURL: resolveApiBaseUrl(),
    query: options.query || options.params || requestOptions.query || requestOptions.params,
    body: data,
    headers: mergeHeaders(requestOptions.headers, options.headers),
  }
}

export async function apiRequest<TResponse = unknown, TBody = unknown>(
  options: ApiRequestOptions<TBody>,
): Promise<TResponse> {
  return await $fetch<TResponse>(resolveUrl(options), buildRequestOptions(options))
}

function requestWithMethod(method: ApiMethod) {
  return <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    query?: QueryParams,
    options?: ApiFetchConfig,
    headers?: HeaderParams,
  ) => apiRequest<TResponse, TBody>({ method, endpoint, body, query, options, headers })
}

export const api = {
  request: apiRequest,
  get: requestWithMethod('GET'),
  post: requestWithMethod('POST'),
  put: requestWithMethod('PUT'),
  patch: requestWithMethod('PATCH'),
  delete: requestWithMethod('DELETE'),
}
`,
  { replaceWhen: [/AxiosRequestConfig/u, /createApiClient/u] },
)

writeFile(
  "app/utils/api/helpers.ts",
  `import { apiRequest, type ApiFetchConfig, type ApiMethod, type HeaderParams, type QueryParams } from './methods'

export type ApiFunction<TResponse = unknown, TBody = unknown> = (
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  options?: ApiFetchConfig,
  headers?: HeaderParams,
) => Promise<TResponse>

export function callApi<TResponse = unknown, TBody = unknown>(
  method: ApiMethod,
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  options?: ApiFetchConfig,
  headers?: HeaderParams,
) {
  return apiRequest<TResponse, TBody>({
    method,
    endpoint,
    body,
    query,
    options,
    headers,
  })
}

export function getApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  options?: ApiFetchConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('GET', endpoint, body, query, options, headers)
}

export function postApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  options?: ApiFetchConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('POST', endpoint, body, query, options, headers)
}

export function putApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  options?: ApiFetchConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('PUT', endpoint, body, query, options, headers)
}

export function patchApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  options?: ApiFetchConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('PATCH', endpoint, body, query, options, headers)
}

export function deleteApi<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  query?: QueryParams,
  options?: ApiFetchConfig,
  headers?: HeaderParams,
) {
  return callApi<TResponse, TBody>('DELETE', endpoint, body, query, options, headers)
}
`,
  { replaceWhen: [/AxiosRequestConfig/u] },
)

writeFile(
  "app/utils/api/index.ts",
  `export * from './types'
export * from './methods'
export * from './helpers'
`,
  { replaceWhen: [/export \* from ['"]\.\/client['"]/u, /export \* from ['"]\.\/token['"]/u, /export \* from ['"]\.\/errors['"]/u] },
)

writeFile(
  "app/composables/useApiData.ts",
  `import { useAsyncData } from '#imports'
import type { ApiRequestOptions } from '~/utils/api'
import { apiRequest } from '~/utils/api'

type ApiDataRequest<TBody = unknown> = ApiRequestOptions<TBody> | (() => ApiRequestOptions<TBody>)
type UseApiDataOptions<TResponse> = Parameters<typeof useAsyncData<TResponse>>[2]

export function useApiData<TResponse = unknown, TBody = unknown>(
  key: string,
  request: ApiDataRequest<TBody>,
  options?: UseApiDataOptions<TResponse>,
) {
  return useAsyncData<TResponse>(key, (_nuxtApp, { signal }) => {
    const resolved = typeof request === 'function' ? request() : request

    return apiRequest<TResponse, TBody>({
      ...resolved,
      options: {
        ...resolved.options,
        signal,
      },
    })
  }, options)
}
`,
  { replaceWhen: [/resolved\.config/u] },
)

writeFile(
  "app/app.vue",
  `<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
`,
  { replaceWhen: [/NuxtWelcome/u, /<NuxtRouteAnnouncer \/>[\s\S]*<NuxtPage \/>/u] },
)

writeFile(
  "app/layouts/default.vue",
  `<template>
  <div class="min-h-screen bg-slate-50 text-slate-950 antialiased">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
`,
)

writeFile(
  "app/components/app/AppHeader.vue",
  `<template>
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur">
    <BaseContainer class="flex h-16 items-center justify-between">
      <NuxtLink to="/" class="text-sm font-semibold text-slate-950">
        {{ SITE_CONFIG.name }}
      </NuxtLink>
      <nav class="flex items-center gap-4 text-sm text-slate-600">
        <NuxtLink
          v-for="item in SITE_NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="transition hover:text-slate-950"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import { SITE_CONFIG, SITE_NAV_ITEMS } from '~/constants/site'
</script>
`,
)

writeFile(
  "app/components/app/AppFooter.vue",
  `<template>
  <footer class="border-t border-slate-200 bg-white">
    <BaseContainer class="py-6 text-sm text-slate-500">
      <p>{{ year }} {{ SITE_CONFIG.name }}. {{ SITE_CONFIG.copyright }}</p>
    </BaseContainer>
  </footer>
</template>

<script setup lang="ts">
import { SITE_CONFIG } from '~/constants/site'

const year = new Date().getFullYear()
</script>
`,
)

writeFile(
  "app/components/ui/BaseContainer.vue",
  `<template>
  <div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    <slot />
  </div>
</template>
`,
)

writeFile(
  "app/components/ui/BaseSection.vue",
  `<template>
  <section :class="['py-16 sm:py-24', toneClass]">
    <BaseContainer>
      <slot />
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    tone?: 'default' | 'muted'
  }>(),
  {
    tone: 'default'
  },
)

const toneClass = computed(() => {
  return props.tone === 'muted' ? 'bg-slate-100' : 'bg-white'
})
</script>
`,
)

writeFile(
  "app/components/ui/BaseCard.vue",
  `<template>
  <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <slot />
  </div>
</template>
`,
)

writeFile(
  "app/components/ui/BaseButton.vue",
  `<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :class="classes">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
  }>(),
  {
    type: 'button',
    variant: 'primary'
  },
)

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2'

  if (props.variant === 'secondary') {
    return [base, 'border border-slate-300 bg-white text-slate-950 hover:bg-slate-100']
  }

  return [base, 'bg-slate-950 text-white hover:bg-slate-800']
})
</script>
`,
)

writeFile(
  "app/components/seo/SeoJsonLd.vue",
  `<template></template>

<script setup lang="ts">
const props = defineProps<{
  data: Record<string, unknown> | Array<Record<string, unknown>>
}>()

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(props.data)
    }
  ]
})
</script>
`,
)

writeFile(
  "app/pages/index.vue",
  `<template>
  <HomeHero />
  <HomeFeature />
  <HomeContact />
</template>

<script setup lang="ts">
import { SITE_CONFIG } from '~/constants/site'

useSeoMeta({
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description
})
</script>
`,
  { replaceWhen: [/NuxtWelcome/u, /Welcome to Nuxt/u, /<AppLayout>/u] },
)

writeFile(
  "app/content/home/HomeHero.vue",
  `<template>
  <BaseSection>
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-widest text-slate-500">
        {{ HOME_CONTENT.hero.eyebrow }}
      </p>
      <h1 class="mt-4 text-4xl font-bold tracking-normal text-slate-950 sm:text-6xl">
        {{ HOME_CONTENT.hero.title }}
      </h1>
      <p class="mt-6 text-lg leading-8 text-slate-600">
        {{ HOME_CONTENT.hero.description }}
      </p>
      <BaseButton :to="HOME_CONTENT.hero.ctaTo" class="mt-8">
        {{ HOME_CONTENT.hero.ctaLabel }}
      </BaseButton>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { HOME_CONTENT } from '~/constants/site'
</script>
`,
)

writeFile(
  "app/content/home/HomeFeature.vue",
  `<template>
  <BaseSection tone="muted">
    <div class="grid gap-6 md:grid-cols-3">
      <BaseCard v-for="feature in HOME_CONTENT.features" :key="feature.title">
        <h2 class="text-lg font-semibold text-slate-950">{{ feature.title }}</h2>
        <p class="mt-3 text-sm leading-6 text-slate-600">{{ feature.description }}</p>
      </BaseCard>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { HOME_CONTENT } from '~/constants/site'
</script>
`,
)

writeFile(
  "app/content/home/HomeContact.vue",
  `<template>
  <BaseSection>
    <BaseCard>
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-950">{{ HOME_CONTENT.contact.title }}</h2>
          <p class="mt-3 text-slate-600">
            {{ HOME_CONTENT.contact.description }}
          </p>
        </div>
        <BaseButton :to="HOME_CONTENT.contact.ctaTo" variant="secondary">
          {{ HOME_CONTENT.contact.ctaLabel }}
        </BaseButton>
      </div>
    </BaseCard>
  </BaseSection>
</template>

<script setup lang="ts">
import { HOME_CONTENT } from '~/constants/site'
</script>
`,
)
