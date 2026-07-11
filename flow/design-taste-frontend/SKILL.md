---
name: design-taste-frontend
description: 用於 landing page、作品集與既有頁面 redesign 的 anti-slop frontend design skill。協助 agent 先讀懂 brief、判斷設計方向、避免模板化 layout，並用高標準檢查 typography、layout、motion、content、RWD 與互動狀態。
---

# 前端設計品味

這個 skill 用於提升前端頁面設計品味，特別適合：landing page、portfolio、marketing site、品牌頁、既有網站 redesign。它不是 dashboard / data table / 複雜後台 UI 的主要規範；若是後台或資料密集產品，只取用其中的 typography、density、state 與 accessibility 檢查。

核心目標：先讀懂使用者想要什麼，再決定 layout、視覺語氣與 motion。不要套用固定模板，不要產出看起來像 AI 預設的紫色漸層、置中 hero、三張等寬卡片、Inter + slate、到處 glassmorphism 的頁面。

## 0. Brief 判讀

在產生 UI 或 `ui-layout.md` 前，先判斷：

1. 頁面類型：SaaS landing、consumer landing、agency、event、portfolio、editorial、redesign。
2. 使用者語氣：minimal、calm、Linear-style、Awwwards、brutalist、premium consumer、Apple-like、playful、B2B、editorial、glassy、dark tech。
3. 參考來源：使用者貼的 URL、截圖、競品、品牌或既有設計。
4. 受眾：B2B 採購、設計敏感消費者、招聘方、一般大眾、政府/法規場景。
5. 既有品牌資產：logo、顏色、字體、圖片、產品圖、既有 component pattern。
6. 隱性限制：accessibility-first、公共服務、金融/醫療/法規、信任優先 commerce、兒童產品。

產出前先用一句話寫出設計判讀（Design Read）：

```text
Reading this as: <頁面類型> for <受眾>, with a <視覺語氣> language, leaning toward <設計系統或 aesthetic family>.
```

如果 brief 真的不清楚，只問一題，不要丟一長串問題。例如：

```text
這次 layout 想更接近 Linear-clean，還是 Awwwards-experimental？
```

## 1. 三個設計旋鈕

根據 brief 設定三個全域值，後續 layout、motion、density 都要服從它們。

```text
DESIGN_VARIANCE: 1-10   # 1 = 完全對稱，10 = 藝術性混沌
MOTION_INTENSITY: 1-10  # 1 = 靜態，10 = cinematic / physics
VISUAL_DENSITY: 1-10    # 1 = art gallery 留白，10 = cockpit 資訊密集
```

預設值：`8 / 6 / 4`。若使用者或產品情境明顯不同，直接調整，不要要求使用者改 skill 檔。

| 情境 | DESIGN_VARIANCE | MOTION_INTENSITY | VISUAL_DENSITY |
| --- | --- | --- | --- |
| minimalist / calm / Linear-style | 5-6 | 3-4 | 2-3 |
| premium consumer / luxury / Apple-like | 7-8 | 5-7 | 3-4 |
| playful / Awwwards / agency / experimental | 9-10 | 8-10 | 3-4 |
| 一般 landing / portfolio / marketing | 7-9 | 6-8 | 3-5 |
| trust-first / public-sector / regulated | 3-4 | 2-3 | 4-5 |
| redesign preserve | match existing | +1 | match existing |
| redesign overhaul | +2 | +2 | match existing |

## 2. UI Layout 決策 Gate

若要產生或大幅重寫 `design/ui-layout.md`，必須先形成 layout decision。若沒有足夠線索，回 `blocked` 或輸出 question plan，讓使用者選 layout 方向。

至少提供 2-3 個具體 layout 選項，每個選項必須包含：

- 適用原因
- 資訊層級
- 首屏結構
- section rhythm
- mobile collapse strategy
- 風險

常用 layout 選項：

1. 沉浸式銷售導向：hero 強、CTA 明顯、社會證明與產品亮點有節奏地出現。適合 landing / e-commerce / conversion。
2. 任務流程導向：以步驟、表單、進度、狀態回饋為主。適合 checkout、booking、onboarding、申請流程。
3. 資料瀏覽導向：列表、篩選、詳情切換、比較與快速掃描。適合 catalog、dashboard、management。
4. Editorial / brand story：強 typography、敘事分段、圖片與 quote 做節奏。適合品牌、portfolio、agency。
5. Asymmetric / showcase：非對稱 grid、重點作品/商品大圖、局部 overlap。適合 creative、premium、portfolio。

行動版也要問或明確決定：

- 優先快速決策
- 優先完整資訊瀏覽
- 優先表單完成率
- 優先商品比較
- 優先後台效率

## 3. 設計系統選擇

若 brief 明確指向既有 design system，優先使用官方 package，不要手刻仿冒。

| Brief 指向 | 建議 |
| --- | --- |
| Microsoft / enterprise SaaS | Fluent UI |
| Google / Material flavored product | Material 3 |
| IBM / enterprise analytics | Carbon |
| Shopify admin | Polaris |
| Atlassian / Jira-like | Atlassian Design System |
| GitHub-like devtool | Primer |
| UK public-sector | GOV.UK Frontend |
| US public-sector | USWDS |
| Modern SaaS 自有元件 | shadcn/ui + Tailwind |
| Indie / 小團隊 marketing | Tailwind + project tokens |

