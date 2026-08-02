import "server-only";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/i18n/dictionaries/en").then((module) => module.en),
  ar: () => import("@/i18n/dictionaries/ar").then((module) => module.ar),
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
