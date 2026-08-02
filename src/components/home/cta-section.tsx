import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

type CTASectionAction = {
  label: string;
  href: string;
};

export type CTASectionContent = {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  primaryAction: CTASectionAction;
  secondaryAction: CTASectionAction;
  whatsappAction?: CTASectionAction;
  backgroundImage?: {
    src: string;
  };
  placeholderNotice?: string;
};

type CTASectionProps = {
  content: CTASectionContent;
};

export function CTASection({ content }: CTASectionProps) {
  if (!content.enabled) {
    return null;
  }

  const showPlaceholderNotice =
    process.env.NODE_ENV === "development" && content.placeholderNotice;

  return (
    <Section
      aria-labelledby="final-cta-heading"
      className="group relative isolate flex min-h-[36rem] items-center overflow-hidden bg-deep-ocean text-white sm:min-h-[40rem]"
    >
      {content.backgroundImage ? (
        <Image
          src={content.backgroundImage.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(16,32,30,0.94)_0%,rgba(17,46,42,0.82)_48%,rgba(7,93,97,0.58)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(115,201,199,0.22),transparent_34%)]"
      />

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand sm:text-sm">
            {content.eyebrow}
          </p>
          <h2
            id="final-cta-heading"
            className="mt-5 text-balance font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.025em]"
          >
            {content.heading}
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">
            {content.description}
          </p>

          {showPlaceholderNotice ? (
            <p className="mt-5 inline-flex rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-xs font-semibold text-white/75 backdrop-blur-sm">
              {content.placeholderNotice}
            </p>
          ) : null}

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={content.primaryAction.href}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ocean px-7 text-sm font-bold text-white shadow-lg shadow-black/20 outline-none transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-ocean-light hover:text-charcoal hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep-ocean sm:min-h-13 sm:text-base"
            >
              {content.primaryAction.label}
              <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
            </Link>
            <Link
              href={content.secondaryAction.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/45 bg-white/8 px-7 text-sm font-bold text-white backdrop-blur-sm outline-none transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/75 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep-ocean sm:min-h-13 sm:text-base"
            >
              {content.secondaryAction.label}
            </Link>
          </div>

          {content.whatsappAction ? (
            <Link
              href={content.whatsappAction.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white/72 outline-none transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-white/8 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep-ocean"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              {content.whatsappAction.label}
            </Link>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
