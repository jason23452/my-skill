#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const writeFile = (filePath, contents) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
};

writeFile("app/__init__.py", "");
writeFile("app/core/__init__.py", "");
writeFile(
  "app/core/config.py",
  `from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    api_prefix: str = "/api"
    cors_origins: list[str] = ["*"]
    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/app_db"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
`,
);
writeFile("app/features/__init__.py", "");
writeFile(
  "app/features/router.py",
  `from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["health"])
def health():
    return {"status": "ok", "service": "backend"}
`,
);
writeFile(
  "app/main.py",
  `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.features.router import router as feature_router

app = FastAPI(title="Greenfield Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(feature_router, prefix=settings.api_prefix)

@app.get("/health", tags=["health"])
def root_health():
    return {"status": "ok", "service": "backend"}
`,
);
