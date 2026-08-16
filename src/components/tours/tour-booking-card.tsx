import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { formatMoney, getLowestTourPrice } from "@/lib/tours/format-tour-price";
import type { Tour } from "@/types/tour";

type Props = {
  tour: Tour; bookingHref: string; whatsappHref: string; locale: string;
  labels: { duration: string; pricing: string; from: string; book: string; whatsapp: string; reassurance: string };
};
export function TourBookingCard({ tour, bookingHref, whatsappHref, locale, labels }: Props) {
  const lowest = getLowestTourPrice(tour);
  return (
    <aside className="rounded-[1.75rem] border border-warm-line bg-white p-6 shadow-soft sm:p-7 lg:sticky lg:top-28">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean">{tour.packageLabel}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal">{tour.title}</h2>
      <dl className="mt-5 space-y-3 border-y border-warm-line py-5 text-sm">
        <div className="grid grid-cols-2 gap-4"><dt className="text-charcoal/58">{labels.duration}</dt><dd className="min-w-0 break-words text-end font-bold">{tour.durationLabel}</dd></div>
        <div className="grid grid-cols-2 gap-4"><dt className="text-charcoal/58">{labels.pricing}</dt><dd className="min-w-0 break-words text-end font-bold">{lowest ? `${labels.from} ${formatMoney(lowest.pricePerPerson, lowest.currency, locale)}` : tour.pricingAvailabilityLabel}</dd></div>
      </dl>
      <div className="mt-6 grid gap-3">
        <Link href={bookingHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ocean px-6 text-sm font-bold text-white outline-none hover:bg-deep-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2">{labels.book}<ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" /></Link>
        <Link href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-charcoal/15 px-6 text-sm font-bold text-charcoal outline-none hover:border-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2"><MessageCircle aria-hidden="true" className="size-4" />{labels.whatsapp}</Link>
      </div>
      <p className="mt-5 text-sm leading-6 text-charcoal/62">{labels.reassurance}</p>
    </aside>
  );
}
