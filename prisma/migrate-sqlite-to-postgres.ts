import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

import {
  LEGACY_TABLES,
  MIGRATION_GROUPS,
  TABLE_PRIMARY_KEYS,
  type LegacyTable,
} from "./legacy-migration-config";
import {
  openLegacySource,
  type DataRow,
  type LegacySource,
} from "./legacy-sqlite-reader";

type TargetColumn = {
  columnName: string;
  dataType: string;
  udtName: string;
  nullable: boolean;
};

type UniqueConstraint = {
  name: string;
  columns: string[];
};

type RowAction = {
  table: LegacyTable;
  key: string;
  kind: "insert" | "skip" | "merge" | "conflict" | "blocked";
  reason: string;
  source: DataRow;
};

type TablePlan = {
  table: LegacyTable;
  sourceCount: number;
  targetCount: number;
  actions: RowAction[];
};

type Plan = {
  tables: Map<LegacyTable, TablePlan>;
  validationFailures: string[];
  relationFailures: string[];
  remaps: Array<{ table: LegacyTable; oldId: string; newId: string }>;
};

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const dryRun = args.has("--dry-run") || !apply;
if (apply && args.has("--dry-run")) {
  throw new Error("Choose either --dry-run or --apply, not both.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

function quotePostgresIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function canonical(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "bigint") return Number(value);
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, canonical(entry)]),
    );
  }
  return value;
}

function equalRows(source: DataRow, target: DataRow, columns: string[]) {
  return columns.every(
    (column) =>
      JSON.stringify(canonical(source[column])) ===
      JSON.stringify(canonical(target[column])),
  );
}

function coerceSourceValue(value: unknown, column: TargetColumn): unknown {
  if (value === null || value === undefined) return null;
  if (column.dataType === "boolean") return value === true || value === 1;
  if (column.dataType.includes("timestamp")) {
    const date = new Date(String(value));
    if (Number.isNaN(date.valueOf())) {
      throw new Error(`Invalid timestamp value for ${column.columnName}.`);
    }
    return date;
  }
  if (column.dataType === "json" || column.dataType === "jsonb") {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value) as unknown;
    } catch {
      throw new Error(`Invalid JSON value for ${column.columnName}.`);
    }
  }
  return value;
}

async function loadTargetColumns() {
  const rows = await prisma.$queryRawUnsafe<
    Array<{
      table_name: string;
      column_name: string;
      data_type: string;
      udt_name: string;
      is_nullable: "YES" | "NO";
    }>
  >(
    `SELECT table_name, column_name, data_type, udt_name, is_nullable
     FROM information_schema.columns
     WHERE table_schema = 'public'
     ORDER BY table_name, ordinal_position`,
  );
  const result = new Map<LegacyTable, TargetColumn[]>();
  for (const table of LEGACY_TABLES) result.set(table, []);
  for (const row of rows) {
    if (!LEGACY_TABLES.includes(row.table_name as LegacyTable)) continue;
    result.get(row.table_name as LegacyTable)!.push({
      columnName: row.column_name,
      dataType: row.data_type,
      udtName: row.udt_name,
      nullable: row.is_nullable === "YES",
    });
  }
  return result;
}

async function loadTargetUniqueConstraints() {
  const rows = await prisma.$queryRawUnsafe<
    Array<{
      table_name: string;
      constraint_name: string;
      columns_csv: string;
    }>
  >(
    `SELECT tc.table_name, tc.constraint_name,
            string_agg(kcu.column_name, E'\x1f' ORDER BY kcu.ordinal_position) AS columns_csv
     FROM information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu
       ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
     WHERE tc.table_schema = 'public'
       AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
     GROUP BY tc.table_name, tc.constraint_name`,
  );
  const result = new Map<LegacyTable, UniqueConstraint[]>();
  for (const table of LEGACY_TABLES) result.set(table, []);
  for (const row of rows) {
    if (!LEGACY_TABLES.includes(row.table_name as LegacyTable)) continue;
    result.get(row.table_name as LegacyTable)!.push({
      name: row.constraint_name,
      columns: row.columns_csv.split("\x1f"),
    });
  }
  return result;
}

