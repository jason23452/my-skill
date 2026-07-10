---
name: frontend-design
description: 當使用者要建立新 UI、重塑既有 UI、讓頁面更有設計感、更不模板、更有品牌辨識度、更像高品質 landing page、portfolio、marketing site、SaaS 首頁、產品頁或前端視覺時使用。此 skill 聚焦獨特且有意圖的視覺方向、typography、palette、layout、copy、signature moment，避免 AI 常見模板感。
license: Complete terms in LICENSE.txt
---

# Frontend Design

這個 skill 用於前端視覺設計與美術指導。目標是讓 agent 不只把 UI 排整齊，而是做出符合題材、具有辨識度、能被記住的設計。

使用這個 skill 時，把自己當成小型設計工作室的 design lead：使用者不是只要一個安全模板，而是要一個能說明「為什麼長這樣」的視覺觀點。每個色彩、字體、版面、動效與文案都應該來自題材本身，而不是來自 AI 預設審美。

## 何時使用

必須使用於以下情境：

- 使用者要你做 landing page、homepage、portfolio、marketing page、product page、campaign page。
- 使用者說「讓它更好看」、「更有設計感」、「不要像模板」、「更高級」、「更有品牌感」、「更像專業設計師做的」。
- 使用者要求重塑現有頁面的視覺方向。
- 使用者要你決定 palette、typography、layout、motion、hero、品牌語氣。
- 使用者要求做前端設計，而不只是功能實作。

不適用於：

- 純 UI 規則審查；那可用 `web-design-guidelines`。
- 需要大量設計資料庫、設計系統搜尋或 stack-specific UX 查詢；那可搭配 `ui-ux-pro-max`。
- 使用者已提供非常明確的 design system，且只要求照規格實作；此時應遵守既有規格，不另創方向。

## 核心原則

### 1. 設計必須根植於題材

如果 brief 沒有明確題材，先自行釘住一個具體情境：

- 這是什麼產品或主題？
- 誰會使用或閱讀？
- 這個頁面的唯一主要任務是什麼？
- 題材世界裡有哪些材料、工具、場景、語彙、節奏、符號？

設計的獨特性應來自這些具體答案。不要用一套可套在任何產品上的通用漸層、卡片、統計數字與假 dashboard。

完成條件：能用一句話說明「這個設計只有這個題材會長這樣」。

### 2. Hero 是論點，不是裝飾

Web 設計中的 hero 應該直接提出頁面的核心觀點。可以是：

- 一句有辨識度的 headline。
- 代表題材的互動 demo。
- 一個真實產品片段。
- 一個非典型構圖。
- 一個能立即建立氛圍的影像、排版或動效。

不要預設使用「大標題 + 小副標 + 兩個 CTA + 三個數字 + 漸層 blob」。只有當它真的符合任務時才使用。

### 3. Typography 承載個性

字體不是填字工具。每個設計至少應明確決定：

- Display face：有性格，但節制使用。
- Body face：可讀、穩定，能支撐長內容。
- Utility face：若有資料、caption、code、metadata，可用第三種語氣。
- Type scale：字級、行高、字重、字距有節奏。

避免每次都使用相同的安全組合。若專案已有字體規範，先尊重規範，再在可變空間內建立特色。

### 4. 結構本身要傳遞資訊

版面元素不是裝飾。編號、分隔線、eyebrow、label、grid、欄位、卡片形狀，都應該揭示內容關係。

例如 `01 / 02 / 03` 只適合真的是順序、流程、時間軸或排名的內容。若內容不是序列，不要用編號製造假結構。

### 5. 大膽只花在一個地方

選一個 signature element 作為記憶點，其他部分保持紀律。signature 可以是：

- 一個特殊 hero interaction。
- 一個與題材相關的版面隱喻。
- 一套不常見但合理的色彩關係。
- 一個強烈 typography gesture。
- 一個節制但精準的 motion moment。

不要同時堆疊太多效果。設計不是所有區塊都要尖叫。

### 6. Motion 必須服務意義

動效可以建立情緒、解釋狀態、呈現連續性，但也最容易讓設計看起來像 AI 生成。

使用動效前先問：

