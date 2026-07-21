# FastAPI Feature Architecture

這份參考只描述 FastAPI HTTP feature 的結構。

## 根入口

- `app/main.py` 建立 `FastAPI` app。
- middleware 在 `app/main.py` 集中設定。
- `app/main.py` include `app/features/router.py`，不要逐一 include 每個 feature。

## Feature Aggregator

`app/features/router.py` 是所有 feature router 的集中註冊點：

```python
from fastapi import APIRouter

from app.features.health import router as health_router

router = APIRouter()
router.include_router(health_router)
```

## Feature Module

每個 feature 使用獨立目錄：

```text
app/features/<feature>/
  __init__.py
  router.py
  schemas.py
  service.py
```

## 分層責任

- `router.py`: HTTP method、path、status code、response model、query/path/body validation。
- `schemas.py`: Pydantic request/response DTO。
- `service.py`: feature business rules、API exception、資料轉換。
- `__init__.py`: export `router`，讓 aggregator 使用一致 import。

## 驗證

```bash
uv run python -m compileall app
uv run uvicorn app.main:app --reload
```
