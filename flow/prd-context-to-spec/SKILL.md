---
name: prd-context-to-spec
description: 將已定稿 prd.md 與已凍結 project-context.md 轉成 repo-aware spec.md。當流程位於 Bootstrap Result Gate、Project Context Freeze 之後，需要產生、審查或修補 spec.md、功能規格、驗收條件映射、PRD-to-spec、project-context-to-spec 時必須使用本 skill。
---

# PRD Context To Spec

本 skill 用於 post-bootstrap SDD 流程，將已定稿的產品需求與目前 baseline project 狀態轉成可設計、可開發、可驗收的 `spec.md`。

此 skill 參考 `anthropics/knowledge-work-plugins@feature-spec` 的產品規格寫法，但已針對本專案流程改成固定輸入與固定輸出：

```md
prd.md
+ project-context.md
+ bootstrap-result.json 或 Bootstrap Result Gate summary
-> spec.md
```

## 使用時機

在以下情境使用本 skill：

- Bootstrap Result Gate 已通過，且需要產生 `spec.md`。
- `project-context.md` 已完成 Project Context Freeze。
- 需要把 PRD acceptance criteria 轉成可追溯的 spec requirements。
- 需要檢查或修補 `spec.md` 是否符合 `prd.md` 與 `project-context.md`。
- 後續 agent 要以 `spec.md` 作為 `design.md`、`plan.md`、`task.md` 的共同 contract。

## 必要輸入

產生 `spec.md` 前先讀取：

- `prd.md`
- `project-context.md`
- `bootstrap-result.json` 或等價的 Bootstrap Result Gate summary

必要時再讀取 `project-context.md` 明確引用的 repo evidence，例如：

- `README.md` / `readme.md`
- `AGENTS.md`
- `package.json`、`pyproject.toml`、`requirements.txt`
- API docs、schema docs、migration docs
- 測試、啟動與 verification scripts

## 阻擋條件

遇到以下情況不要臆測產生 spec，改輸出 blocked result：

- 找不到 `prd.md`。
- 找不到 `project-context.md`。
- Bootstrap Result Gate 是 blocked 或缺少通過證據。
- PRD acceptance criteria 無法辨識。
- `prd.md` 與 `project-context.md` 有會改變 scope 的衝突。

blocked output 使用：

```md
# Spec Generation Blocked

## Reason

## Missing Inputs

## Required Next Step
```

## 核心原則

- `prd.md` 是產品意圖來源。
- `project-context.md` 是 baseline project 現況來源。
- `spec.md` 是後續 design、engineering plan、task plan、implementation、verification 的共同 contract。
- 不重新定稿 PRD。
- 不改寫 PRD 意圖。
- 不重新判斷 Brownfield / Greenfield；bootstrap 後統一稱為 baseline project。
- 不重新 scaffold，不重新選技術棧，不新增未確認架構。
- 不憑常識發明 API、DB table、route、env var、script 或 deployment rule。
- 若 PRD 與 project context 衝突，寫入 `Open Questions` 或標記 `decision_required`，不要自行默默選邊。
- 非阻塞但需要暫定的理解寫入 `Assumptions`。
- 每條 PRD acceptance criterion 都必須出現在 `驗收條件映射`。

## spec.md 輸出格式

使用以下固定章節：

```md
# 功能規格

## 目標

## 範圍內

## 不在範圍內

## 使用者故事

## 功能需求

## 非功能需求

## 業務規則

## 資料需求

## API / 整合期望

## 狀態與邊界情境

## 錯誤處理

## 驗收條件映射

## 假設

## 待釐清問題
```

## 章節撰寫規則

### 目標

用 2 到 4 句說明此 feature 的目標。

包含：

- PRD 中的使用者問題或機會。
- 預期使用者可觀察結果。
- PRD 已確認的 business 或 delivery intent。
- 若 baseline project 對目標有限制，簡短指出限制。

避免寫入未確認的工程解法。

### 範圍內

列出本 spec 必須交付的能力。

每個項目要能被 design、engineering、QA 理解與追溯。

### 不在範圍內

列出排除事項、非目標、延後項目與明確不做的內容。

來源包含：

- PRD non-goals。
- PRD scope boundary。
- `project-context.md` constraints。
- Bootstrap 階段明確留下的限制。

### 使用者故事

將 PRD actors 與 scenarios 轉成簡潔 user story：

```md
- As a [actor], I want [capability], so that [outcome].
```

此章只放使用者或 stakeholder 行為。系統規則放到 `業務規則`。

