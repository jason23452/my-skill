# Craft

`craft` 用於從確認過的 UX/UI 方向一路做到 production-grade 前端實作。

## 流程

1. 先執行或引用 `shape`，取得確認過的設計 brief。
2. 讀取專案現有 CSS、tokens、components、routing 與 icon system。
3. 根據任務需要讀取相關 reference：`typeset`、`animate`、`colorize`、`adapt`、`clarify`。
4. 實作前確認 visual direction、content、states、responsive 行為。
5. 修改實際前端檔案。
6. 驗證 desktop、tablet、mobile、keyboard、reduced motion、loading/error/empty states。

## 禁止事項

- 沒有確認方向就直接寫 code。
- 引入第二套 icon、component 或 design system，除非有必要。
- 只做靜態 happy path。
- 用 placeholder 取代使用者需要的真實內容結構。

## 完成標準

輸出可執行、可審查、可驗收，且符合既有專案慣例與設計 brief。
