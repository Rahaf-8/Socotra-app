"use server";

import { revalidatePath } from "next/cache";

import type { Locale } from "@/i18n/config";
import { persistBookingRequest, type BookingSubmissionResult } from "@/lib/requests/request-submission";

export type BookingRequestResult = BookingSubmissionResult;

export async function submitBookingRequest(input: unknown, locale: Locale): Promise<BookingRequestResult> {
  const result = await persistBookingRequest(input, locale);
  if (result.success) {
    revalidatePath("/admin/booking-requests");
    revalidatePath("/admin/dashboard");
  }
  return result;
}
