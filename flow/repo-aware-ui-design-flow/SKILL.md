---
name: repo-aware-ui-design-flow
description: Repository-aware product design flow for session-maintained design artifacts. Use after PRD-to-product-design establishes design-context.md, when UX, wireframes, system DESIGN.md, layout.md, previews, or implementation briefs must respect existing frontend routes, components, tokens, and implementation constraints without storing design Markdown in the product repository.
---

# Repo-Aware UI Design Flow

This skill is the single required method for PRD-driven frontend design in this repo. It replaces broad multi-skill design chaining with a small, evidence-first flow.

## Goal

Produce repo-aware product design artifacts from an approved `design-context.md` and actual frontend repo evidence. Keep `spec.md` as the product/engineering contract. Repository code is implementation evidence, not the storage location for design documents.

## Core Sequence

1. Read the product design context.
   - Inputs: `design-context.md`, primary/related PRDs, `spec.md`, `project-context.md`, `bootstrap-result.json`.
   - Completion: every role, capability, screen, state, control, and design consequence has an evidence ID and AC coverage.

2. Read frontend repo reality.
   - Inspect actual frontend repo files: `README*`, `AGENTS.md`, `package.json`, lockfile, routing/layout/page files, shared components, styles, tokens, theme, config, and existing `design/` docs.
   - Completion: evidence is recorded with file paths and impact.

3. Decide UI Foundation Strategy.
   - Classify status as `existing-kit`, `existing-styling`, `partial`, or `none`.
   - Do not require a UI kit. If none exists, say so and define project-local primitives.
   - Do not claim shadcn, coss, MUI, Radix, Tailwind, or custom components are present without repo evidence.
   - If introducing a new kit is proposed, it must not be an assumption. If the caller allows options, present it as one selectable design option with tradeoffs. If the caller requires a single canonical artifact or forbids options, either reject the new kit as out-of-scope or return blocked for explicit user confirmation.
   - Completion: the design can explain what to reuse, extend, create, or optionally adopt.

4. Write Product UX Spec.
   - `ux-spec.md` defines user task, entry, first-look judgement, information priority, content/data contract, states, non-goal controls, and accessibility/trust requirements.

5. Write Wireframe Spec.
   - `wireframe-spec.md` defines screen inventory, page shell, desktop/tablet/mobile regions, reading order, region priority, component slots, state layouts, and RWD collapse rules.

6. Write Visual Design Spec.
   - `visual-design-spec.md` defines visual thesis, color roles, typography roles, spacing/density, surfaces, component visual roles, state treatment, interaction tone, accessibility, and the HTML preview style contract.

7. Write System DESIGN And Layout Contracts.
   - `DESIGN.md` defines product-wide visual semantics, domain components, state language, tokens, responsive behavior, accessibility, and PRD application traceability.
   - `layout.md` defines the whole product system layout contract: app shell, navigation model, route/page template taxonomy, grid/container policy, action placement, state placement, responsive policy, and component layout policy.
   - Current PRD, UX spec, and wireframe spec are representative evidence surfaces used to validate the product-wide layout system, not the boundary of the layout system.
   - Completion: the layout contract can explain how the current feature fits the product-wide templates without becoming a single-feature screen spec.

8. Generate HTML preview.
   - `screen-preview.html` must be a self-contained, high-fidelity product UI mockup grounded in the three design specs.
   - It must show realistic desktop and mobile composition, with core states and scope-safe copy.

9. Enforce static UI first.
   - Frontend planning must create a static high-fidelity UI task before API integration, CRUD, server state, or form submission work.

## Required Final Files

Maintain these files only in the PRD session artifact directory. Do not create, update, commit, or publish frontend repo `design/` working copies.

```text
frontend-design/design-context.md
frontend-design/DESIGN.md
frontend-design/layout.md
frontend-design/ux-spec.md
frontend-design/wireframe-spec.md
frontend-design/visual-design-spec.md
frontend-design/screen-preview.html
frontend-design/implementation-design-brief.md
frontend-design/rendered-design-qa.md
```

