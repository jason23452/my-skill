---
name: nuxt-ui
description: Nuxt UI kit skill for Nuxt 4 frontends. Use when a Greenfield or existing Nuxt project should use the official Nuxt UI component library, when the user asks for a Nuxt-compatible UI kit, or when adding Nuxt UI components, theming, templates, icons, forms, overlays, navigation, dashboards, docs, SaaS, or app shell UI. Requires a Nuxt/Nuxt 4 project such as the nuxt4-creater framework skill.
---

# Nuxt UI

## OpenCode Greenfield Bootstrap Metadata

This skill is a UI kit add-on for Nuxt projects. It does not create the Nuxt app; select it after a Nuxt framework scaffold such as `nuxt4-creater`.

```opencode-bootstrap-json
{
  "role": "frontend",
  "category": "ui-kit",
  "uiKit": "nuxt-ui",
  "frameworks": ["nuxt", "nuxt4"],
  "requiresPrimarySkills": ["nuxt4-creater"],
  "order": 30,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "if test -f .opencode/skills/nuxt-ui/scripts/pnpm-allow-builds.cjs; then node .opencode/skills/nuxt-ui/scripts/pnpm-allow-builds.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt-ui/scripts/pnpm-allow-builds.cjs; fi",
    "pnpm add @nuxt/ui tailwindcss",
    "pnpm add -D @iconify-json/lucide",
    "if test -f .opencode/skills/nuxt-ui/scripts/nuxt-ui-bootstrap.cjs; then node .opencode/skills/nuxt-ui/scripts/nuxt-ui-bootstrap.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt-ui/scripts/nuxt-ui-bootstrap.cjs; fi",
    "pnpm install --frozen-lockfile=false"
  ],
  "verificationCommands": ["pnpm build"]
}
```

## Usage

Use Nuxt UI when the selected frontend framework is Nuxt or Nuxt 4 and the project needs a production-ready Vue/Nuxt component system.

- Install `@nuxt/ui`, `tailwindcss`, and the local Nuxt UI icon collection `@iconify-json/lucide`.
- Keep Nuxt UI default `lucide:*` icons resolvable locally through Nuxt Icon so client and server icon bundles build from installed packages.
- If the project configures Nuxt UI to use another icon collection, install the matching `@iconify-json/<collection>` package during the same bootstrap pass.
- Ensure pnpm `allowBuilds` includes Nuxt/Nuxt UI build-script packages before install, including `vue-demi`. For future packages, pass extra names through `OPENCODE_PNPM_ALLOW_BUILDS` or script arguments instead of adding project-specific logic.
- Add `@nuxt/ui` to `nuxt.config.*` modules.
- Ensure the global CSS imports both Tailwind CSS and Nuxt UI.
- Keep Nuxt UI as the UI kit layer; do not mix it with React-only kits such as coss.

## Bootstrap

The bundled script `scripts/nuxt-ui-bootstrap.cjs` updates:

- `nuxt.config.ts`, `nuxt.config.js`, or `nuxt.config.mjs`
- `app/assets/css/main.css`

It preserves existing config where possible and only adds missing Nuxt UI entries.

## Verification

Run:

```bash
pnpm build
```
