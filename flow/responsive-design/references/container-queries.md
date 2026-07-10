# 容器查詢深入指南

容器查詢讓元件根據自身容器尺寸調整，而不是根據整個 viewport。這對 component library、dashboard widget、card、sidebar 內容與嵌入式 UI 很重要。

## 何時使用

- 同一元件會出現在不同寬度容器。
- viewport 很寬，但元件所在欄位很窄。
- 元件需要可重用，不應知道頁面 layout。
- dashboard、split pane、sidebar、modal、card grid。

## 基本語法

```css
.component-shell {
  container-type: inline-size;
}

@container (min-width: 32rem) {
  .component {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

只需要寬度判斷時優先用 `inline-size`，不要用較重的 `size`。

## 命名容器

當頁面有多個 container，使用命名避免 query 套錯對象。

```css
.product-card-region {
  container: product-card / inline-size;
}

@container product-card (min-width: 40rem) {
  .product-card {
    grid-template-columns: 16rem 1fr;
  }
}
```

## 容器查詢單位

- `cqw`：container width 的 1%。
- `cqh`：container height 的 1%。
- `cqi`：container inline size 的 1%。
- `cqb`：container block size 的 1%。
- `cqmin`：`cqi` 與 `cqb` 較小者。
- `cqmax`：`cqi` 與 `cqb` 較大者。

```css
.card-title {
  font-size: clamp(1rem, 4cqi, 1.5rem);
}
```

## 常見 Pattern

### Card 從堆疊變左右排列

```css
.card-wrap { container-type: inline-size; }

.card { display: grid; gap: 1rem; }

@container (min-width: 36rem) {
  .card {
    grid-template-columns: 12rem 1fr;
    align-items: center;
  }
}
```

### Widget 依容器寬度切換密度

```css
.metric-widget { container-type: inline-size; }

@container (max-width: 24rem) {
  .metric-secondary { display: none; }
}

@container (min-width: 42rem) {
  .metric-widget { grid-template-columns: repeat(3, 1fr); }
}
```

## 效能注意事項

- 不要過度巢狀 container。
- 優先使用 `container-type: inline-size`。
- 避免在大量列表每個小元素都設 container。
- query 條件以 layout 需求為主，不要把它當狀態管理。

## 測試方式

- 在不同父容器寬度下測試同一元件。
- 測試 sidebar、modal、main content、grid item 內的呈現。
- 檢查文字變長、圖片缺失、資料過多時是否仍可用。
