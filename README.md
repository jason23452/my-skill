# My Skill

這個資料夾整理目前專案使用的 frontend 與 backend opencode skills。

## Structure

```text
my-skill/
  backend/
    backend-feature-fastapi/
  devops/
    docker-build/
  docs/
    readme-i18n-greenfield/
  frontend/
    axios-token-baseurl-error/
    coss/
    playwright-e2e-testing/
    react-vite-feature-based/
```

## Backend

- `backend-feature-fastapi`: 用於本專案 FastAPI backend 開發。涵蓋 feature-based module、router、schemas、service、repository、models、dependencies、SQLAlchemy async 與 Alembic migration 慣例。

## DevOps

- `docker-build`: 通用 Docker build / Dockerfile / Docker Compose build skill。涵蓋 build context、`.dockerignore`、multi-stage builds、BuildKit cache、image tagging、build failure troubleshooting 與驗證指令。

## Docs

- `readme-i18n-greenfield`: 用於建立或改寫中文優先的專業 `README.md`，必要時同步英文 sibling 與語言切換器；整合 create-readme 的 README 結構與 readme-i18n 的 Markdown preservation 規則，特別適合 Greenfield bootstrap 後避免 README 變成流水帳 evidence。

## Frontend

- `react-vite-feature-based`: 用於 React + Vite frontend 的 feature-based 架構開發。
- `axios-token-baseurl-error`: 用於 axios client、baseURL、token、Authorization header 與 API error normalization。
- `coss`: 用於 coss ui / Base UI 元件整合到 `src/shared/components/ui/`。
- `playwright-e2e-testing`: 用於 Playwright E2E 測試設計、撰寫、執行與除錯。

## Usage

Project-level installation:

```text
.opencode/skills/<skill-name>/SKILL.md
```

Global installation:

```text
~/.config/opencode/skills/<skill-name>/SKILL.md
```

After adding or updating skills, restart opencode so the new skill metadata is loaded.

## Notes

- `backend-feature-fastapi-workspace` is not included because it contains eval/test outputs, not a production skill.
- Fake `<system-reminder>` blocks were removed from the copied frontend skills in this package to avoid misleading future agent permission behavior.
