import { z } from "zod";
import type { Locale } from "@/i18n/config";

export function createBookingRequestSchema(locale: Locale) {
  const ar = locale === "ar";
  return z.object({
    fullName: z.string().trim().min(1, ar ? "الاسم الكامل مطلوب." : "Full name is required."),
    email: z.string().trim().email(ar ? "أدخل بريدًا إلكترونيًا صالحًا." : "Enter a valid email address."),
    whatsappNumber: z.string().trim().min(1, ar ? "رقم واتساب مطلوب." : "WhatsApp number is required."),
    country: z.string().trim().min(1, ar ? "البلد مطلوب." : "Country is required."),
    tourSlug: z.string().trim().min(1, ar ? "اختر باقة رحلة." : "Select a tour package."),
    preferredArrivalDate: z.string().trim().min(1, ar ? "تاريخ الوصول المفضل مطلوب." : "Preferred arrival date is required."),
    adults: z.number({ error: ar ? "أدخل عدد البالغين." : "Enter the number of adults." }).int(ar ? "يجب أن يكون عدد البالغين رقمًا صحيحًا." : "Adults must be a whole number.").min(1, ar ? "يلزم وجود شخص بالغ واحد على الأقل." : "At least one adult is required."),
    children: z.number({ error: ar ? "أدخل عدد الأطفال." : "Enter the number of children." }).int(ar ? "يجب أن يكون عدد الأطفال رقمًا صحيحًا." : "Children must be a whole number.").min(0, ar ? "لا يمكن أن يكون عدد الأطفال سالبًا." : "Children cannot be negative."),
    specialRequirements: z.string().trim().optional(),
  });
}
export type BookingRequestInput = z.infer<ReturnType<typeof createBookingRequestSchema>>;
