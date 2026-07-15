---
name: layout-md-reference
description: Create and review layout.md files using the layout.design 9-section + 2-appendix specification. Use when generating layout.md, system layout contracts, AI-agent UI implementation contracts, page structure rules, component token mappings, spacing/grid rules, or when users mention layout.design, layout.md, layout references, dashboard/workspace layout, admin layout, product layout, or UI implementation layout contracts.
---

# layout.md Reference Integration

Use this skill to turn product documents, final DESIGN.md docs, the selected DESIGN.md option, repo reality, and external layout references into a canonical `layout.md` implementation contract for AI coding agents.

`layout.md` is not a layout-options document. It is a single source-of-truth implementation contract. It must not ask users to choose a layout, compare layout variants, or produce option previews.

`layout.md` is the whole product system layout contract. The current PRD, UX spec, and wireframe spec are representative evidence surfaces used to validate the system, not the boundary of the layout system. Do not reduce `layout.md` to a single-feature screen spec.

## System Layout Scope

`layout.md` must define the product-wide layout architecture before it describes representative feature placement:

- App shell: root shell, sidebar/topbar/header, content frame, secondary rail, inspector, drawer, modal, and no-shell decisions.
- Navigation model: primary navigation, secondary navigation, breadcrumbs, tabs, context switchers, mobile navigation collapse, and route escape paths.
- Route and page template taxonomy: dashboard/overview, workspace, list/index, list-detail, detail, form/editor, settings, empty/onboarding, loading, error, permission, and recovery templates.
- Container and grid policy: max widths, full-bleed zones, content gutters, dense data grids, split panes, panel ratios, and breakpoint behavior.
- Action placement policy: primary, secondary, destructive, bulk, row, contextual, and sticky mobile actions.
- State placement policy: loading, empty, error, permission denied, selected, dirty/unsaved, success confirmation, and blocked-action states.
- Responsive policy: mobile/tablet/desktop reading order, shell collapse, panel/drawer behavior, overflow rules, touch targets, and table/list/detail rewrites.
- Component layout policy: where cards, tables, ledgers, filters, inspectors, forms, drawers, rails, badges, alerts, and dialogs may appear.

Feature-specific notes are allowed only as representative validation examples after the system policy is established.

## Canonical Format

Follow the layout.design `layout.md` specification exactly: 9 sections plus 2 appendices. Use these headings in this order:

```md
# layout.md

## Quick Reference

## Design Direction & Philosophy

## Colour System

## Typography System

## Spacing & Layout

## Page Structure & Layout Patterns

## Component Patterns

## Elevation & Depth

## Motion

## Anti-Patterns & Constraints

## Appendix A: Complete Token Reference

## Appendix B: Token Source Metadata
```

Do not rename, reorder, skip, or add top-level sections. Fixed headings remain English so downstream tools and agents can parse them reliably. Body prose may use the project language requested by the caller.

## Token Model

Use the five token categories from layout.design:

- Colour: hex, RGB, or HSL values, exposed through primitive, semantic, and component tokens.
- Typography: composite groups only, never standalone font-size/font-weight/line-height tokens.
- Spacing: 4px base unit by default, with every value on the declared scale.
- Radius: px values or `9999px` for full radius.
- Effect: CSS shadow shorthand only when the project explicitly uses shadow tokens.

Colour tokens should use three tiers:

- Tier 1 primitives: raw values, never used directly in components.
- Tier 2 semantic aliases: intent-based names used by layout and page code.
- Tier 3 component tokens: component/state-specific aliases.

Agents should use Tier 2 or Tier 3 tokens in generated UI code. Avoid raw hex values in examples except inside token declarations.

## Required Section Intent

- `Quick Reference`: 50-75 lines maximum. Include design language, 8-12 core tokens, primary type groups, one complete component example, and critical NEVER rules.
- `Design Direction & Philosophy`: product layout personality, density, what it rejects, product category, selected references and why they were translated.
- `Colour System`: primitive, semantic, and component colour tokens derived from final `DESIGN.md`, `visual-design-spec.md`, and the selected DESIGN.md option.
- `Typography System`: composite type tokens, pairing rules, dense data text rules, labels, IDs, numbers, and mono usage.
- `Spacing & Layout`: base unit, scale, container widths, grids, gutters, breakpoints, flex vs grid usage, sticky regions, overflow rules.
- `Page Structure & Layout Patterns`: product-wide app shell, navigation model, route/page template taxonomy, overview/workspace/list/detail/form/settings patterns, RWD collapse, representative surfaces, source layout references, and evidence trace.
- `Component Patterns`: 5-10 canonical components with anatomy, state token mappings, props/defaults, preferred values, and one TSX-style implementation example when appropriate.
- `Elevation & Depth`: elevation scale, background/surface layers, border behavior, z-index, overlays, drawers, inspectors, and whether shadows are allowed.
- `Motion`: duration/easing tokens, transitions by interaction type, loading/skeleton/state changes, reduced-motion rules.
- `Anti-Patterns & Constraints`: precise machine-checkable NEVER rules with forbidden example, correct alternative, and reason.
- `Appendix A`: flat token reference table with token name, resolved value, type, section, and usage.
- `Appendix B`: source metadata table with source document/URL, extraction method, confidence, and notes.

## Live Layout Reference Research