async function loadTargetEnums() {
  const rows = await prisma.$queryRawUnsafe<
    Array<{ enum_name: string; enum_value: string }>
  >(
    `SELECT type.typname AS enum_name, enum.enumlabel AS enum_value
     FROM pg_type type
     JOIN pg_enum enum ON enum.enumtypid = type.oid
     JOIN pg_namespace namespace ON namespace.oid = type.typnamespace
     WHERE namespace.nspname = 'public'
     ORDER BY type.typname, enum.enumsortorder`,
  );
  const result = new Map<string, Set<string>>();
  for (const row of rows) {
    if (!result.has(row.enum_name)) result.set(row.enum_name, new Set());
    result.get(row.enum_name)!.add(row.enum_value);
  }
  return result;
}

async function loadTargetRows(table: LegacyTable) {
  return prisma.$queryRawUnsafe<DataRow[]>(
    `SELECT * FROM ${quotePostgresIdentifier(table)}`,
  );
}

function validateSourceRelations(source: LegacySource) {
  const failures: string[] = [];
  for (const table of LEGACY_TABLES) {
    const rows = source.tables.get(table)!;
    for (const foreignKey of source.foreignKeys.get(table)!) {
      const parentTable = foreignKey.table as LegacyTable;
      const parentRows = source.tables.get(parentTable);
      if (!parentRows) {
        failures.push(`${table}.${foreignKey.from} references unknown table ${parentTable}.`);
        continue;
      }
      const parentValues = new Set(parentRows.map((row) => row[foreignKey.to]));
      for (const row of rows) {
        const value = row[foreignKey.from];
        if (value !== null && value !== undefined && !parentValues.has(value)) {
          failures.push(
            `${table}.${foreignKey.from}=${String(value)} has no ${parentTable}.${foreignKey.to}.`,
          );
        }
      }
    }
  }
  return failures;
}

