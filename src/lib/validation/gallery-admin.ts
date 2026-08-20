import { z } from "zod";

import { cloudinaryPublicIdSchema, imageReferenceSchema, isSafeImageReference } from "@/lib/validation/image-upload";

const id = z.string().trim().min(1).max(120).regex(/^[A-Za-z0-9_-]+$/);
const order = z.coerce.number().int().min(0).max(10_000);
const status = z.enum(["draft", "published", "archived"]);
const text = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum);

export const isSafeGalleryImageReference = isSafeImageReference;

const translation = z.object({
  title: text(1, 200),
  description: z.string().trim().max(2_000),
  altText: text(3, 300),
  location: z.string().trim().max(200),
});

export const galleryItemSchema = z.object({
  id: id.optional(),
  categoryId: id,
  mediaPath: imageReferenceSchema,
  cloudinaryPublicId: z.union([cloudinaryPublicIdSchema, z.literal("")]).optional(),
  featured: z.boolean(),
  displayOrder: order,
  status,
  en: translation,
  ar: translation,
});

const key = z.string().trim().toLowerCase().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only.");
export const galleryCategorySchema = z.object({ id: id.optional(), key, displayOrder: order, status, en: text(1, 120), ar: text(1, 120) });

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type GalleryCategoryInput = z.infer<typeof galleryCategorySchema>;
