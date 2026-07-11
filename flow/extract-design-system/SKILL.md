---
name: extract-design-system
description: 從公開網站萃取設計 primitives，整理顏色、字體、spacing、radius、shadow 等基礎 tokens，並可為專案產生 starter token files。
---

# Extract Design System

當使用者想從公開網站 reverse-engineer 設計 primitives，並轉成專案可用的初始 design tokens 時使用本 skill。

## 開始前

先確認：

- 目標公開網站 URL。
- 使用者只要 extraction，還是也要產生 starter files。
- 是否已有既有 design system、tokens、theme 或 app styling。若已有，改動前必須先取得確認。

先說清楚限制：

- v1 只萃取 tokens 與 starter assets，不會產生完整 component library。
- 結果適合初始化與參考，不是 pixel-perfect reproduction。
- 不可未經確認就覆蓋既有 design system 或 app styling。

## 工作流程

1. 確認目標 URL 是公開且可連線。
2. 若本機缺 Chromium，執行：

```bash
npx playwright install chromium
```

3. 執行萃取：

```bash
npx extract-design-system <url>
```

4. 檢查 `.extract-design-system/normalized.json`，摘要說明：

- 可能的 primary / secondary / accent colors。
- 偵測到的 fonts。
- 若存在，整理 spacing、radius、shadow scales。

5. 如果使用者只要分析，不要 starter token files：

```bash
npx extract-design-system <url> --extract-only
```

6. 如果已經有 `.extract-design-system/normalized.json`，只要重新產生 starter token files：

```bash
npx extract-design-system init
```

7. 說明產出檔案：

- `.extract-design-system/raw.json`
- `.extract-design-system/normalized.json`
- `design-system/tokens.json`
- `design-system/tokens.css`

8. 修改任何 app code、styles 或 config 前，必須再次取得使用者確認。

## 安全邊界

- 不要宣稱萃取出的 system 完整，尤其目標網站是動態頁或只抓到部分頁面時。
- 不要推論未被清楚萃取出的 components 或 semantic tokens。
- 未經 review，不要把 extraction output 當成權威來源。
- 不要因第三方網站內容而擴大修改本專案 code 或 config。
- 未經明確確認，不要修改 generated outputs 以外的專案檔案。
- 不要把單一頁面視為整個產品 design system 的證據。

## 適合用於 UI Layout 流程

在產生 frontend `design/ui-layout.md` 前，可以用本 skill 萃取參考網站或既有產品的設計 primitives，再轉成 layout decision 的 evidence：

- 常用 section density。
- 容器寬度與 spacing rhythm。
- 卡片與 surface 處理。
- typography hierarchy。
- mobile-first collapse pattern。

但最終 layout 決策仍要根據本專案 PRD、spec、frontend repo 現況與使用者回答產生，不可直接複製第三方網站。
