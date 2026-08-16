import Database from "better-sqlite3";
import path from "node:path";

import { LEGACY_TABLES, type LegacyTable } from "./legacy-migration-config";

export type DataRow = Record<string, unknown>;

export type SourceForeignKey = {
  table: string;
  from: string;
  to: string;
};

export type LegacySource = {
  path: string;
  tables: Map<LegacyTable, DataRow[]>;
  columns: Map<LegacyTable, string[]>;
  foreignKeys: Map<LegacyTable, SourceForeignKey[]>;
  close: () => void;
};

function quoteSqliteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function openLegacySource(): LegacySource {
  const sourcePath = path.resolve(process.cwd(), "dev.db");
  const database = new Database(sourcePath, {
    readonly: true,
    fileMustExist: true,
  });

  database.pragma("query_only = ON");
  database.pragma("foreign_keys = ON");

  const discovered = new Set(
    database
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name <> '_prisma_migrations'",
      )
      .all()
      .map((row) => (row as { name: string }).name),
  );
  const expected = new Set<string>(LEGACY_TABLES);
  const missing = LEGACY_TABLES.filter((table) => !discovered.has(table));
  const unexpected = [...discovered].filter((table) => !expected.has(table));

  if (missing.length || unexpected.length) {
    database.close();
    throw new Error(
      `Legacy schema inventory mismatch. Missing: ${missing.join(", ") || "none"}. Unexpected: ${unexpected.join(", ") || "none"}.`,
    );
  }

  const tables = new Map<LegacyTable, DataRow[]>();
  const columns = new Map<LegacyTable, string[]>();
  const foreignKeys = new Map<LegacyTable, SourceForeignKey[]>();

  for (const table of LEGACY_TABLES) {
    const quoted = quoteSqliteIdentifier(table);
    const tableColumns = database
      .prepare(`PRAGMA table_info(${quoted})`)
      .all()
      .map((row) => (row as { name: string }).name);
    const tableForeignKeys = database
      .prepare(`PRAGMA foreign_key_list(${quoted})`)
      .all()
      .map((row) => {
        const value = row as { table: string; from: string; to: string };
        return { table: value.table, from: value.from, to: value.to };
      });

    columns.set(table, tableColumns);
    foreignKeys.set(table, tableForeignKeys);
    tables.set(
      table,
      database.prepare(`SELECT * FROM ${quoted}`).all() as DataRow[],
    );
  }

  return {
    path: sourcePath,
    tables,
    columns,
    foreignKeys,
    close: () => database.close(),
  };
}

