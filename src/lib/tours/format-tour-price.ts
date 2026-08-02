import type { Tour } from "@/types/tour";

export function getLowestTourPrice(tour: Tour) {
  if (!tour.pricingTiers?.length) return null;
  return [...tour.pricingTiers].sort(
    (a, b) => a.pricePerPerson - b.pricePerPerson,
  )[0];
}

export function formatMoney(amount: number, currency: string, locale = "en") {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
