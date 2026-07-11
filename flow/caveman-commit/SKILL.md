---
name: caveman-commit
description: >
  極簡 commit message 產生器。移除 commit message 裡的廢話，同時保留意圖與必要原因。
  使用 Conventional Commits 格式。Subject 前綴 ADO work item id，summary 盡量 ≤50 字元，只有「原因」不明顯時才寫 body。
  當使用者說「寫 commit」、「commit message」、「產生 commit」、「幫我下 commit」、
  「最小 commit」、「精簡 commit」、"write a commit", "commit message", "generate commit",
  "/commit"，或呼叫 /caveman-commit 時使用。看到 staged changes 時也應自動觸發。
---

寫出短、準、可讀的 commit message。遵守 Conventional Commits。不要廢話。優先說明 why，不重複 diff 已經說明的 what。

## 規則

**Subject line：**
- `#<ado-workitem-id> <type>(<scope>): <imperative summary>`，`<scope>` 可省略
- Commit message 前面一定要加 Azure DevOps work item id，例如 `#1234 fix(auth): 修正 token 過期判斷`
- 如果使用者沒有提供 ADO work item id，先詢問，不要自行猜測或省略
- Type 使用：`feat`、`fix`、`refactor`、`perf`、`docs`、`test`、`chore`、`build`、`ci`、`style`、`revert`
- 英文 summary 用祈使語氣：`add`、`fix`、`remove`，不要用 `added`、`adds`、`adding`
- 中文 summary 用短動詞開頭：`新增`、`修正`、`移除`、`調整`、`重構`
- Summary 盡量 ≤50 字元，硬上限 72 字元；不含前面的 `#<ado-workitem-id>`
- 結尾不要句點
- 冒號後大小寫跟隨專案既有慣例

**Body（只有需要時才寫）：**
- Subject 已足夠自明時，不要寫 body
- 只在以下情況寫 body：不明顯的 *why*、breaking changes、migration notes、linked issues
- 英文 body 每行約 72 字元換行；中文 body 保持短句、易讀即可
- 條列用 `-`，不要用 `*`
- Issue/PR reference 放最後：`Closes #42`、`Refs #17`

**絕對不要放：**
- `This commit does X`、`I`、`we`、`now`、`currently`，diff 已經說明 what
- 「依照使用者要求...」，若需要歸屬請用 `Co-authored-by` trailer
- `Generated with Claude Code` 或任何 AI attribution，除非使用者或專案規則要求 `Assisted-by` / AI attribution trailer
- Emoji，除非專案慣例要求
- Scope 已經說明時，不要重複檔名

## 範例

Diff：新增 user profile endpoint，body 說明原因
- 錯：`feat: add a new endpoint to get user profile information from the database`
- 錯：`feat(api): add GET /users/:id/profile`
- 對：
  ```
  #128 feat(api): add GET /users/:id/profile

  Mobile client needs profile data without the full user payload
  to reduce LTE bandwidth on cold-launch screens.

  Closes #128
  ```

Diff：breaking API change
- 對：
  ```
  #128 feat(api)!: rename /v1/orders to /v1/checkout

  BREAKING CHANGE: clients on /v1/orders must migrate to /v1/checkout
  before 2026-06-01. Old route returns 410 after that date.
  ```

Diff：中文 commit message
- 對：
  ```
  #128 fix(auth): 修正 token 過期判斷

  舊邏輯會讓剛過期的 token 多通過一次驗證，造成登出狀態不一致。
  ```

## Auto-Clarity

以下情況一定要寫 body：breaking changes、security fixes、data migrations、任何 revert 既有 commit 的變更。不要壓成只有 subject，未來 debug 需要上下文。

## 邊界

只產生 commit message。不執行 `git commit`，不 stage files，不 amend。輸出可直接貼上的 code block。使用者說「停止 caveman-commit」、「normal mode」或「恢復正常」時，改回較完整的 commit style。
