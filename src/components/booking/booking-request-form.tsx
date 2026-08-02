"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { submitBookingRequest } from "@/lib/services/booking-request";
import {
  createBookingRequestSchema,
  type BookingRequestInput,
} from "@/lib/validation/booking-request";
import type { Locale } from "@/i18n/config";

type TourOption = {
  slug: string;
  packageLabel: string;
  title: string;
  pricingTiers?: readonly {
    label: string;
    pricePerPerson: number;
    currency: string;
  }[];
};

type BookingRequestFormProps = {
  tours: readonly TourOption[];
  initialTourSlug?: string;
  locale: Locale;
  content: {
    title: string; requestNotice: string; pricingNotice: string;
    fields: { fullName: string; email: string; whatsapp: string; country: string; tour: string; date: string; adults: string; children: string; requirements: string };
    selectPackage: string; submit: string; submitting: string; successTitle: string; successMessage: string; invalidTour: string;
  };
};

const fieldClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-warm-line bg-white px-4 text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-ocean focus:ring-2 focus:ring-ocean/15";

export function BookingRequestForm({
  tours,
  initialTourSlug,
  locale,
  content,
}: BookingRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<BookingRequestInput>({
    defaultValues: {
      fullName: "",
      email: "",
      whatsappNumber: "",
      country: "",
      tourSlug: initialTourSlug ?? "",
      preferredArrivalDate: "",
      adults: 1,
      children: 0,
      specialRequirements: "",
    },
  });

  async function onSubmit(values: BookingRequestInput) {
    clearErrors();
    const validation = createBookingRequestSchema(locale).safeParse(values);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof BookingRequestInput;
        if (field) setError(field, { message: issue.message });
      });
      return;
    }

    const selectedTour = tours.find(
      (tour) => tour.slug === validation.data.tourSlug,
    );
    if (!selectedTour) {
      setError("tourSlug", { message: content.invalidTour });
      return;
    }
    const displayedPricingTier = selectedTour.pricingTiers?.length
      ? [...selectedTour.pricingTiers].sort(
          (a, b) => a.pricePerPerson - b.pricePerPerson,
        )[0]
      : undefined;
    const result = await submitBookingRequest({
      ...validation.data,
      selectedPackageTitle: selectedTour.title,
      displayedPricingTier,
    });
    if (!result.success) {
      setError("root", { message: result.message });
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-[1.75rem] border border-palm/20 bg-white p-7 shadow-soft sm:p-9"
      >
        <h2 className="font-display text-4xl font-semibold text-charcoal">
          {content.successTitle}
        </h2>
        <p className="mt-4 leading-7 text-charcoal/70">
          {content.successMessage}
        </p>
      </div>
    );
  }

  function errorFor(field: keyof BookingRequestInput) {
    return errors[field]?.message;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-[1.75rem] border border-warm-line bg-white p-6 shadow-soft sm:p-8"
    >
      <h2 className="font-display text-4xl font-semibold text-charcoal">
        {content.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-charcoal/62">
        {content.requestNotice}
      </p>
      <p className="mt-2 text-sm font-semibold text-deep-ocean">
        {content.pricingNotice}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label={content.fields.fullName} error={errorFor("fullName")}>
          <input
            {...register("fullName")}
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            className={fieldClassName}
          />
        </Field>
        <Field label={content.fields.email} error={errorFor("email")}>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={fieldClassName}
          />
        </Field>
        <Field
          label={content.fields.whatsapp}
          error={errorFor("whatsappNumber")}
        >
          <input
            {...register("whatsappNumber")}
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.whatsappNumber)}
            className={fieldClassName}
          />
        </Field>
        <Field label={content.fields.country} error={errorFor("country")}>
          <input
            {...register("country")}
            autoComplete="country-name"
            aria-invalid={Boolean(errors.country)}
            className={fieldClassName}
          />
        </Field>
        <Field label={content.fields.tour} error={errorFor("tourSlug")}>
          <select
            {...register("tourSlug")}
            aria-invalid={Boolean(errors.tourSlug)}
            className={fieldClassName}
          >
            <option value="">{content.selectPackage}</option>
            {tours.map((tour) => (
              <option key={tour.slug} value={tour.slug}>
                {tour.packageLabel} — {tour.title}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={content.fields.date}
          error={errorFor("preferredArrivalDate")}
        >
          <input
            {...register("preferredArrivalDate")}
            type="date"
            aria-invalid={Boolean(errors.preferredArrivalDate)}
            className={fieldClassName}
          />
        </Field>
        <Field label={content.fields.adults} error={errorFor("adults")}>
          <input
            {...register("adults", { valueAsNumber: true })}
            type="number"
            min={1}
            inputMode="numeric"
            aria-invalid={Boolean(errors.adults)}
            className={fieldClassName}
          />
        </Field>
        <Field label={content.fields.children} error={errorFor("children")}>
          <input
            {...register("children", { valueAsNumber: true })}
            type="number"
            min={0}
            inputMode="numeric"
            aria-invalid={Boolean(errors.children)}
            className={fieldClassName}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field
            label={content.fields.requirements}
            error={errorFor("specialRequirements")}
          >
            <textarea
              {...register("specialRequirements")}
              rows={5}
              className={`${fieldClassName} py-3`}
            />
          </Field>
        </div>
      </div>

      {errors.root?.message ? (
        <p role="alert" className="mt-5 text-sm font-semibold text-red-700">
          {errors.root.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ocean px-7 text-sm font-bold text-white outline-none transition-colors hover:bg-deep-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? content.submitting : content.submit}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block text-sm font-bold text-charcoal">
      {label}
      {children}
      {error ? (
        <span role="alert" className="mt-2 block text-sm font-semibold text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
