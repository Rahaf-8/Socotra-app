import "server-only";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import type { TourAdminInput } from "@/lib/validation/tour-admin";
import type { Tour } from "@/types/tour";

const fullRelations = { translations: true, pricingTiers: { include: { translations: true }, orderBy: { displayOrder: "asc" as const } }, listItems: { include: { translations: true }, orderBy: { displayOrder: "asc" as const } }, itineraryDays: { include: { translations: true }, orderBy: { displayOrder: "asc" as const } }, images: { include: { translations: true }, orderBy: { displayOrder: "asc" as const } } };

type TourRecord = Awaited<ReturnType<typeof prisma.tour.findFirstOrThrow<{ include: typeof fullRelations }>>>;
const translated = <T extends { locale: Locale }>(values: T[], locale: Locale) => values.find((value) => value.locale === locale);

function toPublicTour(record: TourRecord, locale: Locale): Tour | null {
  const copy = translated(record.translations, locale);
  if (!copy) return null;
  const published = <T extends { status: string }>(values: T[]) => values.filter((value) => value.status === "published");
  return {
    id: record.id, slug: record.slug, packageLabel: copy.packageLabel, title: copy.title, tourType: copy.tourType,
    shortDescription: copy.shortDescription, fullDescription: copy.fullDescription, durationDays: record.durationDays ?? undefined,
    durationLabel: copy.durationLabel ?? undefined, pricingAvailabilityLabel: copy.pricingAvailabilityLabel ?? undefined,
    accommodationNote: copy.accommodationNote ?? undefined, practicalNote: copy.practicalNote ?? undefined,
    featuredImage: { src: record.heroImagePath, alt: copy.heroImageAlt },
    galleryImages: published(record.images).map((image) => { const value = translated(image.translations, locale); return value ? { src: image.imagePath, alt: value.altText } : null; }).filter((value): value is { src: string; alt: string } => Boolean(value)),
    pricingTiers: published(record.pricingTiers).map((tier) => { const value = translated(tier.translations, locale); return value ? { id: tier.id, label: value.label, minGuests: tier.minGuests ?? undefined, maxGuests: tier.maxGuests ?? undefined, pricePerPerson: tier.pricePerPerson, currency: tier.currency, note: value.note ?? undefined, displayOrder: tier.displayOrder } : null; }).filter((value): value is NonNullable<typeof value> => Boolean(value)),
    included: published(record.listItems).filter((item) => item.type === "included").map((item) => translated(item.translations, locale)?.label).filter((value): value is string => Boolean(value)),
    excluded: published(record.listItems).filter((item) => item.type === "excluded").map((item) => translated(item.translations, locale)?.label).filter((value): value is string => Boolean(value)),
    requiredExtras: published(record.listItems).filter((item) => item.type === "requiredExtra").map((item) => { const value = translated(item.translations, locale); return value ? { id: item.id, label: value.label, referencePrice: item.referencePrice ?? undefined, currency: item.currency ?? undefined } : null; }).filter((value): value is NonNullable<typeof value> => Boolean(value)),
    itinerary: published(record.itineraryDays).map((day) => { const value = translated(day.translations, locale); return value ? { day: day.dayNumber, title: value.title, description: value.description, overnight: value.overnight ?? undefined, location: value.location ?? undefined, image: day.imagePath && value.imageAlt ? { src: day.imagePath, alt: value.imageAlt } : undefined, needsClientConfirmation: day.needsClientConfirmation } : null; }).filter((value): value is NonNullable<typeof value> => Boolean(value)),
    needsClientConfirmation: record.needsClientConfirmation, published: true, displayOrder: record.displayOrder, featured: record.featured,
    seoTitle: copy.seoTitle ?? undefined, seoDescription: copy.seoDescription ?? undefined,
  };
}

export async function getPublishedTours(locale: Locale) {
  const records = await prisma.tour.findMany({ where: { status: "published", translations: { some: { locale } } }, include: fullRelations, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] });
  return records.map((record) => toPublicTour(record, locale)).filter((tour): tour is Tour => Boolean(tour));
}

export async function getPublishedTourBySlug(locale: Locale, slug: string) {
  const record = await prisma.tour.findFirst({ where: { slug, status: "published", translations: { some: { locale } } }, include: fullRelations });
  return record ? toPublicTour(record, locale) : null;
}

