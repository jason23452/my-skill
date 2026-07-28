---
name: react-vite-feature-based
description: React + Vite feature-based frontend scaffold and maintenance skill. Use when creating or updating React/Vite projects with src/app, src/features, src/shared, routing, pages, components, hooks, types, assets, and feature-oriented refactors.
---

# React Vite Feature-Based

## OpenCode Greenfield Bootstrap Metadata

```opencode-bootstrap-json
{
  "role": "frontend",
  "category": "framework",
  "framework": "react-vite",
  "order": 10,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm create vite . --template react-ts --no-interactive",
    "if test -f .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-02.cjs; then node .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-02.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/react-vite-feature-based/scripts/bootstrap-01-02.cjs; fi",
    "if test -f .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-03.cjs; then node .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-03.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/react-vite-feature-based/scripts/bootstrap-01-03.cjs; fi",
    "if test -f .opencode/skills/react-vite-feature-based/scripts/bootstrap-00-pnpm-allow-builds.cjs; then node .opencode/skills/react-vite-feature-based/scripts/bootstrap-00-pnpm-allow-builds.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/react-vite-feature-based/scripts/bootstrap-00-pnpm-allow-builds.cjs; fi",
    "pnpm install --frozen-lockfile=false"
  ],
  "verificationCommands": [
    "pnpm build"
  ],
  "runtimeSmokeCommand": "if test -f .opencode/skills/react-vite-feature-based/scripts/runtime-smoke-sandbox.cjs; then node .opencode/skills/react-vite-feature-based/scripts/runtime-smoke-sandbox.cjs --cwd \"$PWD\" --port $PORT; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/react-vite-feature-based/scripts/runtime-smoke-sandbox.cjs --cwd \"$PWD\" --port $PORT; fi",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/__opencode_health.txt"
}
```

Runtime smoke in OpenCode Project Flow must use `scripts/runtime-smoke-sandbox.cjs`.
Do not run Vite dev directly from `/workspace` for smoke checks; Docker bind mounts can make dev-server readiness unreliable. The bootstrap script creates `public/__opencode_health.txt` so liveness does not depend on app rendering.

## Package Manager

Detect the package manager from the lockfile and keep using it:

- `pnpm-lock.yaml`: `pnpm`
- `package-lock.json`: `npm`
- `yarn.lock`: `yarn`
- `bun.lock` or `bun.lockb`: `bun`

For greenfield bootstrap, default to `pnpm`.

## Project Layout

Use this feature-based layout:

```text
src/
  app/
    AppRouter.tsx

  features/
    <feature-name>/
      router/
      components/
      hooks/
      types/
      assets/

  shared/
    components/
    hooks/
    types/
    assets/

  App.tsx
  index.css
  main.tsx
```

## Composition Rule

Build feature UI in three layers, in this order:

1. `shared/components/` contains global reusable components.
2. `features/<feature-name>/components/` composes shared components into feature-specific components.
3. `features/<feature-name>/router/` composes feature components into route/page components.

Do not skip the feature component layer. A route/page file should not become the place where global components are assembled directly into product UI. Put that product UI into feature components first, then compose those feature components in the route.

Feature UI flow:

```text
shared/components/Button.tsx
  -> features/profile/components/ProfileActions.tsx
  -> features/profile/router/ProfilePage.tsx
  -> src/app/AppRouter.tsx
```

App-level route wrapper flow:

```text
shared/components/AppShell.tsx
  -> src/app/AppRouter.tsx
  -> features/<feature-name>/router/<FeaturePage>.tsx
```

If a component is used by every route or wraps the entire route tree, compose it in `src/app/AppRouter.tsx`. Examples include app shell, root layout, global navigation, global footer, auth boundary, provider boundary, suspense boundary, error boundary, toast host, and global modal host.

This app-level rule does not replace the feature component layer. It only covers components that are genuinely shared by all routes or all routed pages.

## Directory Responsibilities

### `src/app/`

Use `src/app/` for application-level composition:

