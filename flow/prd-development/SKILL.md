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

## Recommended PRD Structure

Use this structure unless the host agent requires a stricter local template:

- Executive summary.
- Problem statement and evidence.
- Target users/personas.
- Scope and non-goals.
- Solution overview at product level.
- Functional requirements.
- Acceptance criteria.
- Success metrics.
- Risks, assumptions, dependencies.
- Traceability to source User Story or requirements document.

## SDD Constraints

- Keep product requirements separate from engineering implementation planning.
- Do not invent API, schema, framework, or deployment details.
- Preserve ADO source User Story id, title, URL, state, and acceptance criteria.
- One selected ADO User Story produces one PRD unless the user explicitly changes mapping.
- Stop at consolidated preview until user approval; ADO sync belongs to `finalize-prd-batch-run`.

## Validation

Before preview approval, check:

- Problem before solution.
- Outcome before output.
- Scope before details.
- Scenario before fields.
- Acceptance before finalize.
- Risk before handoff.