When web tools are available and the caller requires external layout research, reference selection must be dynamic. Do not rely on a fixed reference list.

Required workflow:

1. Read PRD/spec/UX/wireframe/DESIGN/visual evidence and summarize product archetype, user role, primary decision, screen families, density, trust/accessibility constraints, layout jobs-to-be-done, and the product-wide system layout architecture implied by the evidence.
2. Search for product-specific layout references. Use at least 3 queries combining domain nouns with terms such as `admin dashboard layout`, `operations workspace UI`, `order management dashboard`, `control panel UX`, `list detail inspector`, `layout.md`, and `design system layout`.
3. Fetch at least 3 candidate pages or docs when available. Prefer references that discuss hierarchy, navigation, filters/controls, table/list behavior, selected-detail panels, state design, or responsive behavior.
4. If `layout.design` docs are accessible, use the `layout.md` specification as the schema reference, not as a product layout reference.
5. Score candidates by product archetype fit, layout job fit, density fit, action-path clarity, state handling, responsive fit, accessibility fit, and implementation feasibility.
6. Translate selected references into original project layout rules. Do not copy brand identity, exact page layouts, proprietary UI, screenshots, logos, fonts, or trademarked assets.

If websearch/webfetch is required by the caller and completely unavailable, return blocked with `LAYOUT_REFERENCE_SEARCH_UNAVAILABLE`. Do not silently fall back to a hardcoded reference blend.

## Layout Translation Rules

Good layout references become decisions, not brand mentions. For each selected reference, record:

- Source URL and title.
- Fetch status: `full_doc`, `article_summary`, `catalog_summary`, or `fetch_failed`.
- Which layout job it teaches: hierarchy, navigation, controls, dense list, detail inspector, state, mobile collapse, or action path.
- Which project rule it produced.
- Which project evidence supports the rule.

Put this in `Page Structure & Layout Patterns` and source details in `Appendix B`.

## Representative Surface Rule

The current PRD/wireframe must be used to validate the product-wide layout system:

- Map each current screen to one or more page templates from the system taxonomy.
- State which system rules the current feature exercises, such as dashboard overview, list-detail inspector, form/editor, settings, or exception state.
- Keep the system contract reusable for adjacent routes that the product already implies.
- Do not make a one-off layout rule unless the product evidence proves the surface is unique.
- If the current wireframe conflicts with the product-wide layout system, return blocked and route back to the wireframe/spec stage instead of silently changing the layout contract.

## Dashboard / Admin / Workspace Layout Rules

Do not default every product to a dashboard. Use dashboard, admin panel, operations console, management workspace, review queue, reporting console, or list-detail workspace taxonomy only when PRD/spec/UX/wireframe/repo evidence supports it.

When the evidence supports dashboard/workspace layout, do not avoid it. Produce a product-specific dashboard system contract rather than a generic dashboard scaffold. The forbidden pattern is the reflexive `KPI cards + filter + table` default, not dashboard layout itself.

For dashboards, admin panels, and operational workspaces, layout must answer the user's first decision before showing secondary data.

Prefer these patterns when supported by PRD and wireframe:

- Scope first: role, account, warehouse, store, tenant, permission, date, environment, or selected boundary.
- One primary decision zone: the part of the screen users should inspect first.
- Controls near the content they reshape, not hidden behind generic icons.
- Dense lists/tables only when they carry operational scanning and row actions.
- Selected-detail inspector/cockpit for review, approval, exception handling, and triage workflows.
- Secondary rail for reports, imports, danger states, public preview, help, or lower-priority operations.
- Mobile triage path: scope, highest-risk item, action/block reason, then detail. Never shrink a desktop table.

## Dashboard Quality Bar

When dashboard/workspace evidence exists, `layout.md` must define:

- Dashboard app shell and navigation hierarchy.
- Overview, workspace, list-detail, detail, report, form, settings, and state templates as applicable.
- Metric, dispatch, queue, table, ledger, inspector, filter, and action placement rules.
- Which metrics are allowed, what decision they support, and which scope or next action they connect to.
- Filter placement near the content it reshapes, with desktop/tablet/mobile behavior.
- Table usage only for scanning, sorting, and comparison; triage/review/approval should prefer ledger rows plus selected inspector when supported by evidence.
- A mobile dashboard triage path that recomposes information instead of shrinking desktop tables.

## Anti-Option Rule

`layout.md` must be a single canonical contract. Block or rewrite if it contains layout alternatives, `Option A/B/C`, recommended options, layout selection questions, or any instruction requiring the user to choose a layout.

## Compliance Checklist

Before completing, verify:

- The file uses the exact 9-section + 2-appendix order.
- Quick Reference is short enough for agent prompts.
- Colour tokens are tiered and consistent with the selected DESIGN.md option.
- Typography tokens are composite groups.
- Spacing values are on-scale.
- Page layout rules are traceable to PRD/spec/UX/wireframe/DESIGN/visual/repo evidence.
- Page layout rules define the whole product system before representative feature notes.
- Component states include default, hover, focus, active, disabled, loading, and error when relevant.
- Anti-patterns are machine-checkable.
- Source metadata separates direct evidence from inferred rules.
- No layout options, brand copying, generic dashboard reflex, placeholder data, or non-goal controls are introduced.
