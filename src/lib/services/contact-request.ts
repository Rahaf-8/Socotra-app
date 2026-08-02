import type { ContactRequestInput } from "@/lib/validation/contact-request";

export type ContactRequestResult =
  | { success: true }
  | { success: false; code: "NOT_CONFIGURED" | "FAILED" };

/**
 * Temporary in-browser boundary. It deliberately does not persist, transmit,
 * log, or otherwise retain personal data. Replace this implementation with the
 * approved server operation when contact-request storage and delivery exist.
 */
export async function submitContactRequest(
  request: ContactRequestInput,
): Promise<ContactRequestResult> {
  void request;
  return { success: false, code: "NOT_CONFIGURED" };
}
