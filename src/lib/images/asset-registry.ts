import "server-only";

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

export async function deleteOwnedCloudinaryAsset(publicId: string | null | undefined) {
  const parsed = cloudinaryPublicIdSchema.safeParse(publicId);
  if (!parsed.success) return false;
  const owned = await prisma.cloudinaryAsset.findUnique({ where: { publicId: parsed.data }, select: { publicId: true } });
  if (!owned) return false;
  try {
    if (!await destroyCloudinaryImage(owned.publicId)) return false;
    await prisma.cloudinaryAsset.deleteMany({ where: { publicId: owned.publicId } });
    return true;
  } catch {
    return false;
  }
}
