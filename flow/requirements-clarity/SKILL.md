---
name: requirements-clarity
description: 釐清模糊需求並提升 User Story / PRD question 品質。當需求不清、user story 顆粒太粗、acceptance criteria 不可驗收、scope 邊界不明、PRD discovery 問題不足，或 User Story -> PRD 流程需要產生 questionPlan 時必須使用。
source: softaworks/agent-toolkit@requirements-clarity
license: unknown
---

# Requirements Clarity

本 skill 由 `softaworks/agent-toolkit@requirements-clarity` 安裝後整合進本 SDD flow。用途不是取代本地 `prd` / `breakdown-feature-prd`，而是強化 **提問品質**：讓 agent 在產生 User Story 或 PRD 前，先診斷需求缺口，再產生能直接改善文件的問題。

## SDD 整合邊界

- 在本流程中不要直接寫入 `./docs/prds/`。
- 不要自行產生實作技術方案、API、DB schema、架構或部署方式。
- 技術資訊只可作為已知限制、相依系統、風險或 open question。
- 主要輸出應是 `clarityAssessment`、`gapAnalysis`、`questionPlan`、`qualityWarnings`，交給主流程的 writer / validator 使用。
- User Story 階段聚焦產品需求，不詢問 repo、target workspace、Brownfield / Greenfield、implementation planning。

## 核心原則

### 1. Systematic Questioning

- 每個問題都必須對應一個具體需求缺口。
- 每題只處理一個微決策。
- 優先問高影響缺口，不為湊題數增加無關問題。
- 問題必須能讓使用者回答後直接更新 User Story / PRD 的某個欄位。

### 2. Quality-Driven Iteration

用 100 分 clarity score 判斷是否能進入草稿或定稿：

```text
Functional Clarity: /30
- Core capability is clear: 10
- User interaction / scenario is clear: 10
- Success result is observable: 10

Scope And Boundaries: /20
- In-scope behavior is clear: 7
- Out-of-scope behavior is clear: 7
- MVP vs later work is clear: 6

Acceptance Completeness: /25
- Success AC is testable: 8
- Failure / boundary AC is testable: 8
- Required input/state/test data is clear: 9

Business Context: /15
- Problem statement is clear: 5
- Target user is clear: 5
- Success metric or value is clear: 5

Risk / Constraint Awareness: /10
- Known constraints, dependencies, privacy, permission, or rollout risks are captured: 10
```

Completion threshold:

- `>= 90`: 可定稿或進入下一階段。
- `75-89`: 可產生詳細草稿，但必須保留 non-blocking open questions。
- `< 75`: 不可定稿；planner 或 validator 必須產生 questionPlan。

## Gap Analysis Dimensions

產生 question 前，先檢查以下缺口。

### User Story Gaps

- `actor`: 誰在什麼情境使用？是否有主要角色與排除角色？
- `problem`: 使用者現在遇到什麼痛點？為什麼現在要處理？
- `slice`: 本 run 是否只有一個主要可驗收使用者價值切片？
- `entryPoint`: 使用者從哪個畫面、入口、事件或情境開始？
- `action`: 使用者要完成的單一核心動作是什麼？
- `visibleOutcome`: 成功後使用者看得到什麼狀態、回饋、資料變化或下一步？
- `boundary`: 這次明確不做什麼？哪些是後續版本？
- `failureOrEdge`: 至少一個失敗、權限、空狀態、邊界或例外情境是否可驗收？
- `acceptance`: Given / When / Then 是否可由 QA、demo、畫面狀態或測試資料判斷？

### PRD Gaps

- `problemAndGoal`: 問題、目標、成功指標是否不是 feature list？
- `personasAndScenarios`: persona、使用情境、user journey 是否可追溯？
- `scope`: in scope、out of scope、MVP / later 是否明確？
- `frCards`: 每個 FR 是否是單一可驗收能力，且有 Actor、Entry Point、Trigger、Behavior、Success Result、Failure / Boundary、Permission、Non-Goals？
- `acScenarios`: 每個 AC 是否有 Requirement、Given、When、Then、Test Data？
- `traceability`: User Story、FR、AC、風險、非目標是否能互相追溯？
- `metrics`: 成功指標是否可衡量，或明確標為非阻塞待確認？
- `risks`: 權限、隱私、資料保留、整合、營運、rollout 或法規風險是否已處理？

## Question Strategy

產生 `questionPlan` 時遵守：

- 先問會阻塞可驗收性的問題，再問補充背景。
- 同一輪問題應圍繞同一切片、同一畫面或相鄰 PRD 欄位。
- 可並存選項使用 `multiple:true`；互斥決策才用 `multiple:false`。
- 第一個選項放推薦答案，label 末尾加 `(Recommended)`。
- 每個 option 的 description 必須是可直接寫入需求文件的完整需求句。
- 不要問「你想怎麼實作？」；改問「使用者可見結果 / 限制 / 驗收判準是什麼？」。

## QuestionPlan Schema

```json
{
  "id": "Q-REQ-01",
  "relatedIssueIds": ["REQ-01"],
  "header": "短標題",
  "question": "具體到使用者能一次回答的需求問題",
  "multiple": true,
  "options": [
    {
      "label": "建議選項 (Recommended)",
      "description": "完整需求句，可直接寫入 User Story 或 PRD。"
    }
  ]
}
```

## Anti-Patterns

- 問題沒有對應任何 issue 或文件欄位。
- 問「是否要完整支援 / 優化體驗 / 正常運作」這類抽象問題。
- 把建立、編輯、刪除、權限、驗證、發布混成一條 User Story。
- 只問功能名稱，不問使用者情境、成功結果、失敗狀態與排除範圍。
- 把 open questions 當成逃避提問的垃圾桶。
- 把未確認技術方案寫成已確認需求。

## Completion Criteria

使用本 skill 後，必須能說明：

- clarity score 與主要扣分原因。
- 每個 blocking issue 都有對應 question。
- 每個 question 的回答會更新哪個 User Story / PRD 欄位。
- 不可定稿的原因若存在，已明確標成 blocking issue。
