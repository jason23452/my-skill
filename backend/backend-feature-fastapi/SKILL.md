---
name: backend-feature-fastapi
description: >-
  當使用者要做後端、API、FastAPI、SQLAlchemy、Alembic、資料庫功能或後端 feature 開發時，使用這個 skill。這個 skill 適用於 uv 管理的 Python 3.12 FastAPI 專案，架構包含 FastAPI app factory、app/core 設定、app/db async session，以及 app/features 依 feature 拆分 router、schemas、service、repository、models、dependencies。只要使用者要新增或修改後端 endpoint、feature module、database model、repository、service、migration 或類似 FastAPI 後端程式碼，即使沒有明確提到這個架構，也應優先使用。
compatibility: Python 3.12 FastAPI 後端，使用 uv、SQLAlchemy 2 async、asyncpg、Alembic、pydantic-settings。
---

# FastAPI 後端功能開發

## OpenCode Greenfield Bootstrap Metadata

```opencode-bootstrap-json
{
  "role": "backend",
  "order": 10,
  "packageManager": "uv",
  "scaffoldCommand": [
    "uv init --app --name greenfield-backend --no-readme --no-workspace --vcs none",
    "uv add \"fastapi[standard]>=0.115.0\"",
    "if test -f .opencode/skills/backend-feature-fastapi/scripts/bootstrap-01-03.cjs; then node .opencode/skills/backend-feature-fastapi/scripts/bootstrap-01-03.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/backend-feature-fastapi/scripts/bootstrap-01-03.cjs; fi"
  ],
  "verificationCommands": [
    "uv run python -m compileall app"
  ],
  "runtimeSmokeCommand": "uv run fastapi dev app/main.py --host 127.0.0.1 --port $PORT",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/health"
}
```

```opencode-bootstrap-json
{
  "role": "backend",
  "order": 15,
  "packageManager": "uv",
  "scaffoldCommand": [
    "uv add \"fastapi[standard]>=0.115.0\" \"pydantic-settings>=2.0.0\"",
    "if test -f .opencode/skills/backend-feature-fastapi/scripts/bootstrap-02-02.cjs; then node .opencode/skills/backend-feature-fastapi/scripts/bootstrap-02-02.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/backend-feature-fastapi/scripts/bootstrap-02-02.cjs; fi"
  ],
  "verificationCommands": [
    "uv run python -m compileall app"
  ],
  "runtimeSmokeCommand": "uv run fastapi dev app/main.py --host 127.0.0.1 --port $PORT",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/api/health"
}
```

使用這個 skill 來建立或修改符合本專案風格的後端功能。核心目標是維持 feature-based 後端架構，讓未來功能擴充、測試與維護都保持可預測。

## 開始前

1. 先確認後端根目錄。本專案通常是 `backend/`。
2. 修改前先閱讀 `backend/README.md`、`backend/pyproject.toml`、`backend/app/features/router.py`，以及最接近需求的既有 `backend/app/features/` feature。
3. 若任務會新增或修改資料庫功能，也要閱讀 `backend/app/db/session.py`、`backend/app/db/base.py`、`backend/migrations/env.py`，以及 `backend/migrations/versions/` 中最新的 migration。
4. 除非真的需要共用基礎設施，否則把變更限制在相關 feature 內。

需要快速理解專案地圖時，閱讀 `references/architecture.md`。從零建立新 feature 時，閱讀 `references/feature-template.md`。

## 架構規則

- `app/main.py` 負責建立 FastAPI app，並只掛載集中後的 feature router。不要在這裡逐一 import 個別 feature router。
- `app/features/router.py` 負責收集各 feature router。新增 feature router 時在這裡註冊。
- `app/core/config.py` 負責透過 `pydantic-settings` 管理環境變數設定。
- `app/db/` 負責共用 SQLAlchemy base、async engine 與 async session dependency。
- 每個 feature 自己擁有 HTTP 層、schemas、service layer、repository layer、model 與 dependency wiring。
- 使用從 `app...` 開始的絕對 import。
- API prefix 由 `settings.api_prefix` 統一處理；feature router 使用 feature-local prefix，例如 `/users`，不要直接寫 `/api/v1/users`。

## Feature 結構

資料庫-backed feature 優先使用這個結構：

```text
app/features/<feature>/
  __init__.py       # 匯出 router
  router.py         # FastAPI routes 與 request validation wiring
  schemas.py        # Pydantic request/response DTOs
  service.py        # business rules 與 API errors
  repository.py     # SQLAlchemy async data access
  models.py         # SQLAlchemy model
  dependencies.py   # FastAPI dependency wiring for service/repository
```

不需要資料庫的 feature，可以省略 `models.py`、`repository.py`、`dependencies.py`，除非它們真的能降低複雜度。`health` feature 是最小模式。

## 各層責任

- Router：宣告 `APIRouter`、route methods、`response_model`、status codes、query/path/body validation 與 dependency injection。
- Schemas：定義 Pydantic request / response models。ORM-backed response schema 使用 `ConfigDict(from_attributes=True)`。
- Service：實作 business rules、流程協調，以及 conflict、not-found 等 `HTTPException` 決策。
- Repository：隔離 async SQLAlchemy query 與 persistence。會修改資料的方法在 repository 內 commit 與 refresh。
- Models：使用 SQLAlchemy 2 的 `Mapped[...]` 與 `mapped_column`，並繼承 `app.db.base.Base`。
- Dependencies：把 `get_db_session` 提供的 `AsyncSession` 接到 repository 與 service instance。

## Router 模式

沿用現有 class-based router 風格：

```python
from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.features.<feature>.dependencies import get_<singular>_service
from app.features.<feature>.schemas import <Thing>Create, <Thing>Read
from app.features.<feature>.service import <Thing>Service


class <Thing>Router:
    def __init__(self) -> None:
        self.router = APIRouter(prefix="/<feature>", tags=["<feature>"])
        self.router.add_api_route("", self.list_<feature>, methods=["GET"], response_model=list[<Thing>Read])
        self.router.add_api_route(
            "",
            self.create_<thing>,
            methods=["POST"],
            response_model=<Thing>Read,
            status_code=status.HTTP_201_CREATED,
        )

    async def list_<feature>(
        self,
        service: Annotated[<Thing>Service, Depends(get_<singular>_service)],
    ):
        return await service.list_<feature>()


router = <Thing>Router().router
```

注入 service 時使用 `Annotated[Service, Depends(get_service)]`。不要在 router 內直接存取資料庫。

## 資料庫與 Migration

新增或修改 SQLAlchemy models 時：

1. 在 `app/features/<feature>/models.py` 新增或更新 feature model。
2. 確認 `migrations/env.py` 有 import 該 model module，讓 Alembic 能讀到 metadata。
3. 在 `migrations/versions/` 下建立或更新 migration。
4. 接受前先檢查產生的 migration；Alembic autogenerate 只是草稿，不是保證正確。

Repository 使用 async SQLAlchemy API。不要引入 sync session 或 sync database engine。

## 驗證

可行時從 `backend/` 執行驗證：

```bash
uv run python -m compileall app
uv run alembic upgrade head
uv run dev
```

如果環境沒有 Postgres，說明 migration/runtime verification 無法執行；仍然要盡可能執行 syntax-level checks。

## 回覆方式

完成後端工作時，摘要包含：

- 新增或修改的 feature files。
- Router registration 與 endpoint paths。
- Database model 與 migration 變更，如果有。
- 已執行的驗證指令，以及無法執行的指令。

說明保持直接，聚焦在變更如何符合專案架構。
