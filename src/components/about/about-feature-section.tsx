import Image from "next/image";
import { clsx } from "clsx";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { AboutFeatureSection as AboutFeatureSectionData } from "@/types/about";

type AboutFeatureSectionProps = {
  content: AboutFeatureSectionData;
  tone?: "light" | "dark";
};

export function AboutFeatureSection({
  content,
  tone = "light",
}: AboutFeatureSectionProps) {
  const items = content.items
    .filter((item) => item.published && item.title && item.description)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (!content.published || items.length === 0) {
    return null;
  }

  const isDark = tone === "dark";

  return (
    <Section
      id={content.id}
      aria-labelledby={`${content.id}-heading`}
      className={isDark ? "bg-charcoal text-white" : "bg-white"}
    >
      <Container>
        <header className="max-w-3xl">
          {content.eyebrow ? (
            <p
              className={clsx(
                "text-xs font-bold uppercase tracking-[0.22em] sm:text-sm",
                isDark ? "text-ocean-light" : "text-ocean",
              )}
            >
              {content.eyebrow}
            </p>
          ) : null}
          <h2
            id={`${content.id}-heading`}
            className="mt-4 text-balance font-display text-[clamp(2.75rem,5vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.025em]"
          >
            {content.title}
          </h2>
          {content.description ? (
            <p
              className={clsx(
                "mt-6 max-w-2xl text-base leading-8 sm:text-lg",
                isDark ? "text-white/70" : "text-charcoal/70",
              )}
            >
              {content.description}
            </p>
          ) : null}
        </header>

        <div className="mt-12 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className={clsx(
                "border-t py-7 sm:py-8",
                isDark ? "border-white/15" : "border-warm-line",
              )}
            >
              {item.image ? (
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <h3 className="font-display text-2xl font-semibold">
                {item.title}
              </h3>
              <p
                className={clsx(
                  "mt-3 text-sm leading-7 sm:text-base",
                  isDark ? "text-white/66" : "text-charcoal/68",
                )}
              >
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
