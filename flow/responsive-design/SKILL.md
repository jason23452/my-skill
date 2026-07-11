---
name: responsive-design
description: 建立、修復或審查 responsive layout、mobile-first UI、container queries、fluid typography、CSS Grid、Flexbox、breakpoints、responsive images、adaptive navigation、responsive tables 時必須使用。使用者提到 RWD、響應式、手機版跑版、桌機/平板/手機排版、水平捲動、版面溢出、斷點、container query、fluid spacing、clamp() 或不同螢幕尺寸 UI 時使用。
---

# 響應式設計

本 skill 用於設計、實作與審查現代響應式介面。目標不是只加幾個 media queries，而是讓同一個 UI 在手機、平板、桌機、大螢幕、觸控、滑鼠、不同文字長度與不同內容量下都能保持可讀、可操作與穩定。

## 何時使用

必須使用於以下任務：

- 建立 mobile-first responsive layouts。
- 修復手機版跑版、水平捲動、內容溢出、按鈕太小、卡片擠壓或表格爆版。
- 使用 container queries 做 component-level responsiveness。
- 建立 fluid typography、fluid spacing、`clamp()` scale。
- 使用 CSS Grid、Flexbox、subgrid、auto-fit / auto-fill 建立自適應版面。
- 設計 breakpoint strategy，不依賴固定裝置尺寸。
- 實作 responsive images、media、picture/source、不同 DPR 圖片策略。
- 建立 adaptive navigation、mobile menu、sidebar collapse、responsive tables。
- 審查前端 UI 是否在 375px、768px、1024px、1440px 等常見寬度正常。

不需要使用於純後端、資料庫、API、CLI、非視覺邏輯或完全不影響畫面的變更。

## 詳細參考

詳細 pattern 與範例在 `references/details.md`。當本文件的快速規則不足時，必須讀取該檔。

可按需求讀取：

- `references/container-queries.md`：component-level responsiveness 與 container query patterns。
- `references/fluid-layouts.md`：fluid typography、fluid spacing、`clamp()` 與 intrinsic layout。
- `references/breakpoint-strategies.md`：content-based breakpoints 與斷點設計。

## 工作流程

### 0. 先界定 responsive scope

若任務是整體系統排版、admin/dashboard、app shell、route hierarchy、`design/ui-layout.md` 或多頁 frontend system，不可只檢查單一頁面。先建立 system-level responsive contract：

- desktop shell：sidebar、rail、top nav、tabs、secondary panel、action bar 的預設排列。
- tablet shell：sidebar 是否收斂、panel 是否轉 drawer、table/list/detail 是否重新分層。
- mobile shell：navigation 入口、content order、sticky primary action、safe area、drawer/sheet 使用方式。
- page template behavior：dashboard、list、detail、form、settings、empty/error/loading 在不同寬度的排列。
- data-dense behavior：table、filter、pagination、bulk action、row action、detail panel 如何在窄螢幕保留可操作性。

完成條件：能描述整個 frontend system 在 375px、768px、1024px、1440px 的 layout 行為，而不是只說「mobile 單欄」。

### 1. 先判斷 responsive 問題類型

從需求、截圖、程式碼或現有畫面判斷：

- viewport 問題：手機、平板、桌機、大螢幕哪個尺寸壞掉。
- content 問題：文字太長、圖片比例、表格欄位、卡片數量、空狀態、資料密度。
- interaction 問題：touch target、hover-only behavior、sticky header、drawer、modal、dropdown。
- layout 問題：固定寬度、固定高度、grid columns、flex wrapping、overflow、z-index。
- typography 問題：字太小、行長過長、標題斷行差、不同語言文字長度。

完成條件：能指出 responsive 風險在哪個 breakpoint、哪個元件、哪種內容條件下發生。

### 2. 採用 mobile-first 基線

先讓最小合理寬度可用，再向上增強：

- 內容預設單欄、可捲動、可閱讀。
- touch target 至少 44x44px。
- body text 在手機上通常不得低於 16px。
- 表單欄位、主要 CTA、重要資訊在手機上不可被 sidebar 或裝飾擠掉。
- 不依賴 hover 才能看到關鍵資訊或操作。

完成條件：375px 左右寬度下沒有水平捲動，主要任務可完成。

### 3. 用內容決定斷點

不要只用裝置名決定斷點。當內容開始擠壓、行長過長、卡片密度失衡、表格不可讀時才加斷點。

常見策略：

- 單欄 → 雙欄 → 多欄。
- mobile bottom nav / hamburger → tablet compact sidebar → desktop full sidebar。
- card list → responsive grid。
- table → card stack、horizontal scroll with sticky first column、或欄位優先級摺疊。

完成條件：每個 breakpoint 都有內容理由，不只是照框架預設尺寸。

### 4. 優先使用 intrinsic layout

優先使用會自然適應內容的 CSS：

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}
```

常用原則：

- 一維排列用 Flexbox，二維排列用 Grid。
- 能用 `gap` 就不要用子元素 margin 拼 spacing。
- 避免固定 `width`；使用 `max-width`、`min()`、`max()`、`clamp()`、百分比或 intrinsic sizing。
- 避免 `height: 100vh` 造成 mobile browser chrome 問題；視情況用 `100dvh`、`min-height` 或安全區域。
- 圖片與影片使用 `aspect-ratio`、`object-fit`，避免拉伸。

完成條件：版面能因內容與容器寬度自然調整，而不是依靠大量脆弱斷點。

### 5. 使用 container queries 處理元件級響應

當同一元件會出現在不同寬度容器中，不要只依賴 viewport media query。使用 container queries 讓元件根據自身容器調整。

適合情境：

- dashboard widgets。
- cards 在 sidebar、main content、modal 中都會出現。
- reusable component library。
- responsive tables / charts / forms。

完成條件：元件在窄容器與寬容器中都能獨立適配，不需要知道整個頁面 viewport。

### 6. 檢查常見失敗模式

交付前檢查：

- 沒有水平捲動，除非是刻意設計且有清楚 affordance 的資料表。
- 固定寬度不會讓內容超出 viewport。
- sticky / fixed 元素不會遮住內容。
- modal、popover、dropdown 在小螢幕不會被 clipping。
- 圖片不變形，重要裁切區域不被切掉。
- 字級、行高、行長在手機與桌機都可讀。
- 互動元素在觸控裝置可點、間距足夠。
- `prefers-reduced-motion`、安全區域與鍵盤 focus 不被破壞。

完成條件：至少檢查手機、平板、桌機三種寬度，並記錄主要風險或修正。

## 輸出要求

回覆或產物應包含：

- responsive 問題摘要。
- mobile / tablet / desktop 行為。
- 使用的 layout strategy：Flexbox、Grid、container query、fluid type、breakpoints。
- 需要修改的 CSS / component / layout 位置。
- 測試寬度與驗證方式。

若輸出是 `design/ui-layout.md` 或 system layout spec，還必須包含：

- app shell collapse table：desktop / tablet / mobile。
- page template responsive matrix：dashboard、list、detail、form、settings、state pages。
- action placement responsive rules：primary、secondary、bulk、danger、sticky。
- panel/drawer/modal responsive rules：right panel 何時變 drawer、modal 何時改 full-screen sheet。
- data-dense fallback：table/list/detail 在 mobile 的改寫策略。

若使用者要求實作，直接修改相關檔案並驗證。若只要求規劃，輸出清楚的 responsive layout spec。
