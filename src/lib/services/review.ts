"use server";

import { revalidatePath } from "next/cache";

import { isLocale, type Locale } from "@/i18n/config";
import { createPendingReview } from "@/lib/reviews/review-repository";
import { createReviewSchema } from "@/lib/validation/review";

export type ReviewSubmissionResult = { success: boolean; message?: string };

export async function submitReviewForm(locale: Locale, formData: FormData): Promise<void> {
  await submitReview({
    name: formData.get("name"),
    email: formData.get("email"),
    rating: Number(formData.get("rating")),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  }, locale);
}

export async function submitReview(input: unknown, locale: Locale): Promise<ReviewSubmissionResult> {
  const safeError = locale === "ar" ? "تعذر إرسال المراجعة. راجع البيانات وحاول مرة أخرى." : "We could not submit your review. Check the details and try again.";
  if (!isLocale(locale)) return { success: false, message: safeError };
  const parsed = createReviewSchema(locale).safeParse(input);
  if (!parsed.success || parsed.data.website) return { success: false, message: safeError };

  try {
    await createPendingReview(parsed.data, locale);
  } catch {
    return { success: false, message: safeError };
  }

  revalidatePath("/admin/reviews");
  revalidatePath("/admin/dashboard");
  revalidatePath("/en");
  revalidatePath("/ar");
  return { success: true };
}
