---
name: to-issues
description: Break a plan, spec, PRD, or conversation into independently-grabbable tracer-bullet issues. Use this skill when turning planning artifacts into vertical-slice tasks or issue tracker work items.
disable-model-invocation: true
source: https://github.com/mattpocock/skills/tree/main/skills/engineering/to-tickets
---

# To Issues

Break a plan, spec, PRD, or conversation into **issues**: tracer-bullet vertical slices, each declaring the issues that **block** it.

This local skill preserves the `to-issues` name used by this workflow. The upstream Matt Pocock skill is currently named `to-tickets`; this copy is adapted for PRD-to-ADO Task planning.

## Process

### 1. Gather Context

Work from the provided planning artifacts. For this SDD flow, the expected sources are:

- `prd.md`
- `spec.md`
- `project-context.md`
- `bootstrap-result.json`
- `design.md`
- `plan.md`
- frontend `design/system_design.md`, when available

Do not invent requirements outside those sources.

### 2. Explore The Codebase When Needed

If task titles, dependencies, repo scope, or verification steps require repo vocabulary, inspect only the relevant README, AGENTS, package scripts, API route locations, test folders, and design/system docs.

Avoid stale implementation guesses. Use actual project terms where available.

### 3. Draft Vertical Slices

Break the work into tracer-bullet issues.

<vertical-slice-rules>

- Each slice cuts a narrow but complete path through the required layers: schema, API, UI, tests, or integration evidence.
- A completed slice is demoable or verifiable on its own.
- Each slice fits in a single fresh context window or one OpenCode task session.
- Any prefactoring should be done first and should be explicitly blocked by only the slices that truly need it.
- Prefer AFK-ready issues: clear objective, scope boundary, acceptance criteria, verification, and expected evidence.

</vertical-slice-rules>

Give each issue its blocking edges: the other issues that must complete before it can start. An issue with no blockers can start immediately.

### 4. Check Granularity

For each issue, ask internally:

- Does the title describe one outcome, not a bundle of unrelated work?
- Can one agent complete it without needing the rest of the feature in the same session?
- Does it cover no more than three acceptance criteria, unless it is a final verification issue?
- Are the blockers genuine contracts, not just same-repo or same-layer ordering?
- Would splitting it unlock more parallelism without creating meaningless fragments?

If the answer exposes a coarse issue, split it before publishing tasks.

### 5. Publish To This Workflow

In this SDD workflow, "publish" means producing:

- root `task.md`
- one `tasks/<taskId>/task.md` per issue
- one ADO Task child work item per issue
- one session-only OpenCode session per issue
- one `/previews/task-session/<sessionId>/task.md` per issue

Do not modify parent PRD/User Story work items from this skill. The Work Coordinator's tools handle ADO Task creation and session dispatch.

<issue-template>

## Parent

Reference the parent PRD Work Item and source PRD run.

## What To Build

The end-to-end behavior or engineering gate this issue makes work, from the user's or operator's perspective. Avoid layer-by-layer filler.

## Acceptance Criteria

- Criterion 1
- Criterion 2

## Blocked By

- Reference each blocking task, or "None - can start immediately".

## Verification

- Command, test, smoke check, screenshot, log, or manual evidence required to prove completion.

</issue-template>

Work the frontier one issue at a time. Any issue whose blockers are all done can be implemented independently.
