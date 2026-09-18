import { z } from "zod";
import { cloudinaryPublicIdSchema, imageReferenceSchema } from "@/lib/validation/image-upload";

export const homeHeroImageSchema = z.object({ imagePath: imageReferenceSchema, publicId: z.union([cloudinaryPublicIdSchema, z.literal("")]) });
export type HomeHeroImageInput = z.infer<typeof homeHeroImageSchema>;
