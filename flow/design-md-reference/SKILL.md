---
name: design-md-reference
description: Create or update executable DESIGN.md contracts from approved UI artifacts, product evidence, existing design rules, or getdesign.md / Google DESIGN.md references. Use when generating final DESIGN.md files, documenting completed HTML/CSS or design-tool output, creating visual options, maintaining a living design system, guarding UI changes against existing rules, or improving AI-generated UI consistency and implementation quality.
---

# DESIGN.md Reference Integration

Use this skill to create a project-specific `DESIGN.md` that a coding agent can implement without guessing. The source may be an approved HTML/CSS artifact, an existing design system, or external design references. External references are optional enrichment, never the product authority.

## Core Principle

`DESIGN.md` is a design source of truth for agents. It should contain both machine-readable tokens and human-readable rationale:

- YAML front matter: exact semantic colors, typography, spacing, density, radius, elevation, motion, breakpoints, and component aliases.
- Markdown body: product intent, visual theme, layout/composition, components, states, responsive behavior, accessibility, do/do-not rules, implementation directives, and traceability.

Keep the document concise but complete. Prefer exact values and normative rules over tutorials or generic design advice. Never invent exact values that are absent from the approved artifact or evidence.

## Execution Modes

Choose exactly one mode from caller evidence:

1. `artifact-documentation`: a final HTML/CSS/design-tool artifact has already been approved. Extract and document that direction; do not restart discovery, research, options, or design generation.
2. `design-exploration`: no final direction exists. Research and compare references, produce options, and wait for an explicit selection before final `DESIGN.md`.
3. `living-document-update`: an existing `DESIGN.md` is authoritative and new approved UI evidence must be merged without silently replacing valid rules.

If the caller provides a final artifact and does not explicitly request alternatives, use `artifact-documentation`.

## Final Artifact Documentation Mode

When documenting completed OpenDesign, Figma, HTML/CSS, or implemented UI:

1. Treat the approved artifact as the authority for visible geometry, tokens, components, interactions, and responsive behavior.
2. Use PRD, UX, wireframe, and repository evidence for product intent, required states, permissions, and traceability.
3. Read all linked local styles and scripts needed to understand the artifact.
4. Extract exact values where present. Mark absent values as `unknown` with a required implementation decision; do not fabricate hex values, fonts, breakpoints, dimensions, or durations.
5. Produce one final `DESIGN.md`. Do not create reference research, alternatives, option previews, or a newly generated UI.
6. If the caller uses one consolidated design document, include shell, navigation, scene composition, responsive topology, scroll/sticky ownership, overlays, and progressive disclosure in `DESIGN.md`; do not create `layout.md`.
7. Preserve selectors, component names, routes, files, artifact revision, and source IDs so implementation can be checked against the approved UI.

## Exploration Mode: Live getdesign.md Research

Run this section only in `design-exploration`. When web tools are available, reference selection must start from the actual getdesign.md catalog and DESIGN.md sources. Do not rely on a fixed list of brands. Do not pick references from memory.

Required workflow:

1. Read PRD/spec/UX/wireframe evidence and summarize the product archetype, primary surfaces, density, trust/accessibility constraints, and visual jobs-to-be-done.
2. Search getdesign.md with product-specific queries, for example `site:getdesign.md/design-md ecommerce operations DESIGN.md`, `site:getdesign.md/design-md admin dashboard DESIGN.md`, `site:getdesign.md/design-md structured data SaaS DESIGN.md`, plus domain nouns from the PRD.
3. Fetch `https://getdesign.md/` or `https://getdesign.md/design-md` to inspect catalog categories when needed.
4. Fetch 4-8 candidate pages from getdesign.md. Prefer pages that expose concrete DESIGN.md usage or reference descriptions.
5. When a candidate slug is visible and belongs to the public awesome-design-md collection, try fetching the raw DESIGN.md from `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<slug>/DESIGN.md`. If raw fetch fails, use the getdesign.md page summary and record `referenceFetchStatus: summary_only`.
6. Score candidates against the PRD/spec evidence. Choose 2-4 references with explicit reasons.
7. Translate selected references into 3-5 project-specific `DESIGN.md Options`; do not copy the reference brand.
8. After the user selects `selectedDesignMdOptionId`, collapse only that option into the final `DESIGN.md`.

If websearch/webfetch is required by the caller and unavailable, return blocked with `GETDESIGN_REFERENCE_SEARCH_UNAVAILABLE`. Do not silently fall back to a hardcoded reference blend.

## Reference Selection

Choose references by product task, not by what looks trendy. The following mappings are examples for scoring candidates discovered from getdesign.md, not a fixed required list:

