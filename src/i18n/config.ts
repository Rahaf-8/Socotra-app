export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeDetails: Record<
  Locale,
  { label: string; shortLabel: string; dir: "ltr" | "rtl" }
> = {
  en: { label: "English", shortLabel: "EN", dir: "ltr" },
  ar: { label: "العربية", shortLabel: "العربية", dir: "rtl" },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function assertLocale(value: string): asserts value is Locale {
  if (!isLocale(value)) {
    throw new Error(`Unsupported locale: ${value}`);
  }
}
