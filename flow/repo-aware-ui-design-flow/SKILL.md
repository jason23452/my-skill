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
   - `wireframe-spec.md` defines screen inventory, task/content/action/state invariants, reading priority, responsive task requirements, and a Composition Freedom Boundary. It must not lock every option to one shell, region placement, split ratio, card/table family, or responsive composition.

6. Select And Write The Visual System.
   - The Product Visual System Director creates three visual directions on one identical neutral evaluation DOM, region order, geometry, responsive frame, task, content, actions, and states.
   - Visual options differ through typography, semantic color, spacing rhythm, density variants, surfaces, shape grammar, domain component/state appearance, icons/media/motif, motion, and accessibility. They cannot decide shell, navigation, columns, grouping, master-detail, disclosure, scroll/sticky, or responsive region composition.
   - The platform creates one deterministic desktop/mobile matrix per artifact revision. Writer and independent review share it. A blocked review inventories every matrix issue, then permits one complete batch repair and one full re-review through `bounded-design-review`.
   - After selection, `DESIGN.md` and `visual-design-spec.md` define only the selected visual/component system and explicitly defer layout decisions.

7. Select And Write The Layout System.
   - The Layout Architect creates three layout directions that lock final `DESIGN.md` and product invariants while differing in shell/navigation, scene composition, grouping, master-detail, progressive disclosure, density/action anchoring, scroll ownership, and responsive recomposition.
   - Review real desktop/mobile previews, select one direction, then write final `layout.md` with exact canonical geometry, first-viewport budgets, scroll/sticky ownership, responsive composition, ASCII spatial frames, and executable acceptance tests.
   - The platform creates one deterministic desktop/mobile matrix per artifact revision. Writer and independent review share it. A blocked review permits one complete batch repair; post-repair independent review either passes or records terminal blocked.
   - `layout.md` defines the whole product system layout contract: app shell, navigation model, route/page template taxonomy, grid/container policy, action/state placement, responsive policy, and component layout policy.
   - Current PRD, UX spec, and wireframe spec are representative evidence surfaces used to validate the product-wide layout system, not the boundary of the layout system.
   - Completion: the layout contract can explain how the current feature fits the product-wide templates without becoming a single-feature screen spec.

8. Generate HTML preview.
   - `screen-preview.html` must be a self-contained, high-fidelity product UI mockup grounded in the three design specs.
   - It must open on one focused scene, expose other required screens/states through product navigation, and show realistic desktop/mobile composition with scope-safe copy. Internal IDs and design evidence are metadata, never visible product UI.

9. Run independent QA and critique.
   - Rendered Design QA checks Chromium, scenes, overflow, focus, console, reduced motion, and layout stability.
   - Visual Quality Critic reads actual desktop/tablet/mobile screenshots. It passes only at >= 88/100, with hierarchy/composition/task focus/mobile each >= 8/10, every other dimension >= 7/10, and no hard blocker.

10. Enforce static UI first.
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
frontend-design/visual-quality-review.md
```

After rendered browser QA, Visual Quality Critic, and final contract review pass and the user explicitly approves the preview, sync the markdown files to ADO Wiki under `/design/<repo>/*.md` with `sync-design-wiki-pages`. ADO Wiki is the shared maintained copy. Keep `screen-preview.html` and screenshots as session preview artifacts unless a separate Wiki attachment policy publishes them.

## Contract Authority

Load `skill(prd-to-product-design)` and use its `references/contracts.md` as the structure authority for `design-context.md`, `DESIGN.md`, and `layout.md`. Do not replace those product-wide contracts with a generic one-page UX, dashboard, token, or wireframe template.

- `ux-spec.md` must cover every capability/AC through roles, journeys, IA, screen families, cross-screen navigation, content priority, domain states, responsive task priority, accessibility, and evidence-linked `UX-*` rules.
- `wireframe-spec.md` must preserve the confirmed screen inventory and define `SCR-*`/`REG-*` contracts, screen relationships, representative PRD screens, task/content/action/state invariants, responsive task requirements, reading/focus priorities, traceability, and composition freedom.
- `visual-design-spec.md` applies the selected product-wide `DESIGN.md` system to representative screens and states. It does not define a competing product model or page layout.
- `implementation-design-brief.md` translates evidence, screen, AC, `DS-*`, and `LY-*` rules into implementation and visual acceptance without inventing missing behavior.

All session design documents must use generated product-specific titles and include source traceability through evidence/rule IDs. They must not expose secrets, credentials, raw environment values, or unrelated repository internals.

## Option Uniqueness Gate

This gate applies to visual options, layout options, and final HTML previews. UX and screen-structure agents produce one invariant contract.

Block and regenerate if:

- Previews look like documentation pages, comparison reports, wireframes, placeholder skeletons, or strategy cards instead of actual product UI.
- Previews use placeholder bars, lorem ipsum, generic boxes, generic dashboard/KPI shells, or fake app chrome not supported by repo evidence.
- Previews do not show the actual user-facing screens/states required by PRD/spec.
- Visual options change layout topology instead of using the shared neutral evaluation frame.
- Visual options differ only by palette or font instead of a complete visual/component/state system.
- Layout options change the selected visual system or differ only by palette, font, radius, shadow, or motif instead of shell/grouping/progressive disclosure/density/scroll/responsive composition.
- HTML preview uses unsupported sidebar/cards/table family without evidence.
- HTML preview does not include RWD strategy.
- HTML preview does not include component strategy.
- Options ignore existing repo tokens, styling, components, or layout patterns.
- Options claim a UI kit that repo evidence does not support.
- Visible UI contains `SCR-*`, `REG-*`, PRD/AC/evidence IDs, traceability, QA status, artifact paths, JSON/YAML, or design-document prose.
- Multiple screens/states are expanded at once as a report wall instead of using product navigation or focused scenes.

## High-Fidelity Preview Standard

The HTML previews are design artifacts, not written explanations. They must:

- Open directly on a believable product screen, with realistic navigation/header/content/state composition.
- Show only one focused product scene at a time. Additional screens/states use real navigation or scene controls.
- Include realistic sample data from the PRD/spec. If the feature is read-only product listing, show product names, status labels, empty state, forbidden state, loading/error treatment, and the home entry surface.
- Demonstrate desktop and mobile layouts as visual frames, not just text descriptions.
- Use colors, typography, spacing, radius, shadows, and component density consistent with repo evidence, existing tokens, and existing UI primitives.
- Make differences between options visually obvious within 5 seconds.
- Keep non-goal actions visibly absent. If PRD excludes create/edit/delete/search/filter/sort/export, those controls must not appear.
- Include only a short design rationale section after the visual screen, never before it.
- On mobile, keep product context, the primary task object/decision, and next action in the first viewport; filters and chrome cannot consume the entire first viewport.

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
