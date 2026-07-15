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

## Acceptance Criteria

Prefer Given/When/Then. Include:

- Happy path.
- Permission or forbidden state when applicable.
- Empty/loading/error/conflict states when UI or workflow requires them.
- Data/test examples when needed for objective validation.
