import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GalleryItem } from "@/components/gallery/gallery-item";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { GalleryPreviewItemData } from "@/types/gallery";

export type GalleryPreviewContent = {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  action: {
    label: string;
    href: string;
  };
  placeholderNotice?: string;
};

type GalleryPreviewProps = {
  content: GalleryPreviewContent;
  items: readonly GalleryPreviewItemData[];
};

const editorialLayout = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
  "md:col-span-12",
] as const;

export function GalleryPreview({ content, items }: GalleryPreviewProps) {
  if (!content.enabled) {
    return null;
  }

  const visibleItems = [...items]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 6);
  const showPlaceholderNotice =
    process.env.NODE_ENV === "development" && content.placeholderNotice;

  return (
    <Section
      aria-labelledby="gallery-preview-heading"
      className="bg-white"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean sm:text-sm">
            {content.eyebrow}
          </p>
          <h2
            id="gallery-preview-heading"
            className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.025em] text-charcoal sm:text-5xl lg:text-6xl"
          >
            {content.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-charcoal/72 sm:text-lg sm:leading-8">
            {content.description}
          </p>
          {showPlaceholderNotice ? (
            <p className="mt-5 inline-flex rounded-full border border-ocean/15 bg-soft-sand px-3.5 py-2 text-xs font-semibold text-deep-ocean">
              {content.placeholderNotice}
            </p>
          ) : null}
        </div>

        {visibleItems.length > 0 ? (
          <div className="mt-12 grid gap-4 md:grid-cols-12 md:auto-rows-[15rem] lg:mt-16 lg:gap-5 lg:auto-rows-[17rem]">
            {visibleItems.map((item, index) => (
              <GalleryItem
                key={item.id}
                item={item}
                className={editorialLayout[index]}
                sizes={
                  index === 0 || index === 4
                    ? "(min-width: 768px) 58vw, 100vw"
                    : "(min-width: 768px) 42vw, 100vw"
                }
              />
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href={content.action.href}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-charcoal px-7 text-sm font-bold text-white shadow-sm outline-none transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-deep-ocean hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          >
            {content.action.label}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
