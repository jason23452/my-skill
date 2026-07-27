# AGENTS.md

## Repo 性質
- 這是 OpenCode/Codex skills source repo，不是應用程式 repo；根層沒有 package manifest、CI workflow 或統一 build/test script。
- 每個 skill 的 source of truth 是自己的 `SKILL.md`，必要時搭配同目錄 `references/`、`scripts/`、`evals/`。
- `skills-lock.json` 只記錄外部匯入 skill 來源與 hash；不要把它當成所有本地 skill 的 manifest。

## 同步範圍
- 本輪維護重點是 `backend/`、`frontend/`、`devops/`、`env/`。
- `flow/` 是流程、規劃、review、reference 類 skills；除非使用者明確要求，不納入 backend/frontend/devops/env skill 同步或邊界調整。
- 若修改 skill 的責任邊界、bootstrap metadata、production skill 清單或驗證方式，同步更新根層 `README.md`。

## Skill 邊界
- Framework skill 只負責 framework scaffold 與基本專案結構；不要順手加入 DB、Docker、E2E、UI kit 或 API business wrapper。
- `backend-feature-fastapi` 負責 FastAPI app factory、core config/middleware、feature router/schema/service；DB/ORM/migration 屬於 `backend-orm-migrations`，PostgreSQL Docker/Compose 屬於 `pgdb-docker-orm`。
- Frontend framework skills 負責 scaffold：`react-vite-feature-based` 是 React/Vite feature layout，`nuxt4-creater` 是 Nuxt 4 app layout。
- `axios-token-baseurl-error` 只負責 transport client、base URL、token hook、generic methods、error normalization；business endpoint wrapper 留在 owning feature/domain/module。
- UI kit skills 只安裝與設定自己的直接依賴；`coss-particles` 是 pattern index，依賴 `coss` 後才使用。
- Testing skill 只處理測試策略、工具、測試檔與驗證；不要污染 framework scaffold。
- DevOps skill 只有在使用者要求 Docker、Compose、image build 或 container runtime 時使用。
- `env/opencode-bootstrap-json` 是 metadata 規範 skill；它本身不要放 executable bootstrap block。

## Metadata 規則
- 每個 `SKILL.md` frontmatter 至少要有 `name` 與高觸發精度的 `description`。
- 可執行 bootstrap metadata 放在 skill body 的 `opencode-bootstrap-json` fenced block；`env/opencode-bootstrap-json` 的範例刻意用 `jsonc` fence，避免它自己被當成 executable metadata。
- Framework scaffold metadata 使用 `category:"framework"`，並把昂貴的 project-wide compile/build 放在 `verificationCommands`，例如 `pnpm build` 或 `uv run python -m compileall app`。
- Add-on metadata 必須用明確 `category`、`frameworks`、`requiresPrimarySkills` 或 `requiresUiKitSkills` 表達依賴；verification 只檢查 add-on 自己的整合狀態。
- 多步驟 scaffold 邏輯放 `scripts/*.cjs`，metadata 只保留短 launcher，並同時支援 `.opencode/skills/<skill>/...` 與 `${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/<skill>/...`。
- Add-on bootstrap 要偵測既有 lockfile/package manager；不要把 npm/yarn/bun 專案改成 pnpm。
- Runtime smoke command 有 health URL 時要啟動在 `$PORT`；React/Vite 與 FastAPI 既有 smoke script 使用 sandbox，不要直接從 `/workspace` 跑 dev server 當 readiness 依據。

## 驗證
- 修改任一 skill 後跑：`python C:/Users/Bojii/.config/opencode/skills/skill-creator/scripts/quick_validate.py <skill-dir>`。
- 修改或新增 bundled script 後跑：`node --check <script>`。
- 若 skill 有 `evals/evals.json`，保持 `skill_name` 對應 skill 目錄/name，並讓 prompts/assertions 驗證該 skill 的邊界，不要測到其他 skill 的責任。
- 新增或更新本 repo 的 skills 後，需要重啟 OpenCode/Codex 才會載入新的 skill metadata。
