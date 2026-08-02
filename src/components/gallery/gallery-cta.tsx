import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { GalleryPageData } from "@/types/gallery";

type GalleryCTAProps = {
  content: GalleryPageData["cta"];
};

export function GalleryCTA({ content }: GalleryCTAProps) {
  return (
    <Section className="bg-white">
      <Container>
        <aside className="rounded-[2rem] bg-deep-ocean px-6 py-12 text-center text-white shadow-soft sm:px-10 sm:py-14">
          <h2 className="text-balance font-display text-4xl font-semibold sm:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/72 sm:text-lg">
            {content.description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={content.primaryAction.href}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ocean px-7 text-sm font-bold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-ocean-light hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep-ocean"
            >
              {content.primaryAction.label}
              <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
            </Link>
            {content.secondaryAction ? (
              <Link
                href={content.secondaryAction.href}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-7 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep-ocean"
              >
                {content.secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </aside>
      </Container>
    </Section>
  );
}
