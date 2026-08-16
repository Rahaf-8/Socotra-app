import "server-only";

import { isLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { createBookingRequestSchema } from "@/lib/validation/booking-request";
import { createContactRequestSchema } from "@/lib/validation/contact-request";

const duplicateWindowMs = 2 * 60 * 1000;

export type BookingSubmissionResult = { success: true } | { success: false; message: string };
export type ContactSubmissionResult = { success: true } | { success: false; code: "INVALID" | "FAILED" };

export async function persistBookingRequest(input: unknown, locale: Locale): Promise<BookingSubmissionResult> {
  if (!isLocale(locale)) return { success: false, message: "Unsupported language." };
  const parsed = createBookingRequestSchema(locale).safeParse(input);
  if (!parsed.success || parsed.data.website) return { success: false, message: locale === "ar" ? "يرجى مراجعة بيانات الطلب والمحاولة مرة أخرى." : "Review the request details and try again." };
  const data = parsed.data;
  const arrivalDate = new Date(`${data.preferredArrivalDate}T00:00:00.000Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (Number.isNaN(arrivalDate.getTime()) || arrivalDate < today) return { success: false, message: locale === "ar" ? "اختر تاريخ وصول مستقبليًا." : "Choose a future arrival date." };

  const tour = await prisma.tour.findFirst({ where: { slug: data.tourSlug, status: "published", translations: { some: { locale } } }, select: { id: true, translations: { where: { locale }, select: { title: true }, take: 1 } } });
  if (!tour?.translations[0]) return { success: false, message: locale === "ar" ? "اختر باقة رحلة متاحة." : "Select an available tour package." };
  const duplicate = await prisma.bookingRequest.findFirst({ where: { tourId: tour.id, email: data.email, preferredArrivalDate: arrivalDate, adults: data.adults, children: data.children, createdAt: { gte: new Date(Date.now() - duplicateWindowMs) } }, select: { id: true } });
  if (duplicate) return { success: true };
  try {
    await prisma.bookingRequest.create({ data: { tourId: tour.id, selectedPackageTitle: tour.translations[0].title, fullName: data.fullName, email: data.email, whatsappNumber: data.whatsappNumber, country: data.country, preferredArrivalDate: arrivalDate, adults: data.adults, children: data.children, specialRequirements: data.specialRequirements || null, locale } });
    return { success: true };
  } catch {
    return { success: false, message: locale === "ar" ? "تعذر حفظ الطلب. حاول مرة أخرى." : "The request could not be saved. Try again." };
  }
}

export async function persistContactRequest(input: unknown, locale: Locale): Promise<ContactSubmissionResult> {
  if (!isLocale(locale)) return { success: false, code: "INVALID" };
  const candidate = typeof input === "object" && input !== null && "enquiryType" in input ? String(input.enquiryType) : "";
  const enquiryType = await prisma.contactEnquiryType.findFirst({ where: { value: candidate, status: "published", translations: { some: { locale } } }, select: { id: true, value: true } });
  if (!enquiryType) return { success: false, code: "INVALID" };
  const parsed = createContactRequestSchema(locale, [enquiryType.value]).safeParse(input);
  if (!parsed.success || parsed.data.website) return { success: false, code: "INVALID" };
  const data = parsed.data;
  const duplicate = await prisma.contactRequest.findFirst({ where: { email: data.email, enquiryValue: enquiryType.value, message: data.message, createdAt: { gte: new Date(Date.now() - duplicateWindowMs) } }, select: { id: true } });
  if (duplicate) return { success: true };
  try {
    await prisma.contactRequest.create({ data: { name: data.name, email: data.email, enquiryTypeId: enquiryType.id, enquiryValue: enquiryType.value, subject: data.subject || null, message: data.message, locale } });
    return { success: true };
  } catch {
    return { success: false, code: "FAILED" };
  }
}
