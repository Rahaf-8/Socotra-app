import { contactPageData } from "@/config/contact-content";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/i18n/routing";
import type { ContactPageData } from "@/types/contact";

export function getContactContent(locale: Locale): ContactPageData {
  if (locale === "en") {
    return {
      ...contactPageData,
      guidance: contactPageData.guidance ? { ...contactPageData.guidance, faqAction: contactPageData.guidance.faqAction ? { ...contactPageData.guidance.faqAction, href: localizedHref(locale, "/faq") } : undefined } : undefined,
      bookingCTA: contactPageData.bookingCTA ? { ...contactPageData.bookingCTA, primaryAction: { ...contactPageData.bookingCTA.primaryAction, href: localizedHref(locale, "/booking") }, secondaryAction: contactPageData.bookingCTA.secondaryAction ? { ...contactPageData.bookingCTA.secondaryAction, href: localizedHref(locale, "/tours") } : undefined } : undefined,
    };
  }
  return {
    hero: { eyebrow: "تواصل معنا", title: "لنخطط معًا لرحلتك إلى سقطرى", description: "هل لديك سؤال عن السفر إلى سقطرى؟ أرسل لنا رسالة وأخبرنا كيف يمكننا مساعدتك." },
    intro: { title: "ابدأ باستفسار عام", description: "استخدم هذا النموذج للأسئلة المتعلقة بالرحلات أو التخطيط للسفر أو الاستعداد للزيارة. وإذا اخترت باقة بالفعل، فانتقل إلى طلب الحجز." },
    methods: contactPageData.methods,
    form: {
      eyebrow: "أرسل رسالة", title: "كيف يمكننا مساعدتك؟", description: "شارك سؤالك وبعض التفاصيل عما تبحث عنه.",
      submitLabel: "إرسال الاستفسار", submittingLabel: "جارٍ الإرسال...", successTitle: "تم استلام رسالتك", successMessage: "شكرًا لتواصلك معنا. تم تسجيل استفسارك.",
      errorMessage: "تعذر إرسال رسالتك. يرجى مراجعة النموذج والمحاولة مرة أخرى.",
      unavailableMessage: "خدمة إرسال الاستفسارات عبر الإنترنت غير متصلة بعد. لم تُرسل رسالتك.",
    },
    enquiryTypes: [
      ["general-question", "سؤال عام"], ["tour-information", "معلومات عن الرحلات"], ["travel-planning", "تخطيط السفر"], ["private-journey", "رحلة خاصة"], ["group-enquiry", "استفسار عن مجموعة"], ["partnership-or-media", "شراكة أو إعلام"], ["other", "أخرى"],
    ].map(([value, label], index) => ({ id: value, value, label, displayOrder: index + 1, published: true })),
    guidance: { eyebrow: "قبل الإرسال", title: "معلومات يُستحسن ذكرها", description: "يساعد قليل من السياق الفريق على فهم سؤالك. هذه التفاصيل اختيارية.", items: ["الرحلة أو التجربة التي تهتم بها", "الفترة العامة لسفرك", "عدد المسافرين", "أي أسئلة ترغب في معرفة إجابتها"].map((text, index) => ({ id: contactPageData.guidance!.items[index].id, text, displayOrder: index + 1, published: true })), faqAction: { label: "اقرأ الأسئلة الشائعة للسفر", href: localizedHref(locale, "/faq") } },
    bookingCTA: { eyebrow: "مستعد للسفر؟", title: "هل اخترت رحلتك بالفعل؟", description: "أرسل طلب حجز يتضمن الرحلة المفضلة وتفاصيل السفر.", primaryAction: { label: "ابدأ طلب حجز", href: localizedHref(locale, "/booking") }, secondaryAction: { label: "استكشف رحلاتنا", href: localizedHref(locale, "/tours") } },
    seo: { title: "تواصل مع Tour Socotra | خطط لرحلتك إلى الجزيرة", description: "تواصل مع Tour Socotra للاستفسار عن الرحلات والتخطيط للسفر وزيارة جزيرة سقطرى.", image: contactPageData.seo.image },
  };
}
