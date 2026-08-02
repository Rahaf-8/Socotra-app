import "dotenv/config";

import assert from "node:assert/strict";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { tourAdminSchema } from "../src/lib/validation/tour-admin";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
const tourId = "temporary-tours-crud-verification";
const slug = "temporary-tours-crud-verification";

async function cleanup() {
  await prisma.bookingRequest.deleteMany({ where: { tourId } });
  await prisma.tour.deleteMany({ where: { id: { in: [tourId, `${tourId}-duplicate`] } } });
}

async function main() {
  await cleanup();
  const invalid = tourAdminSchema.safeParse({});
  assert.equal(invalid.success, false, "Invalid payload must be rejected.");

  await prisma.tour.create({ data: {
    id: tourId, slug, packageType: "group", durationDays: 8, heroImagePath: "/socotra-hero-placeholder.png", status: "published", displayOrder: 999,
    translations: { create: [
      { id: `${tourId}-en`, locale: "en", packageLabel: "Verification", title: "Temporary Verification Tour", tourType: "Group Tour", shortDescription: "Temporary verification content.", fullDescription: "Temporary verification content used only during automated checks.", heroImageAlt: "Temporary Socotra verification image" },
      { id: `${tourId}-ar`, locale: "ar", packageLabel: "تحقق", title: "رحلة تحقق مؤقتة", tourType: "رحلة جماعية", shortDescription: "محتوى مؤقت للتحقق.", fullDescription: "محتوى مؤقت يستخدم فقط أثناء التحقق الآلي.", heroImageAlt: "صورة مؤقتة للتحقق من سقطرى" },
    ] },
    pricingTiers: { create: { id: `${tourId}-price`, pricePerPerson: 100, currency: "USD", displayOrder: 1, translations: { create: [{ id: `${tourId}-price-en`, locale: "en", label: "Test tier" }, { id: `${tourId}-price-ar`, locale: "ar", label: "فئة اختبار" }] } } },
    listItems: { create: [
      { id: `${tourId}-included`, type: "included", displayOrder: 1, translations: { create: [{ id: `${tourId}-included-en`, locale: "en", label: "Included test" }, { id: `${tourId}-included-ar`, locale: "ar", label: "عنصر مشمول للاختبار" }] } },
      { id: `${tourId}-excluded`, type: "excluded", displayOrder: 1, translations: { create: [{ id: `${tourId}-excluded-en`, locale: "en", label: "Excluded test" }, { id: `${tourId}-excluded-ar`, locale: "ar", label: "عنصر غير مشمول للاختبار" }] } },
      { id: `${tourId}-extra`, type: "requiredExtra", displayOrder: 1, referencePrice: 10, currency: "USD", translations: { create: [{ id: `${tourId}-extra-en`, locale: "en", label: "Extra test" }, { id: `${tourId}-extra-ar`, locale: "ar", label: "تكلفة إضافية للاختبار" }] } },
    ] },
    itineraryDays: { create: { id: `${tourId}-day`, dayNumber: 1, displayOrder: 1, translations: { create: [{ id: `${tourId}-day-en`, locale: "en", title: "Test day", description: "Test itinerary description." }, { id: `${tourId}-day-ar`, locale: "ar", title: "يوم اختبار", description: "وصف برنامج رحلة للاختبار." }] } } },
    images: { create: { id: `${tourId}-image`, imagePath: "/socotra-hero-placeholder.png", displayOrder: 1, translations: { create: [{ id: `${tourId}-image-en`, locale: "en", altText: "Temporary verification image" }, { id: `${tourId}-image-ar`, locale: "ar", altText: "صورة تحقق مؤقتة" }] } } },
  } });

  const created = await prisma.tour.findUniqueOrThrow({ where: { id: tourId }, include: { translations: true, pricingTiers: true, listItems: true, itineraryDays: true, images: true } });
  assert.equal(created.translations.length, 2); assert.equal(created.listItems.length, 3); assert.equal(created.itineraryDays.length, 1); assert.equal(created.images.length, 1);
  await prisma.tourPricingTier.update({ where: { id: `${tourId}-price` }, data: { pricePerPerson: 125 } });
  assert.equal((await prisma.tourPricingTier.findUniqueOrThrow({ where: { id: `${tourId}-price` } })).pricePerPerson, 125);

  let duplicateRejected = false;
  try { await prisma.tour.create({ data: { id: `${tourId}-duplicate`, slug, packageType: "group", heroImagePath: "/socotra-hero-placeholder.png" } }); } catch { duplicateRejected = true; }
  assert.equal(duplicateRejected, true, "Duplicate slug must be rejected.");

  await prisma.bookingRequest.create({ data: { id: `${tourId}-booking`, tourId, selectedPackageTitle: "Temporary Verification Tour", fullName: "Temporary Verification", email: "verification.invalid@example.invalid", whatsappNumber: "000", country: "Verification", preferredArrivalDate: new Date("2030-01-01"), adults: 1, children: 0, locale: "en" } });
  let restricted = false;
  try { await prisma.tour.delete({ where: { id: tourId } }); } catch { restricted = true; }
  assert.equal(restricted, true, "A tour with booking history must not hard-delete.");
  await prisma.tour.update({ where: { id: tourId }, data: { status: "archived" } });
  assert.equal((await prisma.tour.findUniqueOrThrow({ where: { id: tourId } })).status, "archived");
  console.info("Tours CRUD verification passed.");
}

main().finally(async () => { await cleanup(); await prisma.$disconnect(); }).catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Tours CRUD verification failed."); process.exitCode = 1; });
