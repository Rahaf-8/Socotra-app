import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { formatMoney, getLowestTourPrice } from "@/lib/tours/format-tour-price";
import type { Tour } from "@/types/tour";

type TourDetailHeroProps = {
  tour: Tour;
  bookingHref: string;
  whatsappHref: string;
  locale: string;
  labels: { from: string; perPerson: string; book: string; whatsapp: string };
};

export function TourDetailHero({
  tour,
  bookingHref,
  whatsappHref,
  locale,
  labels,
}: TourDetailHeroProps) {
  const lowestPrice = getLowestTourPrice(tour);

  return (
    <section
      aria-labelledby="tour-detail-heading"
      className="relative isolate flex min-h-[38rem] items-end overflow-hidden bg-charcoal pb-14 pt-32 text-white sm:min-h-[42rem] sm:pb-18"
    >
      <Image
        src={tour.featuredImage.src}
        alt={tour.featuredImage.alt}
        fill
        preload
        sizes="100vw"
        style={{ objectPosition: tour.featuredImage.focalPoint }}
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,29,28,0.28)_0%,rgba(20,29,28,0.94)_100%)]"
      />
      <Container className="relative">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sand">
            {tour.packageLabel} · {tour.tourType}
          </p>
          <h1
            id="tour-detail-heading"
            className="mt-4 max-w-[15ch] text-balance font-display text-[clamp(3.25rem,8vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.03em]"
          >
            {tour.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
            {tour.shortDescription}
          </p>
          <p className="mt-5 text-sm font-bold text-white/75">
            {tour.durationLabel} ·{" "}
            {lowestPrice
              ? `${labels.from} ${formatMoney(lowestPrice.pricePerPerson, lowestPrice.currency, locale)} ${labels.perPerson}`
              : tour.pricingAvailabilityLabel}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={bookingHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ocean px-7 text-sm font-bold text-white outline-none transition-colors hover:bg-ocean-light hover:text-charcoal focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              {labels.book}
              <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
            </Link>
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/45 bg-white/8 px-7 text-sm font-bold text-white outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              {labels.whatsapp}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