- `AppRouter.tsx` wires application routes to feature route/page components.
- Compose components that every route needs in `AppRouter.tsx`.
- Keep cross-feature route registration here.
- Keep app-wide wrappers here, such as app shell, global navigation, providers, auth gates, suspense/error boundaries, toast hosts, and global modal hosts.
- Do not place feature-specific UI implementation here.

### `features/<feature-name>/router/`

Use `router/` for route-level composition only:

- Route/page components such as `HomePage.tsx`, `ProfilePage.tsx`, or `SettingsPage.tsx`.
- Route params, search params, guards, loaders, redirects, and route-level layout decisions.
- Composition of one or more components from `features/<feature-name>/components/`.

Do not put reusable UI blocks, cards, forms, tables, or feature business sections directly in `router/`. Move them to `components/` and import them into the route.

Prefer route imports like:

```ts
import { ProfileHeader } from "@/features/profile/components/ProfileHeader"
import { ProfileActions } from "@/features/profile/components/ProfileActions"
```

Avoid route imports like:

```ts
import { Button } from "@/shared/components/Button"
```

If a route needs `Button`, create or update a feature component that uses `Button`, then import that feature component into the route.

### `features/<feature-name>/components/`

Use feature components for product UI that belongs to exactly one feature:

- Compose global/shared components into feature-specific sections.
- Keep feature copy, feature visual structure, feature forms, feature tables, and feature state presentation here.
- A feature component may import from `shared/components`, `shared/hooks`, `shared/types`, and its own feature folders.
- A feature component must not import from `router/`.

### `features/<feature-name>/hooks/`

Use feature hooks for behavior that belongs to exactly one feature. Move a hook to `shared/hooks/` only after at least two features need it.

### `features/<feature-name>/types/`

Use feature types for data contracts owned by one feature. Move a type to `shared/types/` only when it is truly cross-feature.

### `features/<feature-name>/assets/`

Use feature assets for images, media, and static files used by one feature only.

### `shared/`

Use `shared/` for cross-feature building blocks:

- `shared/components/`: global UI primitives and reusable layout pieces.
- `shared/hooks/`: cross-feature hooks.
- `shared/types/`: cross-feature types.
- `shared/assets/`: cross-feature assets.

Do not place feature-specific product copy, business rules, route decisions, or one-off UI in `shared/`.

## Greenfield Bootstrap

When creating a new React/Vite project:

1. Use Vite React TypeScript scaffold.
2. Add the `@` import alias for `./src`.
3. Add TypeScript paths for `@/*`.
4. Create the feature-based folders.
5. Seed the example UI with the required composition flow:

```text
src/shared/components/AppPanel.tsx
  -> src/features/home/components/HomeIntro.tsx
  -> src/features/home/router/HomePage.tsx
  -> src/app/AppRouter.tsx
```

`vite.config.ts` must include the alias:

```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
})
```

`tsconfig.app.json` must include:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Update Workflow

When adding or refactoring UI:

1. Identify whether the code is global, feature-specific, or route-specific.
2. Put global reusable UI in `shared/components/`.
3. Put feature product UI in `features/<feature-name>/components/`.
4. Put route/page orchestration in `features/<feature-name>/router/`.
5. Compose components used by every route in `src/app/AppRouter.tsx`.
6. Register app-level routing in `src/app/AppRouter.tsx`.
7. Update imports to use the `@` alias for cross-folder imports.

## Naming

- Feature folder names use `kebab-case`.
- Component and page files use `PascalCase.tsx`.
- Hook files use `useXxx.ts`.
- Route/page components end with `Page`, for example `ProfilePage.tsx`.

## Shared Promotion Rule

Move code from a feature folder to `shared/` only when:

1. At least two features use it, or it is clearly global from the start.
2. It has no feature-specific copy, route knowledge, or business rule.
3. Its API is stable enough to be reused without pulling feature dependencies into `shared/`.

## Verification

After changes, run the package manager's build command:

```bash
pnpm build
npm run build
yarn build
bun run build
```

If the project has a lint script, run it too:

```bash
pnpm lint
npm run lint
yarn lint
bun run lint
```

For local runtime checks, start the dev server only when useful for the task and provide the local URL.
