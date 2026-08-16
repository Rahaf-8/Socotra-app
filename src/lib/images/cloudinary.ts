import "server-only";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import type { ImageUploadContext } from "@/lib/validation/image-upload";

const folders: Record<ImageUploadContext, string> = {
  gallery: "socotra/gallery",
  "tour-hero": "socotra/tours/hero",
  "tour-card": "socotra/tours/cards",
  "tour-gallery": "socotra/tours/gallery",
  itinerary: "socotra/tours/itinerary",
};

let configured = false;

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) throw new Error("cloudinary-not-configured");
  if (!configured) {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
    configured = true;
  }
}

export type SafeCloudinaryUpload = {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  originalFilename: string;
};

export async function uploadImage(buffer: Buffer, context: ImageUploadContext): Promise<SafeCloudinaryUpload> {
  configureCloudinary();
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: folders[context],
      resource_type: "image",
      type: "upload",
      overwrite: false,
      unique_filename: true,
      use_filename: false,
    }, (error, response) => error || !response ? reject(error ?? new Error("cloudinary-empty-response")) : resolve(response));
    stream.end(buffer);
  });
  if (result.resource_type !== "image" || !result.secure_url.startsWith("https://res.cloudinary.com/") || !result.public_id.startsWith(`${folders[context]}/`)) {
    throw new Error("cloudinary-invalid-response");
  }
  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    originalFilename: result.original_filename,
  };
}

export async function destroyCloudinaryImage(publicId: string) {
  configureCloudinary();
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  return result.result === "ok" || result.result === "not found";
}
