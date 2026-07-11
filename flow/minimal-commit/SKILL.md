---
name: minimal-commit
description: >
  小步、原子化 git commit workflow。當使用者要求「最小 commit」、「小步 commit」、
  「每改一小部分就 commit」、「atomic commit」、「幫我 commit」、「commit my changes」、
  或需要把目前改動拆成多個可 review 的 commits 時必須使用。會檢查 diff、只 stage
  單一 logical change、執行必要驗證，並用 ADO work item id 前綴產生 Conventional
  Commits message：#ADO_ID type(scope): summary。
---

# Minimal Commit

把改動拆成最小、可驗證、可 review 的 git commits。每個 commit 只代表一個 logical change，commit message 必須短、準、符合專案規則。

## 觸發時機

使用者要求以下任一情境時使用：

- 「最小 commit」、「小步 commit」、「atomic commit」
- 「每改一小部分就 commit」、「改完一段就 commit」
- 「幫我 commit」、「commit my changes」、「create commits」
- 使用者要求整理目前 dirty worktree 成乾淨 commit history
- 任務實作中完成一個小且可驗證的改動，需要立即保存

## 核心原則

- 一次只 commit 一個 logical change。
- 不混合 feature、bugfix、formatting、refactor、docs、test、config changes。
- 不碰不相關 dirty changes；如果同檔案有混合 hunk，只 stage 相關 hunk。
- 每個 commit 前要知道自己準備提交什麼；不要盲目 `git add -A`。
- Commit 前執行最小必要驗證；如果無法驗證，要在回覆中說明。
- 不使用 `--no-verify`，除非使用者明確要求。
- 不 amend，除非使用者明確要求。
- 不 push，除非使用者明確要求。
- 絕不使用 destructive command，例如 `git reset --hard` 或 `git checkout -- <file>`，除非使用者明確要求。

## 必要輸入

Commit message 前面一定要有 Azure DevOps work item id。

格式：

```text
#<ado-workitem-id> <type>(<scope>): <summary>
```

範例：

```text
#1234 fix(auth): 修正 token 過期判斷
```

如果使用者沒有提供 ADO work item id，先問：

```text
請提供這次 commit 要關聯的 ADO work item id，例如 1234。
```

不要猜測、不要省略、不要用 placeholder commit。

## Workflow

### 1. 檢查 repo 狀態

執行並閱讀：

```bash
git status --short
git diff
git diff --staged
git log --oneline -10
```

完成條件：知道目前有哪些 unstaged/staged changes、是否有既有 staged changes、最近 commit message 風格。

### 2. 分組 logical changes

把改動分成最小 logical groups，例如：

- 單一 bugfix
- 單一 feature slice
- 單一 refactor
- 對應該改動的測試
- 文件更新
- formatting-only change
- build/config change

完成條件：每個 group 可以用一句話描述，且可以獨立 review。

如果改動混雜，先列出 commit plan，然後依序處理：

```text
Commit plan:
1. #1234 fix(auth): 修正 token 過期判斷
2. #1234 test(auth): 補 token 過期測試
```

### 3. Stage 單一 group

優先只 stage 相關檔案：

```bash
git add <file1> <file2>
```

若同一檔案包含多個 logical changes，使用非互動方式產生 patch、檢查 patch，再 apply 到 index；不要使用互動 console 卡住流程。

可用策略：

```bash
git diff <file> > <temp-patch>
```

手動編輯 patch 後：

```bash
git apply --cached <temp-patch>
```

如果 patch 風險高或無法安全拆 hunk，停止並問使用者要不要接受整檔 stage 或先手動拆改動。

完成條件：`git diff --staged` 只包含當前 logical group。

### 4. 驗證

根據改動類型執行最小必要驗證：

- 測試改動：跑相關 test
- 前端改動：跑相關 lint/typecheck/test，或專案現有最小驗證命令
- 後端改動：跑相關 unit test/typecheck/migration check
- 文件-only：通常不需要測試，但可檢查格式或連結

如果找不到驗證命令，檢查 README、package scripts、專案慣例；仍找不到就明確回報未執行驗證原因。

完成條件：驗證通過，或使用者同意在已知風險下 commit。

### 5. 寫 commit message

Subject 格式：

```text
#<ado-workitem-id> <type>(<scope>): <summary>
```

Type 使用：

- `feat`: 新功能
- `fix`: bugfix
- `refactor`: 不改行為的重構
- `perf`: 效能改善
- `docs`: 文件
- `test`: 測試
- `chore`: 維護雜項
- `build`: build/dependency changes
- `ci`: CI config
- `style`: formatting-only
- `revert`: revert 既有 commit

Summary 規則：

- 中文用短動詞開頭：`新增`、`修正`、`移除`、`調整`、`重構`
- 英文用 imperative mood：`add`、`fix`、`remove`
- 盡量 <=50 字元，硬上限 72 字元；不含 `#<ado-workitem-id>`
- 結尾不要句點
- 不重複 diff 已經清楚說明的細節

Body 只在必要時加入：

- breaking changes
- security fixes
- data migrations
- revert commits
- why 不明顯

不要加入：

- `Generated with Claude Code` 或 AI attribution，除非專案規則要求
- emoji，除非專案慣例要求
- `This commit does...`、`I`、`we`、`now`、`currently`

### 6. Commit

先確認 staged diff：

```bash
git diff --staged
```

再提交：

```bash
git commit -m "#1234 fix(auth): 修正 token 過期判斷"
```

需要 body 時使用多個 `-m`，避免 heredoc 或 subshell：

```bash
git commit -m "#1234 fix(auth): 修正 token 過期判斷" -m "舊邏輯會讓剛過期的 token 多通過一次驗證。"
```

完成條件：commit 成功，且 remaining changes 只包含其他未處理 groups 或原本不相關 dirty changes。

### 7. 重複到乾淨或停止

如果還有其他 logical groups，回到步驟 3。每個 group 都要重新確認 staged diff 與驗證需求。

停止條件：

- 所有目標改動都已 commit
- 剩下的 changes 是不相關 user changes
- 驗證失敗且需要先修
- 缺少 ADO work item id
- 同檔案 hunk 無法安全拆分，需要使用者決策

## 回覆格式

完成後用短回覆列出：

```text
Created commits:
- <sha> #1234 fix(auth): 修正 token 過期判斷
- <sha> #1234 test(auth): 補 token 過期測試

Verification:
- npm test -- auth: passed

Remaining changes:
- none
```

如果未完成，說明 blocker 與下一步，不要假裝已 commit。

## Safety Notes

- 如果 worktree 一開始已有使用者改動，不要 revert 或覆蓋。
- 如果 staged area 一開始已有內容，先檢查它是否屬於本次 commit；不確定就問。
- 如果 hook 修改檔案，重新檢查 `git status` 與 `git diff`，只 re-stage hook 修改且屬於當前 group 的內容。
- 如果 commit 失敗，修正原因後建立新 commit；不要 amend failed commit。
