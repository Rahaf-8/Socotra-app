import type { Tour } from "@/types/tour";

type TourInformationProps = {
  tour: Tour;
  labels: { eyebrow: string; heading: string; accommodation: string; practical: string };
};

export function TourInformation({ tour, labels }: TourInformationProps) {
  return (
    <article aria-labelledby="tour-information-heading">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">
        {labels.eyebrow}
      </p>
      <h2
        id="tour-information-heading"
        className="mt-3 font-display text-4xl font-semibold tracking-[-0.025em] text-charcoal sm:text-5xl"
      >
        {labels.heading}
      </h2>
      <p className="mt-6 text-base leading-8 text-charcoal/72 sm:text-lg">
        {tour.fullDescription}
      </p>

      {tour.accommodationNote ? (
        <div className="mt-8 rounded-2xl border border-warm-line bg-soft-sand p-5">
          <h3 className="font-bold text-charcoal">{labels.accommodation}</h3>
          <p className="mt-2 leading-7 text-charcoal/70">
            {tour.accommodationNote}
          </p>
        </div>
      ) : null}

      {tour.practicalNote ? (
        <div className="mt-5">
          <h3 className="font-bold text-charcoal">{labels.practical}</h3>
          <p className="mt-2 leading-7 text-charcoal/70">
            {tour.practicalNote}
          </p>
        </div>
      ) : null}
    </article>
  );
}
