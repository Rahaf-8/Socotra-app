import "server-only";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import type { GalleryCategoryData, GalleryItemData } from "@/types/gallery";

export async function getPublishedGalleryContent(locale: Locale) {
  const categories = await prisma.galleryCategory.findMany({
    where: { status: "published", translations: { some: { locale } } },
    orderBy: [{ displayOrder: "asc" }, { key: "asc" }],
    select: { key: true, displayOrder: true, translations: { where: { locale }, select: { label: true } } },
  });
  const items = await prisma.galleryItem.findMany({
    where: { status: "published", mediaType: "image", category: { status: "published" }, translations: { some: { locale } } },
    orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    select: { id: true, mediaPath: true, featured: true, displayOrder: true, category: { select: { key: true } }, translations: { where: { locale }, select: { title: true, description: true, altText: true, location: true } } },
  });
  return {
    categories: categories.map((category) => ({ id: category.key, label: category.translations[0]!.label, displayOrder: category.displayOrder, published: true })) as GalleryCategoryData[],
    items: items.map((item) => { const value = item.translations[0]!; return { id: item.id, imageUrl: item.mediaPath, altText: value.altText, title: value.title, description: value.description ?? undefined, category: item.category.key, location: value.location ?? undefined, featured: item.featured, displayOrder: item.displayOrder, published: true }; }) as GalleryItemData[],
  };
}

export function getAdminGalleryItems() {
  return prisma.galleryItem.findMany({ orderBy: [{ displayOrder: "asc" }, { id: "asc" }], include: { category: { include: { translations: true } }, translations: true } });
}

export function getAdminGalleryItemById(id: string) {
  return prisma.galleryItem.findUnique({ where: { id }, include: { translations: true } });
}

export function getAdminGalleryCategories() {
  return prisma.galleryCategory.findMany({ orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: true, _count: { select: { items: true } } } });
}

export function getGallerySeo(locale: Locale) {
  return prisma.seoMetadata.findUnique({ where: { pageKey_locale: { pageKey: "gallery", locale } }, select: { title: true, description: true, imagePath: true } });
}