### 功能需求

使用穩定 ID：

```md
### FR-01: [Capability Name]

- Source: PRD section 或 AC reference
- Actor:
- Trigger:
- Preconditions:
- Behavior:
- Success Result:
- Failure / Boundary:
- AC Mapping:
```

撰寫規則：

- 每個 FR 描述一個可獨立驗收的能力或行為。
- 不相關的行為要拆成不同 FR。
- 成功、失敗、權限、管理後台等不同關注點不要混成一條模糊 requirement。
- Behavior 與 Success Result 要可觀察、可測試。
- `AC Mapping` 必須連到 PRD 的 `AC-xx`。

### 非功能需求

只寫 PRD 或 project context 已支持的要求。

可涵蓋：

- Performance
- Accessibility
- Security
- Privacy
- Reliability
- Observability
- Compatibility
- Maintainability
- Localization / content constraints

若沒有已確認要求，寫 `No confirmed requirement`，不要補常識。

### 業務規則

整理跨 UI、API、資料與測試都必須一致的產品規則。

可使用：

```md
- BR-01: ...
```

常見內容：

- eligibility rules
- limits
- validation rules
- state transitions
- pricing、inventory、ownership、permission、workflow rules
- content display rules

### 資料需求

描述資料需求、欄位概念、保存需求、讀寫行為與生命週期。

注意：

- 不發明 table name，除非 project context 已確認。
- 若 PRD 需要資料但 baseline project 尚未確認 persistence layer，寫出資料需求，並把實作形狀放入 `Open Questions` 或 `Assumptions`。
- 分清楚 confirmed data requirements 與 assumptions。

### API / 整合期望

描述功能層級的 API 或 integration expectation。

包含：

- project context 中已存在的 API 或 integration。
- PRD 隱含的新 contract 需求。
- frontend/backend contract。
- request / response 的功能語意。
- auth 或 permission expectation。

除非已確認，不要指定 endpoint path、payload schema、framework implementation。

### 狀態與邊界情境

列出使用者可觀察狀態與邊界情境。

至少考慮：

- Empty state
- Loading state
- Success state
- Error state
- Permission denied state
- Invalid input
- Duplicate action
- Partial failure
- Network / backend failure
- PRD AC 中的 boundary values

### 錯誤處理

定義 failure 如何被呈現或處理。

包含：

- user-visible feedback
- retry behavior
- blocking vs non-blocking failure
- validation messages
- logging / operational expectation，如果 project context 已支持

### 驗收條件映射

每條 PRD `AC-xx` 都必須映射。

使用固定表格：

```md
| PRD AC | Covered By | Spec Requirement | Verification Notes |
| --- | --- | --- | --- |
| AC-01 | FR-01, BR-01 | ... | ... |
```

規則：

- 不可省略任何 PRD AC。
- 若 AC 無法映射，仍要列出，`Covered By` 寫 `Missing` 並說明原因。
- 若一條 AC 對應多個 FR / BR，全部列出。
- Verification Notes 要說明 QA 或 test 如何證明行為成立。

### 假設

放入非阻塞、可日後修正的暫定理解。

每個 assumption 要：

- 明確。
- 可追溯到 PRD 或 project context。
- 不把未確認技術方案偽裝成既定事實。

### 待釐清問題

放入阻塞問題、矛盾或需要使用者決策的事項。

需要決策時使用：

```md
- decision_required: ...
```

問題要具體到主 agent 能一次轉成 `question` tool call。

## 產出前檢查清單

在完成 `spec.md` 前檢查：

- 沒有重新開啟 Brownfield / Greenfield 分支。
- 沒有改寫或重新定稿 PRD 意圖。
- 每條 PRD AC 都在 `驗收條件映射` 中。
- 每條 FR 都可測、可驗收。
- `project-context.md` 的技術棧、scripts、repo constraints 已反映。
- 未確認技術細節沒有被寫成事實。
- 阻塞不確定性在 `Open Questions`。
- 非阻塞不確定性在 `Assumptions`。
- `spec.md` 可以作為後續 `design.md`、`plan.md`、`task.md` 的共同 contract。

## 建議 Spec Review Gate

產生 `spec.md` 後，後續 review agent 應檢查：

- AC 覆蓋率是否 100%。
- FR 是否可驗收。
- 是否存在 PRD / project context 矛盾。
- 是否有未標記的 blocking open question。
- 是否發明未確認 API、資料表、技術棧或 scripts。
- 是否足以交給 UIUX、engineering planning 與 work coordination。
