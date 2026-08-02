import type { LucideIcon } from "lucide-react";
import { CalendarDays, MessageCircle, Plane } from "lucide-react";

const icons = {
  calendar: CalendarDays,
  message: MessageCircle,
  plane: Plane,
} satisfies Record<string, LucideIcon>;

type HowToBookStep = {
  id: string;
  title: string;
  description: string;
  iconKey: keyof typeof icons;
};

type HowToBookProps = {
  steps: readonly HowToBookStep[];
  heading?: string;
};

export function HowToBook({ steps, heading = "How to Book" }: HowToBookProps) {
  return (
    <section aria-labelledby="how-to-book-heading">
      <h2
        id="how-to-book-heading"
        className="text-center font-display text-4xl font-semibold tracking-[-0.025em] text-charcoal sm:text-5xl"
      >
        {heading}
      </h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = icons[step.iconKey];
          return (
            <li
              key={step.id}
              className="rounded-[1.5rem] border border-warm-line bg-white p-6 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-soft-sand text-palm">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="text-xs font-bold tracking-[0.16em] text-charcoal/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 font-display text-3xl font-semibold text-charcoal">
                {step.title}
              </h3>
              <p className="mt-3 leading-7 text-charcoal/68">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
