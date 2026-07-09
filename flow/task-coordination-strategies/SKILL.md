---
name: task-coordination-strategies
description: 拆解複雜任務、設計 dependency graph、協調多 agent 工作、撰寫清楚 task description 與平衡工作量。當需要拆分工作、管理 blockers、派發 agent team 或監控進度時使用。
version: 1.0.2
source: https://github.com/wshobson/agents/tree/main/plugins/agent-teams/skills/task-coordination-strategies
---

# 任務協調策略

本 skill 提供複雜任務拆解、平行化設計、dependency graph、task description 與 workload monitoring 策略。

## 使用時機

- 將複雜任務拆成可平行執行的單位。
- 設計 `blockedBy` / `blocks` dependency relationships。
- 撰寫包含 acceptance criteria 的 task description。
- 監控與重新平衡多位 teammate 或 subagent 的工作量。
- 找出 multi-task workflow 的 critical path。

## 任務拆解策略

### By Layer

依架構層拆分：

- Frontend components
- Backend API endpoints
- Database migrations/models
- Test suites

適合：full-stack features、vertical slices。

### By Component

依功能元件拆分：

- Authentication module
- User profile module
- Notification module

適合：microservices、modular architectures。

### By Concern

依橫切關注點拆分：

- Security review
- Performance review
- Architecture review

適合：code reviews、audits。

### By File Ownership

依檔案或目錄 ownership 拆分：

- `src/components/`: Implementer 1
- `src/api/`: Implementer 2
- `src/utils/`: Implementer 3

適合：平行實作、降低 merge conflict。

## Dependency Graph 設計

### 原則

1. **降低 chain depth**: 優先使用寬而淺的 graph，避免過深序列。
2. **找出 critical path**: 最長 dependency chain 決定最短完成時間。
3. **節制使用 blockedBy**: 只加入真正必要的 dependency。
4. **避免 circular dependency**: Task A block B，同時 B block A 會造成 deadlock。

### Patterns

**Independent，最佳平行度**:

```text
Task A --\
Task B ----> Integration
Task C --/
```

**Sequential，必要序列**:

```text
Task A -> Task B -> Task C
```

**Diamond，混合模式**:

```text
        /-> Task B --\
Task A -              -> Task D
        \-> Task C --/
```

### 使用 blockedBy / blocks

```text
TaskCreate: { subject: "Build API endpoints" }         -> Task #1
TaskCreate: { subject: "Build frontend components" }    -> Task #2
TaskCreate: { subject: "Integration testing" }          -> Task #3
TaskUpdate: { taskId: "3", addBlockedBy: ["1", "2"] }  -> #3 waits for #1 and #2
```

## 任務描述最佳實務

每個 task 應包含：

1. **Objective**: 1 到 2 句說明要完成什麼。
2. **Owned Files**: 明確列出可修改的檔案或目錄。
3. **需求**: 具體 deliverables 或預期行為。
4. **Interface Contracts**: 此 task 如何與其他 teammate 的工作銜接。
5. **驗收條件**: 如何確認完成且正確。
6. **Scope Boundaries**: 明確 out of scope。

### Template

```md
## 目標

建立使用者登入 API endpoints。

## 擁有檔案

- src/api/auth.ts
- src/api/middleware/auth-middleware.ts
- src/types/auth.ts (shared - read only, do not modify)

## 需求

- POST /api/login: 接收 email/password，回傳 JWT。
- POST /api/register: 建立新使用者並回傳 JWT。
- GET /api/me: 回傳目前使用者 profile，需要 auth。

## 介面契約

- 從 src/types/auth.ts 匯入 User type，由 implementer-1 擁有。
- 匯出 AuthResponse type 給 frontend 使用。

## 驗收條件

- 所有 endpoints 回傳正確 HTTP status codes。
- JWT tokens 24 小時後過期。
- 密碼使用 bcrypt hash。

## 不在範圍內

- OAuth/social login
- Password reset flow
- Rate limiting
```

## Workload Monitoring

### 失衡訊號

| Signal | Meaning | Action |
| --- | --- | --- |
| Teammate idle, others busy | 工作分配不均 | 重新分派 pending tasks |
| Teammate stuck on one task | 可能有 blocker | 主動檢查並協助排除 |
| All tasks blocked | Dependency 設計有問題 | 先解 critical path |
| One teammate has 3x others | 單人過載 | 拆分或重新分派 |

### 重新平衡步驟

1. 呼叫 `TaskList` 評估目前狀態。
2. 找出 idle 或 overloaded teammates。
3. 使用 `TaskUpdate` 重新分派 tasks。
4. 使用 `SendMessage` 通知受影響 teammate。
5. 追蹤 throughput 是否改善。
