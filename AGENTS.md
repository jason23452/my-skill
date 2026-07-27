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

## 新增 Skill Metadata 與流程讀取方法
- 新增 `backend/`、`frontend/`、`devops/`、`env/` 下的 skill 時，必須在該 skill 的 `SKILL.md` body 放一個有效的 `opencode-bootstrap-json` fenced block；只改 frontmatter 不足以讓 Greenfield Project Flow 讀到它。
- `opencode-bootstrap-json` 至少要包含：`role`、`category`、`order`、`packageManager`、`scaffoldCommand`、`verificationCommands`。有 runtime 時加 `runtimeSmokeCommand` 與 `runtimeSmokeHealthUrl`；add-on 要加 `frameworks` 與 `requiresPrimarySkills` 或 `requiresUiKitSkills`。
- Primary scaffold skill 必須是 `role:"frontend"` 或 `role:"backend"`、`category:"framework"`，且同時具備非空 `scaffoldCommand`、非空 `verificationCommands`、`runtimeSmokeCommand`、`runtimeSmokeHealthUrl`，Greenfield 才會把它視為可選 scaffold 組合。
- Add-on skill 不能偽裝成 primary scaffold。使用 `category:"testing"`、`category:"database"`、`category:"api-client"`、`category:"docker"`、`category:"compose"`、`category:"state"`、`category:"ui-kit"` 或 `category:"ui-kit-patterns"`，並用 dependency fields 說明它搭配哪個 primary skill。
- Docs-only add-on 若也要出現在 Greenfield 選項中，放一個無副作用的 bundled verification launcher，例如 `scripts/verify-docs-only.cjs`；launcher 只輸出選用狀態，不建立檔案、不安裝套件、不修改 target repo。
- Launcher 必須照既有 skills 的格式同時支援 target project skill cache 與 Docker/preseeded skill cache：先找 `.opencode/skills/<skill>/scripts/...`，找不到再 fallback 到 `${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/<skill>/scripts/...`。
- Greenfield 讀取流程：Docker build 或 skills preload 會把本 repo 的 skills 複製到 `/app/.opencode/skills`；`find-skills` 的 read-only discovery 只讀 build-time/preseeded skills，依 `opencode-bootstrap-json` 產生 `combinationGuide` 與 Project Flow 的 `GREENFIELD_SKILL_SELECTION` 選項。
- Greenfield 新增 skill 後，如果是在本機測試，要確認 `OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR` 指向含有該 skill 的目錄，或重新 build/preload skills；如果是在 Docker/Cloud Run，要 rebuild image，否則 running Project Flow 仍讀不到新 metadata。
- Brownfield 讀取流程：Brownfield 不靠 Greenfield selection gate 自動猜 skill，而是從 target repo 的 `README.md` / `AGENTS.md` 讀 declared skills；要讓 Brownfield 後續流程使用某 skill，必須把 skill name 寫進 target repo 的 README/AGENTS「使用的 Skills」或等效章節。
- Brownfield 新增或移除 repo declared skills 時，要同步更新 target repo README/AGENTS，並保留 evidence line；Project Flow 的 Brownfield add/remove gates 只應套用已確認的 repo-scoped 答案，不要跨 repo 共用選項。
- 修改任何 skill 的 `opencode-bootstrap-json`、責任邊界、是否列為 production skill，或 Brownfield/Greenfield 可讀取方式後，都要同步更新根層 `README.md`，讓人類維護文件與機器 metadata 一致。

## 驗證
- 修改任一 skill 後跑：`python C:/Users/Bojii/.config/opencode/skills/skill-creator/scripts/quick_validate.py <skill-dir>`。
- 修改或新增 bundled script 後跑：`node --check <script>`。
- 若 skill 有 `evals/evals.json`，保持 `skill_name` 對應 skill 目錄/name，並讓 prompts/assertions 驗證該 skill 的邊界，不要測到其他 skill 的責任。
- 新增或更新本 repo 的 skills 後，需要重啟 OpenCode/Codex 才會載入新的 skill metadata。
