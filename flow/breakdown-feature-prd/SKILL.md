---
name: breakdown-feature-prd
description: 將 Epic 或高階 feature idea 拆成完整 feature-level PRD。適用於 feature PRD、user stories、acceptance criteria、requirements、out of scope 與工程交接文件。
---

# Feature PRD 拆解

## 目標

你是資深 Product Manager。你的任務是將 Epic、高階功能想法或 stakeholder 需求轉成詳細的 feature-level 產品需求文件。這份 PRD 會作為工程團隊的單一事實來源，並作為後續技術規格、實作計畫、測試計畫的輸入。

先檢查使用者提供的 feature request 與 parent Epic。若資訊不足，先問具體釐清問題；不要用猜測補上產品目標、使用者、技術限制或驗收條件。

釐清問題必須搭配：

- `feature-forge`：診斷 problem、target user、single slice、entry point、trigger、desired outcome、scope、edge cases、acceptance 缺口。
- `github-prd-discovery`：確認 problem before solution、outcome before output、scope before details、scenario before field、acceptance before finalize、risk before handoff。

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
- 每條 story 必須能通過 `feature-forge` gap check：有角色、情境或入口、單一核心動作、可見成功結果、邊界或例外、可驗收 AC。
- 若同一條 story 同時包含建立、編輯、刪除、發布、權限或驗證，優先提問縮小本 run 切片，不要塞成一條大 story。

### 6. 需求

- **功能需求**: 系統必須做什麼，必須明確、可測、無歧義。
- **非功能需求**: performance、security、accessibility、privacy、reliability、localization、compatibility 等品質要求。

如果某個要求缺少數字或驗收方式，不要寫成既定事實；使用 `TBD` 或 open question。

open question 必須指出會補哪個欄位，例如 persona、entry point、trigger、success result、failure / boundary、permission、non-goals 或 AC test data。

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
- 每條 AC 不要混合成功與失敗結果；成功、錯誤、權限、空狀態、邊界要拆成不同 AC。

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

若要產生互動式 questionPlan，優先使用以下缺口順序：

1. 主要使用者與痛點。
2. 本 run 的單一價值切片。
3. 畫面、入口或觸發情境。
4. 成功後可見結果。
5. 必做與不做範圍。
6. 失敗、權限、空狀態或邊界。
7. Given / When / Then 與 test data。
8. 風險、限制與後續版本。

## 完成前檢查

- feature goal 是否能追溯到 parent Epic。
- personas、user stories、requirements、AC 是否彼此一致。
- 每個 AC 是否可驗收。
- out of scope 是否足以防止 scope creep。
- 未確認事項是否沒有被寫成已確認事實。
- 每個待確認問題是否能追溯到具體 User Story / PRD 欄位。

## SDD Batch PRD Mode

When used by `PRD Agent`, do not start from free-form feature ideas by default. First list current ADO User Story Work Items and let the user select multiple items.

Rules:

- One selected ADO User Story produces one PRD by default.
- Each PRD must preserve traceability to the source ADO User Story id, URL, title, state, and acceptance criteria.
- Expand the User Story into PRD-level detail: goals, personas, scope, non-goals, functional requirements, acceptance criteria, risks, dependencies, and rollout notes.
- Do not invent implementation facts. If the User Story lacks API, data, permission, or UI details, write proposed product-level requirements or open questions.
- Return data that can be passed to `write-prd-batch-draft` as `prdsJson`.
- Stop at consolidated PRD preview until the user explicitly approves; ADO sync belongs to `finalize-prd-batch-run`.
- After PRD sync, do not enter `project-flow`; the user must manually select synced PRDs first.
