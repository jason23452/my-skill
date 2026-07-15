---
name: design-taste-frontend
description: 用於 landing page、作品集、既有頁面 redesign、admin/dashboard 與整體系統排版規劃的 anti-slop frontend design skill。協助 agent 先讀懂 brief、判斷設計方向、避免模板化 layout，並用高標準檢查 app shell、route hierarchy、page templates、typography、layout、motion、content、RWD 與互動狀態。
---

# 前端設計品味

這個 skill 用於提升前端頁面設計品味，特別適合：landing page、portfolio、marketing site、品牌頁、既有網站 redesign，也可用於 admin / dashboard / management console 的整體系統排版決策。後台或資料密集產品使用本 skill 時，重點不是做花俏視覺，而是避免單一功能頁模板化、缺少 app shell 決策、route hierarchy 不清、page template 無法複用，以及 RWD collapse 只靠口頭描述。

核心目標：先讀懂使用者想要什麼，再決定 layout、視覺語氣與 motion。不要把紫色漸層、置中 hero、三張等寬卡片、Inter + slate、glassmorphism、dashboard、health check 或 greenfield test page 當預設起點；若產品證據支持其中某種 pattern，必須把它轉化成符合 PRD 的產品專屬 composition。

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

若要產生或大幅重寫 `design/ui-layout.md`、`layout.md` 或其他 system layout spec，必須先形成 layout decision。若沒有足夠線索，回 `blocked` 或輸出 question plan，讓使用者選 layout 方向。

若目前 artifact contract 明確要求單一 final `layout.md`，最終文件不可保留 A/B/C；但 caller 若有獨立的 Design Direction phase，必須先探索可選 composition，再把 selected direction 收斂成單一 canonical `layout.md`。Screen semantics contract 固定任務、內容、actions、states 與 outcomes，不代表所有 options 必須保留相同 shell、region position 或 split ratio。

`layout.md` 與 `design/ui-layout.md` 預設都是整體系統排版政策文件，不是單一 PRD 功能頁的欄位/狀態規格。除非使用者明確要求只規劃單頁，否則 layout decision 必須先回答整個 frontend system 如何排版，再把本輪 feature 放入代表性 surface。

對 `layout.md` 而言，本輪 PRD、UX spec 與 wireframe spec 是代表性 evidence surfaces，用來驗證整體產品排版系統，不是 `layout.md` 的範圍邊界。

完成條件：輸出中必須能分辨「System Layout Contract」與「Feature-specific Layout Notes」。前者是主體，後者只能補充本輪功能的 placement。

### System Layout Contract

產生 `layout.md`、`design/ui-layout.md` 或 layout preview 時，必須先定義以下全域 contract：

- App shell：left sidebar、navigation rail、top nav、drawer、tabs、no persistent shell 的選擇與不採用原因。
- Route hierarchy：global nav、section nav、page tabs、detail route、settings、modal/drawer surface 的層級。
- Page template taxonomy：dashboard / overview、list / index、detail、form / editor、settings、empty / loading / error 的共用模板。
- Grid and container policy：container max width、sidebar/panel ratio、content width、column rules、breakpoints。
- Density and rhythm：資料密度、section rhythm、header/action/footer 高度、card/list/table spacing。
- Action placement：primary、secondary、danger、bulk、sticky action 的固定規則。
- Responsive policy：desktop/tablet/mobile 的 shell collapse、content stacking、drawer/panel behavior、sticky action。
- Visual composition：視覺焦點、surface 層級、留白比例、content density 與 style treatment。

若產物主要篇幅是畫面清單、欄位清單、表單驗證、狀態矩陣或 microcopy，而不是上述 contract，必須視為 layout planning 失敗並重寫。

只有在使用者或 caller 明確要求多方案探索、layout alternatives、design options 或可選 layout preview 時，才提供 2-3 個具體 layout 選項。每個選項必須是一套可套用到整個 frontend system 的 layout policy，而不是單頁 main content 排法。每個選項必須包含：

