---
name: prd
description: 產生高品質產品需求文件 PRD，適用於新產品、新功能、AI 功能、需求釐清、user story、acceptance criteria、technical specs、risk analysis 與 roadmap 規劃。
license: MIT
---

# 產品需求文件 PRD

## 概要

本 skill 用於設計 production-grade 的產品需求文件，將商業願景、使用者問題與工程執行需求連接起來。產出的 PRD 應該能成為產品、設計、工程、QA 與 stakeholder 的共同 source of truth。

## 使用時機

在以下情境使用本 skill：

- 開始新的產品或功能開發週期。
- 使用者只有模糊想法，需要轉成可執行需求。
- 需要產生 user stories、acceptance criteria、technical specifications 或 phased roadmap。
- 需要定義 AI-powered feature 的工具需求、評估方式與風險。
- 使用者要求「寫 PRD」、「產需求文件」、「整理產品需求」、「規劃功能」、「寫 user story」。

## 作業流程

### Phase 1: Discovery Interview

寫 PRD 前先補齊關鍵空白。不要在資訊不足時直接假設。

至少釐清：

- 核心問題：現在為什麼要做？不做的成本是什麼？
- 目標使用者：誰遇到這個問題？頻率與情境是什麼？
- 成功指標：如何知道功能有效？有哪些可量化 KPI？
- 範圍限制：時程、預算、技術棧、相依系統、法規、安全、資料限制。
- 非目標：這次明確不做什麼？哪些需求延後？

若使用者已提供充分背景，可以只問缺失的 2 到 5 個關鍵問題；不要為了流程而重複訪談已明確的內容。

### Phase 2: Analysis And Scoping

整理使用者輸入並找出隱性複雜度。

- 描述主要 user flow。
- 分離 MVP、v1.1、v2.0 或後續版本。
- 定義 non-goals，防止 scope creep。
- 找出相依系統、資料、權限、營運、測試與 rollout 風險。
- 對未確認事項標記 `TBD` 或列入 open questions。

### Phase 3: Technical Drafting

依照下方固定 schema 產出 PRD。語句要可測、可追溯、可交付。

## PRD 品質標準

### 需求品質

使用具體、可衡量條件。避免只寫「快速」、「好用」、「直覺」、「現代」。

```diff
# 模糊，不可接受
- 搜尋要很快並回傳相關結果。
- UI 要現代且容易使用。

# 具體，可驗收
+ 10k 筆資料集下，搜尋結果需在 200ms 內回傳。
+ 搜尋演算法在 benchmark evals 中需達到 >= 85% Precision@10。
+ UI 需符合既有 design system，且 Lighthouse Accessibility score 達 100%。
```

### Traceability

- 每個 user story 都要能連到問題、persona 或 business goal。
- 每個 acceptance criterion 都要能用測試、人工 QA、log、metric 或 demo 證明。
- 技術限制要標明來源：使用者提供、repo evidence、既有架構、法規或暫定假設。

## PRD 輸出結構

必須使用以下章節。

### 1. 執行摘要

- **問題陳述**: 1 到 2 句說明痛點與影響。
- **解法摘要**: 1 到 2 句說明解法。
- **成功條件**: 3 到 5 個可衡量 KPI 或驗收結果。

### 2. 使用者體驗與功能

- **使用者角色**: 誰會使用？角色、情境、痛點。
- **使用者故事**: 使用 `As a [user], I want to [action], so that [benefit].`。
- **驗收條件**: 每個 story 或主要 requirement 的 done definition。
- **非目標**: 本次不做、延後或明確排除的事項。

### 3. AI 系統需求（如適用）

- **工具需求**: 需要哪些 tools、APIs、retrieval、資料來源或 MCP。
- **評估策略**: 如何評估輸出品質、正確性、安全性、穩定性。
- **失敗處理**: hallucination、低信心、工具失敗、資料不足時怎麼處理。

### 4. 技術規格

- **架構概覽**: 高階資料流與元件互動，不寫過早實作細節。
- **整合點**: API、DB、auth、external services、events。
- **安全與隱私**: 資料處理、權限、稽核、合規。
- **營運需求**: observability、rollout、migration、support runbook，如果適用。

### 5. 風險與 Roadmap

- **分階段推出**: MVP -> v1.1 -> v2.0 或等價分期。
- **技術風險**: latency、cost、dependency、data quality、migration、security。
- **產品風險**: adoption、confusing UX、metric ambiguity、stakeholder alignment。

## 實作指引

### 必須做

- 先補齊 discovery gaps，再寫 PRD。
- 對 AI 系統明確定義 eval、品質指標與安全邊界。
- 用具體數字或可驗收行為取代模糊形容詞。
- 產出 draft 後，請使用者針對 scope、metrics、acceptance criteria、non-goals 回饋。

### 避免

- 不要在沒有足夠資訊時直接產完整 PRD。
- 不要發明使用者沒確認的技術棧、API、DB、預算或 deadline。
- 不要把 feature list 當成 PRD；必須有問題、目標、使用者、驗收與風險。

## 範例片段

### 1. Executive Summary

**Problem**: 開發者在大型 repository 中難以快速找到正確文件片段，導致查找時間過長且容易引用錯誤內容。

**Solution**: 建立支援自然語言問題的智能搜尋系統，回傳帶來源引用的直接答案。

**Success**:

- 將平均搜尋時間降低 50%。
- 引用正確率 >= 95%。
- 90% 常見問題可在一次互動內取得可用答案。

### 2. User Stories

- Story: As a developer, I want to ask natural language questions, so that I do not have to guess exact keywords.
- AC:
  - 支援多輪釐清。
  - 回傳答案必須包含來源引用。
  - 代碼片段需提供可複製格式。

### 3. AI 系統需求

- Tools Required: `codesearch`、`grep`、`webfetch` 或等價 repo/document retrieval。
- Benchmark: 使用 50 個常見開發者問題測試。
- Pass Rate: 90% 回答需符合 expected citation set。
