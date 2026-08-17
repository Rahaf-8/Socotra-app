export type TourImage = {
  src: string;
  alt: string;
  focalPoint?: string;
};

export type TourPricingTier = {
  id: string;
  label: string;
  minGuests?: number;
  maxGuests?: number;
  pricePerPerson: number;
  currency: string;
  note?: string;
  displayOrder: number;
};

export type BookingTourOption = {
  slug: string;
  packageLabel: string;
  title: string;
};

export type TourExtra = {
  id: string;
  label: string;
  referencePrice?: number;
  currency?: string;
};

export type TourItineraryDay = {
  day: number;
  title: string;
  description: string;
  overnight?: string;
  location?: string;
  image?: TourImage;
  needsClientConfirmation?: boolean;
};

export type Tour = {
  id: string;
  slug: string;
  packageLabel: string;
  title: string;
  tourType: string;
  shortDescription: string;
  fullDescription: string;
  durationDays?: number;
  durationLabel?: string;
  galleryImages?: readonly TourImage[];
  pricingTiers?: readonly TourPricingTier[];
  pricingAvailabilityLabel?: string;
  included?: readonly string[];
  excluded?: readonly string[];
  requiredExtras?: readonly TourExtra[];
  accommodationNote?: string;
  practicalNote?: string;
  itinerary?: readonly TourItineraryDay[];
  needsClientConfirmation?: boolean;
  internalContentNotes?: readonly string[];
  featuredImage: TourImage;
  published: boolean;
  displayOrder: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type TourCardData = Tour;
