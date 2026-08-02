export type FAQCategory =
  | "travel"
  | "weather"
  | "activities"
  | "safety"
  | "accommodation"
  | "connectivity"
  | "visa"
  | "restrictions"
  | "booking";

export type FAQAnswerBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "subheading"; text: string }
  | { type: "quote"; text: string };

export type FAQItem = {
  id: string;
  question: string;
  answer: readonly FAQAnswerBlock[];
  category: FAQCategory;
  displayOrder: number;
  published: boolean;
};

export type FAQCategoryDefinition = {
  key: FAQCategory;
  label: string;
  displayOrder: number;
};
