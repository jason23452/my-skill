#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const writeFile = (filePath, contents) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
};

try {
  fs.rmSync("main.py", { force: true });
} catch {}

writeFile("app/__init__.py", "");
writeFile("app/core/__init__.py", "");
writeFile("app/features/__init__.py", "");
writeFile("app/features/health/__init__.py", `from app.features.health.router import router

__all__ = ["router"]
`);

writeFile(
  "app/core/config.py",
  `from dataclasses import dataclass
import os


def _csv(value: str) -> tuple[str, ...]:
    items = tuple(item.strip() for item in value.split(",") if item.strip())
    return items or ("*",)


@dataclass(frozen=True)
class Settings:
    service_name: str
    environment: str
    version: str
    cors_origins: tuple[str, ...]


def get_settings() -> Settings:
    return Settings(
        service_name=os.getenv("SERVICE_NAME", "greenfield-backend"),
        environment=os.getenv("APP_ENV", "development"),
        version=os.getenv("APP_VERSION", "0.1.0"),
        cors_origins=_csv(os.getenv("CORS_ORIGINS", "*")),
    )
`,
);

writeFile(
  "app/core/middleware.py",
  `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import Settings


def configure_cors(app: FastAPI, settings: Settings) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_methods=["*"],
        allow_headers=["*"],
    )
`,
);

writeFile(
  "app/features/health/schemas.py",
  `from pydantic import BaseModel


class HealthRead(BaseModel):
    status: str
    service: str
    environment: str
    version: str
`,
);

writeFile(
  "app/features/health/service.py",
  `from app.core.config import Settings
from app.features.health.schemas import HealthRead


class HealthService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def get_health(self) -> HealthRead:
        return HealthRead(
            status="ok",
            service=self.settings.service_name,
            environment=self.settings.environment,
            version=self.settings.version,
        )
`,
);

writeFile(
  "app/features/health/router.py",
  `from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.features.health.schemas import HealthRead
from app.features.health.service import HealthService

router = APIRouter(tags=["health"])


def get_health_service(settings: Settings = Depends(get_settings)) -> HealthService:
    return HealthService(settings)


@router.get("/", response_model=HealthRead, include_in_schema=False)
async def root(service: HealthService = Depends(get_health_service)) -> HealthRead:
    return await service.get_health()


@router.get("/health", response_model=HealthRead)
async def health(service: HealthService = Depends(get_health_service)) -> HealthRead:
    return await service.get_health()
`,
);

writeFile(
  "app/features/router.py",
  `from fastapi import APIRouter

from app.features.health import router as health_router

router = APIRouter()
router.include_router(health_router)
`,
);

writeFile(
  "app/main.py",
  `from fastapi import FastAPI

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
`,
);
