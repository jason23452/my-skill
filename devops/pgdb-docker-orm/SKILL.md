---
name: pgdb-docker-orm
description: 使用 Docker image / Docker Compose 開發 PostgreSQL 資料庫，並用後端 ORM migration 進行 table/schema 開發。使用者提到 pgdb、Postgres、PostgreSQL、Docker database image、docker compose db service、ORM model、migration、Alembic、SQLAlchemy、Prisma、TypeORM、Django migration、建 table、資料表設計、schema change、後端資料庫欄位新增或修改時，都應使用這個 skill；即使使用者只說「pgdb」、「docker image pg」、「建 table」、「開資料庫」或「ORM」也要觸發。
---

# PGDB Docker ORM 開發

## Bootstrap Boundary

PostgreSQL, ORM, migration, and table/schema work is a database add-on. Apply this skill when the user asks for PGDB, Postgres, Docker database service, ORM model, migration, schema, or table work.

```opencode-bootstrap-json
{
  "role": "backend",
  "category": "database",
  "database": "postgresql",
  "frameworks": ["backend", "fastapi", "node", "django"],
  "order": 55,
  "packageManager": "node",
  "scaffoldCommand": [
    "if test -f .opencode/skills/pgdb-docker-orm/scripts/bootstrap-02-01.cjs; then node .opencode/skills/pgdb-docker-orm/scripts/bootstrap-02-01.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/pgdb-docker-orm/scripts/bootstrap-02-01.cjs; fi"
  ],
  "verificationCommands": [
    "node -e \"const fs=require('fs'); const file=['compose.yaml','compose.yml','docker-compose.yml','docker-compose.yaml'].find((item)=>fs.existsSync(item)); if(!file) process.exit(1); const s=fs.readFileSync(file,'utf8'); if(!/postgres:|POSTGRES_DB|postgres_data/.test(s)) process.exit(1);\""
  ]
}
```

如果 Compose 檔已存在，在保留既有 service 的前提下補上 `db` service、healthcheck 與 `postgres_data` volume，並讓 backend 使用 `postgresql+asyncpg://postgres:postgres@db:5432/app_db`。

使用這個 skill 協助使用者用 Docker 建立與維護本機 PostgreSQL 開發資料庫，同時讓後端資料表變更透過 ORM 與 migration 系統管理。

## 核心原則

1. 先檢查既有專案，再提出命令或修改檔案。
2. 本機 PostgreSQL 優先使用 Docker Compose，因為 image 版本、port、healthcheck、volume 與後端連線設定都能集中管理。
3. table/schema 變更優先走 ORM migration。`psql` DDL 適合檢查或臨時實驗，但正式開發變更應寫在 model 與 migration 檔案中。
4. 預設保護開發資料。database volume、drop schema、migration 重置與清空資料庫都需要使用者明確同意。
5. 明確區分主機與容器內連線字串。主機通常用 `localhost:<published-port>`；Compose 內其他 service 通常用資料庫 service 名稱，例如 `db:5432`。

## 專案檢查清單

當使用者要求建立、啟動或修改 PGDB/ORM 設定時，先確認：

- Compose 檔案：`docker-compose.yml`、`compose.yml`、`docker-compose*.yml`。
- PostgreSQL service 名稱、image tag、對外 port、volume 名稱、healthcheck、database/user/password 環境變數。
- 後端框架與 package manager，例如 `pyproject.toml`、`requirements.txt`、`package.json`、`pom.xml`、`go.mod` 或框架設定檔。
- ORM 與 migration 工具。
- Python 常見訊號：`alembic.ini`、`migrations/`、`app/models`、SQLAlchemy、SQLModel、Django migrations。
- Node 常見訊號：`prisma/schema.prisma`、TypeORM config、Drizzle config、Knex migrations。
- 既有 `.env`、`.env.example`、settings module 與 `DATABASE_URL` 命名。
- 是否已有測試或 seed script 可驗證資料庫連線。

Stack evidence incomplete 時，先根據 manifest、framework config 與既有 migration 檔推定最匹配的 ORM；缺少必要決策時輸出 `requiredInput`，由 flow/find-skills question gate 收斂。

## 建立本機 PostgreSQL Service

如果專案還沒有 database service，先提出最小 Compose service，再依專案風格修改。使用專案既有的 Compose 檔名與 network 慣例。

新本機開發環境的建議預設：

```yaml
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d app_db"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
```

依專案調整預設值：

- 如果專案已指定 PostgreSQL major version，沿用既有版本。
- 如果主機 `5432` 已被占用，先說明 tradeoff，再考慮改成 `5433:5432`。
- 共用或正式環境的密碼由 secret 管理或部署環境提供。`postgres/postgres` 適合本機 throwaway 開發環境。
- 後端也在 Compose 中執行時，若專案支援，替 backend service 加上 `depends_on` health condition。

## Docker 操作流程

Docker 指令應從包含 Compose 檔案的專案根目錄執行。

1. 編輯 Docker/Compose 後先驗證設定。
   ```powershell
   docker compose config
   ```

2. 啟動 PostgreSQL。
   ```powershell
   docker compose up -d db
   ```

