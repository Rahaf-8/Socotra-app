import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ReviewsGrid } from "@/components/reviews/reviews-grid";
import { ReviewsSummary } from "@/components/reviews/reviews-summary";
import type { Review, ReviewsSummaryData } from "@/types/review";

export type ReviewsSectionContent = {
  enabled: boolean;
  isPlaceholder: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  readMoreAction: {
    label: string;
    href: string;
  };
  externalAction: {
    label: string;
    href?: string;
  };
  placeholderNotice?: string;
};

type ReviewsSectionProps = {
  content: ReviewsSectionContent;
  summary: ReviewsSummaryData;
  reviews: readonly Review[];
  labels: { outOfFive: string; basedOn: string; reviews: string; readOn: string; newTab: string };
};

export function ReviewsSection({
  content,
  summary,
  reviews,
  labels,
}: ReviewsSectionProps) {
  const isProductionPlaceholder =
    process.env.NODE_ENV === "production" && content.isPlaceholder;

  if (!content.enabled || isProductionPlaceholder) {
    return null;
  }

  const showPlaceholderNotice =
    process.env.NODE_ENV === "development" && content.placeholderNotice;

  return (
    <Section aria-labelledby="guest-reviews-heading" className="bg-soft-sand">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean sm:text-sm">
              {content.eyebrow}
            </p>
            <h2
              id="guest-reviews-heading"
              className="mt-4 max-w-[16ch] text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.025em] text-charcoal sm:text-5xl lg:text-6xl"
            >
              {content.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-charcoal/72 sm:text-lg sm:leading-8">
              {content.description}
            </p>
            {showPlaceholderNotice ? (
              <p className="mt-5 inline-flex rounded-full border border-ocean/15 bg-white/75 px-3.5 py-2 text-xs font-semibold text-deep-ocean">
                {content.placeholderNotice}
              </p>
            ) : null}
          </div>
          <div className="lg:col-span-5">
            <ReviewsSummary summary={summary} labels={labels} />
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <ReviewsGrid reviews={reviews} labels={labels} />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href={content.readMoreAction.href}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-charcoal px-7 text-sm font-bold text-white outline-none transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-deep-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-4 focus-visible:ring-offset-soft-sand"
          >
            {content.readMoreAction.label}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Link>
          {content.externalAction.href ? (
            <Link
              href={content.externalAction.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${content.externalAction.label} (${labels.newTab})`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-charcoal/16 bg-white px-7 text-sm font-bold text-charcoal outline-none transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-ocean hover:text-deep-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-4 focus-visible:ring-offset-soft-sand"
            >
              {content.externalAction.label}
              <ExternalLink aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
