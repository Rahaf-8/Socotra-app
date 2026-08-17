import { z } from "zod";

import { cloudinaryPublicIdSchema, imageReferenceSchema } from "@/lib/validation/image-upload";

const text = (label: string, max: number) => z.string().trim().min(1, `${label} is required.`).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
const order = z.number().int().min(0).max(10_000);
const optionalGuests = z.number().int().min(1).max(10_000).nullable();
const status = z.enum(["draft", "published", "archived"]);

const optionalPublicId = z.union([cloudinaryPublicIdSchema, z.literal("")]).optional();

const translation = z.object({
  packageLabel: text("Package label", 100), title: text("Title", 160), tourType: text("Tour type", 120),
  shortDescription: text("Short description", 500), fullDescription: text("Full description", 10_000),
  durationLabel: optionalText(120), pricingAvailabilityLabel: optionalText(200), accommodationNote: optionalText(3_000), practicalNote: optionalText(3_000),
  heroImageAlt: text("Hero image alt text", 300), seoTitle: optionalText(160), seoDescription: optionalText(320),
});

const localizedLabel = z.object({ en: text("English label", 500), ar: text("Arabic label", 500) });

export const tourAdminSchema = z.object({
  id: z.string().trim().max(100).optional(),
  slug: z.string().trim().toLowerCase().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only."),
  packageType: z.enum(["group", "camping", "comfy"]), durationDays: z.number().int().min(1).max(365).nullable(),
  heroImagePath: imageReferenceSchema, heroImagePublicId: optionalPublicId, cardImagePath: z.union([imageReferenceSchema, z.literal("")]), cardImagePublicId: optionalPublicId, featured: z.boolean(), status, displayOrder: order,
  needsClientConfirmation: z.boolean(), en: translation, ar: translation,
  pricingTiers: z.array(z.object({ id: z.string().optional(), minGuests: optionalGuests, maxGuests: optionalGuests, pricePerPerson: z.number().int().min(0).max(10_000_000), currency: z.string().trim().regex(/^[A-Z]{3}$/), displayOrder: order, status, en: z.object({ label: text("English pricing label", 160), note: optionalText(500) }), ar: z.object({ label: text("Arabic pricing label", 160), note: optionalText(500) }) })).max(30),
  included: z.array(localizedLabel.extend({ id: z.string().optional(), displayOrder: order, status })).max(100),
  excluded: z.array(localizedLabel.extend({ id: z.string().optional(), displayOrder: order, status })).max(100),
  requiredExtras: z.array(localizedLabel.extend({ id: z.string().optional(), descriptionEn: optionalText(500), descriptionAr: optionalText(500), referencePrice: z.number().int().min(0).max(10_000_000).nullable(), currency: z.union([z.string().trim().regex(/^[A-Z]{3}$/), z.literal("")]), displayOrder: order, status })).max(100),
  itineraryDays: z.array(z.object({ id: z.string().optional(), dayNumber: z.number().int().min(1).max(365), displayOrder: order, imagePath: z.union([imageReferenceSchema, z.literal("")]), imagePublicId: optionalPublicId, status, needsClientConfirmation: z.boolean(), en: z.object({ title: text("English day title", 200), description: text("English day description", 10_000), overnight: optionalText(300), location: optionalText(200), imageAlt: optionalText(300) }), ar: z.object({ title: text("Arabic day title", 200), description: text("Arabic day description", 10_000), overnight: optionalText(300), location: optionalText(200), imageAlt: optionalText(300) }) })).max(100),
  images: z.array(z.object({ id: z.string().optional(), imagePath: imageReferenceSchema, cloudinaryPublicId: optionalPublicId, displayOrder: order, status, en: z.object({ altText: text("English image alt text", 300), title: optionalText(200) }), ar: z.object({ altText: text("Arabic image alt text", 300), title: optionalText(200) }) })).max(100),
}).superRefine((data, context) => {
  const unique = (values: number[], path: string, label: string) => {
    if (new Set(values).size !== values.length) context.addIssue({ code: "custom", path: [path], message: `${label} values must be unique.` });
  };
  unique(data.pricingTiers.map((item) => item.displayOrder), "pricingTiers", "Pricing order");
  unique(data.itineraryDays.map((item) => item.dayNumber), "itineraryDays", "Itinerary day");
  unique(data.itineraryDays.map((item) => item.displayOrder), "itineraryDays", "Itinerary order");
  unique(data.included.map((item) => item.displayOrder), "included", "Included-item order");
  unique(data.excluded.map((item) => item.displayOrder), "excluded", "Excluded-item order");
  unique(data.requiredExtras.map((item) => item.displayOrder), "requiredExtras", "Required-extra order");
  unique(data.images.map((item) => item.displayOrder), "images", "Image order");
  const listItemIds = [...data.included, ...data.excluded, ...data.requiredExtras].map((item) => item.id).filter((item): item is string => Boolean(item));
  if (new Set(listItemIds).size !== listItemIds.length) context.addIssue({ code: "custom", path: ["included"], message: "Tour list item IDs must be unique." });
  data.pricingTiers.forEach((tier, index) => { if (tier.minGuests && tier.maxGuests && tier.minGuests > tier.maxGuests) context.addIssue({ code: "custom", path: ["pricingTiers", index, "maxGuests"], message: "Maximum guests must be at least the minimum." }); });
});

export type TourAdminInput = z.input<typeof tourAdminSchema>;
export type TourAdminData = z.output<typeof tourAdminSchema>;
