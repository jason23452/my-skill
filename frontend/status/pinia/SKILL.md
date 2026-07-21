---
name: pinia
description: Vue-only Pinia state management skill for Nuxt 3/4 and Vue SPA Vite projects. Use when adding, configuring, bootstrapping, or refactoring Pinia store modules, @pinia/nuxt modules, createPinia app registration, typed store files, storeToRefs usage, SSR-safe Nuxt state, store actions, getters, persistence boundaries, or migration from ad hoc Vue state to Pinia. Do not use for React, Next.js, Svelte, Angular, or non-Vue state libraries.
---

# Pinia

## Scope

Use this skill for Vue framework projects only. It supports two targets:

- Nuxt 3/4, including Nuxt 4 projects that use the `app/` directory.
- Vue SPA projects built with Vite.

Do not apply this skill to React, Next.js, Svelte, Angular, or plain JavaScript state libraries. A generic Vite project is not enough evidence; confirm it is a Vue Vite SPA before using Pinia.

## OpenCode Greenfield Bootstrap Metadata

This skill is a frontend state add-on. Select it only after the primary frontend framework is known to be Nuxt or Vue SPA Vite.

```opencode-bootstrap-json
{
  "role": "frontend",
  "category": "state",
  "state": "pinia",
  "frameworks": ["vue", "vue-spa", "vue-vite", "nuxt", "nuxt4"],
  "order": 25,
  "packageManager": "node",
  "scaffoldCommand": [
    "if test -f .opencode/skills/pinia/scripts/bootstrap-00-install.cjs; then node .opencode/skills/pinia/scripts/bootstrap-00-install.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/pinia/scripts/bootstrap-00-install.cjs; fi",
    "if test -f .opencode/skills/pinia/scripts/bootstrap-01-config.cjs; then node .opencode/skills/pinia/scripts/bootstrap-01-config.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/pinia/scripts/bootstrap-01-config.cjs; fi"
  ],
  "verificationCommands": [
    "if test -f .opencode/skills/pinia/scripts/verify-pinia.cjs; then node .opencode/skills/pinia/scripts/verify-pinia.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/pinia/scripts/verify-pinia.cjs; fi"
  ]
}
```

## Workflow

1. Inspect `package.json`, lockfiles, framework config, and the app entry before editing.
2. Detect the target as Nuxt or Vue SPA Vite. If detection is ambiguous, keep reading project files until the Vue framework is confirmed.
3. Install and register Pinia with the project's existing package manager.
4. Place store files in the smallest existing Vue state convention in the repo.
5. Run `scripts/verify-pinia.cjs`, then the repo's available `typecheck`, `lint`, `test`, or `build` commands.

## Target Detection

Treat a project as Nuxt when it has `nuxt.config.*`, a `nuxt` dependency, or an established Nuxt layout such as `app/`, `server/`, and Nuxt pages. Use `@pinia/nuxt` for Nuxt projects.

Treat a project as Vue SPA Vite when it has Vue plus Vite evidence such as `vite.config.*`, `src/main.ts`, `src/App.vue`, and `vue`/`vite` dependencies. Use `createPinia()` registration in the Vue app entry.

If a project has Vite but no Vue evidence, stop using this skill and select a state skill for the actual framework instead.

## Package Manager

Choose the package manager from the lockfile:

- `pnpm-lock.yaml` -> `pnpm`
- `package-lock.json` -> `npm`
- `yarn.lock` -> `yarn`
- `bun.lock` or `bun.lockb` -> `bun`

If no lockfile exists, prefer `pnpm` for greenfield work.

## Nuxt Integration

Install `pinia` and `@pinia/nuxt`. Add `@pinia/nuxt` to `nuxt.config.*` modules. Do not create a manual `createPinia()` plugin in Nuxt; Nuxt should own Pinia SSR setup through the module.

Use `app/store/` when the project has the Nuxt 4 `app/` directory. Use `store/` when the project follows the older Nuxt root convention. In feature-based Vue/Nuxt repos, use `src/features/<feature-name>/store/` for feature-owned state and `src/shared/store/` for domain-neutral shared state.

