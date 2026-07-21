---
name: docker-compose-ops
description: >-
  當使用者要建立、檢查、啟動、停止、排錯、修復或泛化 Docker Compose 設定時，使用這個 skill。適用 docker-compose.yml、compose.yaml、service 啟動、container logs、port 衝突、環境變數、volumes、networks、healthchecks、資料庫容器、前後端 stack，或 "docker compose up" 失敗。使用者只要提到 "compose"、"docker-compose"、"啟動容器"、"啟動前後端"、"用 Docker 跑專案"、"修 docker-compose.yml"、"容器起不來"、"port 被佔用"，或預期有 docker-compose.yml 但檔案不存在且需要找出正確 Compose 流程時，都應優先使用。
---

# Docker Compose Ops

## Bootstrap Boundary

Docker Compose setup is a DevOps add-on. Apply this skill when the user asks for Compose services, container orchestration, local stack wiring, logs, ports, volumes, networks, or healthchecks.

```opencode-bootstrap-json
{
  "role": "any",
  "category": "compose",
  "order": 60,
  "packageManager": "node",
  "scaffoldCommand": [
    "if test -f .opencode/skills/docker-compose-ops/scripts/bootstrap-02-01.cjs; then node .opencode/skills/docker-compose-ops/scripts/bootstrap-02-01.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/docker-compose-ops/scripts/bootstrap-02-01.cjs; fi"
  ],
  "verificationCommands": [
    "node -e \"const fs=require('fs'); if(!['compose.yaml','compose.yml','docker-compose.yml','docker-compose.yaml'].some((file)=>fs.existsSync(file))) process.exit(1);\""
  ]
}
```

多 repo Greenfield 時，project-level compose 必須把 frontend、backend、db 放在同一個 stack 中；repo-local compose 承載單 repo runtime。前端透過 `/api` proxy 呼叫後端，backend 在 Compose network 內使用 `db:5432` 連 database。

使用這個 skill 安全地操作與排查 Docker Compose 專案。Compose 工作通常不是只看單一檔案，而是整個 runtime graph：repository 結構、service 相依、環境變數、ports、volumes、healthchecks、networks 與 logs 都要一起檢查。

## 初始檢查

1. 執行指令前，先確認 workspace 並找出 Compose 檔案。
2. 優先使用專案已定義的 Compose 檔與 README/script 裡的既有指令。
3. 如果預期的 `docker-compose.yml` 不存在，先搜尋 `compose.yaml`、`compose.yml`、`docker-compose.yaml`、`docker/` 目錄下的檔案，或 `README.md` 中記錄的啟動方式。
4. 如果完全沒有 Compose 檔，先回報缺少 Compose source；使用者要求建立時，產生最小可用的本機 Compose 檔。
5. 保留使用者既有變更。volumes、資料庫、無關容器與 `.env` 檔都以使用者同意與明確範圍為準。

常用探索指令：

```bash
docker --version
docker compose version
docker compose ls
docker compose ps
docker ps -a
```

使用檔案搜尋工具尋找：

```text
compose.yaml
compose.yml
docker-compose.yml
docker-compose.yaml
Dockerfile*
.env*
README.md
package.json
pyproject.toml
requirements*.txt
```

## 啟動前驗證

當 Compose 檔存在或剛被修改後，先執行 config 驗證：

```bash
docker compose config
docker compose -f <compose-file> config
```

這能提早抓出 YAML 錯誤、無效 service 欄位、缺少環境變數插值，以及 override merge 後的意外設定。驗證失敗時，先修 config，再跑 `up`。

## 指令選擇

使用最符合專案設定的最簡單指令：

```bash
docker compose up -d
docker compose up -d <service>
docker compose up --build <service>
docker compose build <service>
docker compose logs --no-color <service>
docker compose ps
```

本機開發時，如果 service 已經有 build 設定與相依服務，優先用 `docker compose up -d <service>`。只有在 Dockerfile、lockfile、package manifest 或 build args 有變更時，才使用 `--build`。

如果文件指定多個 Compose 檔，要保留原本順序：

```bash
docker compose -f compose.yaml -f compose.dev.yaml up -d
```

## 啟動流程

1. 用 `docker compose config` 驗證設定。
2. 視情況先啟動相依服務，尤其是 database、queue、cache。
3. 啟動 application services。
4. 用 `docker compose ps` 檢查服務狀態。
5. 讀取 unhealthy 或 exited service 的 logs。
6. 從 host 端用 HTTP、TCP、CLI 或專案 health endpoint 驗證。

範例：

```bash
docker compose up -d db redis
docker compose up -d backend frontend
docker compose ps
docker compose logs --no-color backend
```

## 排錯流程

當服務失敗時，由外而內診斷：

