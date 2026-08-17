import type { PublicSiteSettings } from "@/types/site-settings";

const CLIENT_INFORMATION_REQUIRED = "Client Information Required";

/**
 * Temporary public settings used until database-managed Site Settings and
 * approved client information are available.
 */
export const siteSettingsPlaceholder: PublicSiteSettings = {
  companyName: CLIENT_INFORMATION_REQUIRED,
  companyDescription: CLIENT_INFORMATION_REQUIRED,
  logo: {
    src: "/logo.png",
    alt: "Socotra Interface Eco Tours logo",
  },
  contact: {
    email: CLIENT_INFORMATION_REQUIRED,
    phone: CLIENT_INFORMATION_REQUIRED,
    whatsapp: "+967 782 333 969",
    whatsappUrl:
      "https://wa.me/967782333969?text=Hello%2C%20I%20am%20interested%20in%20planning%20a%20trip%20to%20Socotra.%20Please%20send%20me%20more%20information.",
    address: CLIENT_INFORMATION_REQUIRED,
  },
  socialLinks: [{ label: CLIENT_INFORMATION_REQUIRED, href: null }],
  instagram: {
    label: CLIENT_INFORMATION_REQUIRED,
    href: null,
    profileImage: null,
    username: null,
    bio: null,
    buttonLabel: "Follow on Instagram",
  },
  reviewPlatforms: {
    tripadvisorUrl: null,
    googleReviewsUrl: null,
  },
  copyrightOwner: CLIENT_INFORMATION_REQUIRED,
};