Nuxt store example:

```ts
export type SessionUser = {
  id: string
  name: string
}

export const useSessionStore = defineStore('session', () => {
  const user = ref<SessionUser | null>(null)
  const isSignedIn = computed(() => user.value !== null)

  function setUser(nextUser: SessionUser | null) {
    user.value = nextUser
  }

  return { user, isSignedIn, setUser }
})
```

For Nuxt page-level initial fetches, call store actions through `callOnce()` or a Nuxt data composable at the page/composable boundary:

```vue
<script setup lang="ts">
const session = useSessionStore()

await callOnce('session:user', () => session.fetchCurrentUser())
</script>
```

Keep Nuxt store state serializable. Avoid reading `window`, `document`, or `localStorage` at module top level. For SSR-safe persisted preferences, prefer cookies or Nuxt runtime-aware code, and add browser-only storage only behind client guards.

## Vue SPA Vite Integration

Install `pinia`. Register it in the Vue app entry before `mount()`:

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.mount('#app')
```

Use `src/store/` by default. In feature-based Vue Vite repos, use `src/features/<feature-name>/store/` for feature-owned state and `src/shared/store/` for domain-neutral shared state.

Vue Vite store example:

```ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', () => {
  const accessToken = ref('')
  const isAuthenticated = computed(() => accessToken.value.length > 0)

  function setAccessToken(nextToken: string) {
    accessToken.value = nextToken
  }

  return { accessToken, isAuthenticated, setAccessToken }
})
```

## Store Design Rules

Use Pinia for state that crosses component, route, or feature boundaries. Keep local UI state in the component when it is not shared.

Name store files by domain, not by widget: `auth.ts`, `session.ts`, `cart.ts`, `profile.ts`. Export `useXxxStore` from each file and use a stable `defineStore('xxx', ...)` id.

For feature-based projects, choose the store path from the ownership rule before writing code:

- App-level or legacy state -> `app/store/<domain>.ts`, `src/store/<domain>.ts`, or `store/<domain>.ts`
- Single-feature state -> `src/features/<feature-name>/store/<domain>.ts`
- Domain-neutral reusable primitive -> `src/shared/store/<domain>.ts`

Prefer setup-style store definitions for new Vue 3 code unless the repo already uses option-style store definitions consistently. Return all reactive state from setup-style definitions so Pinia can track state, devtools, SSR, and plugins correctly.

Keep getters pure. Put asynchronous work and side effects in actions. Keep API transport details in the repo's API/composable/service layer when such a layer exists, and call it from store actions.

Use `storeToRefs()` when destructuring state or getters in components. Actions can be destructured directly.

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/store/session'

const session = useSessionStore()
const { accessToken, isAuthenticated } = storeToRefs(session)
const { setAccessToken } = session
</script>
```

In Nuxt, `defineStore()` and `storeToRefs()` are auto-imported by `@pinia/nuxt` by default. Follow the repo's existing import style instead of forcing imports everywhere.

Do not add a persistence plugin unless the user asks for persistence. If persistence is requested, persist only the smallest safe subset of state, avoid secrets in browser storage, and make Nuxt persistence SSR-safe.

## Scripts

- `scripts/bootstrap-00-install.cjs` installs `pinia` for Vue Vite, and `pinia` plus `@pinia/nuxt` for Nuxt.
- `scripts/bootstrap-01-config.cjs` adds `@pinia/nuxt` to Nuxt config or registers `createPinia()` in a Vue Vite app entry.
- `scripts/verify-pinia.cjs` verifies dependency and framework registration.

## Reporting

After using this skill, report:

1. Detected target: Nuxt or Vue SPA Vite.
2. Package manager and Pinia packages installed or already present.
3. Registration method: `@pinia/nuxt` module or `createPinia()` in the app entry.
4. Store directory used.
5. Verification commands and results.

Official references: `https://pinia.vuejs.org/getting-started.html`, `https://pinia.vuejs.org/core-concepts/`, and `https://pinia.vuejs.org/ssr/nuxt.html`.
