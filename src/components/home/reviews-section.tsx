import Link from "next/link";
import { ArrowDown } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ReviewsGrid } from "@/components/reviews/reviews-grid";
import { ReviewForm, type ReviewFormContent } from "@/components/reviews/review-form";
import { ReviewsSummary } from "@/components/reviews/reviews-summary";
import type { Locale } from "@/i18n/config";
import type { Review, ReviewsSummaryData } from "@/types/review";

export type ReviewsSectionContent = {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  writeAction: string;
  emptyMessage: string;
  form: ReviewFormContent;
};

type ReviewsSectionProps = {
  content: ReviewsSectionContent;
  summary: ReviewsSummaryData;
  reviews: readonly Review[];
  locale: Locale;
  labels: { outOfFive: string; basedOn: string; reviews: string; submittedBy: string };
};

export function ReviewsSection({
  content,
  summary,
  reviews,
  locale,
  labels,
}: ReviewsSectionProps) {
  if (!content.enabled) return null;

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
            <Link href="#write-review" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-charcoal px-7 text-sm font-bold text-white outline-none hover:bg-deep-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-4 focus-visible:ring-offset-soft-sand">{content.writeAction}<ArrowDown aria-hidden="true" className="size-4" /></Link>
          </div>
          <div className="lg:col-span-5">
            <ReviewsSummary summary={summary} labels={labels} />
          </div>
        </div>

        <div className="mt-12 lg:mt-16">{reviews.length ? <ReviewsGrid reviews={reviews} labels={labels} /> : <p className="rounded-2xl border bg-white p-6 text-center leading-7 text-charcoal/65 shadow-soft">{content.emptyMessage}</p>}</div>
        <div className="mt-10 lg:mt-14"><ReviewForm locale={locale} content={content.form} /></div>
      </Container>
    </Section>
  );
}