- 適用原因
- 資訊層級
- 首屏結構
- section rhythm
- mobile collapse strategy
- 風險
- app shell / navigation model
- page template coverage
- grid / density / action placement policy

多方案探索時，共享的是產品 invariants：role、task、content semantics、actions、states、permissions、outcomes、IA relationships。Options 應在 shell presentation、region grouping、master-detail relationship、progressive disclosure、density、visual center、action anchoring 與 responsive recomposition 上有實質差異。若差異只剩 palette、font、radius、shadow 或 motif，必須重做。

Composition exploration pool。以下不是固定模板清單，而是可被 PRD evidence 支持或轉化的 composition models：

1. Hero-like focal area：當 PRD 需要先建立品牌論點、產品承諾、conversion 或 onboarding context。
2. Task flow / wizard：當主要任務是 checkout、booking、申請、設定、上傳、審核或 onboarding。
3. Dashboard / overview：當 PRD 需要監控、營運、分析、健康狀態、風險總覽或快速 triage；必須產品專屬，不可退化成 KPI cards + table。
4. Inspector workspace：當使用者需要列表/物件與細節同步判斷，例如審核、客服、訂單、內容管理。
5. Timeline / activity stream：當時間、進度、歷史、追蹤、版本或事件是主要心智模型。
6. Board / canvas：當使用者需要拖曳、組織、規劃、視覺化關係或空間工作區。
7. Document workspace：當核心物件是文件、規格、合約、報告、審查意見或長內容。
8. Catalog / gallery：當探索、比較、篩選與視覺選擇是核心任務。
9. Editorial / brand story：當敘事、信任、品牌、案例或長頁閱讀是主要價值。

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

## 4. Template Reflex 檢查

以下是常見 AI template reflex，不是永遠禁止的 pattern。看到它們時先問：PRD 是否支持？這個 pattern 是否被產品化轉換？如果答案是否定，才重寫。

- 置中 hero + 深色 mesh + 紫色 CTA。
- 三張等寬 feature card。
- 每個 section 都小寫 eyebrow + 大標 + 右側短段落。
- 連續 zigzag image/text section 超過兩段。
- 6 張白底卡片組成的無節奏 bento。
- hero 塞太多元素：eyebrow、headline、subtext、CTA、trust logos、tagline、feature bullets 全擠在一起。
- desktop nav 換行或高度超過 80px。
- CTA 文案在 desktop 斷行。
- 多個 CTA label 表達同一意圖，例如 `Get in touch`、`Contact us`、`Let's talk` 同時出現。

Pattern evidence 規則：

- 若使用 Hero，它必須是產品論點、互動 demo、主要物件 preview 或 onboarding context，不是大標 + 副標 + 雙 CTA 的 filler。
- 若使用 Dashboard，它必須支援 PRD 的監控、triage、決策或狀態模型，不可只是 KPI cards、filter bar 與 table 的預設組合。
- 若使用 Health Check，它必須對應真實健康/風險/品質模型，不可只是 greenfield app 或工程 smoke test 頁。
- 若使用 Greenfield App shell，它必須是產品 shell 的第一版，不可出現 scaffold evidence、status check、sample cards 或 fake engineering dashboard。
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
- premium / editorial / calm / trustworthy 不可自動套用 warm-neutral surface + metallic accent + dark coffee ink 的 luxury formula。先定義 `colorTemperature`、`dominantHueFamily`、`palettePosture` 與產品證據，再選色。
- 多方向設計時，每個 option 必須有明顯不同的 hue family 或 contrast model；不要用同一套 warm surface / green-blue ink / amber accent 反覆換名稱。
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

## 9. Automated HTML Preview Quality

當 subagent 產生 `screen-preview.html`、靜態 high-fidelity preview 或自包含 HTML/CSS 時，必須把設計品味落成可見畫面，不可只輸出「乾淨現代」的規格頁。

