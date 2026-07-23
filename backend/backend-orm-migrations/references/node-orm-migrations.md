# Node ORM Migrations

Use this reference when the backend repo is Node/TypeScript and database persistence is owned by the backend service.

## Framework Selection

Keep the existing ORM/migration tool when detected:

- Prisma: `prisma/schema.prisma`, `prisma/migrations/`
- Drizzle: `drizzle.config.*`, `drizzle/`, schema modules
- TypeORM: data source config and entity files
- Knex: `knexfile.*`, `migrations/`

Do not introduce a second ORM.

If no ORM exists, choose only when repo evidence or user direction supports it. Otherwise block with `TASK_CONCRETE_CONTRACT_MISSING`.

## Prisma

Paths:

```text
prisma/schema.prisma
prisma/migrations/
src/**/repository or src/**/service consumers
```

Commands:

```bash
npx prisma migrate dev --name <change_name>
npx prisma generate
```

Prefer package scripts if present.

## Drizzle

Paths depend on repo config. Typical paths:

```text
drizzle.config.ts
src/db/schema.ts
drizzle/
```

Commands are repo-script first. Common commands:

```bash
npm run db:generate
npm run db:migrate
```

If no scripts exist, do not invent command names; block or add explicit scripts as part of the task contract.

## TypeORM

Paths depend on data source config. Typical paths:

```text
src/data-source.ts
src/entities/
src/migrations/
```

Commands must use repo scripts because path aliases and TS runtime differ across projects:

```bash
npm run migration:generate -- <name>
npm run migration:run
```

Do not call raw `typeorm` CLI unless repo scripts already prove it works.

## Knex

Paths:

```text
knexfile.ts or knexfile.js
migrations/
src/db/
```

Commands:

```bash
npx knex migrate:make <name>
npx knex migrate:latest
```

Prefer package scripts if present.

## Task Contract Text

Generated tasks must name:

- Selected ORM/migration tool.
- Config path.
- Schema/entity/model path.
- Migration directory.
- Exact create/apply/status/generate commands.
- Required package scripts, if commands go through scripts.
- Verification command and DB inspection method.

Block when Node repo evidence does not identify enough ORM or package-script details.
