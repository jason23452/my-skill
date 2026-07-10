# Harden

`harden` 用於把 UI 補到 production-ready：錯誤、空狀態、邊界條件、i18n、權限與慢網路。

## 流程

1. 列出 happy path 以外的狀態。
2. 補 loading、error、empty、disabled、success、permission denied、offline/slow network。
3. 檢查長字串、多語系、數字格式、日期格式。
4. 檢查 destructive actions、undo、confirmation。
5. 驗證 keyboard、screen reader、responsive。

## 完成標準

UI 在異常與邊界條件下仍清楚、安全、可恢復。
