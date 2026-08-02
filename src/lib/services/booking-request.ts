import type { BookingRequestInput } from "@/lib/validation/booking-request";

export type BookingRequestSubmission = BookingRequestInput & {
  selectedPackageTitle: string;
  displayedPricingTier?: {
    label: string;
    pricePerPerson: number;
    currency: string;
  };
};

export type BookingRequestResult =
  | { success: true }
  | { success: false; message: string };

/**
 * Temporary in-browser boundary. It deliberately does not persist or transmit
 * personal data. Replace this implementation with the approved server/API
 * operation when booking storage is implemented.
 */
export async function submitBookingRequest(
  request: BookingRequestSubmission,
): Promise<BookingRequestResult> {
  void request;
  return { success: true };
}
