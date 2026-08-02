import { formatMoney } from "@/lib/tours/format-tour-price";
import type { TourExtra } from "@/types/tour";
export function TourExtras({ extras, locale, heading, note }: { extras?: readonly TourExtra[]; locale: string; heading: string; note: string }) {
  if (!extras?.length) return null;
  return <section aria-labelledby="extras-heading"><h2 id="extras-heading" className="font-display text-4xl font-semibold text-charcoal">{heading}</h2><ul className="mt-6 space-y-3">{extras.map(extra=><li key={extra.id} className="flex flex-col justify-between gap-1 rounded-xl border border-warm-line p-4 sm:flex-row"><span>{extra.label}</span>{extra.referencePrice&&extra.currency?<strong>{formatMoney(extra.referencePrice,extra.currency,locale)}</strong>:null}</li>)}</ul><p className="mt-4 text-sm leading-6 text-charcoal/62">{note}</p></section>;
}
