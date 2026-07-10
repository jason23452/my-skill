# Adapt

`adapt` 用於將既有設計適配到不同螢幕、裝置、輸入方式或使用情境。

## 流程

1. 確認 source context：原本為桌機、手機、平板或其他平台設計。
2. 確認 target context：viewport、input method、network、使用時間與任務密度。
3. 找出不能直接縮放的部分。
4. 重新規劃 layout、navigation、content priority、interaction。
5. 實作並驗證。

## 策略

- 手機：單欄、touch target、progressive disclosure。
- 平板：split view、master-detail、two-column hybrid。
- 桌機：多欄、完整 nav、hover states，但不可依賴 hover。
- Email 或窄嵌入：保守寬度、簡化互動。

## 完成標準

每個 context 都像原生設計，不是把同一畫面硬縮放。
