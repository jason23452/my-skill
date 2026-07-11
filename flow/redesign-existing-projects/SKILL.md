---
name: redesign-existing-projects
description: 將既有網站或 app 升級到更高品質。先 audit 現有設計，找出 generic AI patterns、弱 hierarchy、缺狀態與 layout 問題，再在不破壞功能的前提下做 targeted redesign。支援 Tailwind、vanilla CSS、CSS modules、styled-components 等既有 styling 方式。
---

# Redesign Existing Projects

這個 skill 用於既有專案 redesign。目標不是重寫整個產品，而是在現有技術棧與功能限制下，找出最能提升品質的設計問題並修正。

## 工作方式

套用到既有專案時，固定順序：

1. 掃描：讀 codebase，判斷 framework、styling method、design tokens、component patterns、主要頁面與現有 layout。
2. 診斷：依下方 audit checklist 找出 generic pattern、弱點、缺少的 state、RWD 與 accessibility 問題。
3. 決策：若 redesign 程度不清楚，問使用者要 preserve、refresh 還是 overhaul。
4. 修補：使用既有 stack 做 targeted upgrade，不從零重寫，不遷移 framework。
5. 驗證：確認功能未破壞，互動狀態、RWD、contrast、focus、loading / empty / error 都完整。

## Redesign 程度

如果使用者沒說清楚，先問一題：

```text
這次 redesign 想保留原本品牌與 layout，只做精修；還是希望明顯換一個視覺方向？
```

選項：

- Preserve：保留品牌、IA、layout family，只修 typography、spacing、state、RWD 與細節。
- Refresh：保留核心內容與品牌感，但改善 layout rhythm、section 結構、surface 與 hierarchy。
- Overhaul：保留功能與內容目標，但可大幅重排 layout、視覺語言與互動節奏。

## 設計審查

### 排版

檢查並修正：

- 瀏覽器預設字體或全站 Inter。換成更有性格且符合品牌的字體，例如 `Geist`、`Outfit`、`Cabinet Grotesk`、`Satoshi`；editorial / creative 情境才考慮 serif header + sans body。
- 標題缺乏 presence。提高 display size、收緊 letter spacing、降低 line-height，讓標題更有意圖。
- 內文太寬。段落寬度控制約 65 characters，增加 line-height。
- 只用 Regular 400 與 Bold 700。加入 Medium 500、SemiBold 600 做細緻 hierarchy。
- 數字使用 proportional font。資料密集 UI 使用 monospace 或 `font-variant-numeric: tabular-nums`。
- 缺少 tracking 調整。大標用 negative tracking，小 label / small caps 用 positive tracking。
- 每個小標都 all caps。改用 sentence case、lowercase italic 或更節制的 small-caps。
- 孤字。用 `text-wrap: balance` 或 `text-wrap: pretty` 修正。

### Color 與 Surfaces

- 純 `#000000` 背景。改成 off-black、dark charcoal、tinted dark。
- accent 過飽和。預設 saturation 控制在 80% 以下。
- 多個 accent color 互搶。只保留一個主要 accent。
- warm gray / cool gray 混用。統一灰階 hue。
- 紫藍 AI gradient。這是常見 AI 指紋；改成 neutral base + 單一有意圖的 accent。
- generic `box-shadow`。shadow 應帶背景 hue，不要只用黑色低透明。
- 全 flat、沒有材質。加入非常輕微的 noise、grain、micro-pattern 或 ambient gradient。
- 45 度標準 linear gradient 太均勻。用 radial gradient、mesh、noise overlay 打破平板感。
- lighting direction 不一致。所有 shadow 要像同一光源。
- light page 中間突然出現 dark section，或反之。除非是 deliberate theme switch，否則保持同一 theme family。
- 空白平面 section。必要時加入高品質背景圖、blur overlay、mask、低透明照片或細節紋理。

### 版面

- 全部置中且對稱。用 offset margin、混合 aspect ratio、左對齊 heading、非對稱 white space 打破。
- 三張等寬 feature card。改為 asymmetric grid、2+1、1+2、horizontal scroll、masonry、full-width story block。
- 使用 `height: 100vh`。改 `min-height: 100dvh` 避免 iOS Safari address bar 造成跳動。
- 複雜 flexbox 百分比計算。改用 CSS Grid。
- 沒有 max-width container。加入 1200-1440px 左右的 container constraint。
- 強迫卡片等高。內容長度不同時允許 variable height 或使用 masonry。
- 所有 radius 一樣。定義 radius 規則，例如 container 16px、inner 8px、button full pill。
- 沒有 overlap 或 depth。用負 margin、layering、z-index scale 創造層次。
- top / bottom padding 完全相等但視覺不平衡。用 optical adjustment。
- dashboard 永遠左 sidebar。可考慮 top nav、floating command menu、collapsible panel。
- whitespace 不足。Marketing / brand page 通常需要更大 spacing；dashboard 才適合高密度。
- card group 的 buttons 不對齊。不同內容長度時，CTA 應 pin 到底部形成乾淨水平線。
- pricing / comparison feature lists 起點不一致。用固定 title/price block 或一致 spacing。
- side-by-side elements baseline 錯位。titles、descriptions、prices、buttons 要視覺對齊。
- 數學置中但視覺不置中。icons、play buttons、button labels 可做 1-2px optical adjustment。

