import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/home/cta-section";
import { FeaturedTours } from "@/components/home/featured-tours";
import { FlightInformation } from "@/components/home/flight-information";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Hero } from "@/components/home/hero";
import { ReviewsSection } from "@/components/home/reviews-section";
import { WhySocotra } from "@/components/home/why-socotra";
import { siteSettingsPlaceholder } from "@/config/site-settings";
import { isLocale } from "@/i18n/config";
import { getGalleryContent } from "@/i18n/content/gallery";
import { getHomeContent } from "@/i18n/content/home";
import { getTours, getTourUI } from "@/i18n/content/tours";
import { languageAlternates } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getHomeContent(locale, siteSettingsPlaceholder.contact.whatsappUrl);
  return { title: content.metadata.title, description: content.metadata.description, alternates: { languages: languageAlternates("/") }, openGraph: { title: content.metadata.title, description: content.metadata.description, type: "website", url: `/${locale}` } };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getHomeContent(locale, siteSettingsPlaceholder.contact.whatsappUrl);
  const tours = getTours(locale).filter((tour) => tour.featured && tour.published).sort((a,b) => a.displayOrder-b.displayOrder);
  const labels = getTourUI(locale).labels;
  const gallery = getGalleryContent(locale).items.filter((item) => item.published).sort((a,b) => a.displayOrder-b.displayOrder).slice(0,6);
  return (
    <main>
      <Hero content={content.hero}/>
      <FeaturedTours content={content.featuredTours} tours={tours} locale={locale} labels={{view:labels.viewTour,from:labels.from,perPerson:labels.perPerson,contactPricing:labels.contactPricing}}/>
      <WhySocotra content={content.whySocotra}/>
      <FlightInformation content={content.flights}/>
      <GalleryPreview content={content.gallery} items={gallery}/>
      <ReviewsSection content={content.reviews} summary={content.reviewsSummary} reviews={content.reviewItems} labels={locale==="ar"?{outOfFive:"من أصل 5 نجوم",basedOn:"استنادًا إلى",reviews:"مراجعة",readOn:"اقرأ على",newTab:"يفتح في علامة تبويب جديدة"}:{outOfFive:"out of 5 stars",basedOn:"Based on",reviews:"reviews",readOn:"Read on",newTab:"opens in a new tab"}}/>
      <CTASection content={content.finalCTA}/>
    </main>
  );
}
