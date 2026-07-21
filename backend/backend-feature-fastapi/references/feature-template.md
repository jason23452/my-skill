# FastAPI Feature Template

把 `<feature>`、`<Thing>`、`<thing>` 替換成實際業務名稱。

## `__init__.py`

```python
from app.features.<feature>.router import router

__all__ = ["router"]
```

## `schemas.py`

```python
from pydantic import BaseModel


class <Thing>Create(BaseModel):
    name: str


class <Thing>Read(BaseModel):
    id: int
    name: str
```

## `service.py`

```python
from fastapi import HTTPException, status

from app.features.<feature>.schemas import <Thing>Create, <Thing>Read


class <Thing>Service:
    def __init__(self) -> None:
        self._items: list[<Thing>Read] = []

    async def list_<feature>(self) -> list[<Thing>Read]:
        return self._items

    async def create_<thing>(self, payload: <Thing>Create) -> <Thing>Read:
        item = <Thing>Read(id=len(self._items) + 1, name=payload.name)
        self._items.append(item)
        return item

    async def get_<thing>(self, item_id: int) -> <Thing>Read:
        for item in self._items:
            if item.id == item_id:
                return item
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="<Thing> not found")
```

## `router.py`

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
        self.router.add_api_route("/{item_id}", self.get_<thing>, methods=["GET"], response_model=<Thing>Read)

    async def list_<feature>(self) -> list[<Thing>Read]:
        return await self.service.list_<feature>()

    async def create_<thing>(self, payload: <Thing>Create) -> <Thing>Read:
        return await self.service.create_<thing>(payload)

    async def get_<thing>(self, item_id: int) -> <Thing>Read:
        return await self.service.get_<thing>(item_id)


router = <Thing>Router().router
```

## 註冊 Feature

在 `app/features/router.py` 加入：

```python
from app.features.<feature> import router as <feature>_router

router.include_router(<feature>_router)
```
