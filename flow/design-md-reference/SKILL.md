---
name: design-md-reference
description: Integrate getdesign.md / Google DESIGN.md reference systems into automated UI design flows. Use when creating visual design specs, DESIGN.md files, HTML previews, design reviews, color/style selection, content-page layout craft, admin/dashboard/workspace UI, ecommerce UI, or when the user asks to use getdesign.md, DESIGN.md, design references, design system analysis, or improve AI-generated UI taste.
---

# DESIGN.md Reference Integration

Use this skill to turn external design-system references into a project-specific visual language that coding agents can reuse. The goal is not to copy a famous brand. The goal is to extract reusable design principles, then translate them into a new `DESIGN.md` and screen-specific design contract that fits the PRD, UX, wireframe, repo reality, accessibility, and selected color style.

## Core Principle

`DESIGN.md` is a design source of truth for agents. It should contain both machine-readable tokens and human-readable rationale:

- YAML front matter: colors, typography, spacing, rounded, components.
- Markdown body: overview, colors, typography, layout, elevation, shapes, components, do's and don'ts.

When getdesign.md or any external DESIGN.md reference is used, convert it into a derivative project design contract. Never copy logos, exact brand identity, proprietary imagery, trademarked names, or unrelated brand voice.

## Live getdesign.md Research Requirement

When web tools are available, reference selection must start from the actual getdesign.md catalog and DESIGN.md sources. Do not rely on a fixed list of brands. Do not pick references from memory.

Required workflow:

1. Read PRD/spec/UX/wireframe evidence and summarize the product archetype, primary surfaces, density, trust/accessibility constraints, and visual jobs-to-be-done.
2. Search getdesign.md with product-specific queries, for example `site:getdesign.md/design-md ecommerce operations DESIGN.md`, `site:getdesign.md/design-md admin dashboard DESIGN.md`, `site:getdesign.md/design-md structured data SaaS DESIGN.md`, plus domain nouns from the PRD.
3. Fetch `https://getdesign.md/` or `https://getdesign.md/design-md` to inspect catalog categories when needed.
4. Fetch 4-8 candidate pages from getdesign.md. Prefer pages that expose concrete DESIGN.md usage or reference descriptions.
5. When a candidate slug is visible and belongs to the public awesome-design-md collection, try fetching the raw DESIGN.md from `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<slug>/DESIGN.md`. If raw fetch fails, use the getdesign.md page summary and record `referenceFetchStatus: summary_only`.
6. Score candidates against the PRD/spec evidence. Choose 2-4 references with explicit reasons.
7. Translate selected references into the project-specific `DESIGN.md`; do not copy the reference brand.

If websearch/webfetch is required by the caller and unavailable, return blocked with `GETDESIGN_REFERENCE_SEARCH_UNAVAILABLE`. Do not silently fall back to a hardcoded reference blend.

## Reference Selection

Choose references by product task, not by what looks trendy. The following mappings are examples for scoring candidates discovered from getdesign.md, not a fixed required list:

- Data-heavy internal tool: emphasize IBM + Linear + Airtable.
- Commerce storefront: emphasize Shopify + Airtable restraint.
- Support/customer messaging: consider Intercom conversational clarity.
- Developer/code-heavy tool: consider Linear + Vercel/Resend style precision.
- Enterprise regulated workflow: consider IBM + Linear, with lower visual variance.

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
version: alpha
name: <Project design system name>
description: <one paragraph>
colors:
  primary: "#..."
typography:
  display:
    fontFamily: <stack>
    fontSize: <size>
    fontWeight: <weight>
    lineHeight: <line-height>
rounded:
  sm: <value>
spacing:
  sm: <value>
components:
  button-primary:
    backgroundColor: "{colors.primary}"
---

# DESIGN.md

## Overview

## Reference Translation

## Colors

## Typography

## Layout

## Elevation & Depth

## Shapes

## Components

## Content Page Layout Rules

## Do's and Don'ts
```

YAML tokens are normative. Markdown explains how to apply them. Keep the tokens implementable with CSS variables or Tailwind theme values.

## Review Checklist

Before completing a visual spec, HTML preview, or design review, verify:

- The reference blend is appropriate to the product task.
- The reference blend was selected through live getdesign.md search/fetch when the caller required it.
- A project-specific `DESIGN.md` exists or is generated when the flow requires it.
- The generated screen visibly applies at least three reference-derived principles.
- The reference usage does not override PRD, UX, wireframe, accessibility, or selected color style.
- Content pages have composed workspace structure, not generic dashboard scaffolding.
- The design can be implemented in the target repo without external proprietary assets.
