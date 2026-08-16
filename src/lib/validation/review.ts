import { z } from "zod";

import type { Locale } from "@/i18n/config";

export function createReviewSchema(locale: Locale) {
  const ar = locale === "ar";

  return z.object({
    name: z.string().trim().min(2, ar ? "أدخل اسمك." : "Enter your name.").max(100, ar ? "يجب ألا يزيد الاسم على 100 حرف." : "Name must be 100 characters or fewer."),
    email: z.string().trim().toLowerCase().max(254).email(ar ? "أدخل بريدًا إلكترونيًا صالحًا." : "Enter a valid email address."),
    rating: z.number({ error: ar ? "اختر تقييمًا." : "Choose a rating." }).int().min(1, ar ? "اختر نجمة واحدة على الأقل." : "Choose at least one star.").max(5, ar ? "الحد الأقصى خمس نجوم." : "The maximum rating is five stars."),
    message: z.string().trim().min(20, ar ? "يجب أن تتضمن المراجعة 20 حرفًا على الأقل." : "Review must contain at least 20 characters.").max(2_000, ar ? "يجب ألا تزيد المراجعة على 2,000 حرف." : "Review must be 2,000 characters or fewer."),
    website: z.string().max(0).optional(),
  }).strict();
}

export const reviewIdSchema = z.string().trim().min(1).max(160).regex(/^[A-Za-z0-9-]+$/);
export const reviewStatusSchema = z.enum(["pending", "approved", "rejected", "archived"]);
export const reviewFilterSchema = z.enum(["all", "pending", "approved", "rejected", "archived"]);
export type ReviewInput = z.infer<ReturnType<typeof createReviewSchema>>;
