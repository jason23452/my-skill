---
name: job-stories
description: Express requirements as Jobs-to-be-Done job stories using situation, motivation, and outcome. Use when role-based user stories are too shallow, when requirements depend on context or trigger, or when analyzing current workaround and desired outcome.
---

# Job Stories

Adapted for this SDD flow from Pawel Huryn's "job-stories" skill.
Source: https://github.com/phuryn/pm-skills/tree/main/pm-execution/skills/job-stories

## Format

Use this format:

```text
When [situation/trigger], I want to [motivation/action], so I can [observable outcome].
```

## How To Use In SDD

Use job stories during Requirements and User Story generation to capture:

- Entry situation.
- Trigger.
- Motivation.
- Desired visible outcome.
- Current workaround.
- Acceptance criteria focused on outcome.

## Acceptance Criteria

Each job story should include Given/When/Then seeds:

- Given the user is in the stated situation.
- When the trigger occurs.
- Then the system enables the stated outcome.
- Include edge cases for permission, empty state, invalid data, conflict, or failure when relevant.

## Guardrails

- Do not replace all User Stories with job stories unless the actor is genuinely less important than the situation.
- Do not write implementation details as the motivation.
- If a job story has multiple unrelated triggers or outcomes, split it into separate candidates.
