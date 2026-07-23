# Django Migrations

Use this reference when the backend repo has `manage.py` and Django apps.

## Existing Framework Rule

Django already provides the ORM and migration framework. Do not introduce SQLAlchemy, Alembic, Prisma, Drizzle, TypeORM, or Knex.

## Exact Paths

Use repo app paths:

```text
<app_name>/models.py
<app_name>/migrations/
manage.py
settings.py or config/settings/*
```

If models are split into a package, follow the existing import/export pattern and keep migrations in `<app_name>/migrations/`.

## Commands

Create migrations:

```bash
python manage.py makemigrations <app_name>
```

Apply migrations:

```bash
python manage.py migrate
```

Inspect migrations:

```bash
python manage.py showmigrations <app_name>
```

Use the repo's runner (`uv run`, `poetry run`, `pipenv run`, or `docker compose exec backend`) when README/AGENTS requires it.

## Task Contract Text

Generated tasks must name:

- Django app name.
- Model file/package path.
- Migration folder.
- `makemigrations` command.
- `migrate` command.
- `showmigrations` command.
- Any required data migration or backfill command.

Block with `TASK_CONCRETE_CONTRACT_MISSING` when the Django app ownership is unclear.
