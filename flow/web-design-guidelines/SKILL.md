---
name: web-design-guidelines
description: 當使用者要求 review UI、check accessibility、audit design、review UX、檢查網站、審查前端介面、檢查 Web Interface Guidelines、找出 UI/UX 問題、確認網頁是否符合最佳實務時使用。此 skill 會抓取 Vercel Labs Web Interface Guidelines 最新規則，讀取指定檔案或 pattern，並以 file:line findings 格式回報問題。
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Design Guidelines

這個 skill 用於審查 Web UI 程式碼是否符合 Web Interface Guidelines。它不是一般美感建議工具，而是針對具體檔案做規則式 review，輸出可定位、可修復的 findings。

## 何時使用

必須使用於以下情境：

- 使用者說「review my UI」、「check accessibility」、「audit design」、「review UX」。
- 使用者要求檢查網站、頁面、component、form、navigation、dialog、layout 是否符合最佳實務。
- 使用者提供檔案、glob pattern、diff、元件路徑，並要求找 UI/UX 或 accessibility 問題。
- 使用者提到 Web Interface Guidelines、Vercel guidelines、前端介面審查。

不適用於：

- 使用者要你直接設計新視覺方向或產生設計系統；那應搭配或改用 `frontend-design` / `ui-ux-pro-max`。
- 純後端、資料庫、API、build config review。
- 沒有任何檔案或畫面可審查，且使用者只是在討論抽象設計方向。

## 必要流程

### 1. 取得最新 guidelines

每次 review 前都抓取最新規則：

```text
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

使用 WebFetch 讀取內容。該文件包含完整規則與輸出格式要求；以最新抓取內容為準。

完成條件：已讀取最新 guidelines，且 review 依據不是記憶中的舊版本。

### 2. 確認審查範圍

如果使用者提供檔案或 pattern：

- 讀取指定檔案。
- 若 pattern 太寬，先用檔案搜尋確認實際範圍。
- 不要自行審查無關檔案。

如果使用者沒有指定檔案：

- 用一句話詢問要審查哪些檔案或 pattern。
- 不要在沒有範圍時猜測整個 repo。

完成條件：知道要審查哪些檔案，且讀取了足夠上下文。

### 3. 套用 guidelines

逐項檢查 latest guidelines 中的規則，優先找出會造成真實使用者問題的缺陷：

- accessibility：label、focus、keyboard、aria、contrast、semantic HTML。
- interaction：hover-only、loading、disabled、error、touch target。
- layout：responsive、overflow、fixed element、viewport、content hierarchy。
- forms：label、helper、error placement、autocomplete、validation。
- media：alt、image dimension、lazy loading、layout shift。
- navigation：current state、back behavior、landmark、skip link。

完成條件：每個 finding 都能連回 guideline 中的規則，而不是個人偏好。

### 4. 輸出 findings

輸出遵循 fetched guidelines 的格式。若 guidelines 指定 `file:line`，就使用簡潔格式：

```text
path/to/file.tsx:42 - 問題描述。使用者影響。建議修法。
```

排序方式：

1. 阻礙操作或 accessibility 的問題。
2. 會造成錯誤理解、資料遺失、表單無法完成的問題。
3. responsive/mobile 破版。
4. 視覺一致性、可讀性、性能與細節問題。

若沒有發現問題，明確回覆：

```text
No findings.
```

並補充審查範圍與未驗證項目，例如沒有實際瀏覽器截圖、未跑 automated a11y test。

## 安全與邊界

- 不要修改檔案，除非使用者明確要求修復。
- 不要把主觀審美包裝成 guideline violation。
- 不要忽略 fetched guidelines 的輸出規則。
- 如果需要實際瀏覽器驗證但環境不可用，說明限制並給出可手動驗證項目。

## 最小輸出模板

```text
Findings
path/to/file.tsx:12 - <問題>。<影響>。<建議修法>。
path/to/file.tsx:44 - <問題>。<影響>。<建議修法>。

Scope
Reviewed: <files>
Guidelines: Vercel Labs Web Interface Guidelines, fetched at review time

Notes
<未驗證項目或殘餘風險>
```
