import Image from "next/image";

import { Container } from "@/components/layout/container";
import type { AboutHero as AboutHeroData } from "@/types/about";

type AboutHeroProps = {
  content: AboutHeroData;
};

export function AboutHero({ content }: AboutHeroProps) {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative isolate flex min-h-[40rem] items-end overflow-hidden bg-charcoal text-white sm:min-h-[44rem] lg:min-h-[48rem]"
    >
      <Image
        src={content.image.src}
        alt={content.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[66%_center] sm:object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,25,24,0.2)_0%,rgba(17,25,24,0.4)_42%,rgba(17,25,24,0.94)_100%)]"
      />
      <Container className="relative pb-16 pt-36 sm:pb-20 lg:pb-24">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand sm:text-sm">
            {content.eyebrow}
          </p>
          <h1
            id="about-hero-heading"
            className="mt-5 max-w-[13ch] text-balance font-display text-[clamp(3.25rem,7vw,6rem)] font-semibold leading-[0.94] tracking-[-0.03em]"
          >
            {content.title}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
            {content.description}
          </p>
        </div>
      </Container>
    </section>
  );
}
