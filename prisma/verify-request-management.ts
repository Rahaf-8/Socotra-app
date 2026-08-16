import "dotenv/config";

import assert from "node:assert/strict";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { buildMailtoUrl, buildWhatsappUrl, normalizeWhatsappNumber } from "../src/lib/requests/contact-links";
import { createBookingRequestSchema } from "../src/lib/validation/booking-request";
import { createContactRequestSchema } from "../src/lib/validation/contact-request";
import { bookingRequestUpdateSchema, contactRequestUpdateSchema } from "../src/lib/validation/request-admin";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
const bookingIds = ["temporary-request-booking-en", "temporary-request-booking-ar"];
const contactIds = ["temporary-request-contact-en", "temporary-request-contact-ar"];
const enquiryId = "temporary-request-enquiry-type";

async function cleanup() {
  await prisma.bookingRequest.deleteMany({ where: { id: { in: bookingIds } } });
  await prisma.contactRequest.deleteMany({ where: { id: { in: contactIds } } });
  await prisma.contactEnquiryType.deleteMany({ where: { id: enquiryId } });
}

async function main() {
  await cleanup();
  const before = { admins: await prisma.adminUser.count(), tours: await prisma.tour.count(), gallery: await prisma.galleryItem.count(), faq: await prisma.faqItem.count(), bookings: await prisma.bookingRequest.count(), contacts: await prisma.contactRequest.count() };
  assert.equal(createBookingRequestSchema("en").safeParse({}).success, false);
  assert.equal(createContactRequestSchema("en").safeParse({}).success, false);
  assert.equal(bookingRequestUpdateSchema.safeParse({ id: "x", status: "arbitrary", internalNotes: "" }).success, false);
  assert.equal(contactRequestUpdateSchema.safeParse({ id: "x", status: "arbitrary", internalNotes: "" }).success, false);
  assert.equal(normalizeWhatsappNumber("+967 (777) 123-456"), "967777123456");
  assert.equal(normalizeWhatsappNumber("0777 123 456"), null);
  assert.equal(normalizeWhatsappNumber("javascript:alert(1)"), null);
  assert.ok(buildWhatsappUrl("+967 777 123 456", "Hello")?.startsWith("https://wa.me/967777123456?text="));
  assert.equal(buildWhatsappUrl("invalid", "Hello"), null);
  assert.ok(buildMailtoUrl("guest@example.com", "Website enquiry")?.startsWith("mailto:guest%40example.com?subject="));

  const tour = await prisma.tour.findFirstOrThrow({ where: { status: "published" }, include: { translations: true } });
  await prisma.contactEnquiryType.create({ data: { id: enquiryId, value: enquiryId, displayOrder: 999, status: "published", translations: { create: [{ id: `${enquiryId}-en`, locale: "en", label: "Temporary verification" }, { id: `${enquiryId}-ar`, locale: "ar", label: "تحقق مؤقت" }] } } });
  for (const [index, locale] of (["en", "ar"] as const).entries()) {
    const bookingId = bookingIds[index], contactId = contactIds[index];
    const title = tour.translations.find((entry) => entry.locale === locale)?.title ?? tour.slug;
    await prisma.bookingRequest.create({ data: { id: bookingId, tourId: tour.id, selectedPackageTitle: title, fullName: "Temporary Verification", email: `${locale}.booking@example.invalid`, whatsappNumber: "+967777123456", country: "Verification", preferredArrivalDate: new Date("2030-01-01T00:00:00.000Z"), adults: 2, children: 0, locale } });
    await prisma.contactRequest.create({ data: { id: contactId, name: "Temporary Verification", email: `${locale}.contact@example.invalid`, enquiryTypeId: enquiryId, enquiryValue: enquiryId, subject: "Temporary verification", message: "Temporary request-management verification only.", locale } });
  }
  assert.equal(await prisma.bookingRequest.count({ where: { id: { in: bookingIds } } }), 2);
  assert.equal(await prisma.contactRequest.count({ where: { id: { in: contactIds } } }), 2);
  await prisma.bookingRequest.update({ where: { id: bookingIds[0] }, data: { status: "contacted", internalNotes: "Administrator-only verification note." } });
  await prisma.contactRequest.update({ where: { id: contactIds[0] }, data: { status: "resolved", internalNotes: "Administrator-only verification note." } });
  assert.equal((await prisma.bookingRequest.findUniqueOrThrow({ where: { id: bookingIds[0] } })).internalNotes, "Administrator-only verification note.");
  assert.equal((await prisma.contactRequest.findUniqueOrThrow({ where: { id: contactIds[0] } })).status, "resolved");
  let restricted = false;
  try { await prisma.tour.delete({ where: { id: tour.id } }); } catch { restricted = true; }
  assert.equal(restricted, true, "Tour history must remain protected.");
  await prisma.contactEnquiryType.update({ where: { id: enquiryId }, data: { status: "archived" } });
  assert.equal((await prisma.contactRequest.findUniqueOrThrow({ where: { id: contactIds[0] } })).enquiryValue, enquiryId);
  await cleanup();
  assert.deepEqual({ admins: await prisma.adminUser.count(), tours: await prisma.tour.count(), gallery: await prisma.galleryItem.count(), faq: await prisma.faqItem.count(), bookings: await prisma.bookingRequest.count(), contacts: await prisma.contactRequest.count() }, before);
  console.info("Request management verification passed; all temporary requests were removed.");
}

main().finally(async () => { await cleanup(); await prisma.$disconnect(); }).catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Request management verification failed."); process.exitCode = 1; });
