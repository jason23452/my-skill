---
name: ui-ux-pro-max
description: 當使用者要設計、建立、重構、審查、改善或修復 UI/UX 時必須使用。適用於網站、landing page、dashboard、admin panel、SaaS、e-commerce、portfolio、blog、mobile app、React、Next.js、Vue、Svelte、Flutter、React Native、SwiftUI、Tailwind、shadcn/ui、HTML/CSS。觸發語句包含 UI、UX、設計系統、landing page、dashboard、介面、元件、按鈕、表單、表格、圖表、navbar、sidebar、modal、responsive、dark mode、accessibility、typography、color palette、animation、layout、mobile、讓畫面更好看、看起來更專業、改善使用體驗、審查介面。
---

# UI/UX Pro Max

這個 skill 是 UI/UX 設計與實作決策工具。它結合可搜尋資料庫、設計系統產生器、UX checklist、stack-specific guidelines，協助 agent 在真實專案中做出可落地的視覺、互動、無障礙、響應式與效能決策。

目標不是產出漂亮形容詞，而是讓最後的 UI 更清楚、更一致、更可用、更符合產品情境，並能在桌機、手機、深色模式、鍵盤操作、螢幕閱讀器與低動態偏好下正常工作。

## 何時使用

必須使用於以下任務：

- 建立新頁面：landing page、dashboard、admin、SaaS、e-commerce、portfolio、blog、mobile app。
- 建立或改造 UI 元件：button、modal、form、table、card、chart、navbar、sidebar、toast、empty state。
- 選擇或制定設計系統：色彩、字體、間距、圓角、陰影、動效、icon、layout、responsive breakpoints。
- 審查 UI 品質：accessibility、contrast、keyboard navigation、touch target、loading/error/empty states、dark mode。
- 改善使用體驗：資訊架構、導航、表單流程、行動裝置體驗、互動回饋、圖表可讀性。
- 實作特定 stack 的 UI：React、Next.js、Vue、Svelte、Astro、Angular、Laravel Blade、Tailwind、shadcn/ui、SwiftUI、Flutter、Jetpack Compose、React Native、Three.js。

不需要使用於以下任務：

- 純後端、資料庫、API、DevOps、CLI 或非視覺自動化。
- 僅修復商業邏輯且不影響畫面、互動或使用流程。
- 使用者明確要求不要討論設計，只要改非 UI 程式碼。

判斷原則：只要任務會改變使用者看到什麼、如何理解畫面、如何操作、畫面如何回饋，就使用本 skill。

## 工作流程

### 1. 先萃取設計條件

從使用者 prompt 與 repo context 中找出：

- 產品類型：SaaS、電商、內容、工具、娛樂、金融、醫療、教育、內部系統等。
- 使用者與情境：一般消費者、專業使用者、管理員、行動場景、資料密集場景。
- 頁面任務：轉換、探索、監控、編輯、購買、設定、上傳、閱讀、分析。
- 視覺方向：minimal、editorial、playful、technical、luxury、brutalist、glass、dark、dense、spacious。
- 技術 stack：讀 package/config 或使用者指定。不要憑空假設。
- 既有設計系統：若 repo 已有 tokens、theme、components，優先延續；不要重新發明。

完成條件：能用 2 到 5 句說明「這個介面服務誰、要完成什麼、視覺應該支持什麼」。

### 2. 產生或讀取設計系統

若專案尚未有明確設計系統，先用 `--design-system` 產生建議：

```bash
python <skill-path>/scripts/search.py "<product type> <industry> <tone> <density>" --design-system -p "<Project Name>"
```

Windows 環境使用 `python`；macOS/Linux 可視環境使用 `python3`。

若需要跨 session 保存設計規則，使用：

```bash
python <skill-path>/scripts/search.py "<query>" --design-system --persist -p "<Project Name>"
```

這會建立：

- `design-system/MASTER.md`：全域設計 source of truth。
- `design-system/pages/<page>.md`：頁面級 override，若有則優先於 master。

若正在做特定頁面，先檢查：

- `design-system/MASTER.md`
- `design-system/pages/<page-name>.md`

完成條件：實作前已有明確的 palette、type scale、spacing、radius、shadow/elevation、motion、component state、responsive 規則。

### 3. 用資料庫補足細節

針對不確定的設計面向查詢 domain：

```bash
python <skill-path>/scripts/search.py "<keyword>" --domain <domain> -n 5
```

常用 domain：

| Domain | 用途 |
| --- | --- |
| `product` | 產品類型與典型 UI pattern |
| `style` | 視覺風格、效果、設計語言 |
| `color` | 色彩 palette 與產業適配 |
| `typography` | 字體搭配、字級與文字氣質 |
| `google-fonts` | Google Fonts 搜尋 |
| `landing` | landing page 結構、hero、CTA、social proof |
| `ux` | accessibility、loading、forms、navigation、motion 等 UX 規則 |
| `chart` | 圖表類型、資料視覺化與可讀性 |
| `gsap` | 動效強度與 GSAP skeleton |
| `prompt` | AI prompt / CSS keyword 輔助 |

完成條件：對即將實作或審查的關鍵 UI 決策有依據，不只靠主觀偏好。

### 4. 查詢 stack-specific guidelines

依專案 framework 查詢 stack：

```bash
python <skill-path>/scripts/search.py "<keyword>" --stack <stack>
```

常見 stack：

- `react`
- `nextjs`
- `vue`
- `nuxtjs`
- `nuxt-ui`
- `svelte`
- `astro`
- `shadcn`
- `html-tailwind`
- `angular`
- `laravel`
- `swiftui`
- `flutter`
- `jetpack-compose`
- `react-native`
- `threejs`