async function buildPlan(source: LegacySource): Promise<Plan> {
  const targetColumns = await loadTargetColumns();
  const uniqueConstraints = await loadTargetUniqueConstraints();
  const targetEnums = await loadTargetEnums();
  const plans = new Map<LegacyTable, TablePlan>();
  const validationFailures: string[] = [];

  for (const table of LEGACY_TABLES) {
    const sourceRows = source.tables.get(table)!;
    const sourceColumns = source.columns.get(table)!;
    const columns = targetColumns.get(table)!;
    const targetRows = await loadTargetRows(table);
    const targetColumnNames = columns.map((column) => column.columnName);
    const missingInTarget = sourceColumns.filter(
      (column) => !targetColumnNames.includes(column),
    );
    const missingInSource = columns.filter(
      (column) => !sourceColumns.includes(column.columnName) && !column.nullable,
    );
    if (missingInTarget.length) {
      validationFailures.push(
        `${table}: populated source columns absent from target: ${missingInTarget.join(", ")}.`,
      );
    }
    if (missingInSource.length) {
      validationFailures.push(
        `${table}: required target columns absent from source: ${missingInSource.map((column) => column.columnName).join(", ")}.`,
      );
    }

    const converted = sourceRows.map((row) => {
      const result: DataRow = {};
      for (const column of columns) {
        if (!sourceColumns.includes(column.columnName)) continue;
        try {
          result[column.columnName] = coerceSourceValue(
            row[column.columnName],
            column,
          );
          const allowedEnumValues = targetEnums.get(column.udtName);
          const convertedValue = result[column.columnName];
          if (
            allowedEnumValues &&
            convertedValue !== null &&
            !allowedEnumValues.has(String(convertedValue))
          ) {
            throw new Error(
              `value ${String(convertedValue)} is not valid for PostgreSQL enum ${column.udtName}`,
            );
          }
        } catch (error) {
          validationFailures.push(
            `${table}.${column.columnName}: ${error instanceof Error ? error.message : "conversion failed"}`,
          );
        }
      }
      return result;
    });

    source.tables.set(table, converted);
    const primaryKey = TABLE_PRIMARY_KEYS[table];
    const actions: RowAction[] = [];

    for (const row of converted) {
      const key = String(row[primaryKey]);
      if (!key || key === "undefined" || key === "null") {
        actions.push({ table, key, kind: "blocked", reason: "missing primary key", source: row });
        continue;
      }

      if (table === "AdminUser") {
        const email = String(row.email).trim().toLowerCase();
        const byEmail = targetRows.find(
          (target) => String(target.email).trim().toLowerCase() === email,
        );
        if (byEmail) {
          actions.push({
            table,
            key,
            kind: "merge",
            reason: "administrator email already exists; target credentials and security state are preserved",
            source: row,
          });
          continue;
        }
      }

      const byPrimaryKey = targetRows.find(
        (target) => String(target[primaryKey]) === key,
      );
      if (byPrimaryKey) {
        actions.push({
          table,
          key,
          kind: equalRows(row, byPrimaryKey, Object.keys(row)) ? "skip" : "conflict",
          reason: equalRows(row, byPrimaryKey, Object.keys(row))
            ? "identical primary-key record"
            : "primary key exists with materially different data",
          source: row,
        });
        continue;
      }

      const uniqueCollision = uniqueConstraints
        .get(table)!
        .filter((constraint) => !constraint.columns.includes(primaryKey))
        .find((constraint) =>
          targetRows.some((target) =>
            constraint.columns.every(
              (column) =>
                row[column] !== null &&
                row[column] !== undefined &&
                canonical(row[column]) === canonical(target[column]),
            ),
          ),
        );
      if (uniqueCollision) {
        actions.push({
          table,
          key,
          kind: "conflict",
          reason: `unique constraint ${uniqueCollision.name} conflicts with another target ID`,
          source: row,
        });
        continue;
      }

      actions.push({ table, key, kind: "insert", reason: "missing from target", source: row });
    }

    plans.set(table, {
      table,
      sourceCount: converted.length,
      targetCount: targetRows.length,
      actions,
    });
  }

  return {
    tables: plans,
    validationFailures,
    relationFailures: validateSourceRelations(source),
    remaps: [],
  };
}

function printPlan(source: LegacySource, plan: Plan) {
  console.info(`Mode: ${dryRun ? "DRY RUN (no target writes)" : "APPLY"}`);
  console.info(`Legacy source: ${source.path}`);
  console.info("Source connected: yes (read-only/query-only)");
  console.info("Target connected: yes (PostgreSQL via @prisma/adapter-pg)");
  console.info(`Dependency order: ${MIGRATION_GROUPS.flatMap((group) => group.tables).join(" -> ")}`);
  console.info("\nModel plan:");
  for (const table of LEGACY_TABLES) {
    const tablePlan = plan.tables.get(table)!;
    const count = (kind: RowAction["kind"]) =>
      tablePlan.actions.filter((action) => action.kind === kind).length;
    console.info(
      `${table}: source=${tablePlan.sourceCount} target=${tablePlan.targetCount} insert=${count("insert")} skip=${count("skip")} merge=${count("merge")} conflict=${count("conflict")} blocked=${count("blocked")}`,
    );
    for (const action of tablePlan.actions.filter((entry) =>
      ["merge", "conflict", "blocked"].includes(entry.kind),
    )) {
      console.info(`  ${action.kind.toUpperCase()} ${action.key}: ${action.reason}`);
    }
  }
  const allActions = [...plan.tables.values()].flatMap(
    (tablePlan) => tablePlan.actions,
  );
  const total = (kind: RowAction["kind"]) =>
    allActions.filter((action) => action.kind === kind).length;
  console.info("\nPlan totals:");
  console.info(`Planned inserts: ${total("insert")}`);
  console.info(`Planned skips: ${total("skip")}`);
  console.info(`Protected merges: ${total("merge")}`);
  console.info(`Conflicts: ${total("conflict")}`);
  console.info(`Blocked records: ${total("blocked")}`);
  console.info(`\nID remaps: ${plan.remaps.length}`);
  console.info(`Validation failures: ${plan.validationFailures.length}`);
  for (const failure of plan.validationFailures) console.info(`  ${failure}`);
  console.info(`Referential-integrity failures: ${plan.relationFailures.length}`);
  for (const failure of plan.relationFailures) console.info(`  ${failure}`);
}

