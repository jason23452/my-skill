# 原生適配

`adapt.native` 用於 native app 在 phone、tablet、foldable、desktop-like context 之間的適配。

## 原則

- 重構，不要拉伸。把 phone UI 放大到 tablet 是失敗模式。
- iOS 使用 size classes；Android 使用 window size classes。
- 大螢幕應考慮 split view、master-detail、多欄 grid、popover。
- 手機 sheet 到大螢幕可改 popover 或 side panel。

## 驗證

- phone portrait / landscape。
- tablet split view。
- foldable 或 resizable window。
- keyboard、screen reader、Reduce Motion。

## 完成標準

每個 native context 都像為該裝置設計，而不是縮放同一畫面。
