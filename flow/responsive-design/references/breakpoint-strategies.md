# 斷點策略

斷點應由內容與任務決定，不是由裝置名稱決定。先完成 mobile-first baseline，再在內容真的需要時增加斷點。

## 行動優先做法

預設樣式就是手機版：

```css
.layout {
  display: grid;
  gap: 1rem;
}

@media (min-width: 48rem) {
  .layout {
    grid-template-columns: 16rem 1fr;
  }
}
```

優點：

- 手機載入較少 override。
- 先確保最受限制情境可用。
- 往大螢幕增強，比桌機版硬縮小更穩定。

## 常見斷點起點

這些只是起點，不是規則：

```css
/* base: mobile (< 40rem) */
@media (min-width: 40rem) { /* large phone / small tablet */ }
@media (min-width: 48rem) { /* tablet */ }
@media (min-width: 64rem) { /* desktop */ }
@media (min-width: 80rem) { /* wide desktop */ }
```

## Content-Driven Breakpoints

加 breakpoint 前先問：

- 文字行長是否過長或過短？
- 卡片是否太窄或太鬆？
- sidebar 是否有足夠空間？
- table 是否仍可讀？
- primary action 是否仍明顯？
- 圖片比例是否仍支持內容？

只有答案指出 layout 壞掉時才加 breakpoint。

## 設計 Token 整合

把 breakpoint 與 container width 放進 token，避免散落在各檔。

```css
:root {
  --bp-sm: 40rem;
  --bp-md: 48rem;
  --bp-lg: 64rem;
  --container-lg: 72rem;
}
```

若使用 JS hook，名稱要與 CSS tokens 對齊，不要兩套數值。

## 常見策略

### App Shell

- mobile：top bar + drawer 或 bottom nav。
- tablet：collapsed sidebar。
- desktop：expanded sidebar + content region。

### Card Grid

- mobile：單欄。
- tablet：雙欄。
- desktop：三欄或更多，但卡片最小寬度不可低於內容需求。

### Data Table

- mobile：card list 或 horizontal scroll。
- tablet：隱藏低優先欄位。
- desktop：完整 table。

## 避免

- desktop-first 後再硬塞手機。
- 只因為框架有 `md/lg/xl` 就加斷點。
- 用 device detection 取代 feature detection。
- 忽略 landscape tablet。
- 同一元件在不同容器只靠 viewport breakpoint。

## 驗證

- 320px、375px、430px、768px、1024px、1440px。
- 手機直向與橫向。
- 長文字、無圖片、多資料、空狀態。
- keyboard navigation 與 touch target。
