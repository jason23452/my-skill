# 流動式版面與排版

流動式設計使用相對單位與 CSS 函數，在不同寬度間平滑縮放，減少大量 media queries，讓介面更自然。

## 流動式字級

使用 `clamp(min, preferred, max)` 建立字級範圍。

```css
:root {
  --text-sm: clamp(0.875rem, 0.84rem + 0.18vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-xl: clamp(1.5rem, 1.1rem + 2vw, 2.5rem);
  --text-hero: clamp(2.5rem, 1.4rem + 5vw, 5.5rem);
}
```

規則：

- 內文字級手機不要低於 16px。
- Hero max 不要大到造成 tablet/mobile overflow。
- 長標題使用 `text-wrap: balance`。
- 正文行長控制在 65 到 75ch。

## 流動式間距

spacing 也應隨 viewport 或 container 調整。

```css
:root {
  --space-xs: clamp(0.5rem, 0.45rem + 0.25vw, 0.75rem);
  --space-m: clamp(1rem, 0.8rem + 1vw, 1.75rem);
  --space-xl: clamp(2rem, 1.2rem + 4vw, 5rem);
}
```

使用方式：

```css
.section {
  padding-block: var(--space-xl);
  padding-inline: var(--space-m);
}
```

## 流動式容器寬度

```css
.container {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}

.narrow {
  width: min(100% - 2rem, 42rem);
}
```

不要寫死 `width: 1200px`。應使用 `max-width`、`min()` 或 `clamp()`。

## CSS Grid 流動式版面

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
  gap: var(--space-m);
}
```

這讓 grid 在空間不足時自然變單欄，不需要手寫每個 breakpoint。

## Aspect Ratio

```css
.media {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

@media (max-width: 40rem) {
  .media { aspect-ratio: 4 / 3; }
}
```

圖片可裁切，但不可扭曲。重要人物、產品或文字不應被裁掉。

## Flexbox 流動式 Patterns

### Cluster

適合 tag、actions、button group。

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}
```

### Switcher

空間足夠時左右排列，不足時自動堆疊。

```css
.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-m);
}

.switcher > * {
  flex: 1 1 22rem;
}
```

## 驗證

- 在 320px 到 1440px 之間拖曳 viewport，觀察是否平滑。
- 檢查字級是否在最小與最大值間合理。
- 檢查 spacing 是否有節奏，不是手機太擠、桌機太散。
- 檢查圖片、卡片、表格與 CTA 在不同寬度下是否仍清楚。
