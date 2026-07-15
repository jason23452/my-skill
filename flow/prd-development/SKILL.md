---
name: prd-development
description: Build or validate PRDs that connect problem, users, solution scope, success metrics, requirements, user stories, acceptance criteria, risks, and non-goals. Use when turning selected ADO User Stories or requirements into engineering-ready PRD drafts.
---

# PRD Development

Adapted for this SDD flow from Dean Peters' Product Manager Skills "prd-development" and aligned with local PRD/ADO preview gates.
Source: https://github.com/deanpeters/Product-Manager-Skills/tree/main/skills/prd-development

## PRD Questions

A PRD must answer:

1. What problem are we solving?
2. For whom?
3. Why now?
4. What product outcome are we building toward?
5. How will success be measured?
6. What requirements and acceptance criteria define done?
7. What is explicitly out of scope?
8. What risks, assumptions, and dependencies remain?
9. Which roles, permissions, business rules, lifecycle transitions, and failure/recovery behaviors govern the product?
10. What data lifecycle, integrations, security/privacy/compliance, service-quality, observability, support, migration, rollout, and rollback requirements make it operable in production?

## Recommended PRD Structure

Use this structure unless the host agent requires a stricter local template:

- Executive summary.
- Problem statement and evidence.
- Target users/personas.
- Scope and non-goals.
- Solution overview at product level.
- Functional requirements.
- Roles/permissions, business rules, lifecycle/state transitions, integrations, and failure/recovery behavior.
- Data lifecycle, analytics, audit, reconciliation, and reporting.
- Non-functional requirements, security/privacy/compliance, operations/support, and migration/rollout/rollback.
- Acceptance criteria.
- Success metrics.
- Risks, assumptions, dependencies.
- Traceability to source User Story or requirements document.

## SDD Constraints

- Keep product requirements separate from engineering implementation planning.
- Default to a complete production product at PC4 or PC5. Do not reduce scope to an MVP, prototype, or happy path unless the user explicitly requests it; record accepted exclusions, consequences, and reconsideration triggers.
- Do not invent API, schema, framework, or deployment details.
- Preserve ADO source User Story id, title, URL, state, and acceptance criteria.
- One selected ADO User Story produces one PRD unless the user explicitly changes mapping.
- Stop at consolidated preview until user approval; ADO sync belongs to `finalize-prd-batch-run`.
- Finalization creates one ADO PRD Work Item and one session-only OpenCode session per PRD. No prompt is sent to the created PRD sessions.
- A created PRD session displays only its own final `/previews/prd/<prdRunId>/prd.md` first. Batch, sibling PRD, User Story, design, and planning previews must not leak into it.
- PRD Agent stops after batch sync/session creation. The separate `Project Flow` primary agent later lists ADO PRDs, lets the user select multiple PRDs, and owns every downstream stage.

## Validation

Before preview approval, check:

- Problem before solution.
- Outcome before output.
- Scope before details.
- Scenario before fields.
- Acceptance before finalize.
- At least three acceptance scenarios per PRD covering normal, validation/permission/boundary, and relevant state/failure/recovery/audit/operational behavior; add every other applicable scenario.
- Each functional requirement maps to acceptance criteria and affected production-completeness dimensions.
- Production concerns are confirmed, explicitly not applicable with reason, or visibly assumed. Missing sections are not proof that a concern is irrelevant.
- Risk before handoff.
