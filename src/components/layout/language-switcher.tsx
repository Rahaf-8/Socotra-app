"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { localeDetails, locales, type Locale } from "@/i18n/config";
import { replacePathLocale } from "@/i18n/routing";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
  compact?: boolean;
};

export function LanguageSwitcher({ locale, label, compact }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <nav aria-label={label} className="flex items-center gap-1 rounded-full border border-current/20 p-1">
      {locales.map((targetLocale) => {
        const path = replacePathLocale(pathname, targetLocale);
        const href = query ? `${path}?${query}` : path;
        const active = targetLocale === locale;
        return (
          <Link
            key={targetLocale}
            href={href}
            lang={targetLocale}
            hrefLang={targetLocale}
            aria-current={active ? "page" : undefined}
            onClick={(event) => {
              if (!window.location.hash) return;
              event.preventDefault();
              window.location.assign(`${href}${window.location.hash}`);
            }}
            className={`inline-flex min-h-9 items-center justify-center rounded-full px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-light ${active ? "bg-ocean text-white" : "hover:bg-current/10"}`}
          >
            {compact ? localeDetails[targetLocale].shortLabel : localeDetails[targetLocale].label}
          </Link>
        );
      })}
    </nav>
  );
}
