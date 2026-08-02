import { TourCard } from "@/components/tours/tour-card";
import type { TourCardData } from "@/types/tour";
import type { Locale } from "@/i18n/config";
import { tourHref } from "@/i18n/routing";

type ToursGridProps = {
  tours: readonly TourCardData[];
  locale: Locale;
  labels: { view: string; from: string; perPerson: string; contactPricing: string };
};

export function ToursGrid({ tours, locale, labels }: ToursGridProps) {
  const publishedTours = [...tours]
    .filter((tour) => tour.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
      {publishedTours.map((tour) => (
        <TourCard key={tour.id} tour={tour} href={tourHref(locale, tour.slug)} locale={locale} labels={labels} />
      ))}
    </div>
  );
}
