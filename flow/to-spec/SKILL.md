---
name: to-spec
description: 將目前對話與 repo context 合成 spec/PRD 並發布到專案 issue tracker；不重新訪談，只整理已經討論清楚的內容。
metadata:
  disable-model-invocation: "true"
---

# To Spec

本 skill 將目前對話、已知產品決策與 codebase 理解合成一份 spec。這份文件也可以被視為 PRD。核心限制是：不要重新訪談使用者；只綜合已經知道的內容，並把缺口列成 open questions。

issue tracker 與 triage label vocabulary 應該已由 `/setup-matt-pocock-skills` 或專案文件提供；若找不到，先回報缺少設定，不要猜測發布位置。

## 流程

1. 探索 repo 現況，若尚未探索過，先讀取相關 README、AGENTS、domain glossary、ADR、package scripts、測試與 feature 附近程式碼。

2. 使用專案既有 domain language 撰寫 spec。尊重既有 ADR 與命名，不重新命名核心概念。

3. 在寫 spec 前，先 sketch feature 的測試 seam。

4. 優先使用既有 seam；若需要新增 seam，選最高層、最穩定、數量最少的 seam。理想上整個 feature 只有一個主要 seam。

5. 若 seam 會影響架構或測試策略，先向使用者確認是否符合期待。

6. 使用下方 template 寫 spec，然後依專案 tracker 規則發布。若 tracker 支援 label，套用 `ready-for-agent` 或專案等價標籤。

## Spec Template

```md
## 問題陳述

從使用者角度描述問題。

## 解法

從使用者角度描述解法與可觀察結果。

## 使用者故事

使用長而完整的編號清單，格式如下：

1. As an [actor], I want a [feature], so that [benefit]

此清單要涵蓋主要路徑、重要變體與邊界情境。

## 實作決策

列出已經做出的實作決策，例如：

- 會新增或修改的 module。
- 會變更的 module interface。
- 技術釐清與架構決策。
- schema changes。
- API contracts。
- 重要互動行為。

不要放容易過期的具體 file paths 或完整 code snippets。

例外：若 prototype 產出的狀態機、reducer、schema 或 type shape 比文字更精準，可貼最小片段，並註明來自 prototype；只保留決策所需部分。

## 測試決策

列出測試決策，例如：

- 好測試的定義：測外部行為，不測 implementation details。
- 會測哪些 module 或 seam。
- codebase 中可參考的既有測試模式。
- 必要的 smoke check、integration test 或 manual QA evidence。

## 不在範圍內

列出本 spec 明確不包含的事項。

## 補充說明

補充背景、assumptions、open questions、後續工作。
```

## 品質規則

- 不要重新打開已經定稿的產品討論。
- 不要新增未討論過的功能。
- 對未知內容使用 `Open Questions`，不要用猜測補齊。
- spec 應足以交給 `to-issues` 或 `to-tickets` 拆成可實作工作。
