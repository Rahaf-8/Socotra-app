export type AboutImage = {
  src: string;
  alt: string;
};

export type AboutHero = {
  eyebrow: string;
  title: string;
  description: string;
  image: AboutImage;
};

export type EditorialSection = {
  id: string;
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  image?: AboutImage;
  displayOrder: number;
  published: boolean;
};

export type AboutFeatureItem = {
  id: string;
  title: string;
  description: string;
  image?: AboutImage;
  displayOrder: number;
  published: boolean;
};

export type AboutFeatureSection = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  items: readonly AboutFeatureItem[];
  displayOrder: number;
  published: boolean;
};

export type AboutHighlight = {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  published: boolean;
};

export type AboutCTA = {
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

export type AboutSEO = {
  title: string;
  description: string;
  image?: string;
};

export type AboutPageData = {
  hero: AboutHero;
  island: EditorialSection;
  geography: EditorialSection;
  flora: AboutFeatureSection;
  fauna: AboutFeatureSection;
  culture: EditorialSection;
  history: AboutFeatureSection;
  highlights: readonly AboutHighlight[];
  cta: AboutCTA;
  seo: AboutSEO;
};
