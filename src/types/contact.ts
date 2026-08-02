export type ContactMethodType =
  | "email"
  | "phone"
  | "whatsapp"
  | "location"
  | "social";

export type ContactMethod = {
  id: string;
  type: ContactMethodType;
  label: string;
  value?: string;
  href?: string;
  description?: string;
  icon?: ContactMethodType;
  displayOrder: number;
  published: boolean;
  external?: boolean;
};

export type ContactFormOption = {
  id: string;
  label: string;
  value: string;
  displayOrder: number;
  published: boolean;
};

export type ContactPageData = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  intro?: {
    title: string;
    description: string;
  };
  methods: readonly ContactMethod[];
  form: {
    eyebrow?: string;
    title: string;
    description?: string;
    submitLabel: string;
    submittingLabel: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
    unavailableMessage: string;
  };
  enquiryTypes: readonly ContactFormOption[];
  guidance?: {
    eyebrow?: string;
    title: string;
    description?: string;
    items: readonly {
      id: string;
      text: string;
      displayOrder: number;
      published: boolean;
    }[];
    faqAction?: {
      label: string;
      href: string;
    };
  };
  bookingCTA?: {
    eyebrow?: string;
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
