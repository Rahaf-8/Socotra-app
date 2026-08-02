import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/i18n/routing";
import type { FooterNavigationGroup, NavigationItem } from "@/types/navigation";

export function getNavigation(locale: Locale, dictionary: Dictionary) {
  const mainNavigation: NavigationItem[] = [
    { href: localizedHref(locale, "/"), label: dictionary.navigation.home },
    { href: localizedHref(locale, "/tours"), label: dictionary.navigation.tours },
    { href: localizedHref(locale, "/about"), label: dictionary.navigation.about },
    { href: localizedHref(locale, "/gallery"), label: dictionary.navigation.gallery },
    { href: localizedHref(locale, "/faq"), label: dictionary.navigation.faq },
    { href: localizedHref(locale, "/contact"), label: dictionary.navigation.contact },
  ];
  const footerNavigation: FooterNavigationGroup[] = [
    { title: dictionary.navigation.quickLinks, links: mainNavigation },
    {
      title: dictionary.navigation.plan,
      links: [
        { href: localizedHref(locale, "/booking"), label: dictionary.navigation.booking },
        { href: localizedHref(locale, "/privacy"), label: dictionary.navigation.privacy },
        { href: localizedHref(locale, "/terms"), label: dictionary.navigation.terms },
      ],
    },
  ];
  return {
    mainNavigation,
    footerNavigation,
    bookingNavigationItem: { href: localizedHref(locale, "/booking"), label: dictionary.navigation.booking },
  };
}
