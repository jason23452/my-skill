# FastAPI Project Architecture

Use this reference when a FastAPI task needs project-level structure, not only a single endpoint.

## Greenfield Structure

```text
app/
  __init__.py
  main.py
  core/
    __init__.py
    config.py
    middleware.py
  features/
    __init__.py
    router.py
    health/
      __init__.py
      router.py
      schemas.py
      service.py
```

## Responsibilities

- `app/main.py`: define `create_app()`, create the `FastAPI` app, apply framework-level wiring, include `app/features/router.py`, and expose `app`.
- `app/core/config.py`: parse application settings from environment variables. Keep secret values out of defaults.
- `app/core/middleware.py`: configure app-level middleware such as CORS.
- `app/features/router.py`: aggregate feature routers. Do not import every feature directly in `app/main.py`.
- `app/features/<feature>/router.py`: define HTTP path, method, tags, response model, status code, and validation wiring.
- `app/features/<feature>/schemas.py`: define Pydantic request and response DTOs.
- `app/features/<feature>/service.py`: hold business rules and feature-level errors.
- `app/features/<feature>/__init__.py`: export `router`.

## Boundary

This architecture covers FastAPI HTTP application structure only. Database connections, ORM models, migrations, Docker Compose services, and persistent infrastructure belong to separate database or DevOps skills.

## Feature Registration

Register each feature through the aggregator:

```python
from fastapi import APIRouter

from app.features.health import router as health_router
from app.features.projects import router as projects_router

router = APIRouter()
router.include_router(health_router)
router.include_router(projects_router)
```

`app/main.py` stays focused on app construction:

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

## Verification

```bash
uv run python -m compileall app
uv run uvicorn app.main:app --reload
```
