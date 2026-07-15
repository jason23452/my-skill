---
name: github-prd-discovery
description: 使用 GitHub awesome-copilot PRD discovery workflow 強化 PRD 提問、問題陳述、成功指標、scope、user stories、acceptance criteria 與 risk analysis。當 User Story 要轉 PRD、PRD 草稿缺 discovery 問題、或 PRD questionPlan 品質不足時使用。
license: MIT
metadata:
  source: github/awesome-copilot@prd
---

# GitHub PRD Discovery

本 skill 是 PRD discovery 問題模型的權威。它不取代本地中文 writer，但 PRD 的問題設計、scope 判斷、成功指標、AC 與風險補洞必須依它執行；不可 fallback 到舊內建 PRD 提問模板。

## Discovery Workflow

### Phase 1: Discovery Interview

寫 PRD 前必須補齊關鍵空白。不要在資訊不足時直接假設。

至少檢查：

- **Core Problem**: 為什麼現在要做？不做的成本是什麼？
- **Target Users**: 誰遇到這個問題？頻率、場景、現有替代方案是什麼？
- **Success Metrics**: 如何知道功能有效？有哪些可量化 KPI 或可驗收結果？
- **Scope**: 必要範圍、延伸範圍候選、不做、相依系統與限制是什麼？
- **Acceptance**: 哪些使用者可見狀態、測試資料、metric、log、demo 能證明完成？

### Phase 2: Analysis And Scoping

- 描述主要 user flow。
- 定義必要範圍、延伸範圍候選與明確排除事項。
- 定義 non-goals，防止 scope creep。
- 找出相依系統、資料、權限、營運、測試與 rollout 風險。
- 對未確認事項標記為 blocking issue、assumption 或 non-blocking open question。

## PRD Discovery Question Model

產生 PRD question 時，必須依序檢查：

1. **Problem Before Solution**: 使用者要解決的痛點是什麼？誰受影響？目前怎麼 workaround？
2. **Outcome Before Output**: 成功後使用者行為、業務指標或交付狀態如何改變？
3. **Scope Before Details**: 本次必做、不做、延後、相依、限制是什麼？
4. **Scenario Before Field**: 使用情境、入口、觸發、主要流程、例外情境是否清楚？
5. **Acceptance Before Finalize**: 每個 FR / user story 是否能映射到可測 AC？
6. **Risk Before Handoff**: 權限、隱私、資料、內容、營運、rollout、stakeholder alignment 風險是否已標記？

## PRD Quality Standards

- 避免「快速」、「好用」、「完整」、「正確」、「直覺」等不可驗收詞。
- 來源 User Story 已確認的內容不要重問。
- 只問會影響 PRD 定稿、FR/AC 可驗收性、scope 或風險的缺口。
- Owner、stakeholders、priority、release target、analytics 若未提供，通常是非阻塞，不應阻擋 PRD 定稿，除非會影響 scope 或驗收。
- 每個問題都要指出會補哪個 PRD 欄位，例如 `FR-01.Entry Point`、`AC-02.Test Data`、`Non-Goals`、`Risks`。

## Completion Criteria

使用本 skill 後，PRD planner / validator 必須能確認：

- 問題、目標、scope、non-goals 已清楚。
- 每個核心 FR 都有 Actor、Entry Point、Trigger、Behavior、Success Result、Failure / Boundary、Permission、Non-Goals、Acceptance Criteria。
- 每條 AC 都有 Given、When、Then、Test Data。
- 未確認內容沒有被寫成已確認需求。
- blocking open questions 都已轉成 `questionPlan`。
