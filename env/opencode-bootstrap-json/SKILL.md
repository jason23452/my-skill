---
name: opencode-bootstrap-json
description: 建立或補齊 opencode-bootstrap-json 區塊，用於新專案、scaffold、runtime、驗證流程或 skill bootstrap metadata。當使用者要求 bootstrap JSON、scaffold commands、package manager 設定、verification commands、runtime smoke checks、health URLs、project roles、排序 setup steps，或要求補齊 opencode-bootstrap-json 格式時使用，即使使用者只是貼上 JSON 骨架也要使用。
---

# OpenCode Bootstrap JSON

使用這個 skill 產生精簡的 `opencode-bootstrap-json` 區塊，用來描述專案、工作流程或產生的 skill 應該如何初始化與驗證。

## 工作流程

1. 從使用者需求、repository 檔案與專案慣例推斷可填入的欄位。
2. 優先使用專案現有指令，不要自行發明指令。可檢查 `package.json`、`pnpm-lock.yaml`、`yarn.lock`、`package-lock.json`、`pyproject.toml`、`requirements.txt`、`Cargo.toml`、`go.mod`、`docker-compose.yml` 與 README 等常見檔案。
3. 如果無法有把握地判斷欄位內容，保留空值，不要猜測。
4. 只有在缺少某個值會阻礙產生有用 bootstrap plan 時，才問一個聚焦的追問。
5. 除非使用者要求編輯檔案，否則用標記為 `opencode-bootstrap-json` 的 fenced code block 輸出 JSON。
6. 如果要把 metadata 寫進某個 skill，任何長指令或多步驟檔案產生邏輯都要搬到該 skill 的 bundled script，metadata 只保留短 script launcher。

## 欄位說明

- `role`: 這個 bootstrap entry 代表的 repo routing 角色。Greenfield repo 分派只接受 `frontend`、`backend`、`any`：`frontend` 只套前端 repo，`backend` 只套後端 repo，`any` 代表明確通用並套到每個開發 repo。不要把未知 role 當成 `any`。
- `order`: 數字執行順序。單一項目或順序未知時使用 `0`。如果使用者要求多個項目，使用遞增整數。
- `packageManager`: package manager 或 runtime command 類型，例如 `npm`、`pnpm`、`yarn`、`bun`、`pip`、`poetry`、`uv`、`cargo`、`go`、`docker`；不適用時使用空字串。
- `scaffoldCommand`: 用來建立或初始化專案的 command string 陣列。如果專案已存在，或沒有 scaffold 步驟，保持空陣列。
- `verificationCommands`: 用來驗證正確性的 command string 陣列，例如 test、type check、lint、build 或 format check。
- `runtimeSmokeCommand`: 用來啟動 app 或 service 進行基本 runtime smoke test 的單一 command string。沒有 runtime component 時保持空字串。
- `runtimeSmokeHealthUrl`: smoke command 啟動後要檢查的 URL，例如 `http://localhost:5173`、`http://localhost:3000/health`；不適用時保持空字串。

## 長指令與 bundled scripts

避免在 metadata 裡放超長 command。OpenCode permission、shell quoting、Windows escaping 與 log rendering 都會因為巨大 `node -e "..."` 變慢或破壞語法。

當 `scaffoldCommand` 或 `verificationCommands` 符合任一條件時，改成 bundled script：

- command 超過約 300 字元。
- command 包含 `node -e`、大量 quote/backslash、regex、JSON/string template 或多個檔案寫入。
- command 需要多步驟控制流程、watchdog、polling、timeout 或跨平台 path handling。

做法：

1. 在同一個 skill 目錄建立 `scripts/bootstrap-<name>.cjs`。
2. 把實作放進 script；用 `.cjs` 避免目標專案的 `type: module` 影響執行。
3. metadata 只寫短 launcher，優先執行 target project 已初始化的 skill script，否則 fallback 到 Docker/global preseeded skills：

```json
"if test -f .opencode/skills/<skill-name>/scripts/bootstrap-<name>.cjs; then node .opencode/skills/<skill-name>/scripts/bootstrap-<name>.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/<skill-name>/scripts/bootstrap-<name>.cjs; fi"
```

保留 inline command 只適合簡短穩定的 CLI，例如 `pnpm add axios`、`uv init`、`uv add "fastapi[standard]>=0.115.0"`。不要在 Greenfield bootstrap runtime 再安裝 skills；skills 應由 global/preseeded skills manager 提供。

## 輸出格式

使用這個固定結構：

```jsonc
{
  "role": "",
  "order": 0,
  "packageManager": "",
  "scaffoldCommand": [],
  "verificationCommands": [],
  "runtimeSmokeCommand": "",
  "runtimeSmokeHealthUrl": ""
}
```

## 範例

以下範例用 `jsonc` fence，避免這個說明 skill 本身被 Greenfield bootstrap parser 誤判成 executable metadata。實際回覆使用者或寫入其他 skill metadata 時，仍要使用 `opencode-bootstrap-json` fence。

**既有 Vite frontend：**

```jsonc
{
  "role": "frontend",
  "order": 0,
  "packageManager": "pnpm",
  "scaffoldCommand": [],
  "verificationCommands": ["pnpm lint", "pnpm build"],
  "runtimeSmokeCommand": "pnpm dev --host 0.0.0.0",
  "runtimeSmokeHealthUrl": "http://localhost:5173"
}
```

**新的 FastAPI backend：**

```jsonc
{
  "role": "backend",
  "order": 0,
  "packageManager": "uv",
  "scaffoldCommand": ["uv init"],
  "verificationCommands": ["uv run pytest"],
  "runtimeSmokeCommand": "uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000",
  "runtimeSmokeHealthUrl": "http://localhost:8000/health"
}
```

**skill metadata 需要產生多個檔案時：**

把實作放在 `scripts/bootstrap-app-files.cjs`，metadata 只放短 launcher：

```jsonc
{
  "role": "frontend",
  "order": 10,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm create vite . --template react-ts --no-interactive",
    "if test -f .opencode/skills/react-vite-feature-based/scripts/bootstrap-app-files.cjs; then node .opencode/skills/react-vite-feature-based/scripts/bootstrap-app-files.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/react-vite-feature-based/scripts/bootstrap-app-files.cjs; fi"
  ],
  "verificationCommands": ["pnpm build"],
  "runtimeSmokeCommand": "pnpm dev --host 127.0.0.1 --port $PORT --strictPort",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/"
}
```
