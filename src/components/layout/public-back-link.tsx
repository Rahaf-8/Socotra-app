"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { localeFromPathname, localizedHref, type PublicRoute } from "@/i18n/routing";

type PublicBackLinkProps = { fallbackPath: PublicRoute; className?: string };
const labels: Record<Locale, string> = { en: "Back", ar: "رجوع" };

export function PublicBackLink({ fallbackPath, className = "" }: PublicBackLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const fallbackHref = localizedHref(locale, fallbackPath);

  function canSafelyUseHistory() {
    if (!document.referrer || window.history.length <= 1) return false;
    try {
      const previous = new URL(document.referrer);
      const previousLocale = previous.pathname.split("/").filter(Boolean)[0];
      return previous.origin === window.location.origin && previousLocale === locale && previous.href !== window.location.href;
    } catch {
      return false;
    }
  }

  return <Link href={fallbackHref} onNavigate={(event) => { if (!canSafelyUseHistory()) return; event.preventDefault(); router.back(); }} className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/10 px-3.5 text-sm font-semibold text-white/82 outline-none backdrop-blur-sm transition-[background-color,border-color,color] hover:border-white/45 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal ${className}`}>
    <ArrowLeft aria-hidden="true" className="size-4 shrink-0 rtl:rotate-180" />
    <span>{labels[locale]}</span>
  </Link>;
}
