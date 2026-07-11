---
name: readme-i18n-greenfield
description: 建立、重寫或改善中文 repository README.md，尤其是 Greenfield repo bootstrap、OpenCode 自動 scaffold 後的 README、README 很像流水帳 evidence、或需要中英雙語/多語 README 與語言切換器時必須使用。預設以繁體中文撰寫 README.md，整合 create-readme 的專業 README 結構與 readme-i18n 的 Markdown/i18n preservation 規則，避免硬寫不存在的 API、Docker、DB 或 port。
---

# README 雙語 Greenfield

這個 skill 用於產生專業、可維護、中文優先的 repository README。它整合兩個來源 skill 的做法：

- `create-readme`：專業 README 結構、精簡、GitHub Flavored Markdown、不要濫用 emoji、不要塞 `LICENSE` / `CONTRIBUTING` / `CHANGELOG` 這類應獨立成檔的段落。
- `readme-i18n`：README 本地化、語言切換器、保留 Markdown 結構、命令、路徑、環境變數、URL、badge、code fences 與 anchors。

來源改寫摘要在 `references/source-create-readme.md` 與 `references/source-readme-i18n.md`。Markdown 保留規則在 `references/preservation-checklist.md`，語言切換器規則在 `references/language-selector-reference.md`。

## 使用時機

使用這個 skill 處理：

1. 新 Greenfield repo bootstrap 完成後產生中文 `README.md`。
2. 現有 `README.md` 很粗糙、像工具 evidence、缺少 setup / usage / verification / project structure 時重寫。
3. 需要建立中文 README，或需要同步建立英文 sibling，例如 `README.en.md`。
4. 需要加入或更新 README 語言切換器。
5. 需要翻譯 README，但不能破壞 code block、commands、links、anchors、badge URLs。

## 預設語言策略

- 預設主要檔案是繁體中文 `README.md`。
- 只有使用者明確要求英文或多語，才建立英文 sibling，例如 `README.en.md`。
- 如果 repo 已經使用 `README.md` 作英文、`README.zh.md` 作中文，保留既有命名慣例，不要強制改名。
- 如果使用者說「都用中文」、「全部中文」或同義需求，只產生/更新中文 `README.md`，不要新增英文版本。

## 核心原則

README 是給下一位開發者、reviewer 或使用者快速理解專案，不是 bootstrap log。

應該做到：

- 先檢查 repo 內容再寫，不要只根據 repo name 或 PRD 猜。
- 只描述可從檔案、指令、package metadata、skill metadata 或使用者已確認資訊支持的事。
- 不要硬寫不存在的 `/api`、`/api/health`、Docker、PostgreSQL、port、cloud、database、auth、payment、queue、worker。
- 如果某資訊未知，使用「待補」或省略該段，不要假裝存在。
- 使用 GitHub Flavored Markdown，簡潔、專業、可掃讀。
- 不濫用 emoji；除非 repo 已有明確品牌風格。
- 不包含 `License`、`Contributing`、`Changelog` 段落，除非 repo 沒有獨立檔且使用者要求。
- 生成多語 README 時，所有語言版本章節順序必須一致。

## `## 使用的 Skills` 保留規則

更新既有 repo README 時，不要把既有 `## 使用的 Skills` 整段覆蓋成只剩本輪使用的 README skill。必須先判斷 repo 是否真的仍使用過去的 skills：

- 先讀既有 `README*`、`AGENTS.md`、`.opencode/skills/**/SKILL.md`、`.opencode/opencode.json` / `opencode.json`、docs、scripts/config 中是否有 skill 名稱、`skill(...)`、bootstrap metadata、handoff 記錄或明確用途。
- 有 repo evidence 的舊 skill 必須保留，並補齊用途與套用範圍。
- 沒有 repo evidence、只有舊 README 表格殘留、或無法說明用途/套用範圍的舊 skill 才移除。
- Brownfield 本輪沒有經 project-flow 新選 bootstrap skills，不代表 repo 沒有使用過去的 skills；不可因此刪除已驗證的既有 skills。
- 本輪實際用於 README handoff 的 `readme-i18n-greenfield` 可以加入或更新，但應與已驗證保留的既有 skills 並存。

建議表格欄位：`Skill`、`用途`、`套用範圍`。每列都要能對應 repo evidence；不要只列 skill 名稱。

## 寫 README 前的檢查

至少檢查這些檔案或資料夾，存在才引用：

- package / runtime：`package.json`、`pnpm-lock.yaml`、`package-lock.json`、`yarn.lock`、`bun.lockb`、`pyproject.toml`、`requirements.txt`、`uv.lock`、`go.mod`、`Cargo.toml`
- app structure：`src/`、`app/`、`backend/`、`frontend/`、`tests/`、`docs/`
- config：`vite.config.*`、`next.config.*`、`tsconfig*.json`、`Dockerfile`、`docker-compose*.yml`、`.env.example`
- scripts：`package.json scripts`、Makefile targets、documented shell scripts
- existing docs：既有 `README*`、`docs/*`
- skills evidence：既有 `## 使用的 Skills`、`AGENTS.md`、`.opencode/skills/**/SKILL.md`、`opencode.json`、docs/scripts/config 中的 skill references

## 中文 README.md 推薦結構

依專案內容取捨，不要無腦塞滿。以下是中文優先模板：

