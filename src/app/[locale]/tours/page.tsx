import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ToursGrid } from "@/components/tours/tours-grid";
import { ToursPageCTA } from "@/components/tours/tours-page-cta";
import { ToursPageHero } from "@/components/tours/tours-page-hero";
import { siteSettingsPlaceholder } from "@/config/site-settings";
import { isLocale } from "@/i18n/config";
import { getTours, getTourUI } from "@/i18n/content/tours";
import { languageAlternates, localizedHref } from "@/i18n/routing";

export async function generateMetadata({params}:PageProps<"/[locale]/tours">):Promise<Metadata>{const{locale}=await params;if(!isLocale(locale))notFound();const ui=getTourUI(locale);return{title:ui.metadata.title,description:ui.metadata.description,alternates:{languages:languageAlternates("/tours")},openGraph:{title:ui.metadata.title,description:ui.metadata.description,type:"website",url:`/${locale}/tours`}}}
export default async function ToursPage({params}:PageProps<"/[locale]/tours">){const{locale}=await params;if(!isLocale(locale))notFound();const ui=getTourUI(locale);return <main><ToursPageHero content={{eyebrow:ui.listing.eyebrow,heading:ui.listing.heading,description:ui.listing.description,placeholderNotice:ui.listing.placeholderNotice}}/><Section className="bg-soft-sand"><Container><ToursGrid tours={getTours(locale)} locale={locale} labels={{view:ui.labels.viewTour,from:ui.labels.from,perPerson:ui.labels.perPerson,contactPricing:ui.labels.contactPricing}}/></Container></Section><Section className="bg-white pt-0"><ToursPageCTA content={{heading:ui.listing.ctaHeading,primaryAction:{label:ui.listing.plan,href:localizedHref(locale,"/booking")},whatsappAction:{label:ui.listing.whatsapp,href:siteSettingsPlaceholder.contact.whatsappUrl}}}/></Section></main>}
