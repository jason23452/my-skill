const fs = require("fs")
const path = require("path")

const cwd = process.cwd()
const configCandidates = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"]
const cssAlias = "~/assets/css/main.css"
const cssPath = path.join(cwd, "app", "assets", "css", "main.css")

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

function ensureCssConfig() {
  const configPath = findConfigPath()
  let source = fs.existsSync(configPath)
    ? fs.readFileSync(configPath, "utf8").replace(/^\uFEFF/u, "")
    : "export default defineNuxtConfig({\n})\n"

  const config = findConfigObject(source)
  if (!config) {
    fs.writeFileSync(configPath, source)
    return
  }

  const css = findArrayProperty(source, config, "css")
  if (!css) {
    source = insertTopLevelProperty(source, `css: ['${cssAlias}'],`)
    fs.writeFileSync(configPath, source)
    return
  }

  const existing = source.slice(css.open, css.close)
  if (new RegExp(`["']${cssAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "u").test(existing)) return

  const beforeClose = source.slice(0, css.close).replace(/\s*$/u, "")
  const afterClose = source.slice(css.close)
  const needsComma = !beforeClose.endsWith("[")
  source = `${beforeClose}${needsComma ? "," : ""}\n    '${cssAlias}'\n  ${afterClose}`
  fs.writeFileSync(configPath, source)
}

function baseCss() {
  return `/* Generated by nuxt4-creater base CSS. */
:root {
  color: #0f172a;
  background: #f8fafc;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background: #f8fafc;
}

a {
  color: inherit;
  text-decoration: none;
}

.app-shell {
  min-height: 100vh;
  color: #0f172a;
  background: #f8fafc;
}

.app-header,
.app-footer {
  border-color: #e2e8f0;
  background: rgba(255, 255, 255, 0.92);
}

.app-header {
  border-bottom: 1px solid #e2e8f0;
}

.app-footer {
  border-top: 1px solid #e2e8f0;
}

.app-header__inner,
.app-footer__inner {
  display: flex;
  align-items: center;
}

.app-header__inner {
  min-height: 4rem;
  justify-content: space-between;
  gap: 1.5rem;
}

.app-footer__inner {
  padding-block: 1.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.app-brand {
  font-size: 0.875rem;
  font-weight: 700;
}

.app-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #475569;
  font-size: 0.875rem;
}

.app-nav__link:hover {
  color: #0f172a;
}

.base-container {
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: clamp(1rem, 3vw, 2rem);
}

.base-section {
  padding-block: clamp(4rem, 8vw, 6rem);
  background: #ffffff;
}

.base-section--muted {
  background: #f1f5f9;
}

.base-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  border-radius: 0.375rem;
  padding-inline: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
}

.base-button:focus-visible {
  outline: 2px solid #94a3b8;
  outline-offset: 2px;
}

.base-button--primary {
  background: #0f172a;
  color: #ffffff;
}

.base-button--primary:hover {
  background: #1e293b;
}

.base-button--secondary {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
}

.base-button--secondary:hover {
  background: #f1f5f9;
}

.home-hero {
  max-width: 48rem;
}

.home-hero__eyebrow {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-hero__title {
  margin: 1rem 0 0;
  color: #0f172a;
  font-size: clamp(2.25rem, 6vw, 4rem);
  line-height: 1;
}

.home-hero__description {
  margin: 1.5rem 0 0;
  color: #475569;
  font-size: 1.125rem;
  line-height: 1.75;
}

.home-hero__action {
  margin-top: 2rem;
}

.home-feature-grid {
  display: grid;
  gap: 1.5rem;
}

.home-feature__title,
.home-contact__title {
  margin: 0;
  color: #0f172a;
}

.home-feature__title {
  font-size: 1.125rem;
}

.home-feature__description {
  margin: 0.75rem 0 0;
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.7;
}

.home-contact {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.home-contact__title {
  font-size: 1.5rem;
}

.home-contact__description {
  margin: 0.75rem 0 0;
  color: #475569;
  line-height: 1.7;
}

@media (min-width: 768px) {
  .home-feature-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .home-contact {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
`
}

function ensureBaseCssFile() {
  ensureDir(path.dirname(path.relative(cwd, cssPath)))
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, baseCss())
    return
  }

  const current = fs.readFileSync(cssPath, "utf8").replace(/^\uFEFF/u, "")
  const trimmed = current.trim()
  if (!trimmed) {
    fs.writeFileSync(cssPath, baseCss())
  }
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
ensureCssConfig()
ensureBaseCssFile()

removeGeneratedFile("app/components/app/AppLayout.vue", [
  "min-h-screen bg-slate-50 text-slate-950 antialiased",
  "<AppHeader />",
  "<AppFooter />",
])

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
  <div class="app-shell">
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
  <header class="app-header">
    <BaseContainer class="app-header__inner">
      <NuxtLink to="/" class="app-brand">
        {{ SITE_CONFIG.name }}
      </NuxtLink>
      <nav class="app-nav">
        <NuxtLink
          v-for="item in SITE_NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="app-nav__link"
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
  <footer class="app-footer">
    <BaseContainer class="app-footer__inner">
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
  <div class="base-container">
    <slot />
  </div>
</template>
`,
)

writeFile(
  "app/components/ui/BaseSection.vue",
  `<template>
  <section :class="['base-section', toneClass]">
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
  return props.tone === 'muted' ? 'base-section--muted' : undefined
})
</script>
`,
)

writeFile(
  "app/components/ui/BaseCard.vue",
  `<template>
  <div class="base-card">
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
  return ['base-button', 'base-button--' + props.variant]
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
    <div class="home-hero">
      <p class="home-hero__eyebrow">
        {{ HOME_CONTENT.hero.eyebrow }}
      </p>
      <h1 class="home-hero__title">
        {{ HOME_CONTENT.hero.title }}
      </h1>
      <p class="home-hero__description">
        {{ HOME_CONTENT.hero.description }}
      </p>
      <BaseButton :to="HOME_CONTENT.hero.ctaTo" class="home-hero__action">
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
    <div class="home-feature-grid">
      <BaseCard v-for="feature in HOME_CONTENT.features" :key="feature.title">
        <h2 class="home-feature__title">{{ feature.title }}</h2>
        <p class="home-feature__description">{{ feature.description }}</p>
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
      <div class="home-contact">
        <div>
          <h2 class="home-contact__title">{{ HOME_CONTENT.contact.title }}</h2>
          <p class="home-contact__description">
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
