import Link from "next/link";
import { ArrowRight, CalendarDays, Plane } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

type FlightInformationAction = {
  label: string;
  href: string;
};

export type FlightInformationContent = {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  frequency: {
    label: string;
    value: string;
  };
  operatingDays: {
    label: string;
    value: string;
  };
  scheduleStatus: {
    label: string;
    value: string;
  };
  supportingNote: string;
  primaryAction: FlightInformationAction;
  secondaryAction: FlightInformationAction;
  placeholderNotice?: string;
};

type FlightInformationProps = {
  content: FlightInformationContent;
};

export function FlightInformation({ content }: FlightInformationProps) {
  if (!content.enabled) {
    return null;
  }

  const showPlaceholderNotice =
    process.env.NODE_ENV === "development" && content.placeholderNotice;

  return (
    <Section
      aria-labelledby="flight-information-heading"
      className="relative isolate overflow-hidden bg-charcoal text-white"
    >
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 size-96 rounded-full bg-ocean/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-44 left-1/4 size-96 rounded-full bg-palm/20 blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean-light sm:text-sm">
              {content.eyebrow}
            </p>
            <h2
              id="flight-information-heading"
              className="mt-4 max-w-[16ch] text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.025em] text-white sm:text-5xl lg:text-6xl"
            >
              {content.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
              {content.description}
            </p>

            {showPlaceholderNotice ? (
              <p className="mt-5 w-fit rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/75">
                {content.placeholderNotice}
              </p>
            ) : null}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={content.primaryAction.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ocean px-7 text-sm font-bold text-white shadow-lg shadow-black/15 outline-none transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-deep-ocean hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
              >
                {content.primaryAction.label}
                <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
              </Link>
              <Link
                href={content.secondaryAction.href}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-white/5 px-7 text-sm font-bold text-white outline-none transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
              >
                {content.secondaryAction.label}
              </Link>
            </div>
          </div>

          <aside
            aria-label="Flight schedule summary"
            className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 shadow-2xl shadow-black/15 backdrop-blur-sm sm:p-8 lg:col-span-5"
          >
            <div className="flex items-center justify-between gap-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-ocean text-white">
                <Plane aria-hidden="true" className="size-5" strokeWidth={1.7} />
              </span>
              <span className="rounded-full border border-ocean-light/30 bg-ocean/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-ocean-light">
                {content.scheduleStatus.value}
              </span>
            </div>

            <dl className="mt-8">
              <div className="border-b border-white/12 pb-7">
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  {content.frequency.label}
                </dt>
                <dd className="mt-2 font-display text-4xl font-semibold tracking-[-0.02em] text-white sm:text-5xl">
                  {content.frequency.value}
                </dd>
              </div>

              <div className="grid gap-2 border-b border-white/12 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <dt className="flex items-center gap-2 text-sm font-semibold text-white/60">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-4 text-ocean-light"
                  />
                  {content.operatingDays.label}
                </dt>
                <dd className="text-sm font-bold text-white">
                  {content.operatingDays.value}
                </dd>
              </div>

              <div className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <dt className="text-sm font-semibold text-white/60">
                  {content.scheduleStatus.label}
                </dt>
                <dd className="text-sm font-bold text-white">
                  {content.scheduleStatus.value}
                </dd>
              </div>
            </dl>

            <p className="rounded-2xl border border-sand/20 bg-sand/10 px-4 py-3.5 text-sm font-semibold leading-6 text-sand">
              {content.supportingNote}
            </p>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
