import "server-only";
import { prisma } from "@/lib/prisma";
import { isSafeImageReference } from "@/lib/validation/image-upload";

export const HOME_HERO_FALLBACK = "/socotra-hero-placeholder.png";
export const HOME_HERO_IMAGE_KEY = "homeHeroImagePath";
export const HOME_HERO_PUBLIC_ID_KEY = "homeHeroImagePublicId";

export async function getHomeHeroImage() {
  try {
    const settings = await prisma.siteSetting.findMany({ where: { key: { in: [HOME_HERO_IMAGE_KEY, HOME_HERO_PUBLIC_ID_KEY] } }, select: { key: true, value: true } });
    const value = (key: string) => settings.find((setting) => setting.key === key)?.value?.trim() ?? "";
    const imagePath = value(HOME_HERO_IMAGE_KEY);
    return { imagePath: isSafeImageReference(imagePath) ? imagePath : HOME_HERO_FALLBACK, publicId: value(HOME_HERO_PUBLIC_ID_KEY), configured: isSafeImageReference(imagePath) };
  } catch {
    return { imagePath: HOME_HERO_FALLBACK, publicId: "", configured: false };
  }
}
