# Animate

`animate` 用於加入有目的的 motion。動效必須說明關係、提供回饋、引導注意或建立節奏，不是裝飾。

## 流程

1. 找出需要 motion 的狀態變化。
2. 定義每個 animation 的目的。
3. 選擇 CSS transition、keyframes、motion library 或 scroll trigger。
4. 設定 duration、easing、stagger 與 reduced motion fallback。
5. 驗證效能與可及性。

## 規則

- feedback 100-200ms。
- state/layout change 200-300ms。
- modal/page transition 300-500ms。
- exit 通常比 enter 快。
- 優先動畫化 `transform`、`opacity`。
- 必須支援 `prefers-reduced-motion`。

## 避免

- bounce / elastic 濫用。
- 動畫化 `width`、`height`、`top`、`left`。
- 讓內容預設不可見等待 JS 觸發。
- 每個 section 都套同一進場效果。
