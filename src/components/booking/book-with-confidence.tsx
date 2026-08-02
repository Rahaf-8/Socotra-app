import { Check } from "lucide-react";

type BookingPolicyContent = {
  heading: string;
  intro: string;
  points: readonly string[];
  finalNote: string;
};

type BookWithConfidenceProps = {
  policy: BookingPolicyContent;
};

export function BookWithConfidence({ policy }: BookWithConfidenceProps) {
  return (
    <section
      aria-labelledby="book-with-confidence-heading"
      className="rounded-[2rem] bg-deep-ocean px-6 py-12 text-white sm:px-10 lg:px-14"
    >
      <h2
        id="book-with-confidence-heading"
        className="font-display text-4xl font-semibold tracking-[-0.025em] sm:text-5xl"
      >
        {policy.heading}
      </h2>
      <p className="mt-5 max-w-3xl leading-7 text-white/75">
        {policy.intro}
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {policy.points.map((point) => (
          <li key={point} className="flex gap-3 leading-7 text-white/82">
            <Check
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-ocean-light"
            />
            {point}
          </li>
        ))}
      </ul>
      <p className="mt-8 border-t border-white/15 pt-6 text-sm font-semibold leading-6 text-sand">
        {policy.finalNote}
      </p>
    </section>
  );
}
