import { galleryPageData } from "@/config/gallery-content";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/i18n/routing";
import type { GalleryPageData } from "@/types/gallery";

export function getGalleryContent(locale: Locale): GalleryPageData {
  if (locale === "en") {
    return {
      ...galleryPageData,
      cta: {
        ...galleryPageData.cta,
        primaryAction: { ...galleryPageData.cta.primaryAction, href: localizedHref(locale, "/tours") },
        secondaryAction: galleryPageData.cta.secondaryAction ? { ...galleryPageData.cta.secondaryAction, href: localizedHref(locale, "/booking") } : undefined,
      },
    };
  }
  return {
    hero: { eyebrow: "استكشف سقطرى", title: "لحظات من الجزيرة", description: "اكتشف سقطرى من خلال مناظرها وحياتها البرية وثقافتها ورحلاتها التي لا تُنسى." },
    categories: galleryPageData.categories.map((category) => ({ ...category, label: category.id === "all" ? "الكل" : "النباتات" })),
    items: galleryPageData.items.map((item) => ({ ...item, title: "أشجار دم الأخوين", description: "أشجار دم الأخوين المميزة تنتشر على هضبة جزيرية صخرية فوق البحر.", altText: "أشجار دم الأخوين على هضبة سقطرية صخرية تطل على البحر." })),
    instagram: {
      eyebrow: "تابع الرحلة", title: "منشورات Instagram", description: "شاهد المزيد من لحظات رحلاتنا ومخيماتنا والحياة في أنحاء جزيرة سقطرى.", published: galleryPageData.instagram.published,
      posts: galleryPageData.instagram.posts.map((post) => ({ ...post, altText: "معاينة مؤقتة لمنشور Instagram تظهر أشجار دم الأخوين على هضبة سقطرية صخرية.", caption: "معاينة مؤقتة لطريقة عرض صور Instagram المعتمدة." })),
    },
    cta: { title: "عِش تجربة سقطرى بنفسك", description: "استكشف رحلاتنا واكتشف المناظر التي تقف خلف هذه اللحظات.", primaryAction: { label: "استكشف رحلاتنا", href: localizedHref(locale, "/tours") }, secondaryAction: { label: "خطط لرحلتك", href: localizedHref(locale, "/booking") } },
    seo: { title: "معرض سقطرى | المناظر والحياة البرية ورحلات الجزيرة", description: "استكشف صور مناظر سقطرى وسواحلها ونباتاتها المميزة وحياتها البرية وثقافتها ورحلاتها التي لا تُنسى.", image: galleryPageData.seo.image },
  };
}
