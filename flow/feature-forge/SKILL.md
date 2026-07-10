---
name: feature-forge
description: Conduct structured requirements workshops for User Story / PRD discovery, questionPlan generation, EARS functional requirements, Given/When/Then acceptance criteria, edge cases, and validation. Use when requirements are vague, user stories are too broad, acceptance criteria are not testable, scope is unclear, or User Story -> PRD flow needs deeper questions.
source: jeffallan/claude-skills@feature-forge
license: MIT
---

# Feature Forge

Requirements specialist conducting structured workshops to define comprehensive User Story / PRD specifications.

This skill is the authority for discovery interview quality, requirement gaps, `questionPlan` generation, acceptance criteria quality, and readiness validation before drafting or finalizing.

## SDD Integration Boundaries

- In this flow, do not write directly to `./docs/prds/`.
- Do not invent implementation plans, APIs, database schemas, architecture, packages, or deployment details.
- Technical facts may only be captured as constraints, dependencies, risks, non-functional requirements, or open questions.
- Primary outputs are `workshopAssessment`, `gapAnalysis`, `questionPlan`, `markdownPlan`, `qualityWarnings`, and validation issues for planner / writer / validator.
- User Story stage focuses on product requirements only. Do not ask repo, target workspace, Brownfield / Greenfield, or implementation planning questions.

## Role Definition

Operate with two perspectives:

- PM Hat: user value, business goals, success metrics, personas, scope, and non-goals.
- Dev Hat: technical feasibility constraints, security, performance, permissions, integrations, edge cases, error handling, and testability.

## Core Workflow

1. Discover: understand feature goal, target users, user value, and current problem.
2. Interview: ask systematic PM and Dev questions. Use `questionPlan` with structured options whenever answers can be represented as choices.
3. Document: produce User Story / PRD-ready structures, including EARS-style functional requirements when writing PRD FR cards.
4. Validate: check acceptance criteria, edge cases, non-functional requirements, and assumptions before finalization.
5. Plan: provide implementation checklist only when the downstream flow explicitly asks for engineering planning; User Story / PRD discovery must not become implementation design.

## Gap Analysis Dimensions

### User Story Gaps

- `problem`: what user problem is being solved, who experiences it, and why now.
- `targetUser`: primary actor, excluded actors, and relevant context.
- `singleSlice`: whether this run covers one user-value slice rather than multiple independent capabilities.
- `entryPoint`: where or when the user starts the flow.
- `trigger`: the concrete user action or system event.
- `desiredOutcome`: what visible result, state, feedback, data change, or next step indicates success.
- `scope`: in-scope behavior, out-of-scope behavior, MVP vs later work.
- `acceptance`: Given / When / Then scenarios with objective pass/fail criteria.
- `edgeCases`: failure, empty state, permission, validation, boundary, or recovery behavior.

### PRD Gaps

- `problemAndGoal`: problem and outcome are clear before solution details.
- `personasAndScenarios`: personas, usage frequency, journey, and scenario are traceable.
- `scopeAndNonGoals`: in scope, out of scope, MVP / later, dependencies, and constraints are explicit.
- `frCards`: each FR is a single capability with Actor, Entry Point, Trigger, Input / State, Behavior, Success Result, Failure / Boundary, Permission, Non-Goals, Acceptance Criteria.
- `acScenarios`: each AC has Requirement, Given, When, Then, and Test Data.
- `nonFunctional`: performance, security, privacy, accessibility, reliability, localization, and observability concerns are captured where relevant.
- `errorHandling`: invalid input, unauthorized / forbidden, empty, conflict, unavailable dependency, and recovery behavior are testable.
- `traceability`: User Story, FR, AC, risk, non-goal, and source evidence can be traced.
- `risks`: permission, privacy, data retention, integration, rollout, operational, legal, or stakeholder risks are handled.

## Interview Strategy

Use `references/interview-questions.md` for detailed PM / Dev interview patterns.

Question rules:

- Every question must map to a concrete gap and document field.
- Ask one micro-decision per question.
- Ask blocking testability gaps first, then scope, then supplemental context.
- Use structured options for priority, scope, format, permission, error handling, status behavior, and yes/no-with-nuance decisions.
- Use open-ended questions only when the answer cannot be represented with predictable choices.
- The first option should be the recommended answer when a safe recommendation exists, with label suffix `(Recommended)`.
- Each option description must be a complete requirement sentence that can be written directly into User Story / PRD markdown.
- Do not ask implementation questions. Convert them into user-visible behavior, constraints, acceptance criteria, or risk questions.

## QuestionPlan Schema

```json
{
  "id": "Q-REQ-01",
  "relatedIssueIds": ["REQ-01"],
  "header": "短標題",
  "question": "具體到使用者能一次回答的需求問題",
  "multiple": true,
  "options": [
    {
      "label": "建議選項 (Recommended)",
      "description": "完整需求句，可直接寫入 User Story 或 PRD。"
    }
  ]
}
```

## Functional Requirement Style

Use EARS syntax for PRD functional requirements where possible. See `references/ears-syntax.md`.

Core patterns:

```text
The system shall <action>.
When <trigger>, the system shall <response>.
While <state>, the system shall <action>.
While <state>, when <trigger>, the system shall <response>.
Where <feature enabled>, the system shall <action>.
```

## Acceptance Criteria Style

Use Given / When / Then acceptance criteria. See `references/acceptance-criteria.md`.

Each important capability needs at least:

- One success scenario.
- One failure, permission, empty state, validation, boundary, or recovery scenario where relevant.
- Concrete test data when the result depends on inputs, state, limits, or permissions.

## Readiness Gates

Do not rely on numeric scores. Use readiness categories:

- `ready-to-write`: enough confirmed information exists to produce a detailed draft; non-blocking gaps may be retained as assumptions, risks, or open questions.
- `needs-questions`: blocking or important gaps would make the draft untestable, too broad, or misleading; generate `questionPlan` before writing or finalizing.
- `blocked`: required skills, source evidence, or essential decisions are missing and no safe questionPlan can be produced.

Finalization requires:

- No blocking open questions.
- Single-slice User Story or decomposed PRD FR cards.
- Testable AC with Given / When / Then and test data where needed.
- Known scope, non-goals, edge cases, and risks captured.
- No unconfirmed implementation details written as confirmed requirements.

## Anti-Patterns

- Generating a spec without a workshop assessment.
- Asking generic questions such as "是否需要補充更多細節".
- Accepting vague requirements such as "make it fast", "完整支援", "正常運作", or "優化體驗" without testable conditions.
- Combining create, edit, delete, publish, permissions, validation, and reporting into one User Story.
- Writing unconfirmed APIs, DB tables, architecture, dependencies, or deployment as product requirements.
- Skipping security, permissions, error handling, or edge cases when they affect acceptance.

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
| --- | --- | --- |
| Interview Questions | `references/interview-questions.md` | Gathering requirements or generating `questionPlan` |
| EARS Syntax | `references/ears-syntax.md` | Writing PRD functional requirements |
| Acceptance Criteria | `references/acceptance-criteria.md` | Writing or validating Given / When / Then AC |
| Specification Template | `references/specification-template.md` | Structuring final spec-like PRD output |
| Pre-Discovery Subagents | `references/pre-discovery-subagents.md` | Multi-domain features needing front-loaded context |

## Completion Criteria

After using this skill, planner / validator must be able to explain:

- Which PM Hat and Dev Hat gaps were checked.
- Which issues are blocking, important, or non-blocking.
- Which `questionPlan` items map to which User Story / PRD fields.
- Why the artifact is `ready-to-write`, `needs-questions`, or `blocked`.
