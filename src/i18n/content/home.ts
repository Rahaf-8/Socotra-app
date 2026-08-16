import type { CTASectionContent } from "@/components/home/cta-section";
import type { FeaturedToursContent } from "@/components/home/featured-tours";
import type { FlightInformationContent } from "@/components/home/flight-information";
import type { GalleryPreviewContent } from "@/components/home/gallery-preview";
import type { HeroContent } from "@/components/home/hero";
import type { ReviewsSectionContent } from "@/components/home/reviews-section";
import type { WhySocotraContent } from "@/components/home/why-socotra";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/i18n/routing";

export type HomeContent = {
  hero: HeroContent;
  featuredTours: FeaturedToursContent;
  whySocotra: WhySocotraContent;
  flights: FlightInformationContent;
  gallery: GalleryPreviewContent;
  reviews: ReviewsSectionContent;
  finalCTA: CTASectionContent;
  metadata: { title: string; description: string };
};

export function getHomeContent(locale: Locale, whatsappUrl: string): HomeContent {
  const ar = locale === "ar";
  return {
    hero: {
      eyebrow: ar ? "استكشف الاستثنائي" : "Explore the extraordinary",
      heading: ar ? "اكتشف جمال سقطرى البكر" : "Discover the Untouched Beauty of Socotra",
      description: ar
        ? "انطلق إلى واحدة من أكثر جزر العالم استثنائية عبر رحلات مصممة بعناية وخبرة محلية وتجارب طبيعية لا تُنسى."
        : "Journey to one of the world’s most extraordinary islands through carefully designed tours, local expertise, and unforgettable natural experiences.",
      primaryAction: { label: ar ? "استكشف الرحلات" : "Explore Tours", href: localizedHref(locale, "/tours") },
      secondaryAction: { label: ar ? "خطط لرحلتك" : "Plan Your Trip", href: localizedHref(locale, "/booking") },
      trustLine: ar ? "مجموعات صغيرة · مرشدون محليون · رحلات مخطط لها بعناية" : "Small groups · Local guides · Carefully planned journeys",
      image: { src: "/socotra-hero-placeholder.png", alt: ar ? "أشجار دم الأخوين على هضبة سقطرية وعرة تطل على البحر عند الشروق." : "Dragon blood trees on a rugged Socotra plateau overlooking the sea at sunrise." },
    },
    featuredTours: {
      eyebrow: ar ? "رحلات منتقاة" : "Curated journeys",
      heading: ar ? "استكشف رحلاتنا المميزة إلى سقطرى" : "Explore Our Featured Socotra Tours",
      description: ar ? "تجارب مصممة بعناية تكشف مناظر سقطرى الاستثنائية وثقافتها وعجائبها الطبيعية." : "Carefully designed experiences that reveal Socotra’s extraordinary landscapes, culture, and natural wonders.",
      action: { label: ar ? "عرض جميع الرحلات" : "View All Tours", href: localizedHref(locale, "/tours") },
      placeholderNotice: ar ? "صور مؤقتة للباقات · تتطلب موافقة العميل" : "Temporary package imagery · Client approval required",
    },
    whySocotra: {
      eyebrow: ar ? "لماذا سقطرى؟" : "Why Socotra",
      heading: ar ? "رحلة تتجاوز المألوف" : "A Journey Beyond the Ordinary",
      description: ar ? "تجمع سقطرى بين مناظر نادرة وحياة برية مميزة وسواحل نائية وثقافة محلية عميقة الجذور." : "Socotra offers an extraordinary combination of rare landscapes, distinctive wildlife, remote coastlines, and deeply rooted local culture.",
      placeholderNotice: ar ? "محتوى تطوير مؤقت · يتطلب موافقة العميل" : "Temporary development content · Client approval required",
      features: [
        { title: ar ? "طبيعة من عالم آخر" : "Otherworldly Nature", description: ar ? "اكتشف مناظر درامية ونباتات لا توجد في أي مكان آخر على الأرض." : "Discover dramatic landscapes and plant life found nowhere else on Earth.", icon: "leaf" },
        { title: ar ? "تجارب محلية أصيلة" : "Authentic Local Experiences", description: ar ? "سافر برؤية محلية وتعرّف إلى الجزيرة من خلال أهلها وتقاليدها وحكاياتها." : "Travel with local insight and experience the island through its people, traditions, and stories.", icon: "users" },
        { title: ar ? "نائية وبكر" : "Remote and Unspoiled", description: ar ? "استكشف الشواطئ الهادئة والهضاب الجبلية والأودية والمواقع الطبيعية بعيدًا عن السياحة الجماعية." : "Explore quiet beaches, mountain plateaus, valleys, and natural locations far from mass tourism.", icon: "mountain" },
      ],
    },
    flights: {
      enabled: true,
      eyebrow: ar ? "خطط لوصولك" : "Plan your arrival",
      heading: ar ? "تُسيّر الرحلات إلى سقطرى مرتين أسبوعيًا" : "Flights to Socotra Operate Twice Weekly",
      description: ar ? "جداول الرحلات محدودة وقد تتغير. سيساعد فريقنا الضيوف على فهم خيارات السفر المتاحة بعد تأكيد مسار الرحلة وتفاصيل الحجز." : "Flight schedules are limited and may change. Our team will help guests understand the available travel options once the final itinerary and booking details are confirmed.",
      frequency: { label: ar ? "التكرار الحالي" : "Current frequency", value: ar ? "مرتان أسبوعيًا" : "Twice Weekly" },
      operatingDays: { label: ar ? "أيام التشغيل" : "Operating days", value: ar ? "معلومات العميل مطلوبة" : "Client Information Required" },
      scheduleStatus: { label: ar ? "حالة الجدول" : "Schedule status", value: ar ? "بانتظار التأكيد" : "To be confirmed" },
      supportingNote: ar ? "أيام الرحلات وتفاصيل الجدول الدقيقة: معلومات العميل مطلوبة" : "Exact flight days and schedule details: Client Information Required",
      primaryAction: { label: ar ? "خطط لرحلتك" : "Plan Your Trip", href: localizedHref(locale, "/booking") },
      secondaryAction: { label: ar ? "تواصل معنا" : "Contact Us", href: localizedHref(locale, "/contact") },
      placeholderNotice: ar ? "محتوى تطوير مؤقت · يتطلب موافقة العميل" : "Temporary development content · Client approval required",
    },
    gallery: {
      enabled: true,
      eyebrow: ar ? "المعرض" : "Gallery",
      heading: ar ? "اكتشف جمال سقطرى" : "Discover the Beauty of Socotra",
      description: ar ? "استكشف لمحة بصرية مؤقتة عن مناظر سقطرى المتنوعة وشواطئها الهادئة وجبالها وحياتها البرية وبيئتها الطبيعية المميزة." : "Explore a temporary visual preview of Socotra’s varied landscapes, quiet beaches, mountain scenery, wildlife, and distinctive natural surroundings.",
      action: { label: ar ? "عرض المعرض الكامل" : "View Full Gallery", href: localizedHref(locale, "/gallery") },
      placeholderNotice: ar ? "صور ونصوص تطوير مؤقتة · تتطلب موافقة العميل" : "Temporary development imagery and copy · Client approval required",
    },
    reviews: {
      enabled: true,
      eyebrow: ar ? "آراء الضيوف" : "Guest Reviews",
      heading: ar ? "حكايات مسافري سقطرى" : "Stories from Socotra Travelers",
      description: ar ? "اقرأ تجارب حقيقية وافق فريقنا على نشرها، أو شارك تجربتك معنا." : "Read authentic guest experiences approved by our team, or share your own experience with us.",
      writeAction: ar ? "اكتب مراجعة" : "Write a Review",
      emptyMessage: ar ? "لا توجد مراجعات منشورة بعد. يمكنك مشاركة تجربتك أدناه." : "There are no published reviews yet. You can share your experience below.",
      form: {
        title: ar ? "شارك تجربتك" : "Share your experience",
        description: ar ? "ستراجع الإدارة مشاركتك قبل ظهورها على الموقع. لن يظهر بريدك الإلكتروني للعامة." : "Your submission will be reviewed before it appears on the website. Your email address will not be displayed publicly.",
        name: ar ? "الاسم" : "Name", email: ar ? "البريد الإلكتروني" : "Email", rating: ar ? "التقييم بالنجوم" : "Star rating", message: ar ? "مراجعتك" : "Your review",
        submit: ar ? "إرسال المراجعة" : "Submit Review", submitting: ar ? "جارٍ الإرسال…" : "Submitting…",
        successTitle: ar ? "شكرًا لمشاركتك" : "Thank you for sharing",
        successMessage: ar ? "استلمنا مراجعتك وستظهر بعد موافقة الإدارة." : "We received your review. It will appear after administrator approval.",
        errorMessage: ar ? "تعذر إرسال المراجعة. راجع البيانات وحاول مرة أخرى." : "We could not submit your review. Check the details and try again.",
      },
    },
    finalCTA: {
      enabled: true,
      eyebrow: ar ? "مغامرتك بانتظارك" : "Your Adventure Awaits",
      heading: ar ? "هل أنت مستعد لتجربة سقطرى؟" : "Ready to Experience Socotra?",
      description: ar ? "ابدأ التخطيط لرحلة مرتبة بعناية واكتشف جزيرة شكلتها المناظر المذهلة والطبيعة وتجارب لا تُنسى." : "Begin planning a thoughtfully arranged journey and discover an island shaped by remarkable landscapes, natural beauty, and memorable experiences.",
      primaryAction: { label: ar ? "احجز رحلتك" : "Book Your Trip", href: localizedHref(locale, "/booking") },
      secondaryAction: { label: ar ? "استكشف الرحلات" : "Explore Tours", href: localizedHref(locale, "/tours") },
      whatsappAction: { label: ar ? "تحدث معنا عبر واتساب" : "Chat with us on WhatsApp", href: whatsappUrl },
      backgroundImage: { src: "/socotra-hero-placeholder.png" },
      placeholderNotice: ar ? "محتوى وصور تطوير مؤقتة · تتطلب موافقة العميل" : "Temporary development content and imagery · Client approval required",
    },
    metadata: {
      title: ar ? "السياحة في جزيرة سقطرى" : "Socotra Island Tourism",
      description: ar ? "اكتشف رحلات سقطرى المصممة بعناية ومناظر الجزيرة الاستثنائية ومعلومات السفر الأساسية." : "Discover carefully designed Socotra tours, extraordinary island landscapes and essential travel information.",
    },
  };
}