function hasUnsafeFailures(plan: Plan) {
  return (
    plan.validationFailures.length > 0 ||
    plan.relationFailures.length > 0 ||
    [...plan.tables.values()].some((table) =>
      table.actions.some((action) => action.kind === "conflict" || action.kind === "blocked"),
    )
  );
}

const APPLY_BATCH_SIZE = 25;
const APPLY_TRANSACTION_OPTIONS = {
  maxWait: 10_000,
  timeout: 20_000,
} as const;
const JSON_COLUMNS: Partial<Record<LegacyTable, ReadonlySet<string>>> = {
  FaqItemTranslation: new Set(["answer"]),
  ContentSectionTranslation: new Set(["paragraphs"]),
};

function chunk<T>(values: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function serializeSqlParameter(
  table: LegacyTable,
  column: string,
  value: unknown,
) {
  if (value === null || value === undefined) return value;
  if (!JSON_COLUMNS[table]?.has(column)) return value;
  return JSON.stringify(value);
}

async function insertBatch(
  client: Pick<PrismaClient, "$executeRawUnsafe">,
  actions: readonly RowAction[],
) {
  const firstAction = actions[0];
  if (!firstAction) return;
  const columns = Object.keys(firstAction.source);
  const values = actions.flatMap((action) =>
    columns.map((column) =>
      serializeSqlParameter(
        firstAction.table,
        column,
        action.source[column],
      ),
    ),
  );
  const rowsSql = actions
    .map((_, rowIndex) => {
      const offset = rowIndex * columns.length;
      return `(${columns.map((__, columnIndex) => `$${offset + columnIndex + 1}`).join(", ")})`;
    })
    .join(", ");
  const sql = `INSERT INTO ${quotePostgresIdentifier(firstAction.table)} (${columns.map(quotePostgresIdentifier).join(", ")}) VALUES ${rowsSql}`;
  await client.$executeRawUnsafe(sql, ...values);
}

async function applyPlan(plan: Plan) {
  if (hasUnsafeFailures(plan)) {
    throw new Error("Apply refused because the dry-run plan contains unsafe failures.");
  }
  for (const group of MIGRATION_GROUPS) {
    for (const table of group.tables) {
      const actions = plan.tables
        .get(table)!
        .actions.filter((action) => action.kind === "insert");
      const batches = chunk(actions, APPLY_BATCH_SIZE);
      if (!batches.length) continue;
      console.info(
        `Applying phase ${group.name}/${table}: ${actions.length} inserts in ${batches.length} batch(es).`,
      );
      for (const [batchIndex, batch] of batches.entries()) {
        try {
          await prisma.$transaction(
            async (transaction) => insertBatch(transaction, batch),
            APPLY_TRANSACTION_OPTIONS,
          );
          console.info(
            `Applied phase ${group.name}/${table} batch ${batchIndex + 1}/${batches.length}: ${batch.length} inserts.`,
          );
        } catch (error) {
          const detail =
            error instanceof Error ? error.message : "unknown database error";
          throw new Error(
            `Apply failed in phase ${group.name}/${table}, batch ${batchIndex + 1}/${batches.length}. That batch was rolled back; dependent phases were not started. ${detail}`,
            { cause: error },
          );
        }
      }
    }
  }
}

async function main() {
  const source = openLegacySource();
  try {
    const plan = await buildPlan(source);
    printPlan(source, plan);
    if (hasUnsafeFailures(plan)) {
      process.exitCode = 2;
      return;
    }
    if (apply) {
      await applyPlan(plan);
      console.info("Migration apply completed.");
    } else {
      console.info("Dry-run completed successfully. No target writes were performed.");
    }
  } finally {
    source.close();
  }
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Legacy migration failed.");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
