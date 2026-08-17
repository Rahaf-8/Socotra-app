import type { Prisma } from "@/generated/prisma/client";
import type { TourAdminData } from "@/lib/validation/tour-admin";

const locales = ["en", "ar"] as const;

export class TourListItemConflictError extends Error {
  constructor() {
    super("A submitted tour list item belongs to another tour.");
    this.name = "TourListItemConflictError";
  }
}

type ListItemTransaction = Pick<Prisma.TransactionClient, "tourListItem" | "tourListItemTranslation">;

type SubmittedListItem = {
  id: string;
  type: "included" | "excluded" | "requiredExtra";
  displayOrder: number;
  status: "draft" | "published" | "archived";
  referencePrice: number | null;
  currency: string | null;
  en: { label: string; description: string | null };
  ar: { label: string; description: string | null };
};

const clean = (value?: string) => value?.trim() || null;

export function prepareTourListItems(
  tourId: string,
  data: Pick<TourAdminData, "included" | "excluded" | "requiredExtras">,
  createId: (prefix: string) => string,
): SubmittedListItem[] {
  const items: SubmittedListItem[] = [];

  for (const [type, values] of [["included", data.included], ["excluded", data.excluded]] as const) {
    for (const item of values) {
      items.push({
        id: item.id || createId(`${tourId}-${type}`),
        type,
        displayOrder: item.displayOrder,
        status: item.status,
        referencePrice: null,
        currency: null,
        en: { label: item.en, description: null },
        ar: { label: item.ar, description: null },
      });
    }
  }

  for (const item of data.requiredExtras) {
    items.push({
      id: item.id || createId(`${tourId}-requiredExtra`),
      type: "requiredExtra",
      displayOrder: item.displayOrder,
      status: item.status,
      referencePrice: item.referencePrice,
      currency: clean(item.currency),
      en: { label: item.en, description: clean(item.descriptionEn) },
      ar: { label: item.ar, description: clean(item.descriptionAr) },
    });
  }

  if (new Set(items.map((item) => item.id)).size !== items.length) {
    throw new TourListItemConflictError();
  }

  return items;
}

export async function syncTourListItems(
  tx: ListItemTransaction,
  tourId: string,
  items: SubmittedListItem[],
) {
  const submittedIds = items.map((item) => item.id);
  const existingById = submittedIds.length
    ? await tx.tourListItem.findMany({ where: { id: { in: submittedIds } }, select: { id: true, tourId: true } })
    : [];

  if (existingById.some((item) => item.tourId !== tourId)) {
    throw new TourListItemConflictError();
  }

  // Free the current order slots first so swaps and type changes cannot collide
  // with the compound (tourId, type, displayOrder) unique constraint.
  const currentItems = await tx.tourListItem.findMany({
    where: { tourId },
    select: { displayOrder: true },
  });
  if (currentItems.length) {
    const currentOrders = currentItems.map((item) => item.displayOrder);
    const submittedOrders = items.map((item) => item.displayOrder);
    const currentMin = Math.min(...currentOrders);
    const stagingFloor = Math.max(...currentOrders, ...submittedOrders, 0) + 1;
    await tx.tourListItem.updateMany({
      where: { tourId },
      data: { displayOrder: { increment: stagingFloor - currentMin } },
    });
  }

  for (const item of items) {
    const values = {
      tourId,
      type: item.type,
      displayOrder: item.displayOrder,
      status: item.status,
      referencePrice: item.referencePrice,
      currency: item.currency,
    };
    const updated = await tx.tourListItem.updateMany({
      where: { id: item.id, tourId },
      data: values,
    });
    if (updated.count === 0) {
      await tx.tourListItem.create({
        data: {
          id: item.id,
          ...values,
        },
      });
    }

    for (const locale of locales) {
      const translation = item[locale];
      await tx.tourListItemTranslation.upsert({
        where: { listItemId_locale: { listItemId: item.id, locale } },
        update: { label: translation.label, description: translation.description },
        create: {
          id: `${item.id}-${locale}`,
          listItemId: item.id,
          locale,
          label: translation.label,
          description: translation.description,
        },
      });
    }
  }

  await tx.tourListItem.deleteMany({
    where: { tourId, ...(submittedIds.length ? { id: { notIn: submittedIds } } : {}) },
  });
}
