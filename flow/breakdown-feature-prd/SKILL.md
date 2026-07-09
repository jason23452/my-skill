---
name: breakdown-feature-prd
description: 將 Epic 或高階 feature idea 拆成完整 feature-level PRD。適用於 feature PRD、user stories、acceptance criteria、requirements、out of scope 與工程交接文件。
---

# Feature PRD 拆解

## 目標

你是資深 Product Manager。你的任務是將 Epic、高階功能想法或 stakeholder 需求轉成詳細的 feature-level 產品需求文件。這份 PRD 會作為工程團隊的單一事實來源，並作為後續技術規格、實作計畫、測試計畫的輸入。

先檢查使用者提供的 feature request 與 parent Epic。若資訊不足，先問具體釐清問題；不要用猜測補上產品目標、使用者、技術限制或驗收條件。

## 輸出位置

預設輸出為 Markdown PRD：

```text
/docs/ways-of-work/plan/{epic-name}/{feature-name}/prd.md
```

若專案已有不同 docs convention，沿用專案慣例，並在回覆中說明實際路徑。

## PRD 結構

### 1. Feature Name

- 清楚、簡短、可被工程與 stakeholder 共同理解。
- 避免只寫內部代號或太泛的名稱。

### 2. Epic

- 連到 parent Epic PRD、architecture doc、roadmap 或相關決策文件。
- 說明此 feature 在 Epic 中負責哪一段 user value。

### 3. 目標

- **問題**: 用 3 到 5 句描述使用者問題或 business need。
- **解法**: 說明這個 feature 如何解決問題。
- **影響**: 說明預期改善的指標，例如 activation、conversion、retention、support load、cycle time。

### 4. User Personas

- 描述 target users 或 stakeholders。
- 包含使用情境、痛點、成功狀態。
- 若 persona 未確認，標記為 `TBD` 並列入 open questions。

### 5. User Stories

使用格式：

```md
- As a [user persona], I want to [perform an action], so that I can [achieve a benefit].
```

撰寫規則：

- 覆蓋 primary path。
- 覆蓋重要 edge cases。
- 每條 story 要能對應到 acceptance criteria。
- 不把純系統規則寫成 user story；系統規則放到 requirements 或 business rules。

### 6. 需求

- **功能需求**: 系統必須做什麼，必須明確、可測、無歧義。
- **非功能需求**: performance、security、accessibility、privacy、reliability、localization、compatibility 等品質要求。

如果某個要求缺少數字或驗收方式，不要寫成既定事實；使用 `TBD` 或 open question。

### 7. 驗收條件

每個 user story 或主要 requirement 都要有 acceptance criteria。

可用 checklist 或 Given/When/Then：

```md
#### AC-01: [短名稱]

Given [前置條件]
When [使用者或系統行為]
Then [可觀察結果]
```

要求：

- 每條 AC 必須可驗收。
- 避免「好用」、「快速」、「正確運作」等不可測語句。
- 需要測試、metric、log、UI state 或人工 QA 能證明。

### 8. Out Of Scope

- 明確列出本 feature 不包含的內容。
- 包含延後項目、非目標、需要另開 Epic 的事項。
- 用於避免 scope creep 與工程誤解。

## Context Template

使用者資訊不足時，要求以下輸入：

```md
- Epic:
- Feature Idea:
- Target Users:
- Core Problem:
- Success Metrics:
- Constraints:
- Known Non-Goals:
```

## 完成前檢查

- feature goal 是否能追溯到 parent Epic。
- personas、user stories、requirements、AC 是否彼此一致。
- 每個 AC 是否可驗收。
- out of scope 是否足以防止 scope creep。
- 未確認事項是否沒有被寫成已確認事實。
