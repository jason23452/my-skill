---
name: impeccable
description: 設計、重設計、塑形、審查、audit、polish、clarify、distill、harden、optimize、adapt、animate、colorize、extract 或改善 frontend interface 時使用。適用於網站、landing page、dashboard、product UI、app shell、component、form、settings、onboarding、empty state、UX review、visual hierarchy、information architecture、accessibility、performance、responsive、theme、typography、spacing、layout、color、motion、micro-interactions、UX copy、error states、edge cases、i18n、design system、tokens。不是純後端或非 UI 任務。
license: Apache 2.0
metadata:
  version: "3.9.1"
  user-invocable: "true"
  argument-hint: "[craft|shape · audit|critique · animate|bolder|colorize|delight|layout|overdrive|quieter|typeset · adapt|clarify|distill · harden|onboard|optimize|polish · init|document|extract|live] [target]"
allowed-tools:
  - Bash(npx impeccable *)
  - Bash(node .claude/skills/impeccable/scripts/*)
---

# Impeccable

本 skill 用於設計、塑形、審查與打磨 production-grade frontend interfaces。它不是只提供美感建議，而是要求 agent 先理解產品情境、既有設計系統與目標畫面，再做出有明確取捨、可落地、可驗證的 UI/UX 決策。

## 何時使用

必須使用於以下任務：

- 使用者要設計或重設計 UI、頁面、component、app shell、dashboard、landing page、form、empty state、onboarding。
- 使用者要求 `craft`、`shape`、`audit`、`critique`、`polish`、`layout`、`adapt`、`clarify`、`distill`、`harden`、`optimize`、`animate`、`colorize`、`typeset`、`extract`、`live` 等設計流程。
- 使用者說畫面太普通、太 AI、太花、太亂、太淡、層級不清、排版不好、動效不順、手機版壞掉、文案不清楚。
- 需要檢查 visual hierarchy、information architecture、cognitive load、accessibility、performance、responsive behavior、theming、spacing、alignment、motion、micro-interactions、error states、i18n、design system 或 tokens。

不使用於純後端、資料庫、API、CLI、DevOps 或完全不影響 UI/UX 的任務。

## 啟動流程

開始前必須做以下步驟：

1. 執行 context script，一個 session 只執行一次：

```bash
node .claude/skills/impeccable/scripts/context.mjs
```

若 runtime 顯示本 skill 的 loaded base directory，改用：

```bash
node <skill-base-dir>/scripts/context.mjs
```

保持 cwd/workdir 在使用者專案，不要切到 skill 目錄。若使用者指定或暗示 monorepo 中的檔案、route 或 app，將具體目標加到同一命令：

```bash
node <skill-base-dir>/scripts/context.mjs --target <path>
```

2. 如果使用者呼叫 sub-command，例如 `craft`、`shape`、`audit`、`polish`，必須讀取對應 reference：

```text
reference/<command>.md
```

若專案平台是 native，依 context directive 讀取 native variant，例如 `reference/audit.native.md`。只讀一個正確 reference，不要兩個都讀。

3. 讀取至少一個現有設計 evidence：CSS、tokens、theme、representative component、page 或 layout。即使已讀 sub-command reference，也必須做這步。

4. 根據任務選擇 register reference：

- marketing、landing page、campaign、long-form content、portfolio：讀 `reference/brand.md`。
- app UI、admin、dashboard、tool：讀 `reference/product.md`。

5. 若 `PRODUCT.md` 的 `## Platform` 是 `ios` 或 `android`，額外讀 `reference/ios.md` 或 `reference/android.md`。若是 `adaptive`，兩者都讀。web 或未指定則略過。

6. 若專案全新且沒有 CSS tokens、theme 或既有品牌色，執行 palette script 取得品牌 seed 與構圖建議：

```bash
node .claude/skills/impeccable/scripts/palette.mjs
```

若使用者已指出設計太暖、只給暖色系、或 brief 不支持 warm / amber / terracotta / olive 類品牌語氣，改用：

```bash
node .claude/skills/impeccable/scripts/palette.mjs --avoid-warm
```

需要明確色溫時可使用 `--temperature cool|neutral|warm|mixed`。`warm` 只有在 brand、PRD 或使用者明確支持時才使用。

如果已找到既有品牌色，優先保留既有 identity，不要重置。

## 設計品質要求

產出必須接近可上線品質，不是 prototype 或 placeholder。除非使用者明確要求簡化，否則不要偷工減料。

必須做到：

- 美觀且有明確設計方向。
- responsive、fast、accessible、on-brand。
- 可讀、可操作、狀態完整。
- 不依賴 AI 常見模板套路。
- 能在瀏覽器、截圖、元件檔或可用工具中被檢查。

## 通用規則

### 色彩

- 必須檢查 contrast。正文對背景至少 4.5:1；大字至少 3:1。placeholder text 也要達到 4.5:1。
- 彩色背景上的灰字容易顯髒；改用背景同色系更深 shade，或文字色透明度。
- 新專案優先使用 OKLCH。
- 不要把「溫暖、傳統、海岸、義式、雜誌感」自動翻成 cream / sand / beige 背景。這是常見 AI 預設。

### Typography

- 內文行長控制在 65 到 75ch。
- 不要配兩個很像但不一樣的字體。字體配對應有明確 contrast axis。
- Hero / display heading 的 `clamp()` max 不應超過約 6rem / 96px，除非有很強理由。
- Display heading letter-spacing 不要小於 `-0.04em`。
- h1 到 h3 可使用 `text-wrap: balance`；長文可使用 `text-wrap: pretty`。

### 版面

- spacing 要有節奏，不要每段都一樣。
- card 不是萬用答案；nested cards 通常是錯誤。
- 一維排列用 Flexbox，二維排列用 Grid。
- responsive grid 可用 `repeat(auto-fit, minmax(280px, 1fr))` 類型 pattern。
- 建立語意化 z-index scale：dropdown、sticky、modal backdrop、modal、toast、tooltip。避免 `9999`。

### Motion

- 動效必須有目的：引導注意、說明關係、提供回饋或建立節奏。
- 不要動畫化 layout properties，除非必要。
- 進場/離場使用自然 easing；避免 bounce / elastic 濫用。
- 進階動效可用 motion、gsap、anime.js、lenis 等，但要符合專案依賴與效能。
- 必須支援 `prefers-reduced-motion: reduce`。
- Reveal animation 不能讓內容預設不可見；hidden tab 或 headless render 可能導致內容永遠空白。

### Interaction

- dropdown 若放在 `overflow: hidden/auto` 容器內會被裁切；用 native `<dialog>` / popover、`position: fixed` 或 portal。
- hover-only behavior 不可承載關鍵操作；觸控裝置也要可用。
- 錯誤、loading、empty、disabled、success 狀態都要有明確回饋。

## 絕對避免

看到以下傾向時，必須重寫設計而不是微調：

- 彩色 `border-left` / `border-right` 當 card、list item、callout 的裝飾條。
- gradient text 作為裝飾性強調。
- glassmorphism 當預設卡片風格。
- hero metric template：大數字、小 label、supporting stats、gradient accent。
- 一整排同尺寸 card，icon + heading + text 重複到底。
- 每個 section 都有 tiny uppercase tracked eyebrow。
- 每個 section 都用 `01 / 02 / 03` 編號，但內容不是有序流程。
- heading 在 tablet/mobile overflow。

## AI Slop 測試

如果別人一眼能說「這是 AI 做的」，設計就失敗。檢查兩層 reflex：

- 第一層：只看類別就能猜到 palette 或 layout，例如 AI 工具就紫色漸層、金融就深藍金色。
- 第二層：避開第一層後又落入新套路，例如「不是 SaaS cream，所以做 editorial typography」。

設計必須來自產品世界、使用情境、內容結構與實際限制。

## Commands

| 指令 | 類別 | 用途 | 參考檔 |
| --- | --- | --- | --- |
| `craft [feature]` | Build | 先 shape，再端到端建立 feature | `reference/craft.md` |
| `shape [feature]` | Build | 寫 code 前規劃 UX/UI | `reference/shape.md` |
| `init` | Build | 建立 PRODUCT.md、DESIGN.md、live config 與 next steps | `reference/init.md` |
| `document` | Build | 從既有 code 產生 DESIGN.md | `reference/document.md` |
| `extract [target]` | Build | 萃取 reusable tokens / components 到 design system | `reference/extract.md` |
| `critique [target]` | Evaluate | UX design review 與 heuristic scoring | `reference/critique.md` |
| `audit [target]` | Evaluate | 技術品質檢查：a11y、performance、responsive | `reference/audit.md` |
| `polish [target]` | Refine | 上線前最後品質打磨 | `reference/polish.md` |
| `bolder [target]` | Refine | 放大安全或平淡設計 | `reference/bolder.md` |
| `quieter [target]` | Refine | 降低過度刺激或太吵的設計 | `reference/quieter.md` |
| `distill [target]` | Refine | 去除複雜度，留下核心功能 | `reference/distill.md` |
| `harden [target]` | Refine | 補齊 errors、i18n、edge cases | `reference/harden.md` |
| `onboard [target]` | Refine | 設計 first-run flows、empty states、activation | `reference/onboard.md` |
| `animate [target]` | Enhance | 加入有目的的 animation 與 motion | `reference/animate.md` |
| `colorize [target]` | Enhance | 替單調 UI 加入策略性 color | `reference/colorize.md` |
| `typeset [target]` | Enhance | 改善 typography hierarchy 與 fonts | `reference/typeset.md` |
| `layout [target]` | Enhance | 修復 spacing、rhythm、visual hierarchy | `reference/layout.md` |
| `delight [target]` | Enhance | 加入個性與記憶點 | `reference/delight.md` |
| `overdrive [target]` | Enhance | 推到更大膽、更技術性的視覺效果 | `reference/overdrive.md` |
| `clarify [target]` | Fix | 改善 UX copy、labels、error messages | `reference/clarify.md` |
| `adapt [target]` | Fix | 適配不同 devices 與 screen sizes | `reference/adapt.md` |
| `optimize [target]` | Fix | 診斷與修復 UI performance | `reference/optimize.md` |
| `live` | Iterate | Browser 中選元素並產生變體 | `reference/live.md` |

## 路由規則

1. 沒有 argument：根據 context 提供 2 到 3 個最有價值的 next commands，不要自動執行。
2. 第一個字符合 command：讀取對應 reference 並照該流程執行。
3. 第一個字不符合 command，但 intent 明確對應某 command：當成該 command 執行。例如「fix spacing」對應 `layout`。
4. 無法明確對應：使用 setup steps、通用規則與 register reference 做一般設計協助。

`teach` 是 `init` 的 deprecated alias；使用者輸入時視為 `init`。

## Pin / Unpin

`pin` 建立獨立 shortcut，讓 `/<command>` 等同 `/impeccable <command>`。`unpin` 移除 shortcut。

```bash
node .claude/skills/impeccable/scripts/pin.mjs <pin|unpin> <command>
```

`<command>` 必須是上表中的 command。成功時簡短確認；錯誤時原樣回報 stderr。

## Hooks

`/impeccable hooks <on|off|status|ignore-rule|ignore-file|ignore-value|reset>` 管理本專案的 design detector hook。使用者呼叫時讀取 `reference/hooks.md` 並照流程執行。
