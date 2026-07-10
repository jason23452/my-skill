# Optimize

`optimize` 用於診斷與修復 UI performance 問題。

## 檢查項目

- LCP、CLS、INP、TTI。
- 圖片大小、lazy loading、font loading。
- layout thrashing、昂貴動畫、過度 re-render。
- bundle size、第三方 script、unused CSS。
- 大表格、長列表、虛擬化。

## 流程

1. 先量測或讀現有 performance evidence。
2. 找出使用者可感知的卡頓或延遲。
3. 優先修最高影響問題。
4. 保留視覺品質，不用粗暴移除所有 polish。

## 完成標準

UI 更快、更穩，且改善可被測量或合理驗證。
