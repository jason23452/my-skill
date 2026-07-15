---
name: requirements-clarity
description: Validate production-ready product requirement completeness across discovery, User Story, and PRD drafting. Use for broad product ideas, requirements documents, admin or operational systems, customer-facing products, workflow-heavy features, regulated or sensitive data, and any request that should be directly implementable and operable rather than automatically reduced to an MVP.
---

# Production Requirements Clarity

Produce requirements that describe a complete, operable product outcome. Default to production-ready scope. Use MVP, prototype, proof-of-concept, phased delivery, or deferred core capability only when the user explicitly requests that delivery posture.

## Completeness Model

Assess the artifact against these levels:

- PC0 Problem unclear: user, pain, current behavior, or desired outcome is unknown.
- PC1 Product intent clear: actors, outcomes, scope, and product surfaces are understood.
- PC2 Workflow complete: entry points, end-to-end flows, states, rules, exceptions, and completion outcomes are testable.
- PC3 Control complete: permissions, data ownership, integrations, notifications, audit needs, and dependency behavior are defined.
- PC4 Production complete: security/privacy, performance/capacity, availability, recovery, observability, support operations, migration, rollout, and accessibility/localization are addressed where applicable.
- PC5 Validated handoff: contradictions are resolved, blocking decisions are answered, acceptance coverage is traceable, and remaining assumptions are explicitly non-blocking.

Do not declare an artifact ready below PC4 unless the user explicitly requests an MVP or exploratory deliverable.

## Adaptive Completeness Dimensions

Derive questions from the user's domain. Do not ask a generic checklist when a dimension is irrelevant, but do record an applicability decision.

1. Problem and outcomes: who is affected, current workaround, business impact, why now, measurable result.
2. Actors and authority: user types, administrators, approvers, external parties, ownership, segregation of duties, permission boundaries.
3. Product structure: channels, entry points, navigation, work queues, detail views, reports, settings, and cross-surface handoffs.
4. Domain data: objects, required fields, source of truth, validation, identity, relationships, history, retention, deletion, import/export.
5. Workflow and lifecycle: trigger, prerequisites, normal path, alternate path, states, transitions, cancellation, reopening, expiration, archival.
6. Business rules: calculations, eligibility, ordering, limits, conflicts, duplicate handling, concurrency, idempotency, effective dates.
7. Failure and recovery: validation feedback, partial failure, dependency outage, retry, rollback, compensation, manual recovery, escalation.
8. Integrations and communication: upstream/downstream systems, API or file boundaries at product level, notifications, templates, timing, delivery failure.
9. Trust and governance: authentication, authorization, privacy, consent, sensitive data, audit trail, compliance, abuse and fraud considerations.
10. Quality attributes: expected volume, peak load, response expectations, availability, data freshness, accessibility, localization, compatibility.
11. Operations: configuration, feature control, monitoring, alerting, support tooling, reconciliation, reporting, audit review, runbook ownership.
12. Adoption and change: existing data migration, cutover, backward compatibility, training, rollout, rollback, success monitoring.

## Discovery Loop

Use multiple focused question rounds for broad or incomplete requests:

1. Intent round: problem, users, outcome, scope, product shape.
2. Domain round: objects, workflows, states, rules, permissions, exceptions.
3. Production round: integrations, data lifecycle, security/privacy, scale, recovery, operations, migration, rollout.
4. Validation round: contradictions, examples/test data, measurable acceptance, unresolved blocking decisions.

Ask two to five related questions per round. Skip answered dimensions. Use multi-select when choices can coexist and single-select only when choices are mutually exclusive. Inferred domain behavior must be presented as a candidate, never silently promoted to fact.

A complete source document does not bypass discovery. Run a gap audit and ask only the missing blocking questions.

## Decision Policy

Ask the user when an answer changes product scope, actor authority, money or legal behavior, irreversible data behavior, external integration contracts, lifecycle transitions, or observable acceptance.

Record a non-blocking assumption when it can be changed later without altering those areas. Do not ask product users to choose frameworks, database schemas, packages, deployment topology, or low-level API design unless already stated as a constraint.

## Artifact Gates

### Requirements

Require product-wide coverage, not a feature list:

- Complete actors, product surfaces, domain glossary, workflows, lifecycle, rules, data, integrations, quality attributes, operations, rollout, acceptance, risks, and open decisions.
- Mark each production dimension as confirmed, not applicable with reason, assumed, or blocking.
- Do not use "future phase" to hide a capability required for safe day-one operation.

### User Story

Each story remains a coherent vertical slice and includes:

- Entry point, trigger, preconditions, actor/permission, data and state change, business rules, observable result.
- Acceptance scenarios for normal behavior plus every relevant validation, permission, empty, conflict/concurrency, dependency failure, retry/recovery, and audit outcome.
- Dependencies and operational impact when the slice affects notifications, reports, reconciliation, configuration, or support.
- Traceability to exact requirement sections and explicit non-goals.

Do not create generic stories such as "manage settings" or technical-layer stories. Split when actors, triggers, outcomes, release independence, or acceptance behavior differ.

### PRD

Require an engineering-ready product contract:

- Problem/evidence, users/stakeholders, end-to-end journeys, scope/non-goals, functional requirements, business rules, data and analytics, permissions, integrations, NFRs, security/privacy/compliance, operations/support, migration/rollout/rollback, measurable success, risks/dependencies, and traceability.
- Every functional requirement maps to acceptance scenarios and affected production dimensions.
- Open decisions that change scope, money, authority, data integrity, compliance, or acceptance block approval.

## Anti-MVP Rule

Do not describe a product as MVP by default. Do not omit administration, permissions, error recovery, auditability, reporting, configuration, migration, or support merely because they are not part of a happy-path screen.

If the user explicitly requests an MVP, still identify production gaps and label them as accepted exclusions with consequences and a reconsideration trigger.
