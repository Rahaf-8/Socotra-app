import { formatMoney } from "@/lib/tours/format-tour-price";
import type { Tour } from "@/types/tour";

export function TourPricing({ tour, locale, labels }: { tour: Tour; locale: string; labels: { pricing: string; perPerson: string } }) {
  if (!tour.pricingTiers?.length) return <p className="rounded-2xl bg-soft-sand p-5 font-bold text-deep-ocean">{tour.pricingAvailabilityLabel}</p>;
  return <section aria-labelledby="pricing-heading"><h2 id="pricing-heading" className="font-display text-4xl font-semibold text-charcoal">{labels.pricing}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{[...tour.pricingTiers].sort((a,b)=>a.displayOrder-b.displayOrder).map(tier=><article key={tier.id} className="rounded-2xl border border-warm-line bg-white p-5"><h3 className="font-bold text-charcoal">{tier.label}</h3><p className="mt-2 font-display text-3xl font-semibold text-deep-ocean">{formatMoney(tier.pricePerPerson,tier.currency,locale)}</p><p className="mt-1 text-sm text-charcoal/58">{labels.perPerson}</p>{tier.note?<p className="mt-3 text-sm">{tier.note}</p>:null}</article>)}</div></section>;
}
