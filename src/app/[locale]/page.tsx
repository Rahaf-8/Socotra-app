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
import { getHomeContent } from "@/i18n/content/home";
import { getTourUI } from "@/i18n/content/tours";
import { languageAlternates } from "@/i18n/routing";
import { getPublishedTours } from "@/lib/tours/tour-repository";
import { getPublishedGalleryContent } from "@/lib/gallery/gallery-repository";
import { getApprovedReviews } from "@/lib/reviews/review-repository";

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
  const tours = (await getPublishedTours(locale)).filter((tour) => tour.featured);
  const labels = getTourUI(locale).labels;
  const gallery = (await getPublishedGalleryContent(locale)).items.filter((item) => item.featured).slice(0,6);
  const reviewData = await getApprovedReviews(locale);
  return (
    <main>
      <Hero content={content.hero}/>
      <FeaturedTours content={content.featuredTours} tours={tours} locale={locale} labels={{view:labels.viewTour,from:labels.from,perPerson:labels.perPerson,contactPricing:labels.contactPricing}}/>
      <WhySocotra content={content.whySocotra}/>
      <FlightInformation content={content.flights}/>
      <GalleryPreview content={content.gallery} items={gallery}/>
      <ReviewsSection content={content.reviews} summary={reviewData.summary} reviews={reviewData.reviews} locale={locale} labels={locale==="ar"?{outOfFive:"من أصل 5 نجوم",basedOn:"استنادًا إلى",reviews:"مراجعة",submittedBy:"تجربة ضيف معتمدة"}:{outOfFive:"out of 5 stars",basedOn:"Based on",reviews:"reviews",submittedBy:"Approved guest experience"}}/>
      <CTASection content={content.finalCTA}/>
    </main>
  );
}
