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
writeFile("app/features/__init__.py", "");
writeFile(
  "app/features/router.py",
  `from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def root():
    return {"status": "ok"}

@router.get("/health")
def health():
    return {"status": "ok"}
`,
);
writeFile(
  "app/main.py",
  `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.features.router import router as feature_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(feature_router)
`,
);
