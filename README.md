# 我的 Skills

這個資料夾整理目前專案使用的 frontend 與 backend opencode skills。

## 目錄結構

```text
  my-skill/
  backend/
    backend-feature-fastapi/
  devops/
    docker-build/
  docs/
    readme-i18n-greenfield/
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
    playwright-e2e-testing/
    react-vite-feature-based/
```

## 後端

- `backend-feature-fastapi`: 用於本專案 FastAPI backend 開發。涵蓋 feature-based module、router、schemas、service、repository、models、dependencies、SQLAlchemy async 與 Alembic migration 慣例。

## 開發維運

- `docker-build`: 通用 Docker build / Dockerfile / Docker Compose build skill。涵蓋 build context、`.dockerignore`、multi-stage builds、BuildKit cache、image tagging、build failure troubleshooting 與驗證指令。

## 文件

- `readme-i18n-greenfield`: 用於建立或改寫中文優先的專業 `README.md`，必要時同步英文 sibling 與語言切換器；整合 create-readme 的 README 結構與 readme-i18n 的 Markdown preservation 規則，特別適合 Greenfield bootstrap 後避免 README 變成流水帳 evidence。

## 流程

- `prd`: 由 `github/awesome-copilot` 匯入，用於產生完整 PRD，包含摘要、使用者故事、驗收條件、技術規格與風險分析。
- `breakdown-feature-prd`: 由 `github/awesome-copilot` 匯入，用於把 Epic 或高階功能想法拆成 feature-level PRD。
- `to-spec`: 由 `mattpocock/skills` 匯入；上游已將 `to-prd` 重新命名為 `to-spec`，用於從現有對話與 repo context 合成 spec/PRD，不重新訪談。
- `prd-context-to-spec`: 本地 SDD flow skill，用於把已定稿 `prd.md` 與已凍結 `project-context.md` 轉成 `spec.md`。
- `to-issues`: 本地改寫自 `mattpocock/skills` 的 `to-tickets`，用於把 PRD/spec/plan 拆成可並行實作的 vertical-slice issues。
- `skill-creator`: 由 `anthropics/skills` 匯入，用於建立、測試、benchmark、迭代優化 agent skills；已包含上游 scripts、eval viewer、references。
- `writing-great-skills`: 由 `mattpocock/skills` 匯入，用於審查與改寫 skill 品質，聚焦可預期觸發、資訊階層、漸進揭露與精簡維護。
- `task-coordination-strategies`: 用於拆解複雜任務、設計 dependency graph、協調多 agent 工作。

## 前端

- `react-vite-feature-based`: 用於 React + Vite frontend 的 feature-based 架構開發。
- `axios-token-baseurl-error`: 用於 axios client、baseURL、token、Authorization header 與 API error normalization。
- `coss`: 用於 coss ui / Base UI 元件整合到 `src/shared/components/ui/`。
- `playwright-e2e-testing`: 用於 Playwright E2E 測試設計、撰寫、執行與除錯。

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