- 先回答：這個產品畫面的品牌指紋是什麼？使用者 5 秒後會記住什麼？答案不可只有 professional、modern、clean、trustworthy。
- 第一屏必須是一個真實 product scene，不是文件、報告、比較表、策略說明頁或需求摘要。
- 一次只顯示一個真實 product scene；其他 screens/states 透過真實 navigation 或 scene controls 切換，不得在右欄或長頁同時展開作為 coverage report。
- 只能有一個主要視覺重心；其他資訊用 progressive disclosure、inspector、secondary panel、compact strip、drawer 或 secondary route 呈現，不要把需求平均鋪成同權重卡片。
- `SCR-*`、`REG-*`、PRD/AC/evidence IDs、traceability、coverage、QA status、file paths、JSON/YAML 與設計說明不得出現在 visible product UI。
- 必須有產品專屬 visual motif，且 motif 要承載業務語意，例如 lifecycle、scope、status、receipt、ledger、approval、inventory、correction、handoff、sync、risk 或 permission。
- 自包含 HTML 可用 inline SVG、CSS texture、grid/ledger lines、status rails、receipt strips、scope ribbons、mask、subtle noise、geometric separators；不可依賴外部圖片、外部字體或外部 icon font。
- 至少要有 3 種有功能意義的 surface weight。不要讓所有 panel 使用同一 radius、border、shadow、padding。
- 色彩必須有比例與職責，通常 dominant/support/accent/status 要分離。不可只把 button 改成主色。
- Typography 即使使用 system stack，也要透過 size scale、weight、case、letter spacing、tabular numbers、label style 和 line-height 建立個性。
- Mobile 不是 desktop 截圖縮小；要重新安排 reading order、sticky action、state compression 或 inspector collapse。
- Mobile 第一視窗至少要看見產品 context、主要任務物件/決策，以及下一步操作；filters、header 與 navigation 不得把核心內容完全推到首屏之外。
- 若出現 generic KPI cards + filter + table、三等分卡片牆、紫藍 glow SaaS、無產品語意 bento、fake chart、placeholder bars、lorem ipsum、`Project Alpha`、`Metric 1`、`Sample item`，必須重寫。

### Screenshot Visual Quality Gate

HTML source、DOM probe、overflow 與 accessibility checks 只能證明技術正確，不能代替視覺審查。最終 preview 必須由獨立 critic 讀取 desktop/tablet/mobile screenshots，依 hierarchy、composition、task focus、product specificity、typography/rhythm、surface craft、responsive recomposition、polish/accessibility 評分。通過條件是 weighted score >= 88/100，hierarchy/composition/task focus/mobile 各 >= 8/10，其餘各 >= 7/10，且沒有 internal metadata、report wall、generic template、mobile desktop縮小版等 hard blockers。

## 10. Redesign 工作流

既有專案不要重寫一切。流程：

1. 掃描：framework、styling method、tokens、component patterns、現有 page rhythm。
2. 診斷：列出 generic AI patterns、弱 hierarchy、缺 state、RWD 問題。
3. 決策：問使用者 preserve、refresh、overhaul 哪種程度。
4. 修補：在現有 stack 裡做最小高影響改動。
5. Review：用 layout、typography、color、motion、accessibility、content 自檢。

## 11. 交付前檢查

完成前必須檢查：

- 設計判讀（Design Read）與產物一致。
- 三個旋鈕有被實際反映。
- layout pattern 有 PRD evidence，且不是未轉化的預設置中 hero / 三卡片 / KPI dashboard / health check scaffold。
- desktop nav 不換行，hero 不溢出 viewport。
- mobile collapse 逐 section 明確。
- typography、color、radius、shadow 有一致規則。
- CTA 對比通過，文字不斷行。
- loading / empty / error / focus state 存在。
- copy 沒有 AI cliché、語病或 fake precision。
- 若有 motion，支援 reduced motion。

若任何項目失敗，先修正，不要宣稱完成。
