---
name: github-prd-discovery
description: 使用 GitHub awesome-copilot PRD discovery workflow 強化 PRD 提問、問題陳述、成功指標、scope、user stories、acceptance criteria 與 risk analysis。當 User Story 要轉 PRD、PRD 草稿缺 discovery 問題、或 PRD questionPlan 品質不足時使用。
source: github/awesome-copilot@prd
license: MIT
---

# GitHub PRD Discovery

本 skill 由 `github/awesome-copilot@prd` 安裝後整合進本 SDD flow。因本地已存在 `prd` skill，這裡以 `github-prd-discovery` 命名，專門負責 PRD discovery 問題模型與品質標準。

## When To Use

- 從 User Story 轉成 PRD。
- 使用者只有模糊想法，需要轉成可執行產品需求。
- PRD 缺少問題陳述、成功指標、scope、non-goals、user stories、acceptance criteria 或 risk analysis。
- PRD validator 需要產生更好的 `questionPlan`。

## Operational Workflow

### Phase 1: Discovery Interview

寫 PRD 前必須補齊關鍵空白。不要在資訊不足時直接假設。

至少檢查：

- **Core Problem**: 為什麼現在要做？不做的成本是什麼？
- **Target Users**: 誰遇到這個問題？頻率、場景、現有替代方案是什麼？
- **Success Metrics**: 如何知道功能有效？有哪些可量化 KPI 或可驗收結果？
- **Scope**: MVP 必做、延後、不做、相依系統與限制是什麼？
- **Acceptance**: 哪些使用者可見狀態、測試資料、metric、log、demo 能證明完成？

### Phase 2: Analysis And Scoping

- 描述主要 user flow。
- 定義 MVP、v1.1、v2 或後續版本。
- 定義 non-goals，防止 scope creep。
- 找出相依系統、資料、權限、營運、測試與 rollout 風險。
- 對未確認事項標記為 blocking issue、assumption 或 non-blocking open question。

### Phase 3: PRD Drafting Support

本 skill 不直接取代本地 writer。它提供 PRD 草稿品質標準，writer 仍應依本地 `prd` 與 `breakdown-feature-prd` 輸出繁體中文 Markdown。

## PRD Quality Standards

### Requirements Quality

避免「快速」、「好用」、「完整」、「正確」、「直覺」等不可驗收詞。

```diff
# 模糊，不可接受
- 搜尋要很快並回傳相關結果。
- UI 要現代且容易使用。

# 具體，可驗收
+ 10k 筆資料集下，搜尋結果需在 200ms 內回傳。
+ 搜尋結果在 benchmark evals 中需達到 >= 85% Precision@10。
+ UI 需符合既有 design system，且 Lighthouse Accessibility score 達 100%。
```

### Strict PRD Schema Inputs

PRD 至少需要下列資訊可追溯：

- **Executive Summary**: problem statement、proposed solution、success criteria。
- **User Experience & Functionality**: personas、user stories、acceptance criteria、non-goals。
- **AI System Requirements**: 如適用，tools、evaluation strategy、failure handling。
- **Technical Specifications**: 高階 constraints、integration points、security/privacy，不發明實作細節。
- **Risks & Roadmap**: phased rollout、technical risks、product risks。

## Discovery Question Model

產生 PRD question 時，依序檢查：

1. **Problem Before Solution**: 使用者要解決的痛點是什麼？誰受影響？目前怎麼 workaround？
2. **Outcome Before Output**: 成功後使用者行為、業務指標或交付狀態如何改變？
3. **Scope Before Details**: 本次必做、不做、延後、相依、限制是什麼？
4. **Scenario Before Field**: 使用情境、入口、觸發、主要流程、例外情境是否清楚？
5. **Acceptance Before Finalize**: 每個 FR / user story 是否能映射到可測 AC？
6. **Risk Before Handoff**: 權限、隱私、資料、內容、營運、rollout、stakeholder alignment 風險是否已標記？

## SDD QuestionPlan Rules

- 來源 User Story 已確認的內容不要重問。
- 只問會影響 PRD 定稿、FR/AC 可驗收性、scope 或風險的缺口。
- Owner、stakeholders、priority、release target、analytics 若未提供，通常是非阻塞，不應阻擋 PRD 定稿，除非會影響 scope 或驗收。
- 每個問題都要指出會補哪個 PRD 欄位，例如 `FR-01.Entry Point`、`AC-02.Test Data`、`Non-Goals`、`Risks`。
- 若沒有足夠資訊寫完整 PRD，至少問 2 個高影響 clarifying questions；不要直接產定稿。

## Completion Criteria

使用本 skill 後，PRD planner / validator 必須能確認：

- 問題、目標、scope、non-goals 已清楚。
- 每個核心 FR 都有 Actor、Entry Point、Trigger、Behavior、Success Result、Failure / Boundary、Permission、Non-Goals、Acceptance Criteria。
- 每條 AC 都有 Given、When、Then、Test Data。
- 未確認內容沒有被寫成已確認需求。
- blocking open questions 都已轉成 `questionPlan`。
