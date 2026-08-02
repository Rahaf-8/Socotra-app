import { z } from "zod";
import type { Locale } from "@/i18n/config";

export const contactEnquiryValues = ["general-question","tour-information","travel-planning","private-journey","group-enquiry","partnership-or-media","other"] as const;
const allowed = new Set<string>(contactEnquiryValues);

export function createContactRequestSchema(locale: Locale) {
  const ar = locale === "ar";
  return z.object({
    name: z.string().trim().min(2, ar ? "أدخل اسمك الكامل." : "Enter your full name.").max(100, ar ? "يجب ألا يزيد الاسم على 100 حرف." : "Name must be 100 characters or fewer."),
    email: z.string().trim().max(254, ar ? "يجب ألا يزيد البريد الإلكتروني على 254 حرفًا." : "Email address must be 254 characters or fewer.").email(ar ? "أدخل بريدًا إلكترونيًا صالحًا." : "Enter a valid email address."),
    enquiryType: z.string().trim().refine(value => allowed.has(value), ar ? "اختر نوع استفسار صالحًا." : "Select a valid enquiry type."),
    subject: z.string().trim().max(120, ar ? "يجب ألا يزيد الموضوع على 120 حرفًا." : "Subject must be 120 characters or fewer.").optional(),
    message: z.string().trim().min(20, ar ? "يجب أن تتضمن الرسالة 20 حرفًا على الأقل." : "Message must contain at least 20 characters.").max(2000, ar ? "يجب ألا تزيد الرسالة على 2,000 حرف." : "Message must be 2,000 characters or fewer."),
  });
}
export type ContactRequestInput = z.infer<ReturnType<typeof createContactRequestSchema>>;
