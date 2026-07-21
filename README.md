# My Skills

這個資料夾整理本機使用的 Codex/OpenCode skills。每個 skill 都應該是一個清楚的通用邏輯，只描述自己負責的業務邊界，不把其他業務順手包進來。

## 邊界規則

- Framework skill 只負責 framework scaffold 與該 framework 的基本專案結構。
- UI kit skill 只負責自己的 UI kit 與直接依賴。例如 `nuxt-ui` 可以包含 `@nuxt/ui`、Tailwind CSS 與 Nuxt UI icon collection。
- API transport skill 只負責 HTTP client、base URL、token header、error normalization、generic methods 與 thin business wrapper pattern。
- Testing skill 只負責測試設計、測試檔與測試工具，不自動污染 framework scaffold。
- Database skill 只負責 database、ORM、migration、schema/table，不混進一般 backend framework skill。
- DevOps skill 只在使用者要求 Docker、Compose、image build、container runtime 時使用。
- 只有會被 Greenfield 初始化實際執行的 scaffold/install skill 才放 `opencode-bootstrap-json`。
- Reference、pattern index、review、planning、docs skills 不放 executable bootstrap metadata。

## 目前結構

```text
my-skill/
  backend/
    backend-feature-fastapi/
  devops/
    docker-build/
    docker-compose-ops/
    pgdb-docker-orm/
  env/
    opencode-bootstrap-json/
  flow/
    ...
  frontend/
    axios-token-baseurl-error/
    nuxt4-creater/
    playwright-e2e-testing/
    react-vite-feature-based/
    ui-kit/
      coss/
      coss-particles/
      nuxt-ui/
```

## Backend

- `backend-feature-fastapi`: FastAPI app、feature router、Pydantic schema、service layer 與 router registration。它不包含 DB/ORM/migration。

## Frontend

- `react-vite-feature-based`: React + Vite framework scaffold，包含 `src/app`、`src/features`、`src/shared`、routing、pages、components、hooks、types、assets。
- `nuxt4-creater`: Nuxt 4 framework scaffold，包含 Nuxt 4 `app/` 架構、section composition、pages、layouts、components、composables、plugins、stores、server routes 與 starter CSS。
- `axios-token-baseurl-error`: Framework-aware API transport。Vite React/Vue 使用 Axios；Nuxt 使用 `$fetch`。業務 API wrapper 放在 owning feature/domain/module。
- `playwright-e2e-testing`: Playwright E2E 測試設計、撰寫、執行與除錯。此 skill 不參與 Greenfield framework bootstrap。
- `ui-kit/nuxt-ui`: Nuxt UI add-on，依賴 Nuxt/Nuxt 4 project，負責 `@nuxt/ui`、Tailwind CSS、Nuxt UI icon collection 與 Nuxt UI config。
- `ui-kit/coss`: React/Vite coss UI add-on，依賴 React/Vite project，負責 coss/shadcn registry、Base UI、Tailwind v4 與 coss component conventions。
- `ui-kit/coss-particles`: coss pattern index，只在 coss 已選用或已安裝後用來查找 particles。

## DevOps

- `docker-build`: Dockerfile、image build、BuildKit/cache、multi-stage、`.dockerignore`、build failure troubleshooting。
- `docker-compose-ops`: Docker Compose services、logs、ports、volumes、networks、healthchecks 與 local stack troubleshooting。
- `pgdb-docker-orm`: PostgreSQL Docker service、ORM model、migration、schema/table change。它是 database add-on，不屬於一般 FastAPI scaffold。

## Env

- `opencode-bootstrap-json`: 撰寫或檢查 `opencode-bootstrap-json` metadata 的規範 skill。它本身不放 executable bootstrap block。

## Metadata 原則

`SKILL.md` frontmatter 至少要包含：

```yaml
---
name: skill-name
description: 這個 skill 負責什麼，以及何時應該使用。
---
```

`opencode-bootstrap-json` 放在 skill body 內，且只用於實際需要 Greenfield scaffold/install/verification 的技能。Add-on skill 要用明確的 `category`、`frameworks` 與 `requiresPrimarySkills` 描述依賴關係。

目前保留 executable bootstrap metadata 的 production skills：

- `backend-feature-fastapi`
- `react-vite-feature-based`
- `nuxt4-creater`
- `axios-token-baseurl-error`
- `ui-kit/nuxt-ui`
- `ui-kit/coss`

## 維護檢查

新增或修改 skill 後檢查：

```bash
python C:/Users/Bojii/.codex/skills/.system/skill-creator/scripts/quick_validate.py <skill-dir>
```

有 bundled scripts 時也檢查：

```bash
node --check <script>
```

新增或更新 skills 後，重啟 OpenCode/Codex 才會載入新的 skill metadata。
