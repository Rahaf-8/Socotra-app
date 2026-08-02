import { Container } from "@/components/layout/container";

export type ToursPageHeroContent = {
  eyebrow: string;
  heading: string;
  description: string;
  placeholderNotice?: string;
};

type ToursPageHeroProps = {
  content: ToursPageHeroContent;
};

export function ToursPageHero({ content }: ToursPageHeroProps) {
  const showPlaceholderNotice =
    process.env.NODE_ENV === "development" && content.placeholderNotice;

  return (
    <section
      aria-labelledby="tours-page-heading"
      className="relative isolate overflow-hidden bg-charcoal pb-20 pt-36 text-white sm:pb-24 sm:pt-40 lg:pb-28 lg:pt-44"
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 top-0 size-[28rem] rounded-full bg-ocean/18 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(32,40,39,0.98)_0%,rgba(32,40,39,0.9)_58%,rgba(7,93,97,0.62)_100%)]"
      />

      <Container className="relative">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand sm:text-sm">
            {content.eyebrow}
          </p>
          <h1
            id="tours-page-heading"
            className="mt-5 max-w-[15ch] text-balance font-display text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.96] tracking-[-0.025em]"
          >
            {content.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
            {content.description}
          </p>
          {showPlaceholderNotice ? (
            <p className="mt-5 inline-flex rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-xs font-semibold text-white/75">
              {content.placeholderNotice}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
