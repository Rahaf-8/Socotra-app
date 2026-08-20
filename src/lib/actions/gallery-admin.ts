"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";
import { deleteOwnedCloudinaryAsset, validateUnclaimedAssets } from "@/lib/images/asset-registry";
import { prisma } from "@/lib/prisma";
import { galleryCategorySchema, galleryItemSchema } from "@/lib/validation/gallery-admin";

export type GalleryActionState = { ok: boolean; id?: string; error?: string; fieldErrors?: Record<string, string[]> };
const locales = ["en", "ar"] as const;
const clean = (value?: string) => value?.trim() || null;
const fieldErrors = (error: { flatten(): { fieldErrors: Record<string, string[] | undefined> } }) => Object.fromEntries(Object.entries(error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1])));

function revalidateGallery() {
  for (const path of ["/admin/gallery", "/admin/dashboard", "/en/gallery", "/ar/gallery", "/en", "/ar", "/sitemap.xml"]) revalidatePath(path);
}

export async function saveGalleryItem(input: unknown): Promise<GalleryActionState> {
  await requireAdmin();
  const parsed = galleryItemSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Review the Gallery item fields.", fieldErrors: fieldErrors(parsed.error) };
  const data = parsed.data, itemId = data.id ?? `gallery-${crypto.randomUUID()}`;
  const existing = data.id ? await prisma.galleryItem.findUnique({ where: { id: data.id }, select: { mediaPath: true, cloudinaryPublicId: true } }) : null;
  let newlyClaimed: string[] = [];
  try {
    newlyClaimed = await validateUnclaimedAssets([{ publicId: data.cloudinaryPublicId, secureUrl: data.mediaPath, existingPublicId: existing?.cloudinaryPublicId }]);
    await prisma.$transaction(async (tx) => {
      const category = await tx.galleryCategory.findUnique({ where: { id: data.categoryId }, select: { id: true, key: true } });
      if (!category || category.key === "all") throw new Error("invalid-category");
      await tx.galleryItem.upsert({ where: { id: itemId }, update: { categoryId: data.categoryId, mediaType: "image", mediaPath: data.mediaPath, cloudinaryPublicId: clean(data.cloudinaryPublicId), postUrl: null, featured: data.featured, displayOrder: data.displayOrder, status: data.status }, create: { id: itemId, categoryId: data.categoryId, mediaType: "image", mediaPath: data.mediaPath, cloudinaryPublicId: clean(data.cloudinaryPublicId), featured: data.featured, displayOrder: data.displayOrder, status: data.status } });
      for (const locale of locales) await tx.galleryItemTranslation.upsert({ where: { galleryItemId_locale: { galleryItemId: itemId, locale } }, update: { title: data[locale].title, description: clean(data[locale].description), altText: data[locale].altText, location: clean(data[locale].location) }, create: { id: `${itemId}-${locale}`, galleryItemId: itemId, locale, title: data[locale].title, description: clean(data[locale].description), altText: data[locale].altText, location: clean(data[locale].location) } });
      if (newlyClaimed.length && (await tx.cloudinaryAsset.updateMany({ where: { publicId: { in: newlyClaimed }, claimedAt: null }, data: { claimedAt: new Date() } })).count !== newlyClaimed.length) throw new Error("asset-claim-conflict");
    });
  } catch { for (const publicId of newlyClaimed) await deleteOwnedCloudinaryAsset(publicId); return { ok: false, error: "The Gallery item could not be saved. No partial changes were applied." }; }
  if (existing?.cloudinaryPublicId && existing.cloudinaryPublicId !== data.cloudinaryPublicId) await deleteOwnedCloudinaryAsset(existing.cloudinaryPublicId);
  revalidateGallery();
  return { ok: true, id: itemId };
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || formData.get("confirm") !== "on") redirect("/admin/gallery?result=confirmation-required");
  const existing = await prisma.galleryItem.findUnique({ where: { id }, select: { cloudinaryPublicId: true } });
  const result = await prisma.galleryItem.deleteMany({ where: { id } });
  if (result.count && existing?.cloudinaryPublicId) await deleteOwnedCloudinaryAsset(existing.cloudinaryPublicId);
  revalidateGallery();
  redirect(`/admin/gallery?result=${result.count ? "deleted" : "missing"}`);
}

export async function saveGalleryCategory(input: unknown): Promise<GalleryActionState> {
  await requireAdmin();
  const parsed = galleryCategorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Review the category fields.", fieldErrors: fieldErrors(parsed.error) };
  const data = parsed.data, categoryId = data.id ?? `gallery-category-${crypto.randomUUID()}`;
  if (data.key === "all" && !data.id) return { ok: false, error: "The reserved all category cannot be created." };
  try { await prisma.$transaction(async (tx) => { await tx.galleryCategory.upsert({ where: { id: categoryId }, update: { displayOrder: data.displayOrder, status: data.status }, create: { id: categoryId, key: data.key, displayOrder: data.displayOrder, status: data.status } }); for (const locale of locales) await tx.galleryCategoryTranslation.upsert({ where: { categoryId_locale: { categoryId, locale } }, update: { label: data[locale] }, create: { id: `${categoryId}-${locale}`, categoryId, locale, label: data[locale] } }); }); }
  catch { return { ok: false, error: "The Gallery category could not be saved. Its key must be unique." }; }
  revalidateGallery();
  return { ok: true, id: categoryId };
}

export async function deleteGalleryCategory(formData: FormData) {
  await requireAdmin(); const id = String(formData.get("id") ?? "");
  if (!id || formData.get("confirm") !== "on") redirect("/admin/gallery?result=category-confirmation-required");
  const category = await prisma.galleryCategory.findUnique({ where: { id }, select: { key: true, _count: { select: { items: true } } } });
  if (!category) redirect("/admin/gallery?result=category-missing");
  if (category.key === "all") redirect("/admin/gallery?result=category-structural");
  if (category._count.items) redirect("/admin/gallery?result=category-in-use");
  await prisma.galleryCategory.delete({ where: { id } }); revalidateGallery(); redirect("/admin/gallery?result=category-deleted");
}
