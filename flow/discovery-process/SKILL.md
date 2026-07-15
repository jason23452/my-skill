---
name: discovery-process
description: Run a lightweight product discovery pass from problem hypothesis to validated requirements. Use when requirements need evidence, customer context, research synthesis, assumption testing, or a decision on whether to draft, defer, or reject a feature.
---

# Discovery Process

Adapted for this SDD flow from Dean Peters' Product Manager Skills "discovery-process".
Source: https://github.com/deanpeters/Product-Manager-Skills/tree/main/skills/discovery-process

## Goal

Turn a problem hypothesis into a requirements brief with enough confidence for User Story generation. This is not implementation planning.

## Lightweight SDD Discovery Loop

1. Frame the problem.
   - Use `problem-framing-canvas` when the request is solution-first.

2. Identify evidence.
   - Existing docs, customer feedback, support tickets, analytics, stakeholder notes, ADO items, or Wiki pages.
   - Separate evidence from assumptions.

3. Synthesize opportunities.
   - Group needs by user outcome, not by requested feature.
   - Preserve distinct actors, triggers, and outcomes.

4. Define validation gaps.
   - Blocking gaps: would change scope, user, acceptance, permission, data, or compliance.
   - Important gaps: affect quality but can be drafted as assumptions.
   - Non-blocking gaps: useful research but not needed for a local requirements draft.

5. Decide next action.
   - Draft requirements now.
   - Ask a targeted `questionPlan`.
   - Mark as deferred or not ready.

## SDD Requirements Output

Requirements Agent should convert discovery into:

- Product/problem summary.
- Evidence summary.
- Target users and current workaround.
- Opportunity themes.
- Validated requirement seeds.
- Acceptance seeds.
- Assumptions and validation gaps.
- Suggested User Story backlog candidates.

Do not run experiments, open sessions, create work items, or sync ADO from this skill.
