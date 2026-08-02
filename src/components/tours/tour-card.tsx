import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { TourCardData } from "@/types/tour";
import { formatMoney, getLowestTourPrice } from "@/lib/tours/format-tour-price";

type TourCardProps = {
  tour: TourCardData;
  href: string;
  locale: string;
  labels: { view: string; from: string; perPerson: string; contactPricing: string };
};

export function TourCard({ tour, href, locale, labels }: TourCardProps) {
  const lowestPrice = getLowestTourPrice(tour);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-warm-line/70 bg-white shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Image
          src={tour.featuredImage.src}
          alt={tour.featuredImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          style={{ objectPosition: tour.featuredImage.focalPoint }}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025] group-focus-within:scale-[1.025]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal/35 to-transparent"
        />
        <p className="absolute bottom-4 start-4 rounded-full bg-white/92 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-charcoal shadow-sm backdrop-blur-sm">
          {tour.packageLabel}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-display text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-charcoal">
          {tour.title}
        </h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-ocean">
          {tour.tourType}
        </p>
        <p className="mt-3 text-sm font-semibold text-charcoal/58">
          {tour.durationLabel}
        </p>
        <p className="mt-4 flex-1 text-[0.95rem] leading-7 text-charcoal/72">
          {tour.shortDescription}
        </p>
        <p className="mt-5 font-bold text-charcoal">
          {lowestPrice
            ? `${labels.from} ${formatMoney(lowestPrice.pricePerPerson, lowestPrice.currency, locale)} ${labels.perPerson}`
            : labels.contactPricing}
        </p>
        <Link
          href={href}
          aria-label={`${labels.view}: ${tour.title}`}
          className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full text-sm font-bold text-deep-ocean outline-none transition-colors hover:text-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-4"
        >
          {labels.view}
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  );
}
