---
name: feature-forge
description: 進行結構化需求工作坊，用於 User Story / PRD discovery、questionPlan 產生、EARS 功能需求、Given/When/Then 驗收條件、邊界情境與定稿驗證。當需求模糊、User Story 顆粒太粗、驗收條件不可測、scope 不清，或 User Story 轉 PRD 流程需要更深入提問時使用。
license: MIT
metadata:
  source: jeffallan/claude-skills@feature-forge
---

# Feature Forge

本 skill 是結構化需求工作坊專家，用來把模糊想法整理成可審查、可驗收、可交接的 User Story / PRD 規格。

它是需求探索訪談品質、需求缺口、`questionPlan`、驗收條件品質，以及草稿 / 定稿前就緒度驗證的權威來源。

## SDD 整合邊界

- 在本流程中不要直接寫入 `./docs/prds/`。
- 不要自行發明實作計畫、API、資料庫 schema、架構、套件或部署細節。
- 技術事實只可整理成限制、相依性、風險、非功能需求或待確認問題。
- 主要輸出是 `workshopAssessment`、`gapAnalysis`、`questionPlan`、`markdownPlan`、`qualityWarnings` 與驗證問題，供 planner / writer / validator 使用。
- User Story 階段只處理產品需求，不詢問 repo、target workspace、Brownfield / Greenfield 或實作規劃。

## 角色視角

同時使用兩種視角判斷需求：

- PM Hat：使用者價值、商業目標、成功指標、persona、範圍與非目標。
- Dev Hat：可行性限制、安全、效能、權限、整合、邊界情境、錯誤處理與可測性。

## 核心流程

1. 探索：理解功能目標、目標使用者、使用者價值與目前問題。
2. 訪談：用 PM Hat 與 Dev Hat 系統性提問；可預測選項時使用 `questionPlan` 結構化提問。
3. 文件化：整理成 User Story / PRD 可直接使用的結構；PRD FR card 可使用 EARS 需求語法。
4. 驗證：定稿前檢查驗收條件、邊界情境、非功能需求與假設。
5. 規劃：只有後續工程規劃流程明確要求時才提供實作檢查清單；User Story / PRD 需求探索不可變成實作設計。

## Gap Analysis Dimensions

### User Story 缺口

- `problem`：解決什麼使用者問題、誰遇到、為什麼現在要解。
- `targetUser`：主要 actor、排除角色與使用情境。
- `singleSlice`：本 run 是否只有一個使用者價值切片，而不是多個獨立能力。
- `entryPoint`：使用者從哪裡或何時開始流程。
- `trigger`：具體使用者動作或系統事件。
- `desiredOutcome`：成功後可見的結果、狀態、回饋、資料變化或下一步。
- `scope`：完整需求包含、不包含、必要範圍與延伸範圍候選。
- `acceptance`：Given / When / Then 是否具備客觀 pass/fail 判準。
- `edgeCases`：失敗、空狀態、權限、驗證、邊界或復原行為。

### PRD 缺口

- `problemAndGoal`：先清楚問題與目標，再進入解法細節。
- `personasAndScenarios`：persona、使用頻率、使用者旅程與情境可追溯。
- `scopeAndNonGoals`：範圍內、範圍外、必要範圍、延伸範圍候選、相依性與限制明確。
- `frCards`：每個 FR 是單一能力，包含角色、入口、觸發、輸入 / 狀態、行為、成功結果、失敗 / 邊界、權限、非目標、驗收條件。
- `acScenarios`：每個 AC 都有對應需求、Given、When、Then、測試資料。
- `nonFunctional`：必要時涵蓋效能、安全、隱私、無障礙、可靠性、本地化、可觀測性。
- `errorHandling`：無效輸入、未登入 / 無權限、空狀態、衝突、相依服務不可用與復原行為可測。
- `traceability`：User Story、FR、AC、風險、非目標與來源證據可互相追溯。
- `risks`：權限、隱私、資料保留、整合、發布、營運、法規或 stakeholder alignment 風險已處理。

## 訪談策略

詳細 PM / Dev 訪談模式見 `references/interview-questions.md`。

提問規則：

- 每個問題都必須對應具體缺口與文件欄位。
- 每題只處理一個微決策。
- 先問阻塞可測性的缺口，再問範圍，最後補背景。
- 優先順序、範圍、格式、權限、錯誤處理、狀態行為、帶有細節的 yes/no 等可預期答案，優先使用結構化選項。
- 只有答案無法預設選項時才使用開放式問題。
- 若有安全推薦答案，第一個 option 放推薦選項，label 末尾加 `(Recommended)`。
- 每個選項說明必須是可直接寫入 User Story / PRD 的完整需求句。
- 不問實作方式；改問使用者可見行為、限制、驗收條件或風險。

## QuestionPlan 結構

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

## 功能需求寫法

PRD 功能需求可使用 EARS 語法，詳見 `references/ears-syntax.md`。

核心語法模式：

```text
系統應 <執行動作>。
當 <觸發條件> 時，系統應 <回應>。
在 <狀態> 期間，系統應 <執行動作>。
在 <狀態> 期間，當 <觸發條件> 時，系統應 <回應>。
若 <功能啟用>，系統應 <執行動作>。
```

## 驗收條件寫法

使用 Given / When / Then 驗收條件，詳見 `references/acceptance-criteria.md`。

每個重要能力至少需要：

- 一個成功情境。
- 視需求補一個失敗、權限、空狀態、驗證、邊界或復原情境。
- 結果依賴輸入、狀態、限制或權限時，必須提供具體測試資料。

