# 我的 Skills

這個資料夾整理目前專案使用的 opencode skills。每個 production skill 都應該有 `SKILL.md`，並在檔案開頭使用 YAML frontmatter 提供至少 `name` 與 `description` metadata，讓 opencode 可以建立 skill index 與判斷觸發時機。

## 目錄結構

```text
  my-skill/
  backend/
    backend-feature-fastapi/
  devops/
    docker-build/
    docker-compose-ops/
    pgdb-docker-orm/
  docs/
    readme-i18n-greenfield/
  env/
    opencode-bootstrap-json/
  flow/
    breakdown-feature-prd/
    prd/
    prd-context-to-spec/
    skill-creator/
    task-coordination-strategies/
    to-issues/
    to-spec/
    writing-great-skills/
  frontend/
    axios-token-baseurl-error/
    coss/
    coss-particles/
    playwright-e2e-testing/
    react-vite-feature-based/
    .agents/skills/
      frontend-design/
      web-design-guidelines/
```

## Metadata 規範

每個 `SKILL.md` 開頭都應維持這種基本 metadata：

```yaml
---
name: skill-name
description: 這個 skill 做什麼，以及何時應該使用。
---
```

- `name`: 必須和 skill 資料夾名稱一致，方便安裝、索引與引用。
- `description`: 主要觸發依據；要寫清楚使用情境、關鍵詞與近似說法。
- `compatibility`、`license`、`source`、`version`、`metadata`、`disable-model-invocation` 是可選欄位，只有有實際用途時才加。
- `disable-model-invocation: true` 適合只希望手動呼叫、不希望自動觸發的 workflow/reference skill。
- `opencode-bootstrap-json` 是放在 skill body 內的 fenced block，用來描述 Greenfield scaffold、驗證與 runtime smoke check；只有會影響專案初始化或安裝流程的 skill 需要。

## 後端

- `backend-feature-fastapi`: 用於本專案 FastAPI backend 開發。涵蓋 feature-based module、router、schemas、service、repository、models、dependencies、SQLAlchemy async 與 Alembic migration 慣例。
- Metadata: `name`、`description`、`compatibility`；包含 `opencode-bootstrap-json`。

## 開發維運

- `docker-build`: 通用 Docker build / Dockerfile / Docker Compose build skill。涵蓋 build context、`.dockerignore`、multi-stage builds、BuildKit cache、image tagging、build failure troubleshooting 與驗證指令。
- `docker-compose-ops`: 用於 Docker Compose 設定、啟停、logs、port 衝突、healthcheck、volume、network 與 container troubleshooting。
- `pgdb-docker-orm`: 用於 PostgreSQL Docker image / Docker Compose database service，以及 ORM model、migration、schema/table 開發。
- Metadata: 以上 devops skills 都有 `name`、`description`；`docker-build` 與 `docker-compose-ops` 有 `compatibility`；三者都包含 `opencode-bootstrap-json`。

## 文件

- `readme-i18n-greenfield`: 用於建立或改寫中文優先的專業 `README.md`，必要時同步英文 sibling 與語言切換器；整合 create-readme 的 README 結構與 readme-i18n 的 Markdown preservation 規則，特別適合 Greenfield bootstrap 後避免 README 變成流水帳 evidence。
- Metadata: `name`、`description`；包含 `opencode-bootstrap-json`。

## 環境與 Bootstrap

- `opencode-bootstrap-json`: 用於建立或補齊 `opencode-bootstrap-json` 區塊，描述 Greenfield scaffold、verification commands、runtime smoke commands、health URLs 與 project role routing。
- Metadata: `name`、`description`；這個 skill 本身是 bootstrap metadata 的撰寫規範，不需要在自身 body 內再放 bootstrap block。

## 流程

- `prd`: 由 `github/awesome-copilot` 匯入，用於產生完整 PRD，包含摘要、使用者故事、驗收條件、技術規格與風險分析。
- `breakdown-feature-prd`: 由 `github/awesome-copilot` 匯入，用於把 Epic 或高階功能想法拆成 feature-level PRD。
- `to-spec`: 由 `mattpocock/skills` 匯入；上游已將 `to-prd` 重新命名為 `to-spec`，用於從現有對話與 repo context 合成 spec/PRD，不重新訪談。
- `prd-context-to-spec`: 本地 SDD flow skill，用於把已定稿 `prd.md` 與已凍結 `project-context.md` 轉成 `spec.md`。
- `to-issues`: 本地改寫自 `mattpocock/skills` 的 `to-tickets`，用於把 PRD/spec/plan 拆成可並行實作的 vertical-slice issues。
- `skill-creator`: 由 `anthropics/skills` 匯入，用於建立、測試、benchmark、迭代優化 agent skills；已包含上游 scripts、eval viewer、references。
- `writing-great-skills`: 由 `mattpocock/skills` 匯入，用於審查與改寫 skill 品質，聚焦可預期觸發、資訊階層、漸進揭露與精簡維護。
- `task-coordination-strategies`: 用於拆解複雜任務、設計 dependency graph、協調多 agent 工作。
- Metadata: 以上 flow skills 都有 `name` 與 `description`。`to-spec`、`to-issues`、`writing-great-skills` 使用 `disable-model-invocation: true`，避免 reference/workflow skill 不必要自動觸發；`prd` 有 `license`；`to-issues`、`task-coordination-strategies` 有來源資訊。這類 flow skills 不需要 `opencode-bootstrap-json`。

## 前端

- `react-vite-feature-based`: 用於 React + Vite frontend 的 feature-based 架構開發。
- `axios-token-baseurl-error`: 用於 axios client、baseURL、token、Authorization header 與 API error normalization。
- `coss`: 用於 coss ui / Base UI 元件整合到 `src/shared/components/ui/`。
- `coss-particles`: coss UI particles 範例索引，用於尋找可複製的 UI component patterns。
- `playwright-e2e-testing`: 用於 Playwright E2E 測試設計、撰寫、執行與除錯。
- Metadata: 以上 frontend skills 都有 `name` 與 `description`。`coss`、`coss-particles` 有 `compatibility`、`license` 與 `metadata.author`；`react-vite-feature-based`、`axios-token-baseurl-error`、`coss`、`coss-particles`、`playwright-e2e-testing` 都包含 `opencode-bootstrap-json`。

## Frontend Agent Skills

`frontend/.agents/skills/` 內是前端專用 agent skills：

- `frontend-design`: 用於建立或重塑前端 UI、landing page、dashboard、設計系統與視覺方向。
- `web-design-guidelines`: 用於審查 UI、HTML/CSS、React/Vue 頁面、accessibility、UX 與 design quality。
- Metadata: 兩者都有 `name` 與 `description`。`frontend-design` 有 `license`；`web-design-guidelines` 有 `metadata.author`、`metadata.version` 與 `metadata.argument-hint`。這兩個不是 Greenfield scaffold skill，因此不需要 `opencode-bootstrap-json`。

## 使用方式

專案層級安裝：

```text
.opencode/skills/<skill-name>/SKILL.md
```

全域安裝：

```text
~/.config/opencode/skills/<skill-name>/SKILL.md
```

新增或更新 skills 後，重啟 opencode 才會載入新的 skill metadata。

## 備註

- 未納入 `backend-feature-fastapi-workspace`，因為它包含 eval/test outputs，不是 production skill。
- 已從複製的 frontend skills 移除假的 `<system-reminder>` 區塊，避免誤導後續 agent permission 行為。
- `skills-lock.json` 只記錄部分從外部來源匯入的 skills，不是完整 inventory；完整清單以本 README 與實際 `SKILL.md` 為準。
