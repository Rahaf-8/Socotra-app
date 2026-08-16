import "dotenv/config";

import assert from "node:assert/strict";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { galleryItemSchema } from "../src/lib/validation/gallery-admin";
import { cloudinaryPublicIdSchema, hasValidImageSignature, imageUploadContextSchema, isSafeImageReference, MAX_IMAGE_UPLOAD_BYTES } from "../src/lib/validation/image-upload";
import { tourAdminSchema } from "../src/lib/validation/tour-admin";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
const publicId = "socotra/gallery/temporary-image-management-verification";

async function cleanup() { await prisma.cloudinaryAsset.deleteMany({ where: { publicId } }); }

async function main() {
  await cleanup();
  const before = await prisma.cloudinaryAsset.count();
  assert.equal(imageUploadContextSchema.safeParse("gallery").success, true);
  assert.equal(imageUploadContextSchema.safeParse("arbitrary-folder").success, false);
  assert.equal(cloudinaryPublicIdSchema.safeParse(publicId).success, true);
  assert.equal(cloudinaryPublicIdSchema.safeParse("other-account/delete-me").success, false);
  assert.equal(isSafeImageReference("/socotra-hero-placeholder.png"), true);
  assert.equal(isSafeImageReference("/Socotra  island.jfif"), true);
  assert.equal(isSafeImageReference("https://images.unsplash.com/photo-123?auto=format"), true);
  assert.equal(isSafeImageReference("https://res.cloudinary.com/demo/image/upload/v1/socotra/gallery/example.jpg"), true);
  for (const unsafe of ["javascript:alert(1)", "data:image/png;base64,x", "file:///tmp/a.png", "/../secret.png", "https://example.com/a.jpg"]) assert.equal(isSafeImageReference(unsafe), false);
  assert.equal(hasValidImageSignature(Uint8Array.from([0xff, 0xd8, 0xff]), "image/jpeg"), true);
  assert.equal(hasValidImageSignature(Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]), "image/png"), true);
  assert.equal(hasValidImageSignature(new TextEncoder().encode("RIFF0000WEBP"), "image/webp"), true);
  assert.equal(hasValidImageSignature(new TextEncoder().encode("0000ftypavif"), "image/avif"), true);
  assert.equal(hasValidImageSignature(new TextEncoder().encode("not-an-image"), "image/png"), false);
  assert.equal(MAX_IMAGE_UPLOAD_BYTES, 12 * 1024 * 1024);
  assert.equal(galleryItemSchema.safeParse({ categoryId: "category", mediaPath: "/legacy.jpg", cloudinaryPublicId: "", featured: false, displayOrder: 0, status: "draft", en: { title: "Title", description: "", altText: "English alt", location: "" }, ar: { title: "عنوان", description: "", altText: "وصف الصورة", location: "" } }).success, true);
  assert.equal(tourAdminSchema.safeParse({}).success, false);
  await prisma.cloudinaryAsset.create({ data: { publicId, secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/socotra/gallery/temporary-image-management-verification.jpg", context: "gallery" } });
  const asset = await prisma.cloudinaryAsset.findUniqueOrThrow({ where: { publicId } });
  assert.equal(asset.claimedAt, null);
  await prisma.cloudinaryAsset.update({ where: { publicId }, data: { claimedAt: new Date() } });
  assert.ok((await prisma.cloudinaryAsset.findUniqueOrThrow({ where: { publicId } })).claimedAt);
  await cleanup();
  assert.equal(await prisma.cloudinaryAsset.count(), before);
  console.info("Image management verification passed; temporary metadata removed.");
}

main().finally(async () => { await cleanup(); await prisma.$disconnect(); }).catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Image management verification failed."); process.exitCode = 1; });
