"use server";

import { revalidatePath } from "next/cache";

import type { Locale } from "@/i18n/config";
import { persistContactRequest, type ContactSubmissionResult } from "@/lib/requests/request-submission";

export type ContactRequestResult = ContactSubmissionResult;

export async function submitContactRequest(input: unknown, locale: Locale): Promise<ContactRequestResult> {
  const result = await persistContactRequest(input, locale);
  if (result.success) {
    revalidatePath("/admin/contact-requests");
    revalidatePath("/admin/dashboard");
  }
  return result;
}
