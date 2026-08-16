import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TourBookingCard } from "@/components/tours/tour-booking-card";
import { TourDetailHero } from "@/components/tours/tour-detail-hero";
import { TourExtras } from "@/components/tours/tour-extras";
import { TourExcluded } from "@/components/tours/tour-excluded";
import { TourIncluded } from "@/components/tours/tour-included";
import { TourInformation } from "@/components/tours/tour-information";
import { TourGallery } from "@/components/tours/tour-gallery";
import { TourItineraryAccordion } from "@/components/tours/tour-itinerary-accordion";
import { TourPricing } from "@/components/tours/tour-pricing";
import { siteSettingsPlaceholder } from "@/config/site-settings";
import { isLocale, locales } from "@/i18n/config";
import { getTourUI } from "@/i18n/content/tours";
import { bookingHref, languageAlternates, localizedHref } from "@/i18n/routing";
import { getPublishedTourBySlug, getPublishedTours } from "@/lib/tours/tour-repository";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const values = await Promise.all(locales.map(async (locale) => (await getPublishedTours(locale)).map((tour) => ({ locale, slug: tour.slug }))));
  return values.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const tour = await getPublishedTourBySlug(locale, slug);
  if (!tour) notFound();
  const title = tour.seoTitle ?? tour.title;
  const description = tour.seoDescription ?? tour.shortDescription;
  return { title, description, alternates: { languages: languageAlternates(`/tours/${tour.slug}`) }, openGraph: { title, description, type: "website", url: `/${locale}/tours/${tour.slug}`, images: [{ url: tour.featuredImage.src, alt: tour.featuredImage.alt }] } };
}

export default async function TourPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const tour = await getPublishedTourBySlug(locale, slug);
  if (!tour) notFound();
  const labels = getTourUI(locale).labels;
  const book = bookingHref(locale, tour.slug);
  return (
    <main>
      <TourDetailHero tour={tour} bookingHref={book} whatsappHref={siteSettingsPlaceholder.contact.whatsappUrl} locale={locale} labels={{ from: labels.from, perPerson: labels.perPerson, book: labels.bookTour, whatsapp: labels.whatsapp }} />
      <Section className="bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-16">
            <div>
              <div className="space-y-16">
                <TourInformation tour={tour} labels={{ eyebrow: labels.tourInformation, heading: labels.aboutPackage, accommodation: labels.accommodation, practical: labels.practical }} />
                <TourPricing tour={tour} locale={locale} labels={{ pricing: labels.pricing, perPerson: labels.perPerson }} />
                <TourIncluded items={tour.included} heading={labels.included} />
                <TourExcluded items={tour.excluded} heading={locale === "ar" ? "غير مشمول" : "Not Included"} />
                <TourExtras extras={tour.requiredExtras} locale={locale} heading={labels.extras} note={labels.extrasNote} />
                <TourItineraryAccordion days={tour.itinerary} labels={{ heading: labels.itinerary, day: labels.day, overnight: labels.overnight, location: labels.location }} />
                <TourGallery images={tour.galleryImages} heading={locale === "ar" ? "معرض الرحلة" : "Tour Gallery"} />
              </div>
              <Link href={localizedHref(locale, "/tours")} className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-bold text-deep-ocean outline-none hover:text-ocean focus-visible:ring-2 focus-visible:ring-ocean"><ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />{labels.back}</Link>
            </div>
            <TourBookingCard tour={tour} bookingHref={book} whatsappHref={siteSettingsPlaceholder.contact.whatsappUrl} locale={locale} labels={{ duration: labels.duration, pricing: labels.pricing, from: labels.from, book: labels.bookTour, whatsapp: labels.whatsapp, reassurance: labels.reassurance }} />
          </div>
        </Container>
      </Section>
    </main>
  );
}
