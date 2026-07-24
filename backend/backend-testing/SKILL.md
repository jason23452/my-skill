---
name: backend-testing
description: "Design, add, and improve backend test coverage for service repos. Use when Codex needs to set up or repair backend unit tests, API endpoint tests, integration tests, database test fixtures, external HTTP mocks, coverage commands, CI test commands, or generated task.md testing contracts for FastAPI, Django, Node/TypeScript, or other backend services. Trigger for pytest, TestClient, HTTPX, AnyIO, pytest-cov, respx, testcontainers, backend testing strategy, failing backend tests, missing tests, or API regression coverage."
---

# Backend Testing

## OpenCode Greenfield Bootstrap Metadata

This is a backend testing add-on. It is docs-only until a framework-specific bootstrap script is added; use it to load backend test strategy, fixture, coverage, and verification rules when testing is selected or requested.

```opencode-bootstrap-json
{
  "role": "backend",
  "category": "testing",
  "testing": "backend",
  "frameworks": ["backend", "api", "fastapi", "starlette", "django", "node", "typescript"],
  "order": 45,
  "packageManager": "none",
  "scaffoldCommand": [],
  "verificationCommands": []
}
```

## Responsibility Boundary

Use this skill for backend service repos and API/server modules. It owns test strategy, dependency choices, fixture layout, API client setup, database isolation, external dependency mocking, coverage commands, and verification evidence.

Use alongside related skills:

- `backend-feature-fastapi`: FastAPI router/schema/service structure and app factory.
- `backend-orm-migrations`: ORM, migration, model, DB/session path, and persistence contract.
- `pgdb-docker-orm`: PostgreSQL Docker/Compose service and local database safety.
- `docker-compose-ops`: compose stack runtime checks when tests need local services.

## Discovery Workflow

1. Read repo evidence first: `README.md`, `AGENTS.md`, manifests, existing test files, CI config, package scripts, app factory, DB/session modules, and dependency injection boundaries.
2. Keep the repo's existing test runner and assertion style. Do not introduce a second test framework unless the repo has no usable backend tests.
3. Identify test layers already present: service/unit, API/route, persistence/integration, contract, and smoke.
4. Choose the smallest layer that proves the requested behavior. Prefer service tests for business rules, API tests for routing/validation/status codes, and integration tests for DB or cross-module behavior.
5. Make tests deterministic: no real network calls, no production credentials, no time-sensitive sleeps, no shared mutable state between tests.
6. Use framework-specific references only when needed. For FastAPI + Python, read `references/fastapi-pytest.md`.

## Default Stack Choices

If the backend is Python and has no established test stack, use:

- `pytest` as the runner.
- `httpx` / framework test client for API requests.
- `pytest-cov` for coverage.
- `pytest-mock` for patching.
- `respx` for mocking outbound HTTPX calls.
- `faker` for deterministic fake data.
- `testcontainers` only for integration tests that need real external services and when Docker is available or already part of the repo workflow.

For FastAPI, prefer `TestClient` for simple synchronous endpoint tests and `httpx.AsyncClient` with `ASGITransport` plus `pytest.mark.anyio` when tests need to await async DB/service code.

## Test Layout

Use existing paths if they exist. For new backend test suites, prefer:

```text
tests/
  conftest.py
  unit/
  api/
  integration/
```

Keep reusable fixtures in `tests/conftest.py` only when shared by multiple test modules. Keep domain-specific factories near the tests that use them until duplication justifies promotion.

## Required Contract Output

When generating implementation tasks or test setup instructions, include this exact section:

```md
## Backend Testing Contract
- Skill: `backend-testing`
- Test runner:
- Dependency/package changes:
- Test path:
- Shared fixtures path:
- API client fixture:
- Async test strategy:
- Database isolation strategy:
- External service mock strategy:
- Coverage command:
- Primary verification command:
- CI command/script:
- Test data/factory convention:
```

Do not write vague contracts such as `add tests`, `mock things`, or `run pytest somehow`. Use exact paths and commands from repo evidence or the selected reference. If the app import path, DB dependency, or test runner cannot be determined, block with `BACKEND_TEST_CONTRACT_MISSING`.

## Implementation Rules

- Assert behavior, not implementation details, unless the task is explicitly a unit test for a pure function or service boundary.
- API tests must assert status code, response body shape, and important headers or side effects.
- Validation tests must include at least one negative case for invalid input when adding or changing request schemas.
- Database tests must use a disposable test database, transaction rollback, schema reset, or containerized dependency. Never point tests at production, staging, or a developer's personal database without explicit instruction.
- Outbound HTTP, email, payment, auth-provider, queue, and storage calls must be mocked or pointed at local test doubles.
- Avoid broad sleeps and polling without deadlines. Prefer deterministic fixture setup, explicit health checks, or timeout-bounded awaits.
- Keep tests readable and close to the user-visible contract. Do not overbuild factories or helper abstractions before repetition appears.
- Do not hide broken behavior by loosening assertions, deleting meaningful tests, or marking failures as skipped without explaining the risk.

## Verification

After adding or changing backend tests, run the repo's existing verification commands first. Minimum evidence should include:

- Dependency install/sync succeeds if dependencies changed.
- Targeted tests for the changed behavior pass.
- Full backend test command passes when feasible.
- Coverage command runs when coverage tooling exists or was added.
- Any DB/container integration test documents required local services and cleanup behavior.

## References

- FastAPI + Python + pytest: read `references/fastapi-pytest.md`.
