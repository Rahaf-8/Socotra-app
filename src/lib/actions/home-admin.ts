"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { HOME_HERO_IMAGE_KEY, HOME_HERO_PUBLIC_ID_KEY } from "@/lib/content/home-settings";
import { validateManagedAsset } from "@/lib/images/asset-registry";
import { prisma } from "@/lib/prisma";
import { homeHeroImageSchema } from "@/lib/validation/home-admin";

export type HomeHeroActionState = { ok: boolean; error?: string; fieldErrors?: Record<string, string[]> };

export async function saveHomeHeroImage(input: unknown): Promise<HomeHeroActionState> {
  await requireAdmin();
  const parsed = homeHeroImageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Choose a valid managed image.", fieldErrors: parsed.error.flatten().fieldErrors };
  const data = parsed.data;
  try {
    const asset = await validateManagedAsset({ publicId: data.publicId, secureUrl: data.imagePath });
    await prisma.$transaction(async (tx) => {
      await tx.siteSetting.upsert({ where: { key: HOME_HERO_IMAGE_KEY }, update: { value: data.imagePath, valueType: "url", isPublic: true }, create: { id: "setting-home-hero-image", key: HOME_HERO_IMAGE_KEY, value: data.imagePath, valueType: "url", isPublic: true } });
      await tx.siteSetting.upsert({ where: { key: HOME_HERO_PUBLIC_ID_KEY }, update: { value: asset.publicId, valueType: "string", isPublic: false }, create: { id: "setting-home-hero-public-id", key: HOME_HERO_PUBLIC_ID_KEY, value: asset.publicId, valueType: "string", isPublic: false } });
      if (asset.publicId && asset.shouldClaim) {
        const claimed = await tx.cloudinaryAsset.updateMany({ where: { publicId: asset.publicId, claimedAt: null }, data: { claimedAt: new Date() } });
        if (claimed.count !== 1) throw new Error("asset-claim-conflict");
      }
    });
  } catch {
    return { ok: false, error: "The Home hero image could not be saved. The previously saved image is still active." };
  }
  for (const path of ["/admin/home", "/en", "/ar"]) revalidatePath(path);
  return { ok: true };
}
