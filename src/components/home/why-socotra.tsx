import type { LucideIcon } from "lucide-react";
import { Leaf, Mountain, Users } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const iconRegistry = {
  leaf: Leaf,
  users: Users,
  mountain: Mountain,
} satisfies Record<string, LucideIcon>;

export type WhySocotraIconKey = keyof typeof iconRegistry;

export type WhySocotraContent = {
  eyebrow: string;
  heading: string;
  description: string;
  placeholderNotice: string;
  features: readonly {
    title: string;
    description: string;
    icon: WhySocotraIconKey;
  }[];
};

type WhySocotraProps = {
  content: WhySocotraContent;
};

export function WhySocotra({ content }: WhySocotraProps) {
  return (
    <Section aria-labelledby="why-socotra-heading" className="bg-white">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean sm:text-sm">
              {content.eyebrow}
            </p>
            <h2
              id="why-socotra-heading"
              className="mt-4 max-w-[13ch] text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.025em] text-charcoal sm:text-5xl lg:text-6xl"
            >
              {content.heading}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-charcoal/72 sm:text-lg sm:leading-8">
              {content.description}
            </p>
            <p className="mt-6 inline-flex rounded-full border border-ocean/15 bg-soft-sand px-3.5 py-2 text-xs font-semibold text-deep-ocean">
              {content.placeholderNotice}
            </p>
          </div>

          <div className="lg:col-span-7 lg:pt-2">
            <ol className="border-t border-warm-line">
              {content.features.map((feature, index) => {
                const Icon = iconRegistry[feature.icon];

                return (
                  <li
                    key={`${feature.icon}-${feature.title}`}
                    className="group grid gap-5 border-b border-warm-line py-8 sm:grid-cols-[4rem_1fr] sm:gap-7 sm:py-9"
                  >
                    <div className="flex items-start justify-between sm:block">
                      <span className="flex size-13 items-center justify-center rounded-2xl border border-palm/15 bg-soft-sand text-palm transition-[background-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:bg-palm group-hover:text-white">
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.6}
                          className="size-6"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-xs font-bold tracking-[0.16em] text-charcoal/35 sm:hidden"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:gap-x-8">
                      <div>
                        <h3 className="font-display text-3xl font-semibold leading-tight tracking-[-0.015em] text-charcoal">
                          {feature.title}
                        </h3>
                        <p className="mt-3 max-w-xl text-[0.95rem] leading-7 text-charcoal/70 sm:text-base">
                          {feature.description}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="hidden pt-2 text-xs font-bold tracking-[0.16em] text-charcoal/30 sm:block"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
