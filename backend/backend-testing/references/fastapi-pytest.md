# FastAPI Pytest Reference

Use this reference when the backend is FastAPI or Starlette-compatible Python.

## Dependencies

Keep existing dependency management. If no test stack exists, prefer:

```bash
uv add --dev pytest httpx pytest-cov anyio pytest-mock respx faker
```

For pip-based repos:

```bash
python -m pip install pytest httpx pytest-cov anyio pytest-mock respx faker
```

Add `asgi-lifespan` only when async HTTPX tests must trigger startup/shutdown lifespan events directly.

## Pytest Config

Use `pyproject.toml` when the repo already uses it:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q"
markers = [
  "integration: tests requiring real services such as a database or container",
]
```

Do not force global `asyncio_mode` if using `pytest.mark.anyio`. Keep async configuration consistent with the repo's existing choice.

## Test Layout

Prefer:

```text
tests/
  conftest.py
  api/
    test_health.py
  unit/
    test_<feature>_service.py
  integration/
    test_<feature>_persistence.py
```

Name tests by behavior, not implementation file names, when possible.

## App And Client Fixtures

Use the app factory if available:

```python
import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture()
def app():
    return create_app()


@pytest.fixture()
def client(app):
    with TestClient(app) as test_client:
        yield test_client
```

If the repo only exposes `app`, import it directly:

```python
from app.main import app
```

Avoid starting Uvicorn for API tests. Call the ASGI app in-process.

## Simple Endpoint Test

```python
def test_health_returns_ok(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
```

For POST/validation behavior:

```python
def test_create_item_rejects_missing_name(client):
    response = client.post("/items", json={})

    assert response.status_code == 422
```

## Async Endpoint Or Async DB Tests

Use async tests when the test itself must `await` service or database calls:

```python
import pytest
from httpx import ASGITransport, AsyncClient


@pytest.mark.anyio
async def test_root_async(app):
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/")

    assert response.status_code == 200
```

If lifespan events are required:

```python
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient


async with LifespanManager(app):
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        ...
```

## Dependency Overrides

Use FastAPI dependency overrides for DB sessions, auth users, settings, or service doubles:

```python
@pytest.fixture()
def app_with_overrides(app, fake_user):
    app.dependency_overrides[get_current_user] = lambda: fake_user
    try:
        yield app
    finally:
        app.dependency_overrides.clear()
```

Prefer narrow overrides for external boundaries. Do not mock the route function under test.

## Database Isolation

Pick the repo's existing strategy first. Common acceptable strategies:

- Transaction rollback per test.
- Fresh schema/database per test session with table cleanup per test.
- Testcontainers PostgreSQL for integration tests when Docker is already available.
- SQLite only when the production database behavior is not relevant and the ORM supports it safely.

For SQLAlchemy/FastAPI:

1. Create a test engine/session factory.
2. Override the app's `get_session` or equivalent dependency.
3. Apply migrations or create metadata before tests, matching the repo's migration contract.
4. Roll back or clean data after each test.

Never run tests against a real production/staging `DATABASE_URL`.

## Outbound HTTP Mocks

Use `respx` when app code calls external services through HTTPX:

```python
import httpx
import respx


@respx.mock
def test_external_lookup(client):
    route = respx.get("https://api.example.test/users/123").mock(
        return_value=httpx.Response(200, json={"id": "123"})
    )

    response = client.get("/users/123/profile")

    assert response.status_code == 200
    assert route.called
```

For non-HTTP dependencies, prefer `pytest-mock` at the app boundary:

```python
def test_service_uses_gateway(mocker):
    gateway = mocker.Mock()
    gateway.fetch.return_value = {"id": "123"}
```

## Coverage And Commands

Prefer exact commands from README/CI. For new uv FastAPI repos:

```bash
uv run pytest
uv run pytest --cov=app --cov-report=term-missing
```

For pip/venv repos:

```bash
python -m pytest
python -m pytest --cov=app --cov-report=term-missing
```

Use targeted commands during development, then run the full backend command before finishing.

## Acceptance Checklist

- Tests cover the changed success path.
- Tests cover at least one relevant failure/validation path.
- External services are mocked.
- DB state is isolated and repeatable.
- Full test command passes or any blocker is reported with the failing command and error.
