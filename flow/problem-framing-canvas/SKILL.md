---
name: problem-framing-canvas
description: Reframe solution-first or messy feature requests into a clear problem statement before requirements drafting. Use when the user starts with a requested solution, vague pain, stakeholder demand, copied competitor feature, or unclear target user.
---

# Problem Framing Canvas

Adapted for this SDD flow from Dean Peters' Product Manager Skills "problem-framing-canvas".
Source: https://github.com/deanpeters/Product-Manager-Skills/tree/main/skills/problem-framing-canvas

## Purpose

Prevent the flow from turning a preferred solution into requirements before the actual problem is clear.

## Three Passes

### 1. Look Inward

Identify the team's assumptions:

- What do we think the problem is?
- What solution are we already anchored on?
- Why do we believe this is worth solving now?
- What evidence do we have, and what is only opinion?

### 2. Look Outward

Identify who experiences the problem and who does not:

- Primary users and affected roles.
- Current workaround and pain.
- Stakeholders who benefit if the problem remains or is solved.
- Users, permissions, environments, or scenarios that may be excluded.

### 3. Reframe

Produce a problem statement that does not depend on a specific implementation:

```text
For [target user], [current situation] creates [problem/pain], causing [business/user impact]. We will know it is solved when [observable outcome].
```

Then produce one "How might we..." question:

```text
How might we [enable user outcome] while respecting [key constraint]?
```

## SDD Output

Feed these fields into `requirements.md`:

- Problem statement.
- Target users.
- Current workaround.
- Impact and urgency.
- Evidence vs assumptions.
- Scope boundary and non-goals.
- Requirements seeds and acceptance seeds.

If the problem statement still depends on a specific UI, API, database, vendor, or implementation, mark the draft as not ready and ask a targeted question.
