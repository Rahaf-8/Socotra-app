# Legacy SQLite data migration

The application and current Prisma schema use PostgreSQL/Supabase through
`@prisma/adapter-pg`. The root `dev.db` file is retained only as a read-only
source for the one-time historical data migration.

The checked-in Prisma migrations were generated for SQLite. They must not be
replayed against PostgreSQL. The Supabase schema was created separately with
`prisma db push`; this utility migrates data only and never creates, resets, or
drops schema objects.

## Safety model

- The SQLite source is opened with `readonly: true`, `fileMustExist: true`, and
  SQLite `query_only` mode.
- The target uses `DATABASE_URL`, `@prisma/adapter-pg`, and the generated
  PostgreSQL Prisma Client.
- Dry-run is the default and performs no target writes.
- Apply requires the explicit `--apply` flag.
- Existing target rows are skipped only when identical. Material differences
  are blocking conflicts.
- Existing administrators are matched by normalized email. Their target
  password hash, session version, forced-password-change state, lock state, and
  security timestamps are preserved.
- IDs and foreign keys are preserved. The current utility does not remap IDs;
  an unavoidable collision blocks migration for review.
- Apply proceeds one model at a time in dependency order. Each model is split
  into batches of at most 25 rows; a batch is inserted with one multi-row SQL
  statement inside a bounded transaction (`maxWait` 10 seconds, `timeout` 20
  seconds). A failed batch is rolled back and stops all dependent phases.
  Earlier committed batches are safe on retry because the next plan skips
  identical rows and blocks material conflicts.
- SQLite JSON text is parsed and validated for comparison. At the final raw
  PostgreSQL parameter boundary, `FaqItemTranslation.answer` and
  `ContentSectionTranslation.paragraphs` are serialized exactly once so
  top-level JSON arrays are sent as JSON text rather than PostgreSQL arrays.

## Commands

Run a read-only plan:

```bash
npm run db:migrate:legacy
```

After reviewing a successful dry-run, run the real migration manually:

```bash
npm run db:migrate:legacy:apply
```

Running the command without a mode also defaults to dry-run. Never run
`prisma migrate reset`, `prisma migrate deploy`, or the legacy SQLite migration
SQL against Supabase.

`@prisma/adapter-better-sqlite3` and `better-sqlite3` are legacy migration-only
dependencies. Normal application runtime must continue to use
`src/lib/prisma.ts` and PostgreSQL.