- Data-heavy internal tool: emphasize IBM + Linear + Airtable.
- Commerce storefront: emphasize Shopify + Airtable restraint.
- Support/customer messaging: consider Intercom conversational clarity.
- Developer/code-heavy tool: consider Linear + Vercel/Resend style precision.
- Enterprise regulated workflow: consider IBM + Linear, with lower visual variance.

## Exploration Mode: DESIGN.md Options Workflow

Run this section only in `design-exploration`. When the caller has not provided `selectedDesignMdOptionId`, generate options, not a final `DESIGN.md`:

- Create `design-md-options.md` with 3-5 complete DESIGN.md directions.
- Create `design-md-options-preview.html` so users can compare the options visually before answering a question.
- Each option must cover reference translation, brand fingerprint, visual motif, color system, typography posture, spacing/density, surface/elevation, component tone, state treatment, accessibility notes, and anti-slop constraints.
- Do not write final `DESIGN.md` until the selected option is provided.

When `selectedDesignMdOptionId` is provided, generate one final `DESIGN.md`:

- Read the prior options and verify the selected id exists.
- Copy only the selected option's design decisions into final `DESIGN.md`.
- Do not keep unselected options, comparison tables, or alternate palettes in final `DESIGN.md`.
- Record `Selected DESIGN.md Option: <id> - <name>` in the final design artifacts so downstream agents can enforce consistency.

## Reference Translation Rules

When writing a project-specific `DESIGN.md`, include a `Reference Translation` section that names the references discovered from getdesign.md and maps them into original decisions:

```md
## Reference Translation

- Airtable reference used for: structured data rhythm and non-uniform content cadence.
- IBM reference used for: enterprise boundaries, focus/error/status states, permission-safe surfaces.
- Linear reference used for: selected item + inspector workspace composition.
- Shopify reference used for: transactional confidence and ecommerce action hierarchy.

These are translated principles only. Do not copy brand names, logos, proprietary fonts, exact page layouts, or trademarked visual assets.
```

Each reference must drive a specific decision. Avoid vague statements like "inspired by Linear" without saying what changed in the UI. Include source URLs and fetch status for every selected reference.

## Candidate Scoring Rubric

Score each candidate from 0-3 on these dimensions:

- Product archetype fit: same kind of product, workflow, audience, or trust model.
- Surface fit: useful for the target screen type, such as admin overview, ecommerce checkout, data table, support inbox, product workspace, or content page.
- Layout craft: provides usable composition principles, not only color/type inspiration.
- Component fit: relevant buttons, forms, cards, tables, lists, chips, navigation, focus/error/status states.
- Accessibility and implementation fit: can be implemented with the target repo stack without proprietary assets.
- Differentiation: helps avoid generic AI dashboard/layout patterns.

Select references with the highest evidence-weighted total, but avoid selecting multiple references that teach the same thing.

## Content Page Layout Craft

For content pages, admin overviews, management consoles, and operational workspaces, do not produce `header + equal cards + filter + table` as the default. Convert the page into a designed workspace.

This rule rejects generic dashboard reflex, not dashboard layout itself. When PRD/spec/UX/wireframe/repo evidence shows the product is a dashboard, admin panel, operations console, management workspace, review queue, reporting console, or list-detail workspace, the selected `DESIGN.md` must support that system layout with appropriate tokens, surface hierarchy, component roles, state treatment, and density rules.

For admin overview / operations pages, prefer this structure when wireframe allows:

- Scope or identity stamp first: role, store, permission, mode, result boundary.
- Dispatch strip instead of KPI cards: each item explains risk, queue meaning, and next move.
- Ledger tickets instead of table-only rows: record id, scope, lifecycle braid/rail, owner, last update, allowed action or block reason.
- Selected case cockpit: the selected record gets its own composed inspector panel, not just a side card with key-value rows.
- Secondary operations rail: reports, import states, danger confirmation, public preview, and other non-primary states are compact and visually subordinate.
- Mobile triage: scope stamp, highest-risk card, action/block reason, then details. Never shrink a desktop table.

## Anti-Copy And Anti-Slop Gates

Block or rewrite if any of these happen:

- Reference is copied as a brand clone instead of translated into project-specific rules.
- The generated `DESIGN.md` mentions a reference but no visible UI decision traces back to it.
- Queue cards are just KPI cards with big numbers and generic labels.
- A content page is a uniform stack of same-radius cards.
- A table is used as the main design object when the task is triage, dispatch, review, approval, or exception handling.
- Secondary states are all expanded at equal visual weight.
- The selected item is only highlighted by background color, with no composed detail/cockpit treatment.
- Typography does not differentiate display, labels, metadata, IDs, and dense operational text.
- Status colors are used without text labels, shapes, rails, icons, or other non-color cues.

