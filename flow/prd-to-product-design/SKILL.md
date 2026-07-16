---
name: prd-to-product-design
description: Convert one or more PRDs, specifications, source User Stories, requirements references, and repository evidence into a product-wide design context and consolidated DESIGN.md that safely drives UX, wireframes, frontend design, and implementation. Use when design artifacts must be grounded in product requirements instead of generic dashboard, MVP, SaaS, or visual-reference defaults.
---

# PRD to Product Design

Build the product model before choosing a visual style or page layout. Treat PRD/spec evidence as authoritative, repository evidence as implementation reality, and external design references as optional supporting material only.

Read [references/contracts.md](references/contracts.md) before writing `design-context.md` or `DESIGN.md`.

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

`DESIGN.md` may contain normative rules only from `explicit`, `confirmed`, or defensible `derived` evidence. Put `proposed` and `unknown` items in clearly non-normative sections.

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
- Define the global shell or explicitly justify no persistent shell.
- Define navigation, screen/route/scene inventory, screen families, and cross-screen transitions from confirmed product relationships.
- Define page-template and scene contracts, region anatomy, visual center, content priority, action placement, state placement, scroll/sticky ownership, overflow, overlays, and progressive disclosure.
- Define exact canonical viewport geometry and desktop/tablet/mobile recomposition for every confirmed screen family.
- Map every major rule to evidence IDs.
- Separate system rules from representative PRD applications.
- Keep external reference translation subordinate to product evidence.

Do not create a separate `layout.md`. Keep visual, component, spatial, navigation, screen, responsive, and interaction decisions in one consolidated `DESIGN.md` so implementation agents have one authority.

## Exhaustive Review And Batch Repair

Direction review is a complete matrix audit, not an incremental issue-discovery loop. Load `bounded-design-review` for the authoritative state, matrix ownership, idempotency, resume, and repair-limit contract.

- Inspect every approved screen and required state at desktop and mobile before returning a verdict. Do not stop at the first blocker or cap the issue list.
- For every matrix cell, record screenshot evidence, objective DOM measurements, task/visual checks, and issue IDs.
- Persist a machine-readable review contract containing every blocking/major issue, affected cells, observed/expected behavior, root cause, repair requirements, acceptance checks, and regression cells.
- A writer receiving a blocked report must repair all issue IDs in one coordinated batch. The platform then creates one new complete matrix for the repaired artifact hash.
- Independent review runs once after that batch. If the full post-repair review still fails, record terminal blocked and stop with the complete unresolved matrix.
- Never route a partial report to a writer. `issueInventoryComplete:true` and complete matrix coverage are prerequisites for repair.
- Writers and reviewers must consume the same deterministic matrix manifest; they may not create separate browser probes for the same artifact revision.

## Reference Policy

External design research is optional enrichment:

- First derive product design axes and composition jobs from evidence.
- Search only after the product model is stable.
- Translate principles, never brands or exact layouts.
- Record what each reference changed.
- If search is unavailable, continue from product/repository evidence and add a warning.
- Never block an otherwise complete product design only because an external catalog is unavailable.

## Quality Gates

Block or rewrite when:

- A normative design rule has no evidence ID.
- Acceptance criteria are missing from the design coverage matrix.
- A screen, role, state, control, KPI, chart, or navigation item was invented.
- `DESIGN.md` is mainly a palette/style guide without product semantics.
- `DESIGN.md` omits shell, navigation, screen composition, geometry, responsive topology, or scroll/sticky ownership required to implement the approved UI.
- Mobile is only desktop stacked or scaled down.
- Loading, empty, error, permission, destructive, selected, or recovery states required by evidence are absent.
- A visible preview leaks screen/evidence/PRD/AC IDs, coverage, QA status, artifact paths, JSON/YAML, or design-document prose into product UI.
- A preview presents all screens/states at once as a report wall instead of one focused product scene with real navigation.
- Screenshot-based visual quality is below 88/100, hierarchy/composition/task focus/mobile is below 8/10, or any hard visual blocker remains.
- Documents default to MVP language without source evidence.

Pass only when an engineer can implement the documented scope, a reviewer can trace decisions to PRD evidence, and future agents can distinguish system rules from feature examples.
