---
name: prd-context-to-spec
description: 將已定稿 prd.md 與已凍結 project-context.md 轉成 repo-aware spec.md。當流程位於 Bootstrap Result Gate、Project Context Freeze 之後，需要產生、審查或修補 spec.md、Feature Spec、Acceptance Criteria Mapping、PRD-to-spec、project-context-to-spec 時必須使用本 skill。
---

# PRD Context To Spec

本 skill 用於 post-bootstrap SDD 流程，將已定稿的產品需求與目前 baseline project 狀態轉成可設計、可開發、可驗收的 `spec.md`。

固定資料流：

```md
prd.md
+ project-context.md
+ bootstrap-result.json 或 Bootstrap Result Gate summary
-> spec.md
```

## 必要輸入

- `prd.md`
- `project-context.md`
- `bootstrap-result.json` 或等價的 Bootstrap Result Gate summary

必要時再讀取 `project-context.md` 明確引用的 repo evidence，例如 README、AGENTS、scripts、API docs、schema docs、migration docs。

## 輸出位置

`spec.md` 必須寫在 `prd.md` 同一個 PRD run artifact 目錄。

不可寫到：

- repo root
- `targetProjectRoot`
- `targetCodeProjectRoot`
- 其他 planning folder

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
- 每條 PRD acceptance criterion 都必須出現在 `Acceptance Criteria Mapping`。
- `spec.md` 必須使用繁體中文撰寫。固定 ID（例如 FR-01、AC-01）、表格欄位代號、API method/path、JSON key、檔案路徑、指令與專有技術名稱可保留英文。

## spec.md 固定章節

```md
# 功能規格

## 目標

## 範圍內

## 範圍外

## 使用者故事

## 功能需求

## 非功能需求

## 業務規則

## 資料需求

## API / 整合期望

## 狀態與邊界案例

## 錯誤處理

## 驗收條件映射

## 假設

## 待確認問題
```

## 功能需求格式

使用穩定 ID：

```md
### FR-01：[能力名稱]

- 來源：PRD section 或 AC reference
- 角色：
- 觸發：
- 前置條件：
- 行為：
- 成功結果：
- 失敗 / 邊界：
- AC 映射：
```

每個 FR 只描述一個可獨立驗收的能力或行為。Behavior 與 Success Result 必須可觀察、可測試。

## Acceptance Criteria Mapping

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

## Assumptions 與 Open Questions

- `Assumptions` 放入非阻塞、可日後修正的暫定理解。
- `Open Questions` 可放非阻塞但需要追蹤的未知事項。
- `project-context.md` 若指出 baseline repo 未找到既有 endpoint、route、DB table、permission code 或 response shape evidence，且 PRD 是新增或擴充功能，這不是 blocking。必須在 `spec.md` 產生 proposed/new contract，並標註「新增契約」或「proposed」，不可寫成既有事實。
- 只有 PRD 明確要求沿用既有 API/data/permission contract、外部整合 contract、或 project context 顯示既有 repo reality 互相衝突時，才把缺口升級為 blocking `decision_required:`。
- 新功能的 proposed API、資料欄位、狀態值、permission code 與 verification notes 應該由 spec 定義到足以開發與驗收；不要把這類設計責任退回 Project Context Freeze。
- 只有會影響 scope、business rule、data/API contract、error handling、states、AC mapping、implementation 或 verification 的問題才視為 blocking。
- blocking 問題必須使用 `decision_required:`，讓 `spec-review-gate` 轉成使用者 question。
- 非阻塞 Open Questions 不需要詢問使用者，可留待後續追蹤。

## 產出前檢查清單

- 沒有重新開啟 Brownfield / Greenfield 分支。
- 沒有改寫或重新定稿 PRD 意圖。
- `spec.md` 寫在 `prd.md` 同一個 artifact 目錄。
- 每條 PRD AC 都在 `Acceptance Criteria Mapping` 中。
- 每條 FR 都可測、可驗收。
- `project-context.md` 的技術棧、scripts、repo constraints 已反映。
- 未確認技術細節沒有被寫成事實。
- 阻塞不確定性在 `Open Questions`。
- blocking Open Questions 都標記 `decision_required:`。
- 非阻塞不確定性在 `Assumptions`。
