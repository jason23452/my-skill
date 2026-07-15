---
name: user-stories
description: Create or validate User Stories using 3 C's and INVEST criteria with clear card, conversation, confirmation, acceptance criteria, non-goals, assumptions, and traceability. Use when turning requirements into batch User Stories or reviewing User Story quality.
---

# User Stories

Adapted for this SDD flow from Pawel Huryn's "user-stories" skill.
Source: https://github.com/phuryn/pm-skills/tree/main/pm-execution/skills/user-stories

## 3C Story Shape

Each User Story should contain:

- Card: short title and one-line statement.
- Conversation: why this matters, target user, entry point, trigger, scope, non-goals, assumptions.
- Confirmation: testable acceptance criteria.

Standard statement:

```text
As a [actor], I want to [perform action], so that [benefit/outcome].
```

Use `job-stories` when the situation and trigger are more important than the actor.

## INVEST Check

Validate every story:

- Independent: can be planned without requiring unrelated stories.
- Negotiable: describes outcome, not a fixed implementation.
- Valuable: clear user or business value.
- Estimable: enough scope and constraints are known.
- Small: one coherent product slice, not an entire program.
- Testable: acceptance criteria have observable pass/fail behavior.

## SDD Batch Rules

When generating a batch from requirements:

- One story per coherent product slice.
- Preserve source requirement, Wiki page id/path, and traceability when available.
- Keep related capabilities together when they share actor, entry point, trigger, and outcome.
- Split only when acceptance criteria become unclear or goals diverge.
- Include non-goals and deferred scope to prevent PRD expansion.
- Do not title stories as `User Story 1`, `US-01`, `requirements`, or other sequence-only labels. Use the generated product/domain slice title.
- After batch approval, create one session-only OpenCode session per story. Bind each session to exactly one story run and prioritize only that story's Markdown preview; never inherit the consolidated batch preview.

## Required SDD User Story Markdown

Each batch item must use this structure before it is passed to `write-userstory-batch-draft`:

```markdown
# <domain-specific title>

## Source Requirement Summary
- Source: <requirements run/wiki id + path/title>
- Requirement slice: <specific workflow/capability from the requirements document>
- Business outcome: <observable value>

## User Story
As a <actor>, I want to <action>, so that <outcome>.

## Scope
### In Scope
- <included behavior>

### Non-Goals
- <explicitly excluded or deferred behavior, or "None identified from the source requirements.">

## Conversation Notes
- Actor / entry point: <where this starts>
- Trigger: <event or user intent>
- Data involved: <managed objects or important fields, only if source supports them>

## Preconditions and Permissions
- Preconditions: <required context or state>
- Allowed actor / authority: <permission boundary>
- Denied or restricted behavior: <observable result, or not applicable with reason>

## Business Rules and State Changes
- Rule: <product rule or not applicable with reason>
- Before / after state: <lifecycle impact>
- Conflict / duplicate handling: <behavior or not applicable with reason>

## Data and Audit Impact
- Data read or changed: <product-level objects/fields>
- Validation / retention / privacy: <impact or not applicable with reason>
- Audit / history outcome: <evidence or not applicable with reason>

## Acceptance Criteria
### AC-01: <happy path>
Given <context>
When <action>
Then <observable result>

### AC-02: <validation, permission, empty, error, conflict, or boundary path>
Given <context>
When <action>
Then <observable result>

### AC-03: <state, failure, recovery, audit, or operational path>
Given <context>
When <action or failure>
Then <observable and recoverable result>

## Boundaries and Edge Cases
- <at least one concrete boundary, validation, permission, empty, error, or conflict case>

## Dependencies and Operational Impact
- Dependencies / notifications: <behavior or not applicable with reason>
- Monitoring / reconciliation / support: <evidence or not applicable with reason>
- Rollout / migration impact: <impact or not applicable with reason>

## Assumptions
- <assumption, or "None.">

## Open Questions
- <question, or "None.">

## Traceability
- Source requirements: <run id/path or wiki page id/path/url>
- Requirement section: <heading or slice name>
```

## Batch Quality Gate

Before preview, every story must have:

- 3C completeness: card, conversation, and confirmation.
- INVEST readiness: independent, negotiable, valuable, estimable, small, and testable.
- At least three Given/When/Then acceptance scenarios: normal behavior, validation/permission/boundary behavior, and relevant state/failure/recovery/audit/operational behavior.
- Explicit scope, non-goals, preconditions/permissions, business rules/state changes, data/audit impact, dependencies/operational impact, assumptions, open questions, and source traceability.
- A batch production-coverage map assigning each applicable requirement dimension to one or more stories. Do not force irrelevant controls into every story, and do not leave a dimension without an owner or source-backed not-applicable reason.
- Production-ready scope by default. Use MVP only when explicitly requested and preserve accepted exclusions and consequences.

## Acceptance Criteria

Prefer Given/When/Then. Include:

- Happy path.
- Permission or forbidden state when applicable.
- Empty/loading/error/conflict states when UI or workflow requires them.
- State transition, dependency outage, retry/recovery, audit, notification, and support outcomes when applicable.
- Data/test examples when needed for objective validation.
