"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { tourAdminSchema, type TourAdminInput } from "@/lib/validation/tour-admin";

export type TourActionState = { ok: boolean; id?: string; error?: string; fieldErrors?: Record<string, string[]> };
const clean = (value?: string) => value?.trim() || null;
const id = (value: string | undefined, prefix: string) => value || `${prefix}-${randomUUID()}`;

function revalidateTourPaths(slug: string, previousSlug?: string) {
  for (const locale of ["en", "ar"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/tours`);
    revalidatePath(`/${locale}/tours/${slug}`);
    revalidatePath(`/${locale}/booking`);
    if (previousSlug && previousSlug !== slug) revalidatePath(`/${locale}/tours/${previousSlug}`);
  }
  revalidatePath("/admin/tours");
  revalidatePath("/admin/dashboard");
  revalidatePath("/sitemap.xml");
}

export async function saveTour(input: TourAdminInput): Promise<TourActionState> {
  await requireAdmin();
  const parsed = tourAdminSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Review the highlighted tour information.", fieldErrors: parsed.error.flatten().fieldErrors };
  const data = parsed.data;
  const existing = data.id ? await prisma.tour.findUnique({ where: { id: data.id }, select: { id: true, slug: true } }) : null;
  if (data.id && !existing) return { ok: false, error: "This tour no longer exists." };
  const slugConflict = await prisma.tour.findFirst({ where: { slug: data.slug, id: data.id ? { not: data.id } : undefined }, select: { id: true } });
  if (slugConflict) return { ok: false, error: "That slug is already used by another tour.", fieldErrors: { slug: ["Choose a unique slug."] } };

  const tourId = data.id || `tour-${randomUUID()}`;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.tour.upsert({
        where: { id: tourId },
        update: { slug: data.slug, packageType: data.packageType, durationDays: data.durationDays, heroImagePath: data.heroImagePath, cardImagePath: clean(data.cardImagePath), featured: data.featured, status: data.status, displayOrder: data.displayOrder, needsClientConfirmation: data.needsClientConfirmation },
        create: { id: tourId, slug: data.slug, packageType: data.packageType, durationDays: data.durationDays, heroImagePath: data.heroImagePath, cardImagePath: clean(data.cardImagePath), featured: data.featured, status: data.status, displayOrder: data.displayOrder, needsClientConfirmation: data.needsClientConfirmation },
      });
      for (const locale of ["en", "ar"] as const) {
        const value = data[locale];
        await tx.tourTranslation.upsert({
          where: { tourId_locale: { tourId, locale } },
          update: { ...value, durationLabel: clean(value.durationLabel), pricingAvailabilityLabel: clean(value.pricingAvailabilityLabel), accommodationNote: clean(value.accommodationNote), practicalNote: clean(value.practicalNote), seoTitle: clean(value.seoTitle), seoDescription: clean(value.seoDescription) },
          create: { id: `${tourId}-${locale}`, tourId, locale, ...value, durationLabel: clean(value.durationLabel), pricingAvailabilityLabel: clean(value.pricingAvailabilityLabel), accommodationNote: clean(value.accommodationNote), practicalNote: clean(value.practicalNote), seoTitle: clean(value.seoTitle), seoDescription: clean(value.seoDescription) },
        });
      }

      await tx.tourPricingTier.deleteMany({ where: { tourId } });
      for (const tier of data.pricingTiers) {
        const tierId = id(tier.id, `${tourId}-price`);
        await tx.tourPricingTier.create({ data: { id: tierId, tourId, minGuests: tier.minGuests, maxGuests: tier.maxGuests, pricePerPerson: tier.pricePerPerson, currency: tier.currency, displayOrder: tier.displayOrder, status: tier.status, translations: { create: (["en", "ar"] as const).map((locale) => ({ id: `${tierId}-${locale}`, locale, label: tier[locale].label, note: clean(tier[locale].note) })) } } });
      }

      await tx.tourListItem.deleteMany({ where: { tourId } });
      for (const [type, values] of [["included", data.included], ["excluded", data.excluded]] as const) {
        for (const item of values) {
          const itemId = id(item.id, `${tourId}-${type}`);
          await tx.tourListItem.create({ data: { id: itemId, tourId, type, displayOrder: item.displayOrder, status: item.status, translations: { create: (["en", "ar"] as const).map((locale) => ({ id: `${itemId}-${locale}`, locale, label: item[locale] })) } } });
        }
      }
      for (const item of data.requiredExtras) {
        const itemId = id(item.id, `${tourId}-requiredExtra`);
        await tx.tourListItem.create({ data: { id: itemId, tourId, type: "requiredExtra", displayOrder: item.displayOrder, status: item.status, referencePrice: item.referencePrice, currency: clean(item.currency), translations: { create: (["en", "ar"] as const).map((locale) => ({ id: `${itemId}-${locale}`, locale, label: item[locale], description: clean(locale === "en" ? item.descriptionEn : item.descriptionAr) })) } } });
      }

      await tx.tourItineraryDay.deleteMany({ where: { tourId } });
      for (const day of data.itineraryDays) {
        const dayId = id(day.id, `${tourId}-day`);
        await tx.tourItineraryDay.create({ data: { id: dayId, tourId, dayNumber: day.dayNumber, displayOrder: day.displayOrder, imagePath: clean(day.imagePath), status: day.status, needsClientConfirmation: day.needsClientConfirmation, translations: { create: (["en", "ar"] as const).map((locale) => ({ id: `${dayId}-${locale}`, locale, title: day[locale].title, description: day[locale].description, overnight: clean(day[locale].overnight), location: clean(day[locale].location), imageAlt: clean(day[locale].imageAlt) })) } } });
      }

      await tx.tourImage.deleteMany({ where: { tourId } });
      for (const image of data.images) {
        const imageId = id(image.id, `${tourId}-image`);
        await tx.tourImage.create({ data: { id: imageId, tourId, imagePath: image.imagePath, displayOrder: image.displayOrder, status: image.status, translations: { create: (["en", "ar"] as const).map((locale) => ({ id: `${imageId}-${locale}`, locale, altText: image[locale].altText, title: clean(image[locale].title) })) } } });
      }
    });
  } catch {
    return { ok: false, error: "The tour could not be saved. No partial changes were applied." };
  }
  revalidateTourPaths(data.slug, existing?.slug);
  return { ok: true, id: tourId };
}

export async function deleteOrArchiveTour(formData: FormData) {
  await requireAdmin();
  const tourId = String(formData.get("tourId") ?? "");
  const confirmed = formData.get("confirm") === "on";
  if (!tourId || !confirmed) redirect("/admin/tours?result=confirmation-required");
  const tour = await prisma.tour.findUnique({ where: { id: tourId }, select: { slug: true, _count: { select: { bookingRequests: true } } } });
  if (!tour) redirect("/admin/tours?result=missing");
  if (tour._count.bookingRequests > 0) {
    await prisma.tour.update({ where: { id: tourId }, data: { status: "archived", featured: false } });
    revalidateTourPaths(tour.slug);
    redirect("/admin/tours?result=archived");
  }
  await prisma.tour.delete({ where: { id: tourId } });
  revalidateTourPaths(tour.slug);
  redirect("/admin/tours?result=deleted");
}
