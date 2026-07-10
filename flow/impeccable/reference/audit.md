# 審查

`audit` 是程式碼層級的 UI 品質審查，不是主觀設計評論。檢查 accessibility、performance、responsive、semantic HTML、interaction states 與 implementation risks。

## 檢查項目

- Accessibility：semantic HTML、labels、focus、keyboard、contrast、ARIA。
- Performance：layout thrashing、heavy animation、image loading、bundle impact。
- Responsive：mobile overflow、touch targets、tablet awkwardness、fixed width/height。
- Interaction：loading、error、disabled、empty、hover/focus/active states。
- Code quality：duplicated styles、hard-coded tokens、z-index chaos、fragile layout。

## 輸出格式

- 審查健康分數：`?/20`
- P0：會阻止使用或造成嚴重錯誤。
- P1：主要使用者會遇到的品質問題。
- P2：重要但不阻塞。
- P3：polish 級別。
- Recommended next commands。

## 完成標準

每個 finding 都要可定位、可修復，並附原因。最後推薦下一步，例如 `/impeccable polish`、`/impeccable adapt` 或 `/impeccable harden`。
