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
    "pnpm add @nuxt/ui tailwindcss",
    "if test -f .opencode/skills/nuxt-ui/scripts/nuxt-ui-bootstrap.cjs; then node .opencode/skills/nuxt-ui/scripts/nuxt-ui-bootstrap.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt-ui/scripts/nuxt-ui-bootstrap.cjs; fi",
    "pnpm install"
  ],
  "verificationCommands": ["pnpm build"]
}
```

## Usage

Use Nuxt UI when the selected frontend framework is Nuxt or Nuxt 4 and the project needs a production-ready Vue/Nuxt component system.

- Install `@nuxt/ui` and `tailwindcss`.
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
