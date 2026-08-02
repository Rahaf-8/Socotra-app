import { Container } from "@/components/layout/container";
import type { ContactPageData } from "@/types/contact";

type ContactHeroProps = {
  content: ContactPageData["hero"];
};

export function ContactHero({ content }: ContactHeroProps) {
  return (
    <section
      aria-labelledby="contact-page-heading"
      className="relative isolate overflow-hidden bg-charcoal pb-20 pt-36 text-white sm:pb-24 sm:pt-40 lg:pb-28"
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 top-0 size-[28rem] rounded-full bg-ocean/18 blur-3xl"
      />
      <Container className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand sm:text-sm">
          {content.eyebrow}
        </p>
        <h1
          id="contact-page-heading"
          className="mt-5 max-w-[15ch] text-balance font-display text-[clamp(3rem,7vw,5.25rem)] font-semibold leading-[0.96] tracking-[-0.025em]"
        >
          {content.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
          {content.description}
        </p>
      </Container>
    </section>
  );
}
