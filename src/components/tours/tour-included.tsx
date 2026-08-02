import { Check } from "lucide-react";
export function TourIncluded({ items, heading }: { items?: readonly string[]; heading: string }) {
  if (!items?.length) return null;
  return <section aria-labelledby="included-heading"><h2 id="included-heading" className="font-display text-4xl font-semibold text-charcoal">{heading}</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{items.map(item=><li key={item} className="flex gap-3 leading-7 text-charcoal/70"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-palm"/>{item}</li>)}</ul></section>;
}
