import assert from "node:assert/strict";
import test from "node:test";

import type { Prisma } from "@/generated/prisma/client";
import { prepareTourListItems, syncTourListItems, TourListItemConflictError } from "@/lib/tours/sync-tour-list-items";

type Row = { id: string; tourId: string; type: "included" | "excluded" | "requiredExtra"; displayOrder: number; status: "draft" | "published" | "archived"; referencePrice: number | null; currency: string | null };
type Translation = { id: string; listItemId: string; locale: "en" | "ar"; label: string; description: string | null };

function fakeTransaction(initialRows: Row[], initialTranslations: Translation[] = []) {
  const rows = new Map(initialRows.map((row) => [row.id, { ...row }]));
  const translations = new Map(initialTranslations.map((row) => [`${row.listItemId}:${row.locale}`, { ...row }]));
  const tx = {
    tourListItem: {
      findMany: async ({ where }: { where: { id?: { in: string[] }; tourId?: string } }) => [...rows.values()].filter((row) => where.id ? where.id.in.includes(row.id) : row.tourId === where.tourId),
      updateMany: async ({ where, data }: { where: { id?: string; tourId: string }; data: Partial<Omit<Row, "displayOrder">> & { displayOrder?: number | { increment: number } } }) => {
        let count = 0;
        for (const row of rows.values()) {
          if (row.tourId !== where.tourId || (where.id && row.id !== where.id)) continue;
          if (typeof data.displayOrder === "object") row.displayOrder += data.displayOrder.increment;
          else Object.assign(row, data);
          count += 1;
        }
        return { count };
      },
      create: async ({ data }: { data: Row }) => { if (rows.has(data.id)) throw new Error("duplicate id"); rows.set(data.id, { ...data }); },
      deleteMany: async ({ where }: { where: { tourId: string; id?: { notIn: string[] } } }) => {
        for (const row of rows.values()) if (row.tourId === where.tourId && (!where.id || !where.id.notIn.includes(row.id))) rows.delete(row.id);
      },
    },
    tourListItemTranslation: {
      upsert: async ({ where, update, create }: { where: { listItemId_locale: { listItemId: string; locale: "en" | "ar" } }; update: Partial<Translation>; create: Translation }) => {
        const key = `${where.listItemId_locale.listItemId}:${where.listItemId_locale.locale}`;
        const existing = translations.get(key);
        if (existing) Object.assign(existing, update);
        else translations.set(key, { ...create });
      },
    },
  } as unknown as Pick<Prisma.TransactionClient, "tourListItem" | "tourListItemTranslation">;
  return { tx, rows, translations };
}

const item = (id: string | undefined, en: string, displayOrder: number) => ({ id, en, ar: `ar-${en}`, displayOrder, status: "published" as const });
const extra = (id: string | undefined, en: string, displayOrder: number) => ({ ...item(id, en, displayOrder), descriptionEn: `${en} description`, descriptionAr: `ar-${en} description`, referencePrice: 25, currency: "USD" });
const data = (included: ReturnType<typeof item>[], requiredExtras: ReturnType<typeof extra>[] = []) => ({ included, excluded: [], requiredExtras });

test("edits existing items, adds new items, removes stale items, and preserves translation IDs", async () => {
  const { tx, rows, translations } = fakeTransaction(
    [
      { id: "keep", tourId: "tour-a", type: "included", displayOrder: 1, status: "published", referencePrice: null, currency: null },
      { id: "stale", tourId: "tour-a", type: "included", displayOrder: 2, status: "published", referencePrice: null, currency: null },
    ],
    [{ id: "custom-translation-id", listItemId: "keep", locale: "en", label: "Old", description: null }],
  );
  const prepared = prepareTourListItems("tour-a", data([item("keep", "Changed", 2), item(undefined, "New", 1)]), () => "new-id");
  await syncTourListItems(tx, "tour-a", prepared);
  assert.deepEqual([...rows.keys()].sort(), ["keep", "new-id"]);
  assert.equal(rows.get("keep")?.displayOrder, 2);
  assert.equal(translations.get("keep:en")?.id, "custom-translation-id");
  assert.equal(translations.get("keep:en")?.label, "Changed");
});

test("saves unchanged existing IDs idempotently and updates required extras", async () => {
  const existing: Row = { id: "extra", tourId: "tour-a", type: "requiredExtra", displayOrder: 1, status: "draft", referencePrice: 10, currency: "EUR" };
  const { tx, rows, translations } = fakeTransaction([existing]);
  const prepared = prepareTourListItems("tour-a", data([], [extra("extra", "Permit", 1)]), () => "unused");
  await syncTourListItems(tx, "tour-a", prepared);
  await syncTourListItems(tx, "tour-a", prepared);
  assert.equal(rows.get("extra")?.referencePrice, 25);
  assert.equal(rows.get("extra")?.currency, "USD");
  assert.equal(translations.get("extra:ar")?.description, "ar-Permit description");
});

test("rejects an ID owned by another tour without changing it", async () => {
  const foreign: Row = { id: "foreign", tourId: "tour-b", type: "included", displayOrder: 1, status: "published", referencePrice: null, currency: null };
  const { tx, rows } = fakeTransaction([foreign]);
  const prepared = prepareTourListItems("tour-a", data([item("foreign", "Hijack", 1)]), () => "unused");
  await assert.rejects(syncTourListItems(tx, "tour-a", prepared), TourListItemConflictError);
  assert.deepEqual(rows.get("foreign"), foreign);
});

test("rejects duplicate submitted IDs across list types", () => {
  assert.throws(() => prepareTourListItems("tour-a", { included: [item("same", "One", 1)], excluded: [item("same", "Two", 1)], requiredExtras: [] }, () => "unused"), TourListItemConflictError);
});