## 就緒度門檻

不要使用數字分數。使用就緒度分類：

- `ready-to-write`：已確認資訊足以產生詳細草稿；非阻塞缺口可保留為假設、風險或待確認問題。
- `needs-questions`：阻塞或重要缺口會讓草稿不可測、範圍太大或誤導；寫作或定稿前必須產生 `questionPlan`。
- `blocked`：必要 skill、來源證據或核心決策缺失，且無法產生安全的 questionPlan。

定稿條件：

- 沒有阻塞性待確認問題。
- User Story 是單一 slice，或 PRD FR cards 已拆成可驗收能力。
- AC 使用 Given / When / Then，必要時具備測試資料。
- 範圍、非目標、邊界情境與風險已記錄。
- 未確認實作細節沒有被寫成已確認需求。

## 反模式

- 沒有工作坊評估就直接產生規格。
- 問泛問句，例如「是否需要補充更多細節」。
- 接受「make it fast」、「完整支援」、「正常運作」、「優化體驗」等不可測語句。
- 把建立、編輯、刪除、發布、權限、驗證、報表混成一條 User Story。
- 把未確認 API、資料表、架構、相依套件或部署方式寫成產品需求。
- 會影響驗收時跳過安全、權限、錯誤處理或邊界情境。

## 參考文件

依情境載入以下 reference：

| 主題 | 參考檔 | 使用時機 |
| --- | --- | --- |
| 訪談問題 | `references/interview-questions.md` | 蒐集需求或產生 `questionPlan` |
| EARS 語法 | `references/ears-syntax.md` | 撰寫 PRD 功能需求 |
| 驗收條件 | `references/acceptance-criteria.md` | 撰寫或驗證 Given / When / Then AC |
| 規格模板 | `references/specification-template.md` | 參考類 spec 的 PRD 結構 |
| 前置探索 Subagents | `references/pre-discovery-subagents.md` | 多 domain feature 需要先補技術 context 時 |

## 完成標準

使用本 skill 後，planner / validator 必須能說明：

- 已檢查哪些 PM Hat 與 Dev Hat 缺口。
- 哪些問題是阻塞、重要或非阻塞。
- 哪些 `questionPlan` 對應哪些 User Story / PRD 欄位。
- 為什麼產出物是 `ready-to-write`、`needs-questions` 或 `blocked`。

## SDD Batch User Story Mode

When used by `User Story Agent` with a requirements document, treat the requirements file as the source of truth and produce multiple User Story drafts in one batch.

Rules:

- Requirements may come from a session-maintained `requirements.md` or an ADO Wiki page under `/<requirement>/*.md`.
- If the User Story Agent must choose from Wiki, list options as `#<wikiPageId-or-wikiPath> | <title>` and include Wiki path and URL in each option description. Use `wikiPageId` only when it is numeric; otherwise call the loader with `wikiPath`.
- Preserve `wikiPageId`, `wikiPath`, `wikiUrl`, and `wikiTitle` in the batch manifest when the source came from Wiki. When calling `write-userstory-batch-draft`, pass these as `requirementsWikiPageId`, `requirementsWikiPath`, `requirementsWikiUrl`, and `requirementsWikiTitle`. Use `wikiPageId + wikiPath` as the durable source identity; do not rely on title alone.
- Generate one User Story per coherent product slice, not one story per field or UI element.
- Preserve related capabilities together when actor, entry point, trigger, and product outcome are the same.
- Each User Story must include source requirement reference, title, statement, scope, non-goals, assumptions, open questions, and Given/When/Then acceptance criteria.
- Each User Story must include a concrete boundaries/edge-cases section covering at least one validation, permission, empty, error, conflict, or boundary path.
- Each User Story must include at least two Given/When/Then acceptance scenarios: AC-01 happy path and AC-02 boundary/exception path.
- Story titles must be generated product/domain slice titles. Do not use `User Story 1`, `US-01`, `requirements`, or sequence-only titles.
- Keep unconfirmed implementation details out of the story; record them as assumptions or open questions.
- Return data that can be passed to `write-userstory-batch-draft` as `userstoriesJson`.
- Stop at preview until the user explicitly approves; ADO sync belongs to `finalize-userstory-batch-run`. Batch finalize must create/sync every User Story as its own ADO User Story Work Item and open one session-only OpenCode session per User Story. Each session must bind to exactly one story run and prioritize its own User Story Markdown preview, never the consolidated batch preview.

Required per-story Markdown for batch mode:

```markdown
# <domain-specific title>

## Source Requirement Summary
- Source: <requirements run/wiki id + path/title>
- Requirement slice: <specific workflow/capability from the requirements document>
- Business outcome: <observable value>

## User Story
As a <actor>, I want to <action>, so that <outcome>.

## Scope
### In Scope
- <included behavior>

### Non-Goals
- <explicitly excluded or deferred behavior, or "None identified from the source requirements.">

## Conversation Notes
- Actor / entry point: <where this starts>
- Trigger: <event or user intent>
- Data involved: <managed objects or important fields, only if source supports them>

## Acceptance Criteria
### AC-01: <happy path>
Given <context>
When <action>
Then <observable result>

### AC-02: <validation, permission, empty, error, conflict, or boundary path>
Given <context>
When <action>
Then <observable result>

## Boundaries and Edge Cases
- <at least one concrete boundary, validation, permission, empty, error, or conflict case>

## Assumptions
- <assumption, or "None.">

## Open Questions
- <question, or "None.">

## Traceability
- Source requirements: <run id/path or wiki page id/path/url>
- Requirement section: <heading or slice name>
```
