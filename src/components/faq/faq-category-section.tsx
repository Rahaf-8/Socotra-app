import { FAQAccordion } from "@/components/faq/faq-accordion";
import type { FAQCategoryDefinition, FAQItem } from "@/types/faq";

type FAQCategorySectionProps = {
  category: FAQCategoryDefinition;
  items: readonly FAQItem[];
};

export function FAQCategorySection({
  category,
  items,
}: FAQCategorySectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id={`faq-${category.key}`}
      aria-labelledby={`faq-${category.key}-heading`}
      className="scroll-mt-28"
    >
      <h2
        id={`faq-${category.key}-heading`}
        className="mb-6 font-display text-3xl font-semibold tracking-[-0.02em] text-charcoal sm:text-4xl"
      >
        {category.label}
      </h2>
      <FAQAccordion items={items} />
    </section>
  );
}
