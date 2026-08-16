import "dotenv/config";

import assert from "node:assert/strict";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { createReviewSchema, reviewStatusSchema } from "../src/lib/validation/review";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
const ids = ["temporary-review-en", "temporary-review-ar"];

async function cleanup() { await prisma.review.deleteMany({ where: { id: { in: ids } } }); }

async function main() {
  await cleanup();
  const before = { reviews: await prisma.review.count(), tours: await prisma.tour.count(), gallery: await prisma.galleryItem.count(), faq: await prisma.faqItem.count(), admins: await prisma.adminUser.count() };
  assert.equal(createReviewSchema("en").safeParse({}).success, false);
  assert.equal(createReviewSchema("en").safeParse({ name: "", email: "guest@example.com", rating: 5, message: "A sufficiently meaningful temporary review message." }).success, false);
  assert.equal(createReviewSchema("en").safeParse({ name: "Guest", email: "invalid", rating: 5, message: "A sufficiently meaningful temporary review message." }).success, false);
  assert.equal(createReviewSchema("en").safeParse({ name: "Guest", email: "guest@example.com", rating: 6, message: "A sufficiently meaningful temporary review message." }).success, false);
  assert.equal(createReviewSchema("en").safeParse({ name: "Guest", email: "guest@example.com", rating: 2.5, message: "A sufficiently meaningful temporary review message." }).success, false);
  assert.equal(createReviewSchema("en").safeParse({ name: "Guest", email: "guest@example.com", rating: 5, message: "Too short" }).success, false);
  assert.equal(createReviewSchema("en").safeParse({ name: "Guest", email: "guest@example.com", rating: 5, message: "x".repeat(2_001) }).success, false);
  const oneStar = createReviewSchema("en").safeParse({ name: "Guest One", email: "one@example.com", rating: 1, message: "A complete one-star verification review message." });
  const fiveStars = createReviewSchema("en").safeParse({ name: "Guest Five", email: "five@example.com", rating: 5, message: "A complete five-star verification review message." });
  assert.equal(oneStar.success && oneStar.data.rating, 1);
  assert.equal(fiveStars.success && fiveStars.data.rating, 5);
  assert.equal(createReviewSchema("en").safeParse({ name: "Guest", email: "guest@example.com", rating: 0, message: "A sufficiently meaningful temporary review message." }).success, false);
  const attemptedApproval = createReviewSchema("en").safeParse({ name: "Guest", email: "guest@example.com", rating: 5, message: "A sufficiently meaningful temporary review message.", status: "approved" });
  assert.equal(attemptedApproval.success && "status" in attemptedApproval.data, false, "Public validation must not carry moderation fields.");
  assert.equal(reviewStatusSchema.safeParse("published").success, false);
  assert.equal(reviewStatusSchema.safeParse("archived").success, true);
  await prisma.review.createMany({ data: [
    { id: ids[0], name: "Temporary English Guest", email: "temporary-en@example.invalid", rating: 1, message: "Temporary English review used only for deterministic verification.", locale: "en" },
    { id: ids[1], name: "Temporary Arabic Guest", email: "temporary-ar@example.invalid", rating: 5, message: "Temporary Arabic review used only for deterministic verification.", locale: "ar" },
  ] });
  assert.equal(await prisma.review.count({ where: { id: { in: ids }, status: "pending" } }), 2);
  const preserved = await prisma.review.findMany({ where: { id: { in: ids } }, orderBy: { rating: "asc" }, select: { name: true, email: true, rating: true, message: true } });
  assert.deepEqual(preserved.map((review) => review.rating), [1, 5]);
  assert.equal(preserved[0]?.name, "Temporary English Guest");
  assert.equal(preserved[1]?.email, "temporary-ar@example.invalid");
  assert.equal(await prisma.review.count({ where: { id: { in: ids }, status: "approved" } }), 0);
  const pendingPublicProjection = await prisma.review.findMany({ where: { id: { in: ids }, status: "approved" }, select: { id: true, name: true, rating: true, message: true, createdAt: true } });
  assert.equal(pendingPublicProjection.length, 0);
  await prisma.review.update({ where: { id: ids[0] }, data: { status: "approved" } });
  assert.equal(await prisma.review.count({ where: { id: ids[0], status: "approved", locale: "en" } }), 1);
  const approvedPublicProjection = await prisma.review.findMany({ where: { id: { in: ids }, status: "approved", locale: "en" }, select: { id: true, name: true, rating: true, message: true, createdAt: true } });
  assert.equal(approvedPublicProjection.length, 1);
  assert.equal("email" in approvedPublicProjection[0]!, false, "Public Review projection must exclude email.");
  const approvedSummary = await prisma.review.aggregate({ where: { id: { in: ids }, status: "approved", locale: "en" }, _avg: { rating: true }, _count: { _all: true } });
  assert.equal(approvedSummary._avg.rating, 1);
  assert.equal(approvedSummary._count._all, 1);
  await prisma.review.update({ where: { id: ids[1] }, data: { status: "rejected" } });
  assert.equal(await prisma.review.count({ where: { id: ids[1], status: "approved" } }), 0);
  await prisma.review.update({ where: { id: ids[0] }, data: { status: "archived" } });
  assert.equal(await prisma.review.count({ where: { id: ids[0], status: "approved" } }), 0);
  await prisma.review.delete({ where: { id: ids[1] } });
  assert.equal(await prisma.review.count({ where: { id: ids[1] } }), 0);
  await cleanup();
  assert.deepEqual({ reviews: await prisma.review.count(), tours: await prisma.tour.count(), gallery: await prisma.galleryItem.count(), faq: await prisma.faqItem.count(), admins: await prisma.adminUser.count() }, before);
  console.info("Reviews verification passed; all temporary reviews were removed.");
}

main().finally(async () => { await cleanup(); await prisma.$disconnect(); }).catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Reviews verification failed."); process.exitCode = 1; });