### Interactivity 與 States

- Button 沒有 hover。加入 background shift、scale 或 translate。
- 沒有 active/pressed feedback。用 `scale(0.98)` 或 `translateY(1px)`。
- transition duration 為 0。互動元素預設 150-300ms。
- 缺 focus ring。鍵盤焦點必須可見。
- 沒 loading state。用符合實際 layout 的 skeleton，不用通用 spinner。
- 沒 empty state。空 dashboard 要有 getting started、說明與 CTA。
- 沒 error state。表單用 inline error；不要 `window.alert()`。
- dead links 指向 `#`。改真連結或 disabled state。
- navigation 沒 current page indicator。
- anchor jump 太突兀。可加 `scroll-behavior: smooth`，並尊重 reduced motion。
- 動畫使用 `top`、`left`、`width`、`height`。改用 `transform` / `opacity`。

### 內容

- `John Doe` / `Jane Smith`。改成更真實、多元且符合情境的名字。
- `99.99%`、`50%`、`$100.00` 這類假精準數字。使用真資料，或標註 mock/sample。
- `Acme Corp`、`Nexus`、`SmartFlow` 這類 placeholder brand。改成情境可信的品牌名稱。
- AI 文案 cliché：不要用 `Elevate`、`Seamless`、`Unleash`、`Next-Gen`、`Game-changer`、`Delve`、`Tapestry`、`In the world of...`。
- success message 過度驚嘆。移除不必要驚嘆號。
- `Oops!` error。改直接明確，例如 `Connection failed. Please try again.`。
- passive voice。改 active voice。
- blog dates 全部一樣。用合理日期或真資料。
- 多個人物共用同一 avatar。每個人物要唯一。
- Lorem Ipsum。改成可審查 draft copy。
- 每個標題都 Title Case。改 sentence case，除非品牌規範要求。

### Component Patterns

- generic card：border + shadow + white background。移除多餘 border 或 shadow，只保留真正傳達 hierarchy 的 surface。
- 永遠一個 filled button + 一個 ghost button。可改 text link、tertiary action 或單 CTA。
- `New` / `Beta` pill badge 太泛用。改 square badge、flag、plain label。
- FAQ 永遠 accordion。可改 side-by-side list、searchable help、inline disclosure。
- testimonial 永遠 3-card carousel + dots。改 masonry wall、single strong quote、embedded social proof。
- pricing 永遠 3 towers。用色彩、對比與 spacing 強調推薦方案，不只加高度。
- 所有操作都用 modal。簡單操作用 inline edit、slide-over、expandable section。
- avatar 永遠 circle。可用 squircle 或 rounded square。
- dark/light toggle 永遠 sun/moon。可改 dropdown、system preference 或 settings。
- footer link farm 四欄。簡化，只保留主要導航與必要法律連結。

### Iconography

- 全部 Lucide / Feather。這是常見 AI default；可用 Phosphor、Heroicons 或既有 project icon set。
- Rocketship = launch、shield = security 這類 cliché。換成更貼合產品語境的 icon。
- icon stroke width 不一致。統一 stroke weight。
- 缺 favicon。加入品牌 favicon。
- stock diverse team photos 太假。使用真 team photos、candid shots 或一致 illustration style。

### Code Quality

- div soup。使用 semantic HTML：`nav`、`main`、`article`、`aside`、`section`。
- inline styles 混 CSS classes。回到專案 styling system。
- hardcoded pixel widths。改 `%`、`rem`、`em`、`max-width`。
- meaningful image 缺 alt text。不要 `alt="image"`。
- arbitrary `z-index: 9999`。建立乾淨 z-index scale。
- commented-out dead code。移除。
- import hallucination。新增任何 import 前先查 dependency file。
- 缺 meta tags。補 `title`、`description`、`og:image` 與 social meta。

## 高影響升級技巧

### 排版

- variable font animation。
- outline-to-fill display text。
- text mask reveals。
- display/body/utility 角色分明。

### 版面

- broken grid / asymmetry。
- aggressive whitespace。
- parallax card stack。
- split-screen scroll。
- bento grid with rhythm，不是重複卡片。

### Motion

- staggered entry。
- spring physics。
- scroll-driven reveal。
- tactile button feedback。
- reduced motion fallback。

### Surface

- glassmorphism with inner border，而不只是 blur。
- spotlight borders。
- grain / noise overlay。
- tinted shadows。

## 修正優先順序

用最小風險拿最大改善：

1. Font swap：最快改善、最低風險。
2. Color palette cleanup：移除衝突色與過飽和 accent。
3. Hover / active / focus states：讓介面活起來。
4. 版面 / spacing：container、grid、padding、vertical rhythm。
5. Replace generic components：替換 cliché patterns。
6. Loading / empty / error states：讓產品完整。
7. 排版 scale / spacing polish：最後質感。

## 規則

- 使用現有 tech stack，不遷移 framework 或 styling library。
- 不破壞既有功能；每次改完都要驗證。
- 新增 library 前先檢查 dependency file。
- Tailwind 專案先確認 v3 或 v4，再改 config。
- 無 framework 時使用 vanilla CSS。
- 變更要小而可 review；targeted improvements 優於大重寫。
- 如果 redesign 會改變品牌方向、IA、主要 layout 或使用者流程，先問使用者，不要自行決定。
