import Link from "next/link";
import { Container } from "@/components/layout/container";

const content = {
  en: { eyebrow: "Page not found", title: "This Journey Could Not Be Found", description: "The page you requested may have moved or is no longer available.", home: "Return Home", tours: "Explore Tours" },
  ar: { eyebrow: "الصفحة غير موجودة", title: "تعذر العثور على هذه الصفحة", description: "ربما نُقلت الصفحة التي طلبتها أو لم تعد متاحة.", home: "العودة إلى الرئيسية", tours: "استكشف الرحلات" },
} as const;

function LocaleNotFound({ locale }: { locale: "en" | "ar" }) {
  const text = content[locale];
  return <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`locale-${locale}`}><p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean">{text.eyebrow}</p><h1 className="mt-5 text-balance font-display text-5xl font-semibold text-charcoal sm:text-7xl">{text.title}</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-charcoal/70">{text.description}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href={`/${locale}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-ocean px-7 text-sm font-bold text-white">{text.home}</Link><Link href={`/${locale}/tours`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-charcoal/20 px-7 text-sm font-bold text-charcoal">{text.tours}</Link></div></div>;
}

export default function NotFound() {
  return <main className="flex min-h-[75vh] items-center bg-soft-sand pb-20 pt-36"><Container className="max-w-4xl text-center"><LocaleNotFound locale="en"/><LocaleNotFound locale="ar"/></Container></main>;
}
