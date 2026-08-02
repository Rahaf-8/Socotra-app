export type GalleryCategory =
  | "landscapes"
  | "coastlines"
  | "flora"
  | "wildlife"
  | "culture"
  | "camping"
  | "experiences";

export type GalleryCategoryData = {
  id: GalleryCategory | "all";
  label: string;
  displayOrder: number;
  published: boolean;
};

export type GalleryItemData = {
  id: string;
  imageUrl: string;
  altText: string;
  title: string;
  description?: string;
  category: GalleryCategory;
  location?: string;
  featured: boolean;
  displayOrder: number;
  published: boolean;
};

export type GalleryPreviewItemData = Pick<
  GalleryItemData,
  "id" | "imageUrl" | "altText" | "title" | "displayOrder"
>;

export type InstagramPostType = "image" | "video" | "carousel";

export type InstagramPostData = {
  id: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  postUrl?: string;
  type: InstagramPostType;
  displayOrder: number;
  published: boolean;
  placeholder: boolean;
};

export type GalleryPageData = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  categories: readonly GalleryCategoryData[];
  items: readonly GalleryItemData[];
  instagram: {
    eyebrow?: string;
    title: string;
    description?: string;
    posts: readonly InstagramPostData[];
    published: boolean;
  };
  cta: {
    title: string;
    description: string;
    primaryAction: {
      label: string;
      href: string;
    };
    secondaryAction?: {
      label: string;
      href: string;
    };
  };
  seo: {
    title: string;
    description: string;
    image?: string;
  };
};
