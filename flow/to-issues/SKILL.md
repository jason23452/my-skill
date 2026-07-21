---
name: to-issues
description: Break a plan, spec, PRD, or conversation into independently-grabbable tracer-bullet issues. Use this skill when turning planning artifacts into vertical-slice tasks or issue tracker work items.
metadata:
  disable-model-invocation: "true"
  source: "https://github.com/mattpocock/skills/tree/main/skills/engineering/to-tickets"
---

# To Issues

Break a plan, spec, PRD, or conversation into **issues**: tracer-bullet vertical slices, each declaring the issues that **block** it.

This local skill preserves the `to-issues` name used by this workflow. The upstream Matt Pocock skill is currently named `to-tickets`; this copy is adapted for PRD-to-ADO Task planning.

For this SDD workflow, generated issue/task content must be written in Traditional Chinese. Keep fixed IDs, file paths, commands, API paths, code symbols, JSON keys, package names, and technology terms in English when appropriate.

## Process

### 1. Gather Context

Work from the provided planning artifacts. For this SDD flow, the expected sources are:

- `prd.md`
- `spec.md`
- `project-context.md`
- `bootstrap-result.json`
- `ui-layout.md`
- `plan.md`
- frontend `design/ui_style_guide.md`, when available

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

參照父層 PRD Work Item 與來源 PRD run。

## 要建置什麼

從使用者或操作者角度描述此 issue 要完成的端到端行為或工程 gate。避免只列技術層填充內容。

## 驗收條件

- 條件 1
- 條件 2

## 被哪些任務阻塞

- 列出每個阻塞任務，或寫「無 - 可立即開始」。

## 驗證

- 證明完成所需的指令、測試、smoke check、截圖、log 或人工驗證證據。

</issue-template>

Work the frontier one issue at a time. Any issue whose blockers are all done can be implemented independently.
