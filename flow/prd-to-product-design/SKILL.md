---
name: prd-to-product-design
description: Convert one or more PRDs, specifications, source User Stories, requirements references, and repository evidence into a product-wide design context that safely drives system DESIGN.md, layout.md, UX, wireframes, and frontend previews. Use when design artifacts must be grounded in product requirements instead of generic dashboard, MVP, SaaS, or visual-reference defaults.
---

# PRD to Product Design

Build the product model before choosing a visual style or page layout. Treat PRD/spec evidence as authoritative, repository evidence as implementation reality, and external design references as optional supporting material only.

Read [references/contracts.md](references/contracts.md) before writing `design-context.md`, `DESIGN.md`, or `layout.md`.

## Evidence Order

Use this precedence:

1. Explicit user decisions in the current flow.
2. Approved PRD acceptance criteria and scope.
3. Source User Story and requirements/Wiki references.
4. Approved `spec.md` and `project-context.md`.
5. Existing repository routes, components, tokens, and behavior.
6. Derived design decisions that are required to make the documented scope usable.
7. External references, only to improve execution of an already-derived product direction.

Never let external references add a role, capability, route, lifecycle state, KPI, chart, CRUD action, navigation module, or business rule.

## Evidence Classification

Assign every material input or decision a stable ID and one status:

- `explicit`: directly stated by a user or approved source document.
- `confirmed`: verified in repository behavior or current ADO artifact.
- `derived`: necessary design consequence of explicit/confirmed evidence.
- `proposed`: useful extension that requires future confirmation; never normative.
- `unknown`: missing information that affects design confidence.

`DESIGN.md` and `layout.md` may contain normative rules only from `explicit`, `confirmed`, or defensible `derived` evidence. Put `proposed` and `unknown` items in clearly non-normative sections.

## Product Model First

Before UX, visual style, or layout, establish:

- Product definition and intended operational outcome.
- Primary and secondary roles, responsibilities, permissions, and information boundaries.
- Domain objects, relationships, identifiers, important attributes, and data volume clues.
- Capability inventory mapped to PRD requirement or acceptance-criteria IDs.
- Critical task flows, entry points, completion signals, reversibility, and failure recovery.
- Domain state model and allowed transitions without inventing lifecycle states.
- Content/data priority and first-look decisions per role.
- Product information architecture, screen families, and cross-screen relationships.
- Trust, safety, privacy, audit, destructive-action, and accessibility constraints.
- Responsive decision path, not just responsive dimensions.
- Explicit non-goals and forbidden controls.

Do not assume MVP. Design the complete implementable product scope described by approved evidence. If the sources describe only one release slice, document a coherent current system for that slice and explicit expansion seams; do not invent the rest of the business.

## Multi-PRD Product Scope

When multiple selected PRDs target the same product/repository:

- Build one shared product model from all selected PRDs.
- Keep each PRD's capability and acceptance evidence separately traceable.
- Resolve duplicate concepts into one domain term only when semantics match.
- Record conflicts instead of silently choosing one PRD.
- Produce one system shell/navigation/template contract and PRD-specific representative screens.

When only one PRD is available:

- Do not pretend it proves the whole future product.
- Define only the minimum coherent product shell, screen family, and navigation needed by that PRD.
- Mark likely future modules as out of scope or proposed, never as existing navigation.

## Product Archetype Decision

Infer the product shape from tasks and data, not keywords.

Examples of valid evidence-based archetypes include storefront, content browser, operational queue, case workspace, editor, configuration console, monitoring surface, booking flow, multi-step transaction, or hybrid. `dashboard`, `admin`, `SaaS`, and `internal tool` are too broad by themselves.

Dashboard/workspace patterns are allowed when the evidence requires monitoring, comparison, triage, management, or exception handling. Reject unsupported generic KPI-card/table layouts, not dashboards as a category.

## DESIGN.md Contract

`DESIGN.md` is the product-wide visual and component system. It must:

- Use a generated product-specific H1 and design-system name.
- Start with product evidence and experience principles before tokens.
- Define visual decision axes from roles, tasks, data density, trust, and state semantics.
- Define semantic color, typography roles, density, surface hierarchy, shape, icon/media, motion, and component behavior.
- Define domain-state treatment and non-color cues.
- Define core primitives plus domain-specific components required by the evidence.
- Include responsive visual behavior and accessibility requirements.
- Map every major rule to evidence IDs.
- Separate system rules from representative PRD applications.
- Keep external reference translation subordinate to product evidence.

Visual options must share one neutral evaluation DOM, region order, geometry, responsive frame, product model, task/content/action/state semantics, permissions, outcomes, and acceptance criteria. They may differ through typography, semantic color, spacing rhythm, density variants, surfaces, shape grammar, component/state appearance, icons/media/motif, motion, and accessibility treatment. They must not decide app shell, navigation, columns, region placement, master-detail, disclosure, scroll/sticky ownership, or responsive region topology.

## layout.md Contract

`layout.md` is the product-wide spatial, navigation, and screen-composition system. It must:

- Use a generated product-specific H1.
- Define the global shell or explicitly justify no persistent shell.
- Define navigation from confirmed screen relationships, not a generic sidebar reflex.
- Define screen inventory, screen families, routes when known, and cross-screen transitions.
- Define page-template contracts, region anatomy, content priority, actions, and state placement.
- Define exact canonical viewport geometry, first-viewport budgets, visual-center placement, and scroll/sticky/overflow ownership.
- Define desktop/tablet/mobile composition and reading order for every confirmed screen family.
- Define dense-data overflow, inspector/drawer/modal, focus return, and destructive-action policy where applicable.
- Include representative mappings for every selected PRD capability and acceptance criterion.
- Map every major layout rule to evidence IDs.
- Include screenshot-verifiable layout acceptance tests and desktop/mobile ASCII spatial frames for representative screens.

Do not force a fixed external layout template when it obscures product structure. Prefer an explicit product contract that engineers can implement and reviewers can trace.

Before final `layout.md`, generate three layout options that lock final `DESIGN.md` and all product invariants while differing materially in shell/navigation, grouping, master-detail, progressive disclosure, density/action anchoring, scroll ownership, and responsive recomposition. Review real desktop/mobile previews, then retain only the selected direction in final `layout.md`.

## Reference Policy

External design/layout research is optional enrichment:

- First derive product design axes and layout jobs from evidence.
- Search only after the product model is stable.
- Translate principles, never brands or exact layouts.
- Record what each reference changed.
- If search is unavailable, continue from product/repository evidence and add a warning.
- Never block an otherwise complete product design only because an external catalog is unavailable.

## Quality Gates

Block or rewrite when:

- A normative design/layout rule has no evidence ID.
- Acceptance criteria are missing from the design coverage matrix.
- A screen, role, state, control, KPI, chart, or navigation item was invented.
- `DESIGN.md` is mainly a palette/style guide without product semantics.
- `layout.md` is mainly one screen, a generic dashboard recipe, or a token catalog.
- Mobile is only desktop stacked or scaled down.
- Loading, empty, error, permission, destructive, selected, or recovery states required by evidence are absent.
- A visual option changes layout topology, or a layout option changes the selected visual system, task semantics, content priority, actions, states, permissions, outcomes, or product workflow.
- Visual options change shell/grouping/disclosure/responsive composition instead of using the shared evaluation frame.
- Layout options differ only by palette, typography, radius, shadow, or motif instead of spatial strategy.
- A visible preview leaks screen/evidence/PRD/AC IDs, coverage, QA status, artifact paths, JSON/YAML, or design-document prose into product UI.
- A preview presents all screens/states at once as a report wall instead of one focused product scene with real navigation.
- Screenshot-based visual quality is below 88/100, hierarchy/composition/task focus/mobile is below 8/10, or any hard visual blocker remains.
- Documents default to MVP language without source evidence.

Pass only when an engineer can implement the documented scope, a reviewer can trace decisions to PRD evidence, and future agents can distinguish system rules from feature examples.