1. Container 狀態：exited、restarting、unhealthy，或 running 但無法連線。
2. Logs：找出明確錯誤訊息與第一個失敗的 service。
3. Ports：host port 是否衝突，或 host/container port mapping 是否錯誤。
4. Environment：是否缺 `.env`、database hostname 錯誤、secret 未設定，或 container 內使用了 host-only 值。
5. Networking：Compose 內的服務通常應用 service name 互連，不是用 `localhost`。
6. Volumes：檢查 stale dependency volume、資料庫狀態、權限、bind mount path 是否錯誤。
7. Build：檢查 image 是否過舊，或 dependency 變更後需要 `docker compose build`。

常用指令：

```bash
docker compose ps
docker compose logs --no-color --tail=200 <service>
docker compose exec <service> <command>
docker compose restart <service>
docker compose build <service>
```

需要即時觀察 startup 時使用 `logs -f`。診斷與最終回報時，優先使用有界限的 `--tail` 與 `--no-color`，讓輸出保持可讀。

## 常見修法

### 缺少 Compose 檔

如果找不到 `docker-compose.yml`：

- 先搜尋其他 Compose 檔名。
- 檢查 README 或 scripts 中的專案啟動方式。
- 如果專案只有 app manifests，先說明目前沒有 Compose 可用，再使用專案既有本機啟動指令。
- 如果適合建立 Compose 檔，先只加入必要 service，並明確設定 names、ports、environment。

### 環境變數

- 建立 `.env` 前，先檢查是否有 `.env.example`。
- 若 `.env.example` 明確是本機預設或 placeholder，複製成 `.env` 通常可以接受。
- production secrets 由既有 secret 管理、`.env.example` placeholder 或部署環境提供。
- 在 Compose network 內，database 與 API 通常使用 `db`、`postgres`、`redis`、`backend` 這類 service name。

### Ports

- 如果 host port 被佔用，先找出佔用者，再由使用者確認改 port 或停止程序。
- 無關程序維持原狀；使用者明確同意時才處理。
- 若只是本機衝突，優先修改 host-side port mapping。

範例：

```yaml
ports:
  - "8080:80"
```

### Volumes

- 把 named volumes 當作持久資料處理。
- 刪除 database volume、dependency cache 或 upload storage 前要先詢問。
- 如果 dependency volume 疑似過舊，先說明重建的影響與取捨。

### Healthchecks 與 Depends On

- `depends_on` 主要控制啟動順序；app 可用性由 health condition、retry loop 或 service health endpoint 表達。
- 對 database 這類相依服務，加入 healthcheck，並讓 app startup 能處理可重試的連線失敗。
- 能用 healthcheck 或 retry loop 時，採用可觀測的 readiness strategy。

## 建立或編輯 Compose 檔

Compose 檔要簡單、明確、可預期。優先做最小正確修改，保留既有 stack 結構。

本機開發的良好預設：

- 明確設定 `build.context` 與 `dockerfile`。
- Service names 穩定且有意義。
- 只把 host 需要存取的 service ports 對外映射。
- 環境變數來自 `.env` 或清楚的本機預設值。
- 只有在專案需要 live development 時才使用 bind mounts。
- 用 named volumes 保存 container-managed dependencies 與 database data。
- Database 或其他被依賴的 service 應有 healthchecks。

保留以下界線：

- Commit 真實 secrets。
- 沒有具體理由就使用 `container_name`，因為它容易造成不同專案間的名稱衝突。
- 把所有 internal ports 都映射到 host。
- 把刪除 volumes 當成第一個排錯手段。
- 問題只是 Compose path、env 或 port mapping 時，卻重寫 Dockerfile。

## 驗證

啟動或修改後，用最相關的方式驗證：

```bash
docker compose config
docker compose ps
docker compose logs --no-color --tail=100 <service>
curl http://localhost:<port>/<health-path>
```

Windows 上如果沒有 `curl`，使用：

```powershell
Invoke-WebRequest -Uri "http://localhost:<port>/<health-path>" -UseBasicParsing
```

如果因 Docker 未啟動、port 被佔用、credential 缺失或外部服務 unavailable 而驗證受阻，要明確說出阻塞原因與失敗的指令。

## 回覆方式

完成 Docker Compose 任務時，包含：

- Compose stack 或指定 services 是否正在運行。
- 成功或失敗的確切指令。
- 從 host 驗證過的 URLs、ports 或 health endpoints。
- 修改了哪些檔案與原因。
- 仍存在的阻塞點，特別是缺少 Compose 檔、缺少 `.env`、service unhealthy、port 被佔用，或需要使用者同意才能處理的 protected volumes。

最終回覆保持精簡。先說可行狀態，再補充必要細節。
