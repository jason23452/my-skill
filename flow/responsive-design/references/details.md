# 響應式設計細節

本文件提供 `responsive-design` 的實作細節。保留 CSS 屬性、API 與 code 名稱英文，其餘說明使用繁體中文。

## 核心能力

### 1. 容器查詢

使用 container queries 讓元件依照自身容器尺寸改變，而不是只看 viewport。適合 card、widget、sidebar 內元件、modal 內容與可重用 component。

完成標準：同一元件放在窄欄與寬欄時都能自動調整，不需要知道所在頁面的整體寬度。

```css
.card-list {
  container-type: inline-size;
}

@container (min-width: 36rem) {
  .card {
    display: grid;
    grid-template-columns: 12rem 1fr;
  }
}
```

### 2. 流動式字級與間距

使用 `clamp()` 讓字級與間距在最小值與最大值之間平滑縮放，減少硬切 breakpoint。

```css
:root {
  --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --step-3: clamp(2rem, 1.4rem + 3vw, 4rem);
  --space-l: clamp(1.5rem, 1rem + 2vw, 3rem);
}
```

完成標準：手機不太小、桌機不過大，標題不 overflow。

### 3. 版面 Patterns

- 一維排列用 Flexbox。
- 二維版面用 CSS Grid。
- 卡片列表優先用 `repeat(auto-fit, minmax(min(18rem, 100%), 1fr))`。
- 需要欄位對齊時用 Grid；只需要換行時用 Flexbox。

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}
```

### 4. 斷點策略

不要先背裝置尺寸。先從窄版開始，逐步拉寬，當內容開始壞掉時才加 breakpoint。

常見斷點可作起點，但不是規則：

```css
/* base: mobile */
@media (min-width: 40rem) { /* small tablet */ }
@media (min-width: 48rem) { /* tablet */ }
@media (min-width: 64rem) { /* desktop */ }
@media (min-width: 80rem) { /* wide */ }
```

## 常見元件策略

### Navigation

- 手機：drawer、bottom nav 或 compact menu。
- 平板：compact horizontal nav 或 collapsible sidebar。
- 桌機：完整 sidebar / top nav，label 可完整顯示。
- 不要讓關鍵操作只存在 hover menu。

### Tables

- 資料少：手機改成 cards。
- 欄位多：允許水平捲動，但要 sticky first column 或清楚 affordance。
- 欄位有優先級：手機只顯示主欄位，次要欄位折疊到 details。

### Forms

- 手機單欄。
- 桌機可雙欄，但相關欄位要保持 proximity。
- error message 放在欄位附近，不只放頁頂。
- submit button 在手機上要容易觸及且不被鍵盤遮住。

## 驗證清單

- 375px 沒有非預期水平捲動。
- 768px 版面不尷尬，不只是放大的手機版。
- 1024px 以上善用寬度，但行長不超過可讀範圍。
- 主要 touch target 至少 44x44px。
- 固定 header/footer 不遮住內容。
- modal、popover、dropdown 在小螢幕不被裁切。
- 圖片保持比例，重要內容不被錯誤裁切。
- keyboard focus order 符合視覺順序。
