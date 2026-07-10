# 使用 Subagents 進行前置探索

只有在 feature discovery 需要先取得技術事實，再詢問 stakeholder 時使用。

## 使用時機

- Feature 橫跨三個以上層面，例如 auth、database、UI、integration 或 file handling。
- 既有 codebase pattern 不明。
- 安全、隱私或營運限制可能改變需求。

## 不使用時機

- User Story 階段只需要產品 discovery。
- Feature 是單一切片，主要未知點是產品行為。
- 目前 agent permission 禁止 task 或 repo exploration。

## 執行模式

1. 找出受影響 domains。
2. 在權限允許時啟動 read-only subagents。
3. 將事實發現作為限制或風險放入 `questionPlan`。
4. 問使用者決策，不要猜實作方式。
