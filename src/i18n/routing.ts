import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export type PublicRoute =
  | "/"
  | "/tours"
  | "/about"
  | "/faq"
  | "/gallery"
  | "/contact"
  | "/booking"
  | "/privacy"
  | "/terms";

export function localizedHref(locale: Locale, path: PublicRoute): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function tourHref(locale: Locale, slug: string): string {
  return `/${locale}/tours/${encodeURIComponent(slug)}`;
}

export function bookingHref(locale: Locale, slug?: string): string {
  const base = localizedHref(locale, "/booking");
  return slug ? `${base}?tour=${encodeURIComponent(slug)}` : base;
}

export function replacePathLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) segments[0] = locale;
  else segments.unshift(locale);
  return `/${segments.join("/")}`;
}

export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isLocale(segment) ? segment : defaultLocale;
}

export function languageAlternates(path: PublicRoute | string) {
  const normalized = path === "/" ? "" : path;
  return {
    en: `/en${normalized}`,
    ar: `/ar${normalized}`,
  };
}
