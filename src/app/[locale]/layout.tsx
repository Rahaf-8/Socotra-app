import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Suspense } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getNavigation } from "@/config/navigation";
import { siteSettingsPlaceholder } from "@/config/site-settings";
import { almarai } from "@/fonts/almarai";
import { isLocale, localeDetails, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

import "../globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Socotra Island Tourism", template: "%s | Socotra Island Tourism" },
  description: "Client Information Required",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = { children: React.ReactNode; params: Promise<{ locale: string }> };
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const dictionary = await getDictionary(value);
  const navigation = getNavigation(value, dictionary);
  const isArabic = value === "ar";

  return (
    <html lang={value} dir={localeDetails[value].dir} className={`${manrope.variable} ${cormorant.variable} ${isArabic ? almarai.variable : ""} h-full antialiased`}>
      <body className={`flex min-h-full flex-col ${isArabic ? "font-arabic" : ""}`}>
        <Suspense fallback={null}>
          <Navbar
            navigation={navigation.mainNavigation}
            bookingItem={navigation.bookingNavigationItem}
            settings={siteSettingsPlaceholder}
            locale={value}
            labels={{
              home: dictionary.navigation.home,
              primary: dictionary.navigation.home,
              menuOpen: dictionary.navigation.menuOpen,
              menuClose: dictionary.navigation.menuClose,
              changeLanguage: dictionary.language.change,
            }}
          />
        </Suspense>
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer
          navigation={navigation.footerNavigation}
          settings={siteSettingsPlaceholder}
          locale={value}
          labels={{
            home: dictionary.navigation.home,
            contact: dictionary.navigation.contactHeading,
            social: dictionary.navigation.socialHeading,
            email: value === "ar" ? "البريد الإلكتروني" : "Email",
            phone: value === "ar" ? "الهاتف" : "Phone",
            whatsapp: dictionary.common.whatsapp,
            address: value === "ar" ? "العنوان" : "Address",
          }}
        />
      </body>
    </html>
  );
}
