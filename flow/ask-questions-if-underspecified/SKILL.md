---
name: ask-questions-if-underspecified
description: Ask the minimum necessary clarifying questions before requirements work when objectives, scope, constraints, success criteria, environment, actors, or acceptance criteria are ambiguous. Use in Requirements, User Story, PRD, and planning flows before drafting if proceeding would require risky assumptions.
---

# Ask Questions If Underspecified

Adapted for this SDD flow from Trail of Bits' "ask-questions-if-underspecified" skill.
Source: https://officialskills.sh/trailofbits/skills/ask-questions-if-underspecified

## Core Rule

Pause before drafting when missing information would materially change scope, acceptance criteria, user value, constraints, or downstream implementation planning.

Ask only the smallest useful set of questions. Do not ask questions whose answers can be safely represented as assumptions, non-goals, or open questions.

## When To Ask

Ask clarifying questions when any of these are unclear:

- Objective: what problem is being solved and why now.
- Actor: who experiences the problem or takes the action.
- Scope: what is in, out, deferred, or explicitly non-goal.
- Success: what observable outcome proves the requirement is met.
- Constraints: policy, permission, compliance, data, integrations, timing, cost, or dependency limits.
- Acceptance: Given/When/Then scenarios, edge cases, or test data.
- Source identity: which requirements document, Wiki page, User Story, or PRD is the source.

## Question Format

For SDD agents, produce a `questionPlan` compatible with the host agent:

- Ask 1 to 5 questions in a normal clarification gate.
- For broad product requests, ask 4 to 7 questions in one gate when fewer questions would force risky assumptions.
- Use `multiple:true` only when options can coexist.
- Put the safest or recommended option first and suffix `(Recommended)`.
- Every option description must be a complete requirement sentence that can be copied into requirements.md, User Story, or PRD.
- Include a free-text fallback only when the decision space cannot be enumerated.

## Prompt-Derived Questions

Build questions from the user's words instead of from a fixed domain template:

- Turn nouns into candidate managed objects, records, roles, content, assets, or transactions.
- Turn verbs into candidate workflows and user actions.
- Turn product shape words into scope questions, such as whether the surface is an admin view, customer view, one-page flow, portal, dashboard, or internal tool.
- Turn status or timing hints into lifecycle and exception questions.
- Turn quality adjectives into measurable success criteria.

When the prompt only says "build/implement/create [product/system/tool/site/app]" and does not provide enough detail, ask before drafting. The question set should clarify outcome, actors, managed objects, workflows, lifecycle/states, non-goals, and success criteria.

## Do Not Ask

- Do not ask about API, database schema, framework, UI kit, deployment, colors, or implementation unless the user already made it a constraint.
- Do not ask broad prompts like "any other details?".
- Do not block on perfect research if a local requirements draft can proceed with explicit assumptions.

## Confirmation

After answers are received, restate the confirmed requirement deltas and continue the current SDD flow. Do not branch into User Story, PRD, ADO sync, or project-flow unless the host agent explicitly owns that stage.
