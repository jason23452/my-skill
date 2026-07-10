# 原生審查

`audit.native` 是 native app 的程式碼層級 UI audit。不要使用 browser tooling 或 web detector。

## 檢查項目

- iOS / Android platform conventions。
- Accessibility：VoiceOver / TalkBack、labels、focus order、Dynamic Type。
- Safe area、system bars、keyboard handling。
- Responsive native layout：size classes / window size classes。
- Motion 與 Reduce Motion。
- Loading、error、empty、disabled states。

## 輸出

- 審查健康分數：`?/20`
- P0/P1/P2/P3 findings。
- 每個 finding 附檔案、原因、修正方向。
- 推薦下一步 command。

## 完成標準

報告能讓 native engineer 直接修正，不是泛泛而談。