完成條件：實作用法符合專案 stack，不把其他框架的 pattern 硬套進來。

### 5. 實作或審查

實作時遵守 repo 現有設計系統與 component pattern。若 repo 已使用 Tailwind、CSS modules、design tokens、shadcn/ui、Radix、MUI、native components 等，延續現有方式。

審查時以 findings 優先，列出檔案與行號，聚焦會影響使用者的問題：

- accessibility 或可操作性缺陷。
- mobile/responsive 破版。
- 視覺層級不清、資訊架構混亂。
- loading/error/empty state 缺失。
- 表單錯誤回饋不明。
- 深色模式或對比不足。
- 動效造成 jank、暈眩或 layout shift。
- chart 無法被理解或無法被輔助技術讀取。

完成條件：輸出不只說「更好看」，而是能指出具體改善、實作位置與驗收方式。

## 優先級 Checklist

依序處理，不要為了視覺效果犧牲前面項目。

### 1. Accessibility

- 一般文字對比至少 4.5:1，大字至少 3:1。
- interactive element 有可見 focus ring。
- icon-only button 必須有 accessible name。
- 表單 input 必須有 label，不只用 placeholder。
- tab order 符合視覺順序。
- 資訊不能只靠顏色傳達。
- 圖片若有語意需提供 alt；裝飾圖應標示為裝飾。
- 動效尊重 `prefers-reduced-motion`。

### 2. Touch And Interaction

- 觸控目標至少 44x44pt 或 48x48dp。
- 點擊、按壓、提交、載入、成功、失敗都有明確回饋。
- 不依賴 hover 作為唯一互動方式。
- disabled state 有語意屬性與視覺差異。
- 重要操作不要只有手勢，必須有可見控制。

### 3. Layout And Responsive

- mobile-first，至少檢查 375px、768px、1024px、1440px。
- 不產生水平捲動。
- 固定 header/footer/bottom CTA 不遮住內容。
- 使用一致 spacing scale，優先 4/8pt 節奏。
- 長文行寬桌機約 60 到 75 字元，手機約 35 到 60 字元。
- 使用 `min-h-dvh` 等現代 viewport 單位處理手機瀏覽器。

### 4. Typography And Color

- body 字級通常不小於 16px。
- body line-height 約 1.5 到 1.75。
- 用語意色彩 token，不在元件中散落 raw hex。
- light/dark mode 分別測對比，不要直接反相。
- 字體搭配要符合產品氣質，不使用無理由的預設組合。

### 5. Motion And Performance

- micro-interaction 通常 150 到 300ms。
- 優先動畫 `transform` 與 `opacity`，避免動畫 `width/height/top/left`。
- 動效要解釋狀態改變，不只裝飾。
- loading 超過 300ms 要有狀態；超過 1s 優先 skeleton 或 progressive loading。
- 圖片使用 WebP/AVIF、尺寸保留、lazy loading。
- 大列表使用 virtualization 或分頁。

### 6. Forms And Feedback

- label、helper text、error text 清楚且靠近欄位。
- 錯誤訊息說明原因與修復方式。
- submit 期間防止重複提交並顯示進度。
- destructive action 要確認或提供 undo。
- 多步驟流程有進度、返回與保存策略。

### 7. Navigation

- 目前位置清楚標示。
- back 行為可預期，保留 scroll/filter/input state。
- mobile bottom nav 不超過 5 個 top-level items。
- sidebar/drawer 不應承載主要 CTA。
- modal 不應作為主要導航流程。

### 8. Charts And Data

- 趨勢用 line，比較用 bar，比例少量類別才用 pie/donut。
- 圖表不能只靠顏色區分資料。
- 軸、單位、legend、tooltip、空狀態、錯誤狀態要完整。
- 行動版圖表要簡化或重新排版。
- 重要圖表提供文字摘要或表格替代。

## 設計系統調節參數

`--design-system` 支援三個 1 到 10 的調節參數：

```bash
python <skill-path>/scripts/search.py "internal analytics dashboard" --design-system --variance 8 --motion 7 --density 8 -p "Ops Console"
```

| 參數 | 低 | 中 | 高 |
| --- | --- | --- | --- |
| `--variance` | 穩定、簡潔、保守 | 現代、平衡 | 大膽、不對稱、辨識度高 |
| `--motion` | 細微互動 | 標準 reveal/stagger | 複雜 choreography |
| `--density` | 寬鬆、行銷頁 | 一般產品 UI | 高密度 dashboard |

不要為了「厲害」把三個值都拉滿。依產品任務決定。

## 輸出要求

如果是設計或實作任務，輸出應包含：

- 已採用的設計方向與原因。
- 主要 tokens 或設計系統決策。
- 實作位置與重要改動。
- 已檢查的 responsive、accessibility、dark mode、motion 項目。
- 無法驗證的項目與原因。

如果是 UI review，輸出應包含：

- Findings first，依嚴重度排序。
- 每個 finding 有檔案/行號、問題、使用者影響、建議修法。
- 若沒有 finding，明確說明沒有發現重大問題，並列出殘餘風險。

## 交付前檢查

- 沒有用 emoji 當結構性 icon；使用 SVG 或平台 icon。
- touch target 達標。
- focus state 可見。
- light/dark mode 對比合格。
- mobile 沒有水平捲動。
- loading/error/empty state 存在。
- reduced motion 可用。
- 字體、色彩、間距、圓角、陰影來自一致系統。
- chart 有 legend、tooltip、label 或文字摘要。
- 實作沒有違背既有 component pattern。
