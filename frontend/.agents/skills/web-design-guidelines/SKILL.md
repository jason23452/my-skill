---
name: web-design-guidelines
description: 審查前端 UI、HTML/CSS、React/Vue 頁面、設計系統或 ui_style_guide.md 是否符合 Web Interface Guidelines、可用性、可讀性、accessibility 與互動品質；使用者要求 review UI、check accessibility、audit design、review UX、檢查網站最佳實務時使用。
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

依 Web Interface Guidelines 審查前端 UI 品質。本 skill 可用於 code review、設計審查、accessibility 檢查，也可作為 `ui_style_guide.md` review gate 的品質 rubric。

## 工作方式

1. 從下方來源取得最新 guidelines。
2. 讀取指定檔案或檔案 pattern；若未指定，先詢問要審查的範圍。
3. 依 guidelines 檢查 design、accessibility、UX、interaction、copy、responsive 與 code quality。
4. 對 code review 輸出簡潔的 `file:line` finding；對文件 review 或 agent gate，輸出結構化問題、嚴重度與修正方向。

完成條件：每個 finding 都有明確 evidence，且能指出實際使用者風險或設計品質風險，而不是只寫籠統意見。

## Guidelines Source

每次 review 前優先抓取最新規則：

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

使用 WebFetch 取得最新規則。若 WebFetch 或外部網路暫時不可用，保留 warning，並用本 skill 的內建審查原則繼續，不可因此跳過 review。

## 使用方式

使用者提供 file 或 pattern 時：

1. Fetch 上方 guideline source。
2. Read 指定檔案。
3. 套用 fetched guidelines 與本 skill 的審查原則。
4. 依任務情境輸出 findings。

若沒有指定檔案，先詢問使用者要審查的檔案或範圍。

## 中文輸出規則

本 repo 預設使用繁體中文。除非使用者明確要求英文，審查結果、summary、blocking issue、rewrite guidance 與建議都用繁體中文。固定檔案路徑、code symbol、CSS token、ARIA 屬性、HTTP path、套件名稱可保留英文。

## 審查重點

### 可用性與資訊架構

- 頁面是否有明確主任務與主要 CTA。
- 內容層級是否可掃描，標題、摘要、metadata、狀態與操作是否區分清楚。
- 空狀態、錯誤狀態、loading 與成功回饋是否告訴使用者下一步。

### 視覺品質

- 色彩是否有角色分工，不只是任意套色。
- typography 是否支援閱讀、掃描、數字與狀態辨識。
- spacing、alignment、grid 與 card density 是否一致。
- surface、border、shadow、radius 是否形成穩定層級，不互相競爭。

### Accessibility

- 主要文字與互動元素對比是否足夠。
- 所有互動元素是否有可見 focus state。
- 不只靠顏色傳達錯誤、成功、警告或 disabled 狀態。
- 行動版觸控區域是否接近或高於 44px，且不依賴 hover 才能理解資訊。

### Interaction

- hover、focus、pressed、disabled、loading、success、error 是否有一致回饋。
- 動效是否短、可理解、服務任務；避免長時間、循環或大幅位移造成干擾。
- 表單錯誤是否靠近欄位，文案是否具體且可修正。

### RWD

- 1024px 以下是否降低欄數與裝飾密度。
- 768px 以下是否改為單欄或可讀的 stacked layout。
- Toast、popover、浮動 CTA 或 sticky bar 是否避開安全區與內容遮擋。

## 用於 UI Style Guide Review Gate 時

若審查對象是 `design/ui_style_guide.md`，不要要求它包含 feature-specific component spec。請檢查它是否提供足夠的全域視覺語言：

- brand tone 與 visual point of view 是否具體。
- color tokens 是否有使用情境。
- typography、spacing、surface、motion、RWD 是否可落地。
- visual motif 是否來自產品主題，而不是通用裝飾。
- 前台銷售頁與後台管理頁若同時存在，是否有明確密度與 CTA 規則。

完成條件：若問題屬於全域視覺語言缺口，輸出 blocking finding 與 rewrite guidance；若只是單一功能元件細節，建議放到 session `design.md`，不要要求重寫全域 style guide。
