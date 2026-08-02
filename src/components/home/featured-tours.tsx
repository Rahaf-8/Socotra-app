import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TourCard } from "@/components/tours/tour-card";
import type { TourCardData } from "@/types/tour";
import type { Locale } from "@/i18n/config";
import { tourHref } from "@/i18n/routing";

export type FeaturedToursContent = {
  eyebrow: string;
  heading: string;
  description: string;
  action: {
    label: string;
    href: string;
  };
  placeholderNotice: string;
};

type FeaturedToursProps = {
  content: FeaturedToursContent;
  tours: readonly TourCardData[];
  locale: Locale;
  labels: { view: string; from: string; perPerson: string; contactPricing: string };
};

export function FeaturedTours({ content, tours, locale, labels }: FeaturedToursProps) {
  return (
    <Section
      aria-labelledby="featured-tours-heading"
      className="bg-soft-sand"
    >
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean sm:text-sm">
              {content.eyebrow}
            </p>
            <h2
              id="featured-tours-heading"
              className="mt-4 max-w-[18ch] text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.025em] text-charcoal sm:text-5xl lg:text-6xl"
            >
              {content.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-charcoal/72 sm:text-lg sm:leading-8">
              {content.description}
            </p>
            <p className="mt-4 inline-flex rounded-full border border-ocean/15 bg-white/70 px-3.5 py-2 text-xs font-semibold text-deep-ocean">
              {content.placeholderNotice}
            </p>
          </div>

          <Link
            href={content.action.href}
            className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full border border-charcoal/16 bg-white px-6 text-sm font-bold text-charcoal shadow-sm outline-none transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-ocean hover:bg-ocean hover:text-white focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-4 focus-visible:ring-offset-soft-sand"
          >
            {content.action.label}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-12 grid items-stretch gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-7">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} href={tourHref(locale, tour.slug)} locale={locale} labels={labels} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
