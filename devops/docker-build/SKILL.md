---
name: docker-build
description: >-
  當使用者要建立、改善、除錯或執行 Docker build、Dockerfile、docker compose build、container image tagging、BuildKit/cache optimization、multi-stage builds、.dockerignore、image size reduction、platform builds 或 CI container build steps 時，使用這個 skill。這是通用 Docker build skill，適用 backend、frontend、monorepo 與各類 service 專案；即使使用者只說 "docker build"、"build image"、"containerize this"、"fix Dockerfile"、"docker compose build"、"映像檔"、"容器化"、"Docker 建置"、"修 Dockerfile" 或 "建 image"，也應優先使用。
compatibility: Docker CLI, Docker BuildKit/buildx, Docker Compose, Linux container images, common Node/Python/Go/Java build flows.
---

# Docker Build

使用這個 skill 讓 Docker image build 更可靠、可重現、體積更小，也更容易除錯。Docker build 工作不要只看單一指令；要同時檢查 source layout、build context、dependency cache、runtime image、安全性與驗證方式。

## 開始方式

1. 先確認 build 目標：app/service 名稱、Dockerfile 路徑、build context、image tag、platform，以及使用 Docker Compose 還是單純 `docker build`。
2. 編輯前先檢查相關檔案：`Dockerfile*`、`docker-compose*.yml`、`.dockerignore`、package manifests、lockfiles、build scripts，以及有提到 Docker 的 CI workflow。
3. 優先做最小正確修改。除非現有 Dockerfile 明顯錯誤，否則保留專案既有語言、runtime 與 package manager 慣例。
4. 如果使用者要你實際執行 build，先跑最安全且最貼近專案設定的指令，取得失敗 stage 與 log 再修改。

## Build 指令選擇

依照專案使用方式選擇指令：

```bash
docker build -t <image>:<tag> -f <Dockerfile> <context>
docker compose build <service>
docker buildx build --platform <platform> -t <image>:<tag> <context>
```

如果專案已經在 Compose 裡定義 service，優先用 `docker compose build <service>`。Compose 通常包含 build args、target、context path 等設定，直接跑 `docker build` 可能會漏掉。

## Dockerfile 規則

- build 階段需要的 dependency 不應留在 runtime image 時，使用 multi-stage build。
- 先複製 dependency manifest 與 lockfile，再安裝 dependencies，最後才複製完整 source，讓 Docker cache 能重用 dependency layer。
- manifest 與 lockfile 要一起複製，例如 `package.json` 搭配 `package-lock.json` / `pnpm-lock.yaml`，或 `pyproject.toml` 搭配 lockfile。
- base image 要有意識地選擇明確版本，例如 `python:3.12-slim`、`node:22-alpine`、`golang:1.23-bookworm`，並考慮相容性。
- runtime image 可以小，但不要為了小而脆弱。如果 native dependencies 或 glibc 相容性可能出問題，不要隨意改成 Alpine。
- 在 `COPY` 與 `RUN` 前先設定 `WORKDIR`。
- 除非真的需要自動解壓縮 archive 或 remote URL 行為，否則使用 `COPY`，不要用 `ADD`。
- 不要把 secrets 打進 image。token、password、private key、`.env` 值不應出現在 `ARG`、`ENV` 或被複製進 image。
- 長時間執行的 service 儘量使用 non-root runtime user。
- `EXPOSE` 只是文件用途；如果有實際對外連線需求，要說明 `docker run` 或 Compose 的 port mapping。

## Build Context 與 `.dockerignore`

及早檢查 `.dockerignore`。build context 太大會讓 build 變慢、洩漏本機檔案，也會讓 cache 更容易失效。

常見忽略項目：

```text
.git
.github
.env
.env.*
node_modules
dist
build
coverage
__pycache__
.pytest_cache
.mypy_cache
.ruff_cache
.venv
venv
.DS_Store
*.log
```

不要忽略 build 或 runtime 需要的檔案，例如 lockfiles、runtime 需要的 migrations/templates/static files，或 Dockerfile 明確要複製的 compiled artifacts。

## 語言與框架模式

### Node / Vite / React

- 先複製 `package.json` 與 lockfile，再跑 `npm ci`、`pnpm install --frozen-lockfile` 或專案使用的安裝指令。
- 用 builder stage 建置靜態前端資產，再用 nginx、Caddy 或專案既有 runtime 服務它們。
- 如果使用 Vite，確認 API URL 是 build-time `VITE_*` 變數，還是應該透過 reverse proxy 在 runtime 處理。

### Python / FastAPI

- 專案若使用 `uv`、Poetry 或 pip-tools，優先用 lockfile-based install。
- build tools 盡量不要留在最終 runtime image。
- ASGI app 應使用專案既有啟動方式；常見形式是 `uvicorn app.main:app --host 0.0.0.0 --port 8000` 或既有 script。
- 確認 runtime 需要的檔案都有複製進 image，例如 migrations、templates、static files。

### Go

- 先複製 `go.mod` 與 `go.sum`，執行 `go mod download`，再複製 source，讓 module cache 可重用。
- 明確決定要 build static binary 還是 distro-compatible binary。
- runtime stage 可使用 distroless、scratch 或 Debian slim；選擇時要考慮 TLS certificates、shell/debug 需求與 CGO。

### Java / JVM

- 專案有 wrapper 時使用 `./mvnw` 或 `./gradlew`。
- 可行時，把 dependency resolution 與 source copy 分開，提升 cache 命中率。
- final runtime 優先使用 JRE image，而不是完整 JDK，除非 runtime 真的需要工具鏈。

## 除錯流程

Docker build 失敗時：

1. 從 log 找出確切失敗的 Dockerfile instruction 與 stage。
2. 如果是檔案找不到，檢查該檔案是否在 build context 之外、被 `.dockerignore` 排除，或是在使用後才被 `COPY`。
3. 檢查 package manager 與 lockfile 是否相容，以及 base image 是否缺少必要 system libraries。
4. 需要更清楚 log 時再使用：

```bash
docker build --progress=plain --no-cache -t <image>:debug <context>
docker compose build --no-cache <service>
```

`--no-cache` 只適合診斷或懷疑 cache/dependency 損壞時使用，不應當成一般 build 問題的預設解法。

## BuildKit 與 Cache

如果專案已使用現代 Docker，或 CI 支援 BuildKit，可以使用 cache mount：

```dockerfile
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt
RUN --mount=type=cache,target=/root/.npm npm ci
```

CI 裡的 cache 設定要明確且可重現。不要讓 Dockerfile 依賴某台本機剛好存在的 cache。

## 驗證

修改後依情況驗證：

```bash
docker build -t <image>:local -f <Dockerfile> <context>
docker compose build <service>
docker run --rm <image>:local <health-or-version-command>
docker image ls <image>
```

如果啟動 container 需要目前環境沒有的服務、憑證或 port，明確說明哪些驗證沒有執行，並盡量完成 build 或 syntax 等可執行檢查。

## 回覆方式

完成 Docker build 工作時，摘要包含：

- 修改了哪些 Docker 相關檔案，以及修改原因。
- 實際執行或建議使用的 build 指令。
- image tag、build context、Dockerfile path，以及相關 Compose service。
- 驗證結果；如果 build 仍失敗，附上關鍵失敗 log。
- 發現的安全性或可重現性風險，例如 secrets、build context 過大、runtime 使用 root、dependency 未鎖定。