一個專案只選一個 design system。不要混 Fluent、Carbon、Material、shadcn。

若只是 aesthetic，不要假裝有官方 package。Glassmorphism、bento、brutalism、editorial、dark tech、mesh gradient、kinetic typography 都是設計方向，不是完整 design system。

## 4. 版面反模板規則

避免以下 AI 常見模板：

- 置中 hero + 深色 mesh + 紫色 CTA。
- 三張等寬 feature card。
- 每個 section 都小寫 eyebrow + 大標 + 右側短段落。
- 連續 zigzag image/text section 超過兩段。
- 6 張白底卡片組成的無節奏 bento。
- hero 塞太多元素：eyebrow、headline、subtext、CTA、trust logos、tagline、feature bullets 全擠在一起。
- desktop nav 換行或高度超過 80px。
- CTA 文案在 desktop 斷行。
- 多個 CTA label 表達同一意圖，例如 `Get in touch`、`Contact us`、`Let's talk` 同時出現。

硬規則：

- Hero 必須在初始 viewport 內成立，CTA 不可需要往下捲才看到。
- Hero headline desktop 最多 2 行；subtext 盡量 20 字以內。
- section layout family 同頁最多使用一次，除非有明確理由。
- 9 個 section 至少要有 4 種不同 layout family。
- 每個 multi-column layout 必須寫清楚 `<768px` collapse 行為。
- Bento cell 數量必須等於真實內容數量，不可有空格補版。

## 5. 排版規則

- 不要預設使用 Inter。只有使用者要求 neutral / Linear-style，或 public-sector / accessibility-first 時才可用。
- Display 字體要有性格，但要符合品牌，不是亂選 serif。
- Serif 不是 creative/premium 的自動答案。只有 editorial、luxury、heritage、publication、vintage 等情境才合理。
- 大標使用 tighter tracking 與較緊 line-height，但 italic 有 descender 字母時要避免 clipping。
- Body line length 控制在約 60-75 characters；mobile 約 35-60 characters。
- 使用 `text-wrap: balance` 或 `text-wrap: pretty` 修正孤字。

## 6. 色彩與材質規則

- 最多一個主要 accent color。
- 避免 AI purple / blue glow 作為預設。
- premium consumer 不要每次都 warm beige + brass + espresso。輪替 cold luxury、forest、black/tan、cobalt/cream、olive/brick、monochrome + saturated pop 等方向。
- 一頁只能有一個 theme family。不要 light page 中間突然插一段無理由 dark section。
- shadow 要帶背景 hue，不要所有陰影都黑色低透明。
- 卡片只在 elevation 真有層級意義時使用；否則用 spacing、divider、background tint。
- radius 要有規則：all sharp、all soft、all pill，或明確定義不同元件的 radius。

## 7. 動效與互動

- 動效必須有目的：hierarchy、storytelling、feedback、state transition。
- 不要因為酷就加動畫。
- 動畫只用 `transform` / `opacity`，避免 `top`、`left`、`width`、`height`。
- `MOTION_INTENSITY > 3` 必須支援 `prefers-reduced-motion`。
- Scroll animation 優先使用 Motion、GSAP ScrollTrigger 或 CSS scroll-driven animation；不要用 React state 追蹤 scroll。
- 每個互動元件都要有 hover、active、focus-visible、disabled。
- loading 用符合實際 layout 的 skeleton，不用泛用 spinner。
- empty/error state 必須設計，不可空白或 `window.alert()`。

## 8. 圖像與內容策略

- Landing / portfolio 是視覺產品，純文字頁通常不完整。
- Hero 需要真實 visual：產品圖、攝影、生成圖、實際 screenshot 或有品質的 placeholder。
- 不要用 div 方塊拼假 screenshot。
- 社會證明 logo wall 使用真 logo 或有設計感的 invented mark，不要純文字 wordmark。
- 不使用 lorem ipsum。所有文案都要是可審查的 draft copy。
- 禁用 AI copy cliché：`Elevate`、`Seamless`、`Unleash`、`Next-Gen`、`Game-changer`、`Delve`、`Tapestry`、`In the world of...`。
- fake precise number 要標註 sample/mock，否則不要編造。

## 9. Redesign 工作流

既有專案不要重寫一切。流程：

1. 掃描：framework、styling method、tokens、component patterns、現有 page rhythm。
2. 診斷：列出 generic AI patterns、弱 hierarchy、缺 state、RWD 問題。
3. 決策：問使用者 preserve、refresh、overhaul 哪種程度。
4. 修補：在現有 stack 裡做最小高影響改動。
5. Review：用 layout、typography、color、motion、accessibility、content 自檢。

## 10. 交付前檢查

完成前必須檢查：

- 設計判讀（Design Read）與產物一致。
- 三個旋鈕有被實際反映。
- layout 不是預設置中 hero + 三卡片。
- desktop nav 不換行，hero 不溢出 viewport。
- mobile collapse 逐 section 明確。
- typography、color、radius、shadow 有一致規則。
- CTA 對比通過，文字不斷行。
- loading / empty / error / focus state 存在。
- copy 沒有 AI cliché、語病或 fake precision。
- 若有 motion，支援 reduced motion。

若任何項目失敗，先修正，不要宣稱完成。
