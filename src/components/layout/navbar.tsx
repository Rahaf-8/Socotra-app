import type { NavigationItem } from "@/types/navigation";
import type { PublicSiteSettings } from "@/types/site-settings";
import type { Locale } from "@/i18n/config";

import { NavbarClient } from "./navbar-client";

type NavbarProps = {
  navigation: NavigationItem[];
  bookingItem: NavigationItem;
  settings: PublicSiteSettings;
  locale: Locale;
  labels: { home: string; primary: string; menuOpen: string; menuClose: string; changeLanguage: string };
};

export function Navbar({
  navigation,
  bookingItem,
  settings,
  locale,
  labels,
}: NavbarProps) {
  return (
    <NavbarClient
      navigation={navigation}
      bookingItem={bookingItem}
      logo={settings.logo}
      locale={locale}
      labels={labels}
    />
  );
}
