---
name: planning-and-task-breakdown
description: 將工作拆解成有順序的任務。當你已經有 spec 或明確需求，並需要拆成可實作任務時使用。當任務太大而難以下手、需要估算範圍，或可以平行分工時也使用。
---

# 規劃與任務拆解

## 總覽

將工作拆解成小型、可驗證的任務，並為每個任務定義明確的驗收條件。好的任務拆解，是 agent 能穩定完成工作的關鍵；沒有拆解，實作很容易變成一團糾結的改動。每個任務都應該小到可以在單一專注 session 內完成實作、測試與驗證。

## 何時使用

- 已經有 spec，需要拆成可實作單位
- 任務太大或太模糊，難以直接開始
- 工作需要分配給多個 agent 或多個 session 平行處理
- 需要向人類清楚溝通 scope
- 實作順序不明顯

**不適用情境：** 單一檔案且範圍明確的改動，或 spec 已經包含定義良好的任務。

## 規劃流程

### 步驟 1：進入規劃模式

寫任何程式碼之前，先以唯讀模式工作：

- 閱讀 spec 與相關程式碼區域
- 辨識既有 patterns 與 conventions
- 映射 components 之間的 dependency
- 記錄風險與未知事項

**規劃期間不要寫程式碼。** 產出應該是儲存在 `tasks/plan.md` 的規劃文件，以及儲存在 `tasks/todo.md` 的任務清單，而不是實作。

### 步驟 2：辨識相依關係圖

映射哪些東西依賴哪些東西：

```
Database schema
    │
    ├── API models/types
    │       │
    │       ├── API endpoints
    │       │       │
    │       │       └── Frontend API client
    │       │               │
    │       │               └── UI components
    │       │
    │       └── Validation logic
    │
    └── Seed data / migrations
```

實作順序應依照 dependency graph 從基礎往上建立：先做 foundation。

### 步驟 3：垂直切片

不要先完成整個資料庫、再完成整個 API、再完成整個 UI。改成一次完成一條可運作的 feature path：

**不佳做法（水平切片）：**
```
Task 1: Build entire database schema
Task 2: Build all API endpoints
Task 3: Build all UI components
Task 4: Connect everything
```

**較佳做法（垂直切片）：**
```
Task 1: User can create an account (schema + API + UI for registration)
Task 2: User can log in (auth schema + API + UI for login)
Task 3: User can create a task (task schema + API + UI for creation)
Task 4: User can view task list (query + API + UI for list view)
```

每個 vertical slice 都應交付可運作、可測試的功能。

### 步驟 4：撰寫任務

每個任務使用以下結構：

```markdown
## Task [N]: [簡短描述性標題]

**Description:** 用一段文字說明這個任務要完成什麼。

**Acceptance criteria:**
- [ ] [具體、可測試的條件]
- [ ] [具體、可測試的條件]

**Verification:**
- [ ] Tests pass: `npm test -- --grep "feature-name"`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: [要手動驗證的內容]

**Dependencies:** [此任務依賴的 task 編號，或 "None"]

**Files likely touched:**
- `src/path/to/file.ts`
- `tests/path/to/test.ts`

**Estimated scope:** [Small: 1-2 files | Medium: 3-5 files | Large: 5+ files]
```

### 步驟 5：排序與檢查點

安排任務順序時需符合：

1. Dependency 已被滿足，也就是先建立 foundation
2. 每個任務完成後，系統都仍維持可運作狀態
3. 每 2 到 3 個任務後有 verification checkpoint
4. 高風險任務要排在前面，盡早暴露問題

加入明確 checkpoint：

```markdown
## Checkpoint: After Tasks 1-3
- [ ] All tests pass
- [ ] Application builds without errors
- [ ] Core user flow works end-to-end
- [ ] Review with human before proceeding
```

## 任務大小指南

| Size | Files | Scope | Example |
|------|-------|-------|---------|
| **XS** | 1 | 單一 function 或 config change | Add a validation rule |
| **S** | 1-2 | 單一 component 或 endpoint | Add a new API endpoint |
| **M** | 3-5 | 單一 feature slice | User registration flow |
| **L** | 5-8 | 多 component feature | Search with filtering and pagination |
| **XL** | 8+ | **太大，應進一步拆分** | - |

如果任務是 L 或更大，應該再拆成更小的任務。Agent 最適合處理 S 與 M 大小的任務。

**需要進一步拆分的情境：**

- 需要超過一個專注 session 才能完成，大約超過 2 小時 agent 工作
- 無法用 3 個以內的 bullet 描述 acceptance criteria
- 會碰到兩個以上彼此獨立的 subsystem，例如 auth 與 billing
- 任務標題中出現「以及」，通常代表它其實是兩個任務

## 輸出檔案

- **Plan document:** 將 implementation plan 儲存到 `tasks/plan.md`。
- **Task list:** 將 checklist-style task list 儲存到 `tasks/todo.md`。

如果 `tasks/` 目錄不存在，請建立它。這些路徑是 `/build` command 與其他下游工具預期使用的慣例。

## Plan Document Template

```markdown
# Implementation Plan: [Feature/Project Name]

## Overview
[用一段文字摘要要建立的內容]

## Architecture Decisions
- [關鍵決策 1 與原因]
- [關鍵決策 2 與原因]

## Task List

### Phase 1: Foundation
- [ ] Task 1: ...
- [ ] Task 2: ...

### Checkpoint: Foundation
- [ ] Tests pass, builds clean

### Phase 2: Core Features
- [ ] Task 3: ...
- [ ] Task 4: ...

### Checkpoint: Core Features
- [ ] End-to-end flow works

### Phase 3: Polish
- [ ] Task 5: ...
- [ ] Task 6: ...

### Checkpoint: Complete
- [ ] All acceptance criteria met
- [ ] Ready for review

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | [High/Med/Low] | [Strategy] |

## Open Questions
- [需要人類輸入的問題]
```

## 平行化機會

當有多個 agent 或 session 可用時：

- **可以安全平行處理：** 獨立 feature slices、已實作功能的測試、文件
- **必須循序處理：** Database migrations、shared state changes、dependency chains
- **需要協調：** 共享 API contract 的功能。先定義 contract，再平行處理

## 常見自我合理化

| Rationalization | Reality |
|---|---|
| "I'll figure it out as I go" | 這通常會造成糾結的改動與返工。10 分鐘規劃可以節省數小時。 |
| "The tasks are obvious" | 還是寫下來。明確任務會暴露隱藏 dependency 與被遺漏的 edge cases。 |
| "Planning is overhead" | 規劃就是任務本身。沒有 plan 的 implementation 只是打字。 |
| "I can hold it all in my head" | Context window 有限。書面 plan 可以跨 session 與 compaction 保存。 |

## Red Flags

- 沒有書面 task list 就開始 implementation
- 任務只寫「implement the feature」，但沒有 acceptance criteria
- Plan 裡沒有 verification steps
- 所有任務都是 XL size
- 主要 phases 之間沒有 checkpoints
- 沒有考慮 dependency order

## Verification

開始 implementation 前，確認：

- [ ] 每個 task 都有 acceptance criteria
- [ ] 每個 task 都有 verification step
- [ ] Task dependencies 已辨識，且排序正確
- [ ] 沒有 task 會碰到超過約 5 個檔案
- [ ] 主要 phases 之間有 checkpoints
- [ ] Human 已 review 並 approve plan

## 另見

Acceptance criteria 是 task-level，用來回答「我們是否建對了東西？」它位於 project-wide Definition of Done 之上，也就是每個任務被視為完成前都必須達到的常設標準。請參考 `references/definition-of-done.md`。
