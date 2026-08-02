import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Container } from "@/components/layout/container";

export type ToursPageCTAContent = {
  heading: string;
  primaryAction: {
    label: string;
    href: string;
  };
  whatsappAction: {
    label: string;
    href: string;
  };
};

type ToursPageCTAProps = {
  content: ToursPageCTAContent;
};

export function ToursPageCTA({ content }: ToursPageCTAProps) {
  return (
    <Container>
      <aside className="rounded-[2rem] bg-deep-ocean px-6 py-12 text-center text-white shadow-soft sm:px-10 sm:py-14 lg:px-16">
        <h2 className="text-balance font-display text-4xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
          {content.heading}
        </h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={content.primaryAction.href}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ocean px-7 text-sm font-bold text-white outline-none transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-ocean-light hover:text-charcoal focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep-ocean"
          >
            {content.primaryAction.label}
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Link>
          <Link
            href={content.whatsappAction.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/8 px-7 text-sm font-bold text-white outline-none transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep-ocean"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            {content.whatsappAction.label}
          </Link>
        </div>
      </aside>
    </Container>
  );
}
