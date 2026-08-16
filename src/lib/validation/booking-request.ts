import { z } from "zod";
import type { Locale } from "@/i18n/config";

export function createBookingRequestSchema(locale: Locale) {
  const ar = locale === "ar";
  return z.object({
    fullName: z.string().trim().min(2, ar ? "أدخل الاسم الكامل." : "Enter your full name.").max(100),
    email: z.string().trim().toLowerCase().max(254).email(ar ? "أدخل بريدًا إلكترونيًا صالحًا." : "Enter a valid email address."),
    whatsappNumber: z.string().trim().min(8, ar ? "أدخل رقم واتساب دوليًا صالحًا." : "Enter a valid international WhatsApp number.").max(32).regex(/^\+[1-9](?:[\d ()-]*\d)?$/, ar ? "ابدأ الرقم برمز الدولة، مثل +967." : "Start with the country code, for example +967."),
    country: z.string().trim().min(2, ar ? "البلد مطلوب." : "Country is required.").max(100),
    tourSlug: z.string().trim().min(1, ar ? "اختر باقة رحلة." : "Select a tour package.").max(120).regex(/^[A-Za-z0-9-]+$/),
    preferredArrivalDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, ar ? "أدخل تاريخ وصول صالحًا." : "Enter a valid arrival date."),
    adults: z.number({ error: ar ? "أدخل عدد البالغين." : "Enter the number of adults." }).int(ar ? "يجب أن يكون عدد البالغين رقمًا صحيحًا." : "Adults must be a whole number.").min(1, ar ? "يلزم وجود شخص بالغ واحد على الأقل." : "At least one adult is required.").max(30),
    children: z.number({ error: ar ? "أدخل عدد الأطفال." : "Enter the number of children." }).int(ar ? "يجب أن يكون عدد الأطفال رقمًا صحيحًا." : "Children must be a whole number.").min(0, ar ? "لا يمكن أن يكون عدد الأطفال سالبًا." : "Children cannot be negative.").max(20),
    specialRequirements: z.string().trim().max(2_000).optional(),
    website: z.string().max(0).optional(),
  });
}
export type BookingRequestInput = z.infer<ReturnType<typeof createBookingRequestSchema>>;
