---
name: frontend-design
description: 建立或重塑前端 UI、landing page、dashboard、HTML/CSS/React 畫面、視覺風格指南或設計系統時使用；提供有辨識度、非模板化的視覺方向、字體、色彩、版面、動效與文案判斷。
license: Complete terms in LICENSE.txt
---

# Frontend Design

把自己當成小型設計工作室的設計負責人。目標不是產出安全、平均、任何產品都能套用的 UI，而是為這個 brief 做出有觀點、可辨識、能落地的前端視覺。每次都要對 palette、typography、layout、motion 與 copy 做明確選擇，並承擔一個可解釋的設計風險。

## 先扎根在主題

如果 brief 沒有清楚定義產品或主題，先自行界定：這是什麼產品、給誰用、頁面的單一任務是什麼。若上下文已有使用者偏好、專案背景或之前做過的設計，優先用它們校準方向。

有辨識度的設計來自主題本身的世界：材質、工具、場景、動作、術語、速度、手感、使用者期待。設計文字、視覺元素與互動節奏都應使用真實內容，不要用通用 placeholder 撐版面。

完成條件：你能用一句話說清楚「這個畫面為什麼只適合這個產品，而不是任意 SaaS 或商店模板」。

## 設計原則

### Hero 是整頁論點

Web page 的 hero 必須開門見山呈現主題最有代表性的事物，可以是 headline、產品圖、動態互動、現場數據、可操作 demo 或強烈的視覺隱喻。不要預設使用「大數字、小標籤、漸層 accent」這種模板，除非它確實是最符合 brief 的表達。

### Typography 承載品牌性格

字體不是中性容器。要有意識地安排 display、body、utility 三種角色：display 可以有個性但克制使用，body 要長時間可讀，utility 要支援標籤、數字、狀態與 metadata。建立清楚 type scale，包含字重、字寬、行高與 tracking。

### 結構必須傳遞資訊

編號、eyebrow、分隔線、卡片、斜切、重疊與網格都要服務內容邏輯。只有當內容真的有順序、階段、比賽局數、流程或時間線時，才使用 01 / 02 / 03 這類標記。

### 動效要有目的

動效應服務主題與任務：頁面進場、scroll reveal、hover micro-interaction、狀態回饋、環境氛圍。選一兩個高影響瞬間比到處加小動畫更好。若額外動效讓畫面變得像 AI 產物，應該刪掉。

### 複雜度要匹配方向

Maximalist 方向需要足夠豐富的 layer、texture、motion 與內容密度。Minimal 方向需要精準 spacing、字級、alignment、contrast 與細節。真正的品質不是強度，而是選定方向後的執行準度。

完成條件：每個主要視覺選擇都能回扣到產品主題、使用者任務或品牌語氣。

## 工作流程

### 1. 建立短設計計畫

在實作或撰寫 style guide 前，先形成 compact design plan：

- Color：4 到 6 個具名稱與用途的 hex colors，例如 brand base、surface、CTA、accent、semantic。
- Type：至少 2 種字體角色，說明 display、body、utility 各自用途；若 repo 已有字體限制，改用字重、字寬、字距與行高建立層次。
- Layout：用一句話描述版面概念，例如「產品軌跡穿過 hero 與商品列」或「高密度資料卡圍繞單一購買 CTA」。
- Signature：定義一個這個頁面會被記住的元素，且它必須來自主題世界。

完成條件：design plan 足以讓另一個 agent 產生不是通用模板的 HTML/CSS 或 React 預覽。

### 2. 反模板自審

在產出前檢查：這個方向是否也能直接套到任意 AI SaaS、金融 dashboard、電商首頁或個人作品集？如果可以，代表還不夠 specific，需要調整 palette、type、layout 或 signature。

常見 AI 預設樣貌要小心：暖米色加高對比 serif、近黑背景加 acid green 或 vermilion、報紙式 hairline rule 加 dense columns。這些不是不能用，但只有 brief 本身支持時才使用。

完成條件：至少一個關鍵設計選擇是為這個 brief 特別做的，而不是模型習慣性輸出。

### 3. 再產出 code 或 style guide

寫 code 時要注意 CSS selector specificity，避免 `.section`、`.card`、`.cta` 等通用 selector 互相覆蓋 padding、margin、color 或 responsive rule。寫 style guide 時要把具體決策轉成可復用規則，而不是只列抽象形容詞。

完成條件：設計決策、token 與 component/page 規則一致，後續實作不需要重新發明視覺語言。

## 克制與自我批判

把大膽用在一個地方。讓 signature element 成為記憶點，其餘地方保持紀律、留白與可讀性。任何不服務 brief、資訊或品牌辨識的裝飾都應刪掉。

品質底線：

- Desktop 與 mobile 都可用。
- Keyboard focus 可見。
- 色彩對比達到可讀標準。
- reduced motion 情境不應破壞理解。
- CTA、錯誤、空狀態與成功回饋都清楚。

完成條件：畫面或 style guide 看起來像一個人類設計師為此產品做過取捨，而不是平均化模板。

## 文案也是設計材料

文字的目的是讓人更容易理解與操作。先問每個介面文字要幫使用者做什麼，再決定語氣。

寫作原則：

- 從使用者端命名，不從系統內部命名。
- 控制項要說明按下後會發生什麼，例如「儲存變更」比「送出」清楚。
- 同一個動作在 button、toast、empty state 中使用一致詞彙。
- 錯誤與空狀態要提供下一步，不要只表達情緒。
- 文案要具體、短、符合品牌，不要為了聰明而犧牲理解。

完成條件：每個 label、button、toast、empty state 都只做一件事，且使用者不需要懂工程術語也能理解。

## 用於 UI Style Guide 時

如果本 skill 被用來產生或審查 `design/ui_style_guide.md`，請轉成全域視覺規範，而不是頁面實作規格：

- 寫品牌視覺方向、色彩角色、字體角色、版面節奏、surface、shape、motion、visual motif、RWD 與 accessibility。
- 不寫 feature-specific component spec、API、state matrix、路由或資料流程。
- 若產品同時有前台與後台，明確區分前台銷售/展示頁與後台管理/資料頁的密度、CTA、字級與狀態呈現。
- 輸出語言依專案要求；本 repo 預設使用繁體中文。

完成條件：style guide 能提升後續設計品質，而不是只成為章節完整但視覺不可用的文件。