export async function getAdminTours() {
  return prisma.tour.findMany({ include: { translations: true, pricingTiers: { where: { status: "published" }, orderBy: { pricePerPerson: "asc" }, take: 1 }, _count: { select: { bookingRequests: true } } }, orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }] });
}

export async function getAdminTourById(id: string) {
  return prisma.tour.findUnique({ where: { id }, include: fullRelations });
}

export function toAdminTourInput(record: TourRecord): TourAdminInput {
  const translation = (locale: Locale) => {
    const value = translated(record.translations, locale);
    if (!value) throw new Error(`Missing ${locale} tour translation.`);
    return { packageLabel: value.packageLabel, title: value.title, tourType: value.tourType, shortDescription: value.shortDescription, fullDescription: value.fullDescription, durationLabel: value.durationLabel ?? "", pricingAvailabilityLabel: value.pricingAvailabilityLabel ?? "", accommodationNote: value.accommodationNote ?? "", practicalNote: value.practicalNote ?? "", heroImageAlt: value.heroImageAlt, seoTitle: value.seoTitle ?? "", seoDescription: value.seoDescription ?? "" };
  };
  const list = (type: "included" | "excluded") => record.listItems.filter((item) => item.type === type).map((item) => ({ id: item.id, displayOrder: item.displayOrder, status: item.status, en: translated(item.translations, "en")?.label ?? "", ar: translated(item.translations, "ar")?.label ?? "" }));
  return {
    id: record.id, slug: record.slug, packageType: record.packageType, durationDays: record.durationDays, heroImagePath: record.heroImagePath,
    cardImagePath: record.cardImagePath ?? "", featured: record.featured, status: record.status, displayOrder: record.displayOrder,
    needsClientConfirmation: record.needsClientConfirmation, en: translation("en"), ar: translation("ar"),
    pricingTiers: record.pricingTiers.map((tier) => ({ id: tier.id, minGuests: tier.minGuests, maxGuests: tier.maxGuests, pricePerPerson: tier.pricePerPerson, currency: tier.currency, displayOrder: tier.displayOrder, status: tier.status, en: { label: translated(tier.translations, "en")?.label ?? "", note: translated(tier.translations, "en")?.note ?? "" }, ar: { label: translated(tier.translations, "ar")?.label ?? "", note: translated(tier.translations, "ar")?.note ?? "" } })),
    included: list("included"), excluded: list("excluded"),
    requiredExtras: record.listItems.filter((item) => item.type === "requiredExtra").map((item) => ({ id: item.id, displayOrder: item.displayOrder, status: item.status, referencePrice: item.referencePrice, currency: item.currency ?? "", en: translated(item.translations, "en")?.label ?? "", ar: translated(item.translations, "ar")?.label ?? "", descriptionEn: translated(item.translations, "en")?.description ?? "", descriptionAr: translated(item.translations, "ar")?.description ?? "" })),
    itineraryDays: record.itineraryDays.map((day) => ({ id: day.id, dayNumber: day.dayNumber, displayOrder: day.displayOrder, imagePath: day.imagePath ?? "", status: day.status, needsClientConfirmation: day.needsClientConfirmation, en: { title: translated(day.translations, "en")?.title ?? "", description: translated(day.translations, "en")?.description ?? "", overnight: translated(day.translations, "en")?.overnight ?? "", location: translated(day.translations, "en")?.location ?? "", imageAlt: translated(day.translations, "en")?.imageAlt ?? "" }, ar: { title: translated(day.translations, "ar")?.title ?? "", description: translated(day.translations, "ar")?.description ?? "", overnight: translated(day.translations, "ar")?.overnight ?? "", location: translated(day.translations, "ar")?.location ?? "", imageAlt: translated(day.translations, "ar")?.imageAlt ?? "" } })),
    images: record.images.map((image) => ({ id: image.id, imagePath: image.imagePath, displayOrder: image.displayOrder, status: image.status, en: { altText: translated(image.translations, "en")?.altText ?? "", title: translated(image.translations, "en")?.title ?? "" }, ar: { altText: translated(image.translations, "ar")?.altText ?? "", title: translated(image.translations, "ar")?.title ?? "" } })),
  };
}