3. 檢查 service 狀態。
   ```powershell
   docker compose ps
   docker compose logs db --no-color
   ```

4. 需要時檢查資料庫。
   ```powershell
   docker compose exec db psql -U postgres -d app_db -c "\dt"
   docker compose exec db psql -U postgres -d app_db -c "select version();"
   ```

5. 如果 backend 也跑在 Compose 裡，backend 的環境變數通常要用 Compose service hostname。
   ```text
   postgresql://postgres:postgres@db:5432/app_db
   ```

6. 如果 backend 跑在主機上，通常使用 host published port。
   ```text
   postgresql://postgres:postgres@localhost:5432/app_db
   ```

## ORM Migration 流程

開發 table 時，先修改 ORM model，再產生 migration。套用前要 review migration，確認沒有意外 drop 或破壞性操作。

### SQLAlchemy 或 SQLModel + Alembic

專案有 `alembic.ini`、`env.py`、SQLAlchemy model、SQLModel model、FastAPI database module 或 `postgresql+asyncpg` URL 時，使用這段流程。

1. 在既有 model package 新增或更新 model class。
2. 確認 Alembic 的 `migrations/env.py` 或專案等效檔案會 import model metadata。
3. 產生 migration。
   ```powershell
   alembic revision --autogenerate -m "add <table-name> table"
   ```
4. Review 產生的 migration，確認 index、constraint、enum、server default 與破壞性操作。
5. 套用 migration。
   ```powershell
   alembic upgrade head
   ```
6. 如果命令應在 backend container 內執行，使用專案既有 package runner，例如：
   ```powershell
   docker compose exec backend uv run alembic upgrade head
   ```

### Prisma

專案有 `prisma/schema.prisma` 時，使用這段流程。

```powershell
npx prisma migrate dev --name add_<table_name>_table
npx prisma generate
```

將 schema change 視為完成前，先 review `prisma/migrations/` 中產生的 SQL。

### TypeORM

專案有 TypeORM entity 與 TypeORM data source config 時，使用這段流程。

```powershell
npm run migration:generate -- <descriptive-name>
npm run migration:run
```

優先使用專案既有 script，因為 TypeScript path alias 與環境變數載入常寫在 script 裡。

### Django ORM

專案有 `manage.py` 與 Django apps 時，使用這段流程。

```powershell
python manage.py makemigrations
python manage.py migrate
```

如果後端是 Dockerized service，且專案平常在 container 內跑 Django，改用 `docker compose exec <backend-service>` 執行。

## Table 設計檢查清單

新增或修改 table 時，檢查：

- Primary key 與穩定的 ID 策略。
- Foreign key 與 delete behavior。
- `NOT NULL`、unique constraint 與 check constraint。
- 查詢欄位、foreign key 與常見 filter 的 index。
- 專案若已有慣例，加入 `created_at`、`updated_at` 等 timestamp 欄位。
- 金額或量測欄位的 numeric precision。
- Enum 儲存策略與後續 migration 難度。
- 專案既有 naming convention。
- 既有資料的 backfill 或 default 策略。
- Migration rollback 能力；irreversible migration 要清楚註明。

## 驗證

套用 schema change 後，做最小但足夠的驗證：

- Compose service 健康：`docker compose ps`。
- Migration 已到最新狀態：ORM 對應 migration status 或 `upgrade head` 成功。
- PostgreSQL 內 table 存在：`docker compose exec db psql ... -c "\dt"`。
- Backend 使用預期的 `DATABASE_URL` 能啟動。
- 相關測試通過，尤其是會打到 ORM 的 repository/service tests。
- 如果是 API 功能，盡量打一個最小 request 驗證新增 table 的 create/read path。

## 疑難排解

- `connection refused`：確認 PostgreSQL 是否有跑，並檢查 backend 是否在 container 內誤用 `localhost`。Container 內通常要連 `db`，不是 `localhost`。
- `database missing`：確認 `POSTGRES_DB` 與 `DATABASE_URL` 的 database 名稱一致。Postgres image 只會在 volume 第一次初始化時建立初始 database。
- 改了 `POSTGRES_*` 但沒有變化：既有 volume 會保留第一次初始化的 database、role 與密碼。刪除或重建 volume 前要先問使用者。
- Migration autogenerate 是空的：ORM metadata 可能沒有被 migration environment import，或 model file 沒被載入。
- Migration 想 drop 不預期的物件：先停止，檢查 metadata naming、schema 與實際 database 狀態，再決定下一步。
- Python async URL 問題：app runtime 可能用 `postgresql+asyncpg://...`，但 Alembic 可能需要 sync driver 或專案既有 async Alembic 設定。沿用專案既有模式。

## 回覆風格

使用者提出 PGDB/ORM 需求時，工具可用就直接協助檢查、修改與驗證。過程中只回報有意義的發現、取捨與阻塞點。

最終回覆包含：

- 修改了哪些檔案。
- Docker/PostgreSQL 狀態。
- 執行了哪些 model/migration 指令。
- 做了哪些驗證。
- 需要使用者決定的後續事項，尤其是 volume reset、正式環境密碼或破壞性 migration。
