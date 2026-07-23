# FastAPI SQLAlchemy Alembic

Use this reference when the backend repo is FastAPI + uv + PostgreSQL and has no existing ORM or migration framework.

## Default Stack

- ORM: SQLAlchemy 2.x async ORM.
- Driver: `asyncpg`.
- Migration framework: Alembic.
- Package manager: `uv`.
- Runtime URL: `postgresql+asyncpg://postgres:postgres@db:5432/app_db` in Compose, host equivalent only for host-run app or inspection.

## Exact Paths

Use these paths unless repo evidence already defines better names:

```text
app/core/database.py
app/models/__init__.py
app/models/base.py
app/models/<domain>.py
alembic.ini
migrations/env.py
migrations/script.py.mako
migrations/versions/
```

Keep HTTP feature code under `app/features/<feature>/`. Keep ORM models under `app/models/` so migration metadata has one import surface.

## Dependencies

Add dependencies only in the backend repo:

```bash
uv add "sqlalchemy>=2.0" asyncpg alembic
```

If lockfiles are managed strictly, run the repo's lock/sync flow after dependency changes. Do not edit lockfiles by hand.

## Runtime Modules

`app/core/config.py` must expose `DATABASE_URL`.

`app/models/base.py` owns declarative metadata:

```python
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
```

`app/core/database.py` owns engine/session helpers:

```python
from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings


settings = get_settings()
engine = create_async_engine(settings.database_url, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_db_session() -> AsyncIterator[AsyncSession]:
    async with AsyncSessionLocal() as session:
        yield session
```

Adjust names only when repo evidence has an established convention.

## Alembic Setup

Initialize Alembic only if absent:

```bash
uv run alembic init migrations
```

Configure `alembic.ini` and `migrations/env.py` so metadata imports every model:

```python
from app.core.config import get_settings
from app.models.base import Base
import app.models  # noqa: F401

target_metadata = Base.metadata
```

For async runtime URLs, prefer Alembic's async template/pattern using SQLAlchemy async engine. Do not add a sync driver unless the repo intentionally chooses a sync Alembic configuration.

## Commands

Create migration:

```bash
uv run alembic revision --autogenerate -m "add <domain> schema"
```

Apply migration:

```bash
uv run alembic upgrade head
```

Inspect status:

```bash
uv run alembic current
uv run alembic heads
```

Inspect tables through Compose DB when available:

```bash
docker compose exec db psql -U postgres -d app_db -c "\dt"
```

Compile:

```bash
uv run python -m compileall app
```

## Task Contract Text

When generating a task for a FastAPI repo with no existing ORM, do not write `models/migrations`.

Write exact contracts:

- DB/session path: `app/core/database.py`
- Model package: `app/models/`
- Base metadata: `app/models/base.py::Base.metadata`
- Migration config: `alembic.ini`
- Migration env: `migrations/env.py`
- Migration versions: `migrations/versions/`
- Dependencies: `sqlalchemy`, `asyncpg`, `alembic`
- Create migration: `uv run alembic revision --autogenerate -m "<message>"`
- Apply migration: `uv run alembic upgrade head`
- Status: `uv run alembic current`; `uv run alembic heads`; table list via Compose `psql`

If T001 owns this foundation, every later backend domain task must read T001's reported paths and migration head before adding new models.
