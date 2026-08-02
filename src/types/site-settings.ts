export type PublicSiteSettings = {
  companyName: string;
  companyDescription: string;
  logo: {
    src: string;
    alt: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    whatsappUrl: string;
    address: string;
  };
  socialLinks: Array<{
    label: string;
    href: string | null;
  }>;
  instagram: {
    label: string;
    href: string | null;
    profileImage: {
      src: string;
      alt: string;
    } | null;
    username: string | null;
    bio: string | null;
    buttonLabel: string;
  };
  reviewPlatforms: {
    tripadvisorUrl: string | null;
    googleReviewsUrl: string | null;
  };
  copyrightOwner: string;
};