## Project DESIGN.md Required Shape

When asked to create a project `DESIGN.md`, use this section order:

```md
---
version: <document version>
name: <Project design system name>
description: <one paragraph>
colors:
  semantic:
    action: "#..."
    foreground: "#..."
    background: "#..."
typography:
  family:
    body: <stack>
  roles:
    title:
      fontSize: <size>
      fontWeight: <weight>
      lineHeight: <line-height>
spacing:
  unit: <value>
  scale:
    sm: <value>
radius:
  control: <value>
elevation:
  overlay: <value>
motion:
  standard:
    duration: <value>
    easing: <value>
breakpoints:
  compact: <value>
components:
  button-primary:
    backgroundColor: "{colors.semantic.action}"
---

# <Product-specific design system name>

## Product Evidence And Experience Principles
## Approved Artifact And Revision
## Visual Theme And Atmosphere
## Reference Translation
## Semantic Color System
## Typography Roles
## Density, Spacing, And Rhythm
## Shell, Navigation, And Scene Composition
## Surface, Elevation, And Shape
## Iconography, Media, And Product Motifs
## Core And Domain Components
## Domain State Language
## Interaction And Motion
## Responsive Behavior
## Accessibility Contract
## Do And Do Not
## Agent Implementation Directives
## Evidence And Artifact Traceability
## Coverage And Acceptance Checks
```

YAML tokens are normative. Markdown explains how to apply them. Keep the tokens implementable with CSS variables or Tailwind theme values.

Omit `Reference Translation` when no external reference was used. Do not omit product, component, state, responsive, accessibility, traceability, or acceptance sections merely to keep the file short.

## Living Document And Design Guard

When an existing `DESIGN.md` is present:

1. Compare every new approved decision with the current rule.
2. Classify each conflict as `unchanged`, `update`, `deprecate`, or `scoped-exception`.
3. Never overwrite a valid rule silently.
4. Require explicit approval before applying `update`, `deprecate`, or `scoped-exception`.
5. Keep stable token names when semantics are unchanged; update values and usage notes together.
6. Remove rules contradicted by the approved artifact only when the approved update decision allows it.
7. Emit one complete standalone document, not a patch or append-only history.
8. Record artifact revision, approval source, and update mode so Wiki or Git history can explain the change.

## Implementation Readiness Gate

Rewrite before completion when any check fails:

- YAML front matter is parseable and every token alias resolves or is explicitly `unknown`.
- Colors, type, spacing, radius, elevation, motion, and breakpoints use exact implementable values when the approved artifact provides them.
- Each represented screen has purpose, entry, regions, content/data contract, actions, states, feedback, and desktop/tablet/mobile behavior.
- Each reusable component has anatomy, variants, sizes/density, interaction states, validation, permission behavior, keyboard/focus behavior, and content-fit rules.
- Loading, empty, error, success, permission, selected, destructive, and recovery states required by evidence are documented with non-color cues.
- Responsive rules describe recomposition, priority, overflow, scroll/sticky ownership, overlays, and progressive disclosure rather than only listing breakpoints.
- `Agent Implementation Directives` state how coding agents must consume tokens, reuse components, handle deviations, and verify the result. Do not include copy-paste prompt templates.
- The document contains source/revision traceability and a PRD/UX/wireframe-to-screen/component coverage matrix.
- The document has no unresolved template placeholders, invented screens, unselected alternatives, raw artifact dumps, generic style adjectives without concrete rules, or stale rules contradicted by the approved artifact.
- A coding agent can implement the represented UI from `DESIGN.md` plus referenced final artifacts without reopening the design conversation.

## Review Checklist

Before completing a visual spec, HTML preview, or design review, verify:

- The reference blend is appropriate to the product task.
- The reference blend was selected through live getdesign.md search/fetch when the caller required it.
- A project-specific `DESIGN.md` exists or is generated when the flow requires it.
- When external references are used, the generated screen visibly applies at least three reference-derived principles.
- The reference usage does not override PRD, UX, wireframe, accessibility, or the selected DESIGN.md option.
- Content pages have composed workspace structure, not generic dashboard scaffolding.
- The design can be implemented in the target repo without external proprietary assets.
- Dashboard/workspace patterns are rejected only when unsupported by product evidence or left untransformed as a generic scaffold.
- Final-artifact flows use `artifact-documentation` and do not restart research or option generation.
- Existing documents use the living-document guard and never change silently.
- The final document passes the implementation readiness gate.
