import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";

export type HeroContent = {
  eyebrow: string;
  heading: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction: {
    label: string;
    href: string;
  };
  trustLine: string;
  image: {
    src: string;
    alt: string;
  };
};

type HeroProps = {
  content: HeroContent;
};

export function Hero({ content }: HeroProps) {
  return (
    <section
      aria-labelledby="homepage-hero-heading"
      className="relative isolate flex min-h-[46rem] h-[100svh] items-center overflow-hidden bg-charcoal text-white lg:min-h-[48rem]"
    >
      <Image
        src={content.image.src}
        alt={content.image.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover object-[68%_center] lg:object-center"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,27,26,0.88)_0%,rgba(18,27,26,0.68)_44%,rgba(18,27,26,0.2)_75%,rgba(18,27,26,0.28)_100%)] max-md:bg-[linear-gradient(180deg,rgba(18,27,26,0.58)_0%,rgba(18,27,26,0.78)_48%,rgba(18,27,26,0.9)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal/55 to-transparent"
      />

      <Container className="relative z-10 flex min-h-full items-center pb-14 pt-32 sm:pb-16 sm:pt-36 lg:pb-20 lg:pt-40">
        <div className="max-w-3xl">
          <p className="hero-reveal text-xs font-bold uppercase tracking-[0.24em] text-sand sm:text-sm">
            {content.eyebrow}
          </p>

          <h1
            id="homepage-hero-heading"
            className="hero-reveal hero-reveal-delay-1 mt-5 max-w-[13ch] text-balance font-display text-[clamp(3rem,7vw,5.75rem)] font-semibold leading-[0.94] tracking-[-0.025em]"
          >
            {content.heading}
          </h1>

          <p className="hero-reveal hero-reveal-delay-2 mt-7 max-w-2xl text-base leading-7 text-white/88 sm:text-lg sm:leading-8">
            {content.description}
          </p>

          <div className="hero-reveal hero-reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={content.primaryAction.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-ocean px-7 text-sm font-bold text-white shadow-lg shadow-charcoal/20 transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-deep-ocean hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:min-h-13 sm:text-base"
            >
              {content.primaryAction.label}
            </Link>
            <Link
              href={content.secondaryAction.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/55 bg-white/8 px-7 text-sm font-bold text-white backdrop-blur-sm transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:min-h-13 sm:text-base"
            >
              {content.secondaryAction.label}
            </Link>
          </div>

          <p className="hero-reveal hero-reveal-delay-4 mt-8 border-s border-sand/70 ps-4 text-sm font-semibold leading-6 text-white/82 sm:text-base">
            {content.trustLine}
          </p>
        </div>
      </Container>
    </section>
  );
}