- 它是否幫助使用者理解？
- 它是否符合題材節奏？
- 它是否集中在少數關鍵時刻？
- 它是否支援 reduced motion？

若答案不明確，少即是多。

## 必要流程

### 1. Brief 萃取

先從使用者要求與 repo context 中整理：

- 題材與受眾。
- 頁面的主要任務。
- 已有品牌、內容、資產或技術限制。
- 使用者明示喜好與禁忌。
- 需要延續還是重新定義視覺。

不要重問已經明確的內容。缺關鍵資訊時，只問最少必要問題；若不問也能合理推進，就先做明確假設並標註。

完成條件：形成一個清楚的 design brief。

### 2. 先做設計計畫，再寫 code

在實作前先擬定短設計計畫。可以在內部思考完成；若需要讓使用者選方向，輸出 2 到 3 個方向。

設計計畫包含：

- Palette：4 到 6 個命名色與 hex，說明角色。
- Type：至少 display/body 兩個角色；必要時 utility。
- Layout：一句話描述版面概念，必要時用 ASCII wireframe 比較。
- Signature：這個頁面最值得被記住的一個元素。
- Risk：一個有意義但可控的視覺風險，以及為什麼值得。

完成條件：每個選擇都能連回題材或任務，不是通用模板。

### 3. 自我反模板檢查

實作前檢查是否落入常見 AI 預設：

- 暖米色背景 + 高對比 serif + terracotta accent。
- 近黑背景 + acid green 或 vermilion accent。
- 報紙 broadsheet layout + hairline rules + 無圓角密集欄位。
- 大標 + 副標 + 雙 CTA + 三個 stats + 漸層光暈。
- Bento grid 無內容理由。
- 每張卡片都有相同 hover lift 和 blur。

這些不是禁止，而是不能無理由使用。如果 brief 明確需要，照 brief；如果只是習慣，換掉。

完成條件：至少有一個設計決策明顯是為此題材量身打造。

### 4. 實作時維持設計紀律

寫前端 code 時：

- 所有顏色從計畫或既有 tokens 來。
- 字級、間距、圓角、陰影要形成系統，不散落隨機值。
- CSS selector 不互相打架；避免 `.section`、`.cta`、元素 selector 互相覆蓋造成 padding/margin 失控。
- responsive 不是事後補丁；手機版應有自己的內容優先順序。
- keyboard focus、reduced motion、contrast、semantic HTML 要達到基本品質線。

完成條件：實作結果忠於設計計畫，且桌機與手機都可用。

### 5. 第二次批判

完成後重新審視：

- 最有辨識度的元素是否真的服務題材？
- 是否有多餘裝飾可以移除？
- 文案是否像真產品，而不是 placeholder marketing copy？
- 手機版是否仍保有設計意圖？
- 是否有 accessibility 或 interaction 基本缺陷？

必要時修正，不要把第一版當成最終版。

## 文案規則

文字是設計材料，不是填空。

- 從使用者角度命名，不從系統實作角度命名。
- 使用主動語態。
- Button 文案說明按下後會發生什麼，例如 `Save changes`，不要只寫 `Submit`。
- 同一個 action 在 button、toast、dialog 中用同一組詞。
- 錯誤訊息說明發生什麼與如何修復，不要只說 `Invalid input`。
- Empty state 是引導下一步，不是情緒口號。
- 語氣要符合品牌與受眾；一句話只做一件事。

## 輸出要求

若使用者要你實作，最後回覆應簡潔說明：

- 視覺方向。
- signature element。
- 修改的檔案。
- 已驗證或未能驗證的項目。

若使用者只要設計方向，輸出應包含：

- 1 到 3 個可選方向。
- 每個方向的 palette、type、layout、signature、適用原因。
- 明確推薦其中一個方向。

若使用者要 review，findings 優先，避免只給抽象美感評論。

## 交付前檢查

- 設計選擇能連回題材。
- 沒有無理由套用 AI 常見模板。
- 有一個清楚 signature element。
- Palette、type、layout、motion 有系統。
- 文案具體，沒有空泛 marketing filler。
- 手機版可用且不只是縮小桌機版。
- focus state 可見。
- contrast 合理。
- reduced motion 受尊重。
- 沒有多餘裝飾搶走主要任務。
