import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { AboutHighlight } from "@/types/about";

type AboutHighlightsProps = {
  items: readonly AboutHighlight[];
  labels?: { eyebrow: string; heading: string };
};

export function AboutHighlights({ items, labels }: AboutHighlightsProps) {
  const visibleItems = items
    .filter((item) => item.published && item.title && item.description)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby="about-highlights-heading" className="bg-soft-sand">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean sm:text-sm">
              {labels?.eyebrow ?? "Why Socotra Is Unique"}
            </p>
            <h2
              id="about-highlights-heading"
              className="mt-4 text-balance font-display text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.025em]"
            >
              {labels?.heading ?? "One Island, Many Stories"}
            </h2>
          </header>
          <div className="grid gap-x-8 sm:grid-cols-2 lg:col-span-8">
            {visibleItems.map((item) => (
              <article key={item.id} className="border-t border-warm-line py-6">
                <h3 className="text-base font-bold text-charcoal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-charcoal/68">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
