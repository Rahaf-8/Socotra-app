import type { GalleryPageData } from "@/types/gallery";

const socotraLandscapeImage = "/socotra-hero-placeholder.png";

export const galleryPageData = {
  hero: {
    eyebrow: "Explore Socotra",
    title: "Moments from the Island",
    description:
      "Discover Socotra through its landscapes, wildlife, culture and unforgettable journeys.",
  },
  categories: [
    { id: "all", label: "All", displayOrder: 1, published: true },
    { id: "flora", label: "Flora", displayOrder: 2, published: true },
  ],
  items: [
    {
      id: "dragons-blood-trees-over-sea",
      title: "Dragon's Blood Trees",
      description:
        "Distinctive Dragon's Blood Trees across a rocky island plateau above the sea.",
      imageUrl: socotraLandscapeImage,
      altText:
        "Dragon's Blood Trees on a rocky Socotra plateau overlooking the sea.",
      category: "flora",
      featured: true,
      displayOrder: 1,
      published: true,
    },
  ],
  instagram: {
    eyebrow: "Follow the Journey",
    title: "Instagram Feed",
    description:
      "See more moments from our journeys, camps and life across Socotra Island.",
    posts: [
      {
        id: "instagram-placeholder-dragons-blood-trees",
        imageUrl: socotraLandscapeImage,
        altText:
          "Temporary Instagram preview showing Dragon's Blood Trees on a rocky Socotra plateau.",
        caption:
          "A temporary preview of how approved Instagram photography will appear.",
        type: "image",
        displayOrder: 1,
        published: true,
        placeholder: true,
      },
    ],
    published: true,
  },
  cta: {
    title: "Experience Socotra for Yourself",
    description:
      "Explore our journeys and discover the landscapes behind these moments.",
    primaryAction: {
      label: "Explore Our Tours",
      href: "/tours",
    },
    secondaryAction: {
      label: "Plan Your Journey",
      href: "/booking",
    },
  },
  seo: {
    title: "Socotra Gallery | Landscapes, Wildlife and Island Journeys",
    description:
      "Explore photographs of Socotra's landscapes, coastlines, distinctive flora, wildlife, culture and unforgettable island journeys.",
    image: socotraLandscapeImage,
  },
} satisfies GalleryPageData;

export const publishedGalleryItems = galleryPageData.items
  .filter((item) => item.published)
  .sort((a, b) => a.displayOrder - b.displayOrder);

export const homepageGalleryItems = publishedGalleryItems.slice(0, 6);
