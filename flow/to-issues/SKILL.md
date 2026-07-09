---
name: to-issues
description: 將 plan、spec、PRD 或目前對話拆成可獨立領取的 tracer-bullet issues。適用於把規劃文件轉成 vertical-slice tasks、issue tracker work items 或 ADO Task。
disable-model-invocation: true
source: https://github.com/mattpocock/skills/tree/main/skills/engineering/to-tickets
---

# 拆分 Issues

將 plan、spec、PRD 或對話拆成 **issues**：每個 issue 都是可驗收的 tracer-bullet vertical slice，並明確宣告它被哪些 issue 阻擋。

此本地 skill 保留 `to-issues` 名稱以符合目前 workflow。上游 Matt Pocock skill 目前名為 `to-tickets`；此版本已調整為 PRD-to-ADO Task planning。

## 流程

### 1. 收集 Context

從使用者提供或 workflow 產出的規劃文件工作。本 SDD flow 預期來源包含：

- `prd.md`
- `spec.md`
- `project-context.md`
- `bootstrap-result.json`
- `design.md`
- `plan.md`
- frontend `design/system_design.md`，如果存在

不要發明來源文件以外的需求。

### 2. 必要時探索 Codebase

如果 task title、dependencies、repo scope 或 verification steps 需要 repo vocabulary，只讀相關 README、AGENTS、package scripts、API route 位置、test folders、design/system docs。

避免使用過期實作猜測。能使用實際 project terms 就不要用泛稱。

### 3. 草擬 Vertical Slices

把工作拆成 tracer-bullet issues。

<vertical-slice-rules>

- 每個 slice 都要切過必要層級中的一條窄路徑，例如 schema、API、UI、tests 或 integration evidence。
- 完成後必須能獨立 demo 或驗證。
- 每個 slice 要能在一個 fresh context window 或一個 OpenCode task session 中完成。
- prefactoring 應該先做，且只阻擋真正需要它的 slices。
- 優先產生 AFK-ready issues：清楚 objective、scope boundary、acceptance criteria、verification、expected evidence。

</vertical-slice-rules>

每個 issue 都要標出 blocking edges：哪些 issue 必須先完成。沒有 blockers 的 issue 可以立即開始。

### 4. 檢查 Granularity

對每個 issue 內部檢查：

- title 是否描述一個 outcome，而不是一包無關工作。
- 一個 agent 是否能在單一 session 完成，不需要整個 feature context。
- 除 final verification issue 外，是否最多涵蓋三條 acceptance criteria。
- blockers 是否是真正 contract dependency，而不是同 repo 或同 layer 的假排序。
- 再拆分是否能提高平行度，且不產生無意義碎片。

如果 issue 太粗，發布前先拆小。

### 5. 發布到此 Workflow

在本 SDD workflow 中，publish 指產出：

- root `task.md`
- 每個 issue 一份 `tasks/<taskId>/task.md`
- 每個 issue 一個 ADO Task child work item
- 每個 issue 一個 session-only OpenCode session
- 每個 issue 一份 `/previews/task-session/<sessionId>/task.md`

本 skill 不修改 parent PRD 或 User Story work items。ADO Task 建立與 session dispatch 由 Work Coordinator tools 處理。

<issue-template>

## Parent 父層來源

引用 parent PRD Work Item 與 source PRD run。

## 要建什麼

描述此 issue 要讓哪個 end-to-end behavior 或 engineering gate 成立。從使用者或 operator 角度描述，避免 layer-by-layer filler。

## 驗收條件

- Criterion 1
- Criterion 2

## 被哪些任務阻擋

- 列出每個 blocking task，或寫 `None - can start immediately`。

## 驗證方式

- 需要用來證明完成的 command、test、smoke check、screenshot、log 或 manual evidence。

</issue-template>

按 frontier 工作：任何 blockers 都已完成的 issue，都可以獨立實作。
