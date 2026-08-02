import Image from "next/image";
import { clsx } from "clsx";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { EditorialSection } from "@/types/about";

type AboutEditorialSectionProps = {
  content: EditorialSection;
  tone?: "light" | "sand";
  reverse?: boolean;
};

export function AboutEditorialSection({
  content,
  tone = "light",
  reverse = false,
}: AboutEditorialSectionProps) {
  if (!content.published || content.paragraphs.length === 0) {
    return null;
  }

  return (
    <Section
      id={content.id}
      aria-labelledby={`${content.id}-heading`}
      className={tone === "sand" ? "bg-soft-sand" : "bg-white"}
    >
      <Container>
        <div
          className={clsx(
            "grid items-start gap-10 lg:grid-cols-12 lg:gap-16 xl:gap-24",
            reverse && "lg:[&>*:first-child]:order-2",
          )}
        >
          <header className="lg:col-span-5 lg:sticky lg:top-32">
            {content.eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean sm:text-sm">
                {content.eyebrow}
              </p>
            ) : null}
            <h2
              id={`${content.id}-heading`}
              className="mt-4 text-balance font-display text-[clamp(2.75rem,5vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.025em] text-charcoal"
            >
              {content.title}
            </h2>
          </header>

          <div className="lg:col-span-7">
            {content.image ? (
              <div className="relative mb-9 aspect-[4/3] overflow-hidden rounded-[2rem] shadow-soft">
                <Image
                  src={content.image.src}
                  alt={content.image.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="space-y-6 text-base leading-8 text-charcoal/75 sm:text-lg sm:leading-9">
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
