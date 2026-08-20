import { z } from "zod";

const key = z.string().trim().toLowerCase().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only.");
const label = z.string().trim().min(1).max(120);

export const tourPackageTypeSchema = z.object({
  originalKey: key.optional(),
  key,
  displayOrder: z.coerce.number().int().min(0).max(10_000),
  status: z.enum(["draft", "published", "archived"]),
  en: label,
  ar: label,
});

export type TourPackageTypeInput = z.infer<typeof tourPackageTypeSchema>;
