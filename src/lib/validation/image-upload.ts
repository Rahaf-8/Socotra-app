import { z } from "zod";

export const MAX_IMAGE_UPLOAD_BYTES = 12 * 1024 * 1024;
export const IMAGE_UPLOAD_CONTEXTS = ["gallery", "tour-hero", "tour-card", "tour-gallery", "itinerary"] as const;
export const imageUploadContextSchema = z.enum(IMAGE_UPLOAD_CONTEXTS);
export type ImageUploadContext = z.infer<typeof imageUploadContextSchema>;

export const cloudinaryPublicIdSchema = z.string().trim().min(1).max(255).regex(/^socotra\/(?:gallery|tours\/(?:hero|cards|gallery|itinerary))\/[A-Za-z0-9_-]+$/);

export function isSafeImageReference(value: string) {
  if (/^\/(?!\/)/.test(value)) {
    return /^\/[A-Za-z0-9/_. -]+\.(?:avif|gif|jfif|jpe?g|png|webp)$/i.test(value)
      && !value.split("/").includes("..")
      && !/[?#]/.test(value);
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.port || url.username || url.password || url.hash) return false;
    if (url.hostname === "images.unsplash.com") return /^\/photo-[A-Za-z0-9_-]+$/.test(url.pathname);
    return url.hostname === "res.cloudinary.com" && /^\/[A-Za-z0-9_-]+\/image\/upload\/(?:[A-Za-z0-9_,/-]+\/)?socotra\/.+\.(?:avif|jpe?g|png|webp)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export const imageReferenceSchema = z.string().trim().max(1_000).refine(isSafeImageReference, "Use a safe local image path, approved Unsplash URL, or secure Cloudinary image URL.");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function validateImageFile(file: File): string | null {
  if (!file.size) return "Choose a non-empty image file.";
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) return "Image files must be 12 MB or smaller.";
  if (!allowedMimeTypes.has(file.type.toLowerCase())) return "Choose a JPEG, PNG, WebP, or AVIF image.";
  return null;
}

export function hasValidImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.length >= 8 && [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].every((value, index) => bytes[index] === value);
  if (mimeType === "image/webp") return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (mimeType === "image/avif") return bytes.length >= 12 && String.fromCharCode(...bytes.slice(4, 12)).startsWith("ftyp") && ["avif", "avis"].includes(String.fromCharCode(...bytes.slice(8, 12)));
  return false;
}
