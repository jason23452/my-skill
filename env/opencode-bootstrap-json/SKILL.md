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

## 欄位說明

- `role`: 這個 bootstrap entry 代表的簡短角色，例如 `frontend`、`backend`、`fullstack`、`database`、`docs`、`test`、`lint`，或 skill 專用角色。
- `order`: 數字執行順序。單一項目或順序未知時使用 `0`。如果使用者要求多個項目，使用遞增整數。
- `packageManager`: package manager 或 runtime command 類型，例如 `npm`、`pnpm`、`yarn`、`bun`、`pip`、`poetry`、`uv`、`cargo`、`go`、`docker`；不適用時使用空字串。
- `scaffoldCommand`: 用來建立或初始化專案的 command string 陣列。如果專案已存在，或沒有 scaffold 步驟，保持空陣列。
- `verificationCommands`: 用來驗證正確性的 command string 陣列，例如 test、type check、lint、build 或 format check。
- `runtimeSmokeCommand`: 用來啟動 app 或 service 進行基本 runtime smoke test 的單一 command string。沒有 runtime component 時保持空字串。
- `runtimeSmokeHealthUrl`: smoke command 啟動後要檢查的 URL，例如 `http://localhost:5173`、`http://localhost:3000/health`；不適用時保持空字串。

## 輸出格式

使用這個固定結構：

```opencode-bootstrap-json
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

**既有 Vite frontend：**

```opencode-bootstrap-json
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

```opencode-bootstrap-json
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
