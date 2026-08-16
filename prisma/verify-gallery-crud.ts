import "dotenv/config";

import assert from "node:assert/strict";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { getGalleryContent } from "../src/i18n/content/gallery";
import { galleryItemSchema, isSafeGalleryImageReference } from "../src/lib/validation/gallery-admin";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
const itemId = "temporary-gallery-crud-verification";

async function cleanup() { await prisma.galleryItem.deleteMany({ where: { id: itemId } }); }

async function main() {
  await cleanup();
  const before = { admins: await prisma.adminUser.count(), tours: await prisma.tour.count(), faq: await prisma.faqItem.count(), pages: await prisma.contentPage.count(), gallery: await prisma.galleryItem.count(), instagram: await prisma.instagramPost.count(), bookings: await prisma.bookingRequest.count(), contacts: await prisma.contactRequest.count() };
  assert.equal(galleryItemSchema.safeParse({}).success, false);
  assert.equal(isSafeGalleryImageReference("javascript:alert(1)"), false);
  assert.equal(isSafeGalleryImageReference("data:image/png;base64,x"), false);
  assert.equal(isSafeGalleryImageReference("file:///tmp/image.png"), false);
  assert.equal(isSafeGalleryImageReference("/../secret.png"), false);
  assert.equal(isSafeGalleryImageReference("/socotra-hero-placeholder.png"), true);
  assert.equal(isSafeGalleryImageReference("https://images.unsplash.com/photo-1234567890-abcd?auto=format"), true);
  assert.equal(isSafeGalleryImageReference("https://example.com/photo.jpg"), false);

  for (const locale of ["en", "ar"] as const) {
    const source = getGalleryContent(locale);
    for (const item of source.items) {
      const stored = await prisma.galleryItemTranslation.findUniqueOrThrow({ where: { galleryItemId_locale: { galleryItemId: item.id, locale } } });
      assert.equal(stored.title, item.title);
      assert.equal(stored.description, item.description);
      assert.equal(stored.altText, item.altText);
    }
  }

  const category = await prisma.galleryCategory.findFirstOrThrow({ where: { key: { not: "all" } } });
  await prisma.galleryItem.create({ data: { id: itemId, categoryId: category.id, mediaType: "image", mediaPath: "/socotra-hero-placeholder.png", featured: false, displayOrder: 999, status: "draft", translations: { create: [{ id: `${itemId}-en`, locale: "en", title: "Temporary Gallery verification", description: "Temporary verification only.", altText: "Temporary Gallery verification image" }, { id: `${itemId}-ar`, locale: "ar", title: "تحقق مؤقت للمعرض", description: "للتحقق المؤقت فقط.", altText: "صورة تحقق مؤقتة للمعرض" }] } } });
  assert.equal((await prisma.galleryItem.findUniqueOrThrow({ where: { id: itemId }, include: { translations: true } })).translations.length, 2);
  await prisma.galleryItem.update({ where: { id: itemId }, data: { status: "published", displayOrder: 998, featured: true } });
  const published = await prisma.galleryItem.findFirst({ where: { id: itemId, status: "published", category: { status: "published" }, translations: { some: { locale: "ar" } } } });
  assert.ok(published);
  await prisma.galleryItem.update({ where: { id: itemId }, data: { status: "archived" } });
  assert.equal(await prisma.galleryItem.count({ where: { id: itemId, status: "published" } }), 0);
  await cleanup();
  assert.equal(await prisma.galleryItemTranslation.count({ where: { galleryItemId: itemId } }), 0, "Owned translations must cascade on deliberate deletion.");
  assert.deepEqual({ admins: await prisma.adminUser.count(), tours: await prisma.tour.count(), faq: await prisma.faqItem.count(), pages: await prisma.contentPage.count(), gallery: await prisma.galleryItem.count(), instagram: await prisma.instagramPost.count(), bookings: await prisma.bookingRequest.count(), contacts: await prisma.contactRequest.count() }, before);
  assert.equal(await prisma.tour.count(), 3);
  console.info("Gallery CRUD verification passed; temporary item removed.");
}

main().finally(async () => { await cleanup(); await prisma.$disconnect(); }).catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Gallery CRUD verification failed."); process.exitCode = 1; });
