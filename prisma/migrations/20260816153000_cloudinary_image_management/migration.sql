ALTER TABLE "Tour" ADD COLUMN "heroImagePublicId" TEXT;
ALTER TABLE "Tour" ADD COLUMN "cardImagePublicId" TEXT;
ALTER TABLE "TourItineraryDay" ADD COLUMN "imagePublicId" TEXT;
ALTER TABLE "TourImage" ADD COLUMN "cloudinaryPublicId" TEXT;
ALTER TABLE "GalleryItem" ADD COLUMN "cloudinaryPublicId" TEXT;

CREATE TABLE "CloudinaryAsset" (
    "publicId" TEXT NOT NULL PRIMARY KEY,
    "secureUrl" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedAt" DATETIME
);

CREATE INDEX "CloudinaryAsset_claimedAt_createdAt_idx" ON "CloudinaryAsset"("claimedAt", "createdAt");
