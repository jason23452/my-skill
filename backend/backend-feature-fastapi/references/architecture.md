# 後端架構快照

這個專案使用 feature-based FastAPI 後端，位置通常在 `backend/`。

## 技術棧

- Python `>=3.12`
- 依賴與執行環境管理：`uv`
- Web framework：`FastAPI`
- ORM：`SQLAlchemy 2.x async`
- Postgres driver：`asyncpg`
- Migration：`Alembic`
- 設定管理：`pydantic-settings`

## 入口點

- `backend/main.py`：`uv run dev` 的 CLI 入口，會用 `uvicorn` 啟動 `app.main:app`。
- `backend/app/main.py`：包含 `AppFactory`，負責建立 `FastAPI`、設定 title/debug/lifespan，並用 `settings.api_prefix` 掛載 `api_router`。
- `backend/app/features/router.py`：匯入 feature packages，並掛載每個 feature router。

## 共用基礎設施

- `backend/app/core/config.py`：`Settings` class、`.env` 載入、cached `settings` singleton。
- `backend/app/db/base.py`：SQLAlchemy declarative `Base`。
- `backend/app/db/session.py`：async engine、`async_sessionmaker`，以及 `get_db_session` dependency。
- `backend/migrations/env.py`：Alembic async migration 設定。它必須 import model modules，讓 `Base.metadata` 包含所有資料表。

## 既有 Feature 模式

### `health`

最小、不使用資料庫的 feature：

- `__init__.py` 匯出 `router`。
- `router.py` 定義 class-based router，使用 `APIRouter(prefix="/health", tags=["health"])`。
- `schemas.py` 定義 response DTOs。
- `service.py` 放簡單 business logic。

工具型、不需要 persistence 的 endpoints 可以沿用這個模式。

### `users`

使用資料庫的 feature：

- `models.py`：使用 `Mapped` 與 `mapped_column` 的 SQLAlchemy model。
- `schemas.py`：create/read Pydantic schemas；read schema 使用 `ConfigDict(from_attributes=True)`。
- `repository.py`：async SQLAlchemy queries，並在 mutation 時 commit/refresh。
- `service.py`：business logic 與 API errors，例如 email 重複 conflict。
- `dependencies.py`：從 `get_db_session` 建立 `UserService(UserRepository(session))`。
- `router.py`：class-based router，使用 `add_api_route`、response models、status codes 與 injected service。
- `__init__.py`：匯出 `router`。

一般 CRUD 風格 feature 可以沿用這個模式。

## 必須保留的慣例

- 保持 `app/main.py` 不直接 import 個別 feature。
- 新 feature 要註冊在 `app/features/router.py`。
- route prefix 保持 feature-local；API versioning 由 `settings.api_prefix` 統一處理。
- 資料庫存取放在 repositories，不要放在 routers 或 services。
- business rules 放在 services，不要放在 repositories。
- 使用 async repository methods 與 `AsyncSession`。
- repository 建立新 model 後要 commit 並 refresh。
- schema 變更要新增 Alembic migrations。
- feature 對外 export 保持簡單：`from app.features.<feature>.router import router` 與 `__all__ = ["router"]`。

## 常用指令

從 `backend/` 執行：

```bash
uv sync
uv run dev
uv run uvicorn app.main:app --reload
uv run alembic upgrade head
uv run python -m compileall app
```