After the rendered browser QA and product design review gate pass and the user explicitly approves the preview, sync the markdown files to ADO Wiki under `/design/<repo>/*.md` with `sync-design-wiki-pages`. ADO Wiki is the shared maintained copy. Keep `screen-preview.html` and screenshots as session preview artifacts unless a separate Wiki attachment policy publishes them.

## Contract Authority

Load `skill(prd-to-product-design)` and use its `references/contracts.md` as the structure authority for `design-context.md`, `DESIGN.md`, and `layout.md`. Do not replace those product-wide contracts with a generic one-page UX, dashboard, token, or wireframe template.

- `ux-spec.md` must cover every capability/AC through roles, journeys, IA, screen families, cross-screen navigation, content priority, domain states, responsive task priority, accessibility, and evidence-linked `UX-*` rules.
- `wireframe-spec.md` must preserve the confirmed screen inventory and define `SCR-*`/`REG-*` contracts, screen relationships, representative PRD screens, desktop/tablet/mobile composition, action/state placement, reading/focus order, and traceability.
- `visual-design-spec.md` applies the selected product-wide `DESIGN.md` system to representative screens and states. It does not define a competing product model or page layout.
- `implementation-design-brief.md` translates evidence, screen, AC, `DS-*`, and `LY-*` rules into implementation and visual acceptance without inventing missing behavior.

All session design documents must use generated product-specific titles and include source traceability through evidence/rule IDs. They must not expose secrets, credentials, raw environment values, or unrelated repository internals.

## Option Uniqueness Gate

This gate applies only to stages that explicitly generate options or visual/HTML previews. It does not apply to UX or wireframe agents whose contract requires a single canonical blueprint.

Block and regenerate if:

- Previews look like documentation pages, comparison reports, wireframes, placeholder skeletons, or strategy cards instead of actual product UI.
- Previews use placeholder bars, lorem ipsum, generic boxes, generic dashboard/KPI shells, or fake app chrome not supported by repo evidence.
- Previews do not show the actual user-facing screens/states required by PRD/spec.
- HTML preview only changes colors or names from a generic template.
- HTML preview uses unsupported sidebar/cards/table family without evidence.
- HTML preview does not include RWD strategy.
- HTML preview does not include component strategy.
- Options ignore existing repo tokens, styling, components, or layout patterns.
- Options claim a UI kit that repo evidence does not support.

## High-Fidelity Preview Standard

The HTML previews are design artifacts, not written explanations. They must:

- Open directly on a believable product screen, with realistic navigation/header/content/state composition.
- Include realistic sample data from the PRD/spec. If the feature is read-only product listing, show product names, status labels, empty state, forbidden state, loading/error treatment, and the home entry surface.
- Demonstrate desktop and mobile layouts as visual frames, not just text descriptions.
- Use colors, typography, spacing, radius, shadows, and component density consistent with repo evidence, existing tokens, and existing UI primitives.
- Make differences between options visually obvious within 5 seconds.
- Keep non-goal actions visibly absent. If PRD excludes create/edit/delete/search/filter/sort/export, those controls must not appear.
- Include only a short design rationale section after the visual screen, never before it.

Reject outputs that mostly contain headings like "Design Strategy Contract", "Options Difference Matrix", or text-heavy comparison tables without full screen mockups.

## Conditional References

Use other frontend skills only when their specific branch is needed:

- `redesign-existing-projects`: existing UI or Brownfield redesign evidence.
- `frontend-design`: visual thesis, palette, typography, signature direction.
- `design-taste-frontend`: app shell, route hierarchy, layout archetypes.
- `responsive-design`: RWD contract and mobile reading order.
- `frontend-design-review`: final read-only design review.
- `extract-design-system`: user-provided reference site or explicit token extraction.
- `ui-ux-pro-max`: targeted lookup only, not as the main flow.

Do not load every design skill by default.
