---
name: repo-aware-ui-design-flow
description: PRD + existing frontend repo aware UI design flow. Use when generating ux-spec.md, wireframe-spec.md, visual-design-spec.md, screen-preview.html, or frontend implementation design brief from PRD/spec/project-context and repo evidence.
---

# Repo-Aware UI Design Flow

This skill is the single required method for PRD-driven frontend design in this repo. It replaces broad multi-skill design chaining with a small, evidence-first flow.

## Goal

Produce repo-aware UX, wireframe, visual design, and HTML preview artifacts for the current PRD and actual frontend repo. Keep `spec.md` as the product/engineering contract; design artifacts are downstream and must not overwrite it.

## Core Sequence

1. Read product intent.
   - Inputs: `prd.md`, `spec.md`, `project-context.md`, `bootstrap-result.json`.
   - Completion: the agent can state the user task, visible surfaces, success criteria, and UI-affecting constraints without inventing scope.

2. Read frontend repo reality.
   - Inspect actual frontend repo files: `README*`, `AGENTS.md`, `package.json`, lockfile, routing/layout/page files, shared components, styles, tokens, theme, config, and existing `design/` docs.
   - Completion: evidence is recorded with file paths and impact.

3. Decide UI Foundation Strategy.
   - Classify status as `existing-kit`, `existing-styling`, `partial`, or `none`.
   - Do not require a UI kit. If none exists, say so and define project-local primitives.
   - Do not claim shadcn, coss, MUI, Radix, Tailwind, or custom components are present without repo evidence.
   - If introducing a new kit is proposed, it must be one selectable design option with tradeoffs, not an assumption.
   - Completion: the design can explain what to reuse, extend, create, or optionally adopt.

4. Write UX Spec.
   - `ux-spec.md` defines user task, entry, first-look judgement, information priority, content/data contract, states, non-goal controls, and accessibility/trust requirements.

5. Write Wireframe Spec.
   - `wireframe-spec.md` defines screen inventory, page shell, desktop/tablet/mobile regions, reading order, region priority, component slots, state layouts, and RWD collapse rules.

6. Write Visual Design Spec.
   - `visual-design-spec.md` defines visual thesis, color roles, typography roles, spacing/density, surfaces, component visual roles, state treatment, interaction tone, accessibility, and the HTML preview style contract.

7. Generate HTML preview.
   - `screen-preview.html` must be a self-contained, high-fidelity product UI mockup grounded in the three design specs.
   - It must show realistic desktop and mobile composition, with core states and scope-safe copy.

8. Enforce static UI first.
   - Frontend planning must create a static high-fidelity UI task before API integration, CRUD, server state, or form submission work.

## Required Final Files

```text
design/DESIGN.md
design/ux-spec.md
design/wireframe-spec.md
design/visual-design-spec.md
design/screen-preview.html
design/implementation-design-brief.md
```

## UX Spec Required Structure

```md
# UX Spec

## UX Scope

## Primary User Task

## Entry And Navigation Context

## First-Look Judgement

## Information Priority

## Content And Data Contract

## States To Design

## Non-Goal Controls And Copy

## Accessibility And Trust Requirements

## Repo UI Reality
```

Frontend repo `design/*.md` documents must not contain `## Source Artifacts`, `## Source Specs`, `## Source Design Specs`, `## Source UX Spec`, or any `## Source...` section. Keep source traceability in agent JSON summaries, warnings, or session artifacts only; canonical frontend design docs should start with the design decision content.

## Wireframe Spec Required Structure

```md
# Wireframe Spec

## Screen Inventory

## Page Shell

## Desktop Wireframe

## Tablet Wireframe

## Mobile Wireframe

## Reading Order

## Region Priority

## Component Slots

## State Layouts

## Interaction Placement

## RWD Collapse Rules
```

## Visual Design Spec Required Structure

```md
# Visual Design Spec

## Visual Thesis

## Color System

## Typography System

## Spacing And Density

## Surface And Elevation

## Component Visual Roles

## State Treatment

## Interaction Tone

## Accessibility Requirements

## RWD Rules

## HTML Preview Style Contract

## Do Not Weaken
```

## Option Uniqueness Gate

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
