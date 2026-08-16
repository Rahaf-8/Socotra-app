import "dotenv/config";

import assert from "node:assert/strict";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { getAboutContent } from "../src/i18n/content/about";
import { getContactContent } from "../src/i18n/content/contact";
import { getFAQContent } from "../src/i18n/content/faq";
import { faqInputSchema } from "../src/lib/validation/content-admin";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
const faqId = "temporary-content-cms-verification";
const enquiryId = "temporary-enquiry-cms-verification";
const requestId = "temporary-contact-reference-verification";

async function cleanup() {
  await prisma.contactRequest.deleteMany({ where: { id: requestId } });
  await prisma.contactEnquiryType.deleteMany({ where: { id: enquiryId } });
  await prisma.faqItem.deleteMany({ where: { id: faqId } });
}

async function main() {
  await cleanup();
  const before = { admins: await prisma.adminUser.count(), tours: await prisma.tour.count(), bookingRequests: await prisma.bookingRequest.count(), contactRequests: await prisma.contactRequest.count() };
  assert.equal(faqInputSchema.safeParse({}).success, false, "Invalid FAQ payload must be rejected.");

  for (const locale of ["en", "ar"] as const) {
    const source = getFAQContent(locale);
    for (const item of source.items) {
      const stored = await prisma.faqItemTranslation.findUniqueOrThrow({ where: { faqItemId_locale: { faqItemId: item.id, locale } } });
      assert.equal(stored.question, item.question, `${locale} FAQ question changed: ${item.id}`);
      assert.deepEqual(stored.answer, item.answer, `${locale} FAQ answer changed: ${item.id}`);
    }
    const about = getAboutContent(locale), aboutPage = await prisma.contentPage.findUniqueOrThrow({ where: { key: "about" }, include: { translations: { where: { locale } } } });
    assert.equal(aboutPage.translations[0]?.title, about.hero.title);
    assert.equal(aboutPage.translations[0]?.description, about.hero.description);
    const contact = getContactContent(locale), contactPage = await prisma.contentPage.findUniqueOrThrow({ where: { key: "contact" }, include: { translations: { where: { locale } } } });
    assert.equal(contactPage.translations[0]?.title, contact.hero.title);
    assert.equal(contactPage.translations[0]?.description, contact.hero.description);
  }

  const category = await prisma.faqCategory.findFirstOrThrow();
  await prisma.faqItem.create({ data: { id: faqId, categoryId: category.id, displayOrder: 999, status: "draft", translations: { create: [{ id: `${faqId}-en`, locale: "en", question: "Temporary verification question?", answer: [{ type: "paragraph", text: "Temporary verification answer." }] }, { id: `${faqId}-ar`, locale: "ar", question: "سؤال تحقق مؤقت؟", answer: [{ type: "paragraph", text: "إجابة تحقق مؤقتة." }] }] } } });
  assert.equal((await prisma.faqItem.findUniqueOrThrow({ where: { id: faqId } })).status, "draft");
  await prisma.faqItem.update({ where: { id: faqId }, data: { status: "published", displayOrder: 998 } });
  assert.equal((await prisma.faqItem.findUniqueOrThrow({ where: { id: faqId } })).displayOrder, 998);

  await prisma.contactEnquiryType.create({ data: { id: enquiryId, value: enquiryId, displayOrder: 999, status: "published", translations: { create: [{ id: `${enquiryId}-en`, locale: "en", label: "Temporary verification" }, { id: `${enquiryId}-ar`, locale: "ar", label: "تحقق مؤقت" }] } } });
  await prisma.contactRequest.create({ data: { id: requestId, name: "Temporary Verification", email: "verification@example.invalid", enquiryTypeId: enquiryId, enquiryValue: enquiryId, message: "Temporary verification only.", locale: "en" } });
  const referenceCount = await prisma.contactEnquiryType.findUniqueOrThrow({ where: { id: enquiryId }, select: { _count: { select: { contactRequests: true } } } });
  assert.equal(referenceCount._count.contactRequests, 1, "Historical-reference policy must detect the related request.");
  await prisma.contactEnquiryType.update({ where: { id: enquiryId }, data: { status: "archived" } });
  assert.equal((await prisma.contactEnquiryType.findUniqueOrThrow({ where: { id: enquiryId } })).status, "archived");

  await cleanup();
  assert.deepEqual({ admins: await prisma.adminUser.count(), tours: await prisma.tour.count(), bookingRequests: await prisma.bookingRequest.count(), contactRequests: await prisma.contactRequest.count() }, before);
  assert.equal(await prisma.tour.count(), 3, "The three approved Tours must remain intact.");
  console.info("FAQ/About/Contact CMS verification passed; temporary records removed.");
}

main().finally(async () => { await cleanup(); await prisma.$disconnect(); }).catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Content CMS verification failed."); process.exitCode = 1; });
