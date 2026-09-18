import "server-only";

import { HOME_HERO_PUBLIC_ID_KEY } from "@/lib/content/home-settings";
import { prisma } from "@/lib/prisma";
import { destroyCloudinaryImage } from "@/lib/images/cloudinary";
import { cloudinaryPublicIdSchema, type ImageUploadContext } from "@/lib/validation/image-upload";

export async function registerCloudinaryAsset(asset: { publicId: string; secureUrl: string; context: ImageUploadContext }) {
  return prisma.cloudinaryAsset.create({ data: asset });
}

export async function validateUnclaimedAssets(assets: readonly { publicId?: string | null; secureUrl: string; existingPublicId?: string | null }[]) {
  const requested = assets.filter((asset) => asset.publicId && asset.publicId !== asset.existingPublicId);
  if (!requested.length) return [];
  const publicIds = requested.map((asset) => asset.publicId!);
  if (new Set(publicIds).size !== publicIds.length) throw new Error("duplicate-cloudinary-asset");
  const stored = await prisma.cloudinaryAsset.findMany({ where: { publicId: { in: publicIds }, claimedAt: null }, select: { publicId: true, secureUrl: true } });
  if (stored.length !== requested.length || requested.some((asset) => !stored.some((entry) => entry.publicId === asset.publicId && entry.secureUrl === asset.secureUrl))) throw new Error("invalid-cloudinary-asset");
  return publicIds;
}

export async function markAssetsClaimed(publicIds: readonly string[]) {
  if (publicIds.length) await prisma.cloudinaryAsset.updateMany({ where: { publicId: { in: [...publicIds] }, claimedAt: null }, data: { claimedAt: new Date() } });
}

export async function validateManagedAsset(asset: { publicId?: string | null; secureUrl: string }) {
  if (!asset.publicId) return { publicId: null, shouldClaim: false } as const;
  const parsed = cloudinaryPublicIdSchema.safeParse(asset.publicId);
  if (!parsed.success) throw new Error("invalid-cloudinary-asset");
  const stored = await prisma.cloudinaryAsset.findUnique({
    where: { publicId: parsed.data },
    select: { publicId: true, secureUrl: true, claimedAt: true },
  });
  if (!stored || stored.secureUrl !== asset.secureUrl) throw new Error("invalid-cloudinary-asset");
  return { publicId: stored.publicId, shouldClaim: !stored.claimedAt } as const;
}

export async function deleteOwnedCloudinaryAsset(publicId: string | null | undefined) {
  const parsed = cloudinaryPublicIdSchema.safeParse(publicId);
  if (!parsed.success) return false;
  const owned = await prisma.cloudinaryAsset.findUnique({ where: { publicId: parsed.data }, select: { publicId: true } });
  if (!owned) return false;
  const [tour, itineraryDay, tourImage, galleryItem, homeSetting] = await Promise.all([
    prisma.tour.findFirst({ where: { OR: [{ heroImagePublicId: owned.publicId }, { cardImagePublicId: owned.publicId }] }, select: { id: true } }),
    prisma.tourItineraryDay.findFirst({ where: { imagePublicId: owned.publicId }, select: { id: true } }),
    prisma.tourImage.findFirst({ where: { cloudinaryPublicId: owned.publicId }, select: { id: true } }),
    prisma.galleryItem.findFirst({ where: { cloudinaryPublicId: owned.publicId }, select: { id: true } }),
    prisma.siteSetting.findFirst({ where: { key: HOME_HERO_PUBLIC_ID_KEY, value: owned.publicId }, select: { id: true } }),
  ]);
  if (tour || itineraryDay || tourImage || galleryItem || homeSetting) return false;
  try {
    if (!await destroyCloudinaryImage(owned.publicId)) return false;
    await prisma.cloudinaryAsset.deleteMany({ where: { publicId: owned.publicId } });
    return true;
  } catch {
    return false;
  }
}
