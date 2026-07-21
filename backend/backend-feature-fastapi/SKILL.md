---
name: backend-feature-fastapi
description: "建立與維護 FastAPI 後端專案架構、feature 模組、router、Pydantic schema、service layer、app factory 與 app router 註冊。使用者提到 FastAPI endpoint、backend project architecture、backend feature、router、schema、service、request/response DTO、health endpoint 或 FastAPI greenfield backend 時使用。"
---

# FastAPI Feature Backend

## OpenCode Greenfield Bootstrap Metadata

```opencode-bootstrap-json
{
  "role": "backend",
  "category": "framework",
  "framework": "fastapi",
  "order": 10,
  "packageManager": "uv",
  "scaffoldCommand": [
    "uv init --app --name greenfield-backend --no-readme --no-workspace --vcs none",
    "uv add \"fastapi[standard]>=0.115.0\" \"uvicorn[standard]>=0.30.0\"",
    "if test -f .opencode/skills/backend-feature-fastapi/scripts/bootstrap-01-03.cjs; then node .opencode/skills/backend-feature-fastapi/scripts/bootstrap-01-03.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/backend-feature-fastapi/scripts/bootstrap-01-03.cjs; fi",
    "uv sync"
  ],
  "verificationCommands": [
    "uv run python -m compileall app"
  ],
  "runtimeSmokeCommand": "uv run uvicorn app.main:app --host 127.0.0.1 --port $PORT",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/health"
}
```

這個 skill 只負責 FastAPI 後端的 HTTP feature 結構與應用程式組裝。資料庫、ORM、migration、Docker database service 等資料持久層需求由 `pgdb-docker-orm` skill 負責。

## 使用時機

使用者需要以下工作時使用：

- 建立 FastAPI greenfield backend。
- 定義 FastAPI backend project architecture。
- 新增或調整 endpoint。
- 設計 feature-based router、schemas、service。
- 註冊 feature router 到 app router。
- 建立 health、version、status 等 HTTP feature。
- 整理 FastAPI app entry、CORS 與基本路由組裝。

## 專案架構

Greenfield backend scaffold 採用這個最小但可擴充的 FastAPI 專案架構：

```text
app/
  __init__.py
  main.py                 # create_app() app factory and ASGI app
  core/
    __init__.py
    config.py             # Settings and environment parsing
    middleware.py         # app-level middleware wiring such as CORS
  features/
    __init__.py
    router.py             # feature router aggregator
    health/
      __init__.py
      router.py
      schemas.py
      service.py
```

保留 `app/core` 給 framework-level application concerns，例如 settings、middleware、exception wiring、logging wiring。資料庫連線、ORM model、migration、Docker database service 不放在這個 skill，改由 database/devops skill 處理。

## 架構規則

- `app/main.py` 定義 `create_app()`，建立 `FastAPI` app、讀取 settings、套用 middleware，並 include `app/features/router.py`。
- `app/core/config.py` 放 application settings，不放 secrets 預設值。
- `app/core/middleware.py` 放 framework-level middleware wiring，例如 CORS。
- `app/features/router.py` 作為 feature router aggregator，集中 include 各 feature router。
- 每個 feature 使用自己的目錄，例如 `app/features/users/`。
- feature router 使用 feature-local prefix，例如 `/users` 或 `/projects`。
- request/response 型別放在 `schemas.py`。
- 業務規則放在 `service.py`。
- router 負責 HTTP 方法、status code、response model、query/path/body validation 與呼叫 service。
- 新 feature 先建立最小可工作的 HTTP flow，再依專案既有模式擴充。

## Feature 結構

```text
app/features/<feature>/
  __init__.py       # export router
  router.py         # FastAPI routes and request validation wiring
  schemas.py        # Pydantic request/response DTOs
  service.py        # business rules and API errors
```

`health`、`version`、`status` 這類 feature 也使用相同結構，只保留實際需要的 schema 與 service。

## Router 範例

```python
from fastapi import APIRouter, status

from app.features.<feature>.schemas import <Thing>Create, <Thing>Read
from app.features.<feature>.service import <Thing>Service


class <Thing>Router:
    def __init__(self, service: <Thing>Service | None = None) -> None:
        self.service = service or <Thing>Service()
        self.router = APIRouter(prefix="/<feature>", tags=["<feature>"])
        self.router.add_api_route("", self.list_<feature>, methods=["GET"], response_model=list[<Thing>Read])
        self.router.add_api_route(
            "",
            self.create_<thing>,
            methods=["POST"],
            response_model=<Thing>Read,
            status_code=status.HTTP_201_CREATED,
        )

    async def list_<feature>(self) -> list[<Thing>Read]:
        return await self.service.list_<feature>()

    async def create_<thing>(self, payload: <Thing>Create) -> <Thing>Read:
        return await self.service.create_<thing>(payload)


router = <Thing>Router().router
```

## App Router 註冊

在 `app/features/router.py` 中集中註冊：

```python
from fastapi import APIRouter

from app.features.<feature> import router as <feature>_router

router = APIRouter()
router.include_router(<feature>_router)
```

`app/main.py` 使用 app factory 並只 include aggregator：

```python
from fastapi import FastAPI

from app.core.config import get_settings
from app.core.middleware import configure_cors
from app.features.router import router as feature_router


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.service_name, version=settings.version)
    configure_cors(app, settings)
    app.include_router(feature_router)
    return app


app = create_app()
```

## 驗證

在 backend 根目錄執行：

```bash
uv run python -m compileall app
uv run uvicorn app.main:app --reload
```

若專案已有 lint、test 或 type check script，也一起執行。

## 回覆格式

完成時回報：

- 新增或修改的 feature files。
- endpoint paths 與 router 註冊位置。
- 執行過的驗證指令與結果。
- 需要使用者決定的後續事項。
