# EARS Syntax

EARS 是 Easy Approach to Requirements Syntax，用來讓需求更清楚、無歧義且可測。

## Patterns

```text
系統應 <執行動作>。
當 <觸發條件> 時，系統應 <回應>。
在 <狀態> 期間，系統應 <執行動作>。
在 <狀態> 期間，當 <觸發條件> 時，系統應 <回應>。
若 <功能啟用>，系統應 <執行動作>。
```

## 使用情境

- Ubiquitous：永遠適用。
- Event-driven：由動作或事件觸發。
- State-driven：當某個狀態為 true 時適用。
- Conditional：狀態加觸發條件。
- Optional：feature flag 或設定路徑。

## 範例

```markdown
**FR-001: 加入項目**
在使用者已選擇有效項目時，當使用者點擊加入，
系統應加入該項目並更新可見數量。

**FR-002: 無效輸入**
當使用者送出無效輸入時，
系統應阻擋送出並顯示具體錯誤訊息。
```