````md
# <專案名稱>

<!-- README-I18N:START -->

**中文** | [English](./README.en.md)

<!-- README-I18N:END -->

用一到兩句話具體說明這個 repo 包含什麼、服務誰、目前狀態是什麼。

## 專案概述

說明專案用途、目前完成範圍、重要邊界與非目標。

## 功能

- 實際存在或已 scaffold 的能力。
- 另一個有具體描述的能力。

## 技術棧

- 從檔案推斷出的 runtime / framework。
- 從 lockfile 或 scripts 推斷出的 package manager / build tool。

## 專案結構

```text
.
├── src/
└── ...
```

## 開始使用

### 前置需求

- 已知的 Node.js / Python / Docker 版本；未知時不要亂寫。

### 安裝

```bash
<真實 install command>
```

### 啟動

```bash
<真實 dev/start command>
```

## 驗證

```bash
<真實 test/build/typecheck command>
```

## 環境變數

只記錄 `.env.example`、config 或 source code 實際出現的變數。

## 備註

放重要 implementation note、bootstrap note 或維護提醒。不要把第一屏變成 generated evidence。
````

## Greenfield repo 專用規則

Greenfield bootstrap 產生 README 時，通常資訊有限。請使用「可驗證資訊優先」：

- Project name：使用 repo name 或 package name。
- 專案概述：描述目前 scaffold 產物與用途，不要寫成已完成產品。
- 功能：僅列出 scaffold 已建立、PRD 明確要求且 repo 已落地的能力。
- 技術棧：從檔案推斷，例如 `vite.config.ts`、`FastAPI` app、`pyproject.toml`、`package.json`。
- 專案結構：最多列 10-16 個重要路徑，避開 `node_modules`、`.git`、cache、build output。
- 開始使用：只使用實際存在 scripts 或 skill metadata 給出的命令。
- 驗證：只使用實際已執行或可從 metadata 得到的 verification commands。
- Runtime smoke：如果有 `runtimeSmokeCommand` / `runtimeSmokeHealthUrl`，放在「驗證」或「啟動」段落，命令不可翻譯。
- Repository：可列 ADO remote URL、branch，但不要把 PAT 或 credential 寫入 README。
- Provenance：如需標記 OpenCode bootstrap，放在「備註」最後一小段，不要放在第一屏。

不要產生這些不實內容：

- 「Frontend calls backend through /api」除非 repo 有 proxy/fetch/config 支持。
- 「Backend health endpoint: /api/health」除非 route 存在。
- 「PostgreSQL service: db:5432」除非 compose 或 config 存在。
- 「Docker compose validation」除非有 compose file。
- 固定 port `5173` / `8000`，除非 scripts 或 config 寫明。

## 多語 README 規則

建立英文或其他語言版本時：

- `README.md` 與 sibling README 章節順序一致。
- 翻譯 prose，不翻譯 commands、inline code、file paths、URLs、env vars、package names、repo names、badge/image URLs。
- code fences 數量、語言標籤與內容保持一致。
- 相對連結預設保持原目標；只有 README 語言切換器需要指向 sibling README。
- 若標題翻譯會影響 same-file anchor，更新 `(#...)` links。
- 中文使用自然繁體中文；專有名詞如 `OpenCode`、`Greenfield`、`README`、`GitHub Flavored Markdown` 可保留英文。

## 語言切換器

每個 README variant 頂部只保留一個 selector block。

中文主檔：

```md
<!-- README-I18N:START -->

**中文** | [English](./README.en.md)

<!-- README-I18N:END -->
```

英文 sibling：

```md
<!-- README-I18N:START -->

[中文](./README.md) | **English**

<!-- README-I18N:END -->
```

若已有 selector：

- 有 `README-I18N` marker 時，只替換 marker 中間內容。
- 沒有 marker 但頂部已有明顯語言切換器時，就地正規化，不要新增第二個。

## 最終驗證

完成後檢查：

- 中文 `README.md` 存在。
- 如果有多語版本，每個 README 剛好一個 `README-I18N` selector block。
- code fence 數量一致。
- commands、URLs、env vars、file paths 未被翻譯。
- README 沒有硬寫不存在的 API、Docker、DB、port。
- 若有 same-file anchor links，目標都存在。
- README 第一屏不是 generated evidence，而是專案介紹。
- 既有 `## 使用的 Skills` 已完成 reconcile：有 evidence 的舊 skills 被保留，無 evidence 的舊 skills 才被移除，本輪 `readme-i18n-greenfield` 不會覆蓋掉其他仍有效的 skills。

## 輸出要求

當使用者要求建立或改寫 README：

- 直接編輯 repo 內 README 檔案，不只給範例。
- 簡短回報建立/更新的檔案。
- 列出任何刻意保留英文的專有名詞。
- 如果資訊不足導致省略某段，簡短說明，不要腦補。

## Greenfield Bootstrap Metadata

這個 skill 本身不 scaffold app code，因此不提供可執行 scaffold command。它可作為 `any` role 的 README/publish 指導 skill。

```opencode-bootstrap-json
{
  "role": "any",
  "order": 90,
  "packageManager": "",
  "scaffoldCommand": [],
  "verificationCommands": [],
  "runtimeSmokeCommand": "",
  "runtimeSmokeHealthUrl": ""
}
```
