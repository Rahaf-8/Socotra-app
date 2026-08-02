export const en = {
  navigation: {
    home: "Home", tours: "Tours", about: "About", gallery: "Gallery",
    faq: "FAQ", contact: "Contact", booking: "Book Your Trip",
    quickLinks: "Quick links", plan: "Plan", privacy: "Privacy", terms: "Terms",
    contactHeading: "Contact", socialHeading: "Social links",
    menuOpen: "Open navigation menu", menuClose: "Close navigation menu",
  },
  language: { change: "Change language", current: "Current language" },
  common: {
    exploreTours: "Explore Tours", planTrip: "Plan Your Trip", viewTour: "View Tour",
    bookTour: "Book This Tour", whatsapp: "WhatsApp", backTours: "Back to All Tours",
    from: "From", perPerson: "per person", contactPricing: "Contact for Dates & Pricing",
    clientApproval: "Temporary development content · Client approval required",
    externalNewTab: "opens in a new tab", loadMore: "Load More", close: "Close",
    previous: "Previous", next: "Next", imagePost: "Image post", videoPost: "Video post",
    carouselPost: "Carousel post",
  },
  notFound: {
    eyebrow: "Page not found", title: "This Journey Could Not Be Found",
    description: "The page you requested may have moved or is no longer available.",
    home: "Return Home", tours: "Explore Tours",
  },
} as const;

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> };
export type Dictionary = DeepString<typeof en>;
