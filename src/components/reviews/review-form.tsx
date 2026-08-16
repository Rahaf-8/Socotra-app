"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import type { Locale } from "@/i18n/config";
import { submitReview } from "@/lib/services/review";
import { createReviewSchema, type ReviewInput } from "@/lib/validation/review";

export type ReviewFormContent = {
  title: string;
  description: string;
  name: string;
  email: string;
  rating: string;
  message: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successMessage: string;
  errorMessage: string;
};

const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-warm-line bg-white px-4 text-base outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/15";

export function ReviewForm({ locale, content }: { locale: Locale; content: ReviewFormContent }) {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, setError, setFocus, clearErrors, reset, control, formState: { errors, isSubmitting } } = useForm<ReviewInput>({
    defaultValues: { name: "", email: "", rating: 0, message: "", website: "" },
  });

  async function onSubmit(values: ReviewInput) {
    clearErrors();
    const parsed = createReviewSchema(locale).safeParse(values);
    if (!parsed.success) {
      let hasVisibleFieldError = false;
      let firstVisibleField: "name" | "email" | "rating" | "message" | undefined;
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ReviewInput;
        if (field && field !== "website") {
          hasVisibleFieldError = true;
          setError(field, { message: issue.message });
          if (!firstVisibleField && ["name", "email", "rating", "message"].includes(field)) {
            firstVisibleField = field as "name" | "email" | "rating" | "message";
          }
        }
      }
      if (!hasVisibleFieldError) setError("root", { message: content.errorMessage });
      if (firstVisibleField) setFocus(firstVisibleField);
      return;
    }
    try {
      const result = await submitReview(parsed.data, locale);
      if (!result.success) {
        setError("root", { message: result.message ?? content.errorMessage });
        return;
      }
      reset();
      setSubmitted(true);
    } catch {
      setError("root", { message: content.errorMessage });
    }
  }

  const starLabel = (value: number) => locale === "ar"
    ? `${value} ${value === 1 ? "نجمة" : "نجوم"}`
    : `${value} ${value === 1 ? "star" : "stars"}`;

  if (submitted) return <div role="status" aria-live="polite" className="rounded-2xl border border-palm/20 bg-white p-6 shadow-soft sm:p-8"><h3 className="font-display text-3xl font-semibold">{content.successTitle}</h3><p className="mt-3 leading-7 text-charcoal/70">{content.successMessage}</p></div>;

  return <form id="write-review" onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isSubmitting} className="rounded-2xl border bg-white p-5 shadow-soft sm:p-8">
    <div className="sr-only" aria-hidden="true"><label>Website<input {...register("website")} tabIndex={-1} autoComplete="off" /></label></div>
    <h3 className="font-display text-3xl font-semibold sm:text-4xl">{content.title}</h3>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-charcoal/65">{content.description}</p>
    <div className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
      <Field id="review-name" label={content.name} error={errors.name?.message}><input id="review-name" {...register("name")} autoComplete="name" maxLength={100} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "review-name-error" : undefined} className={fieldClass} /></Field>
      <Field id="review-email" label={content.email} error={errors.email?.message}><input id="review-email" {...register("email")} type="email" autoComplete="email" maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "review-email-error" : undefined} className={fieldClass} /></Field>
      <fieldset className="sm:col-span-2" aria-invalid={Boolean(errors.rating)} aria-describedby={errors.rating ? "review-rating-error" : undefined}><legend className="text-sm font-bold">{content.rating}</legend><Controller name="rating" control={control} render={({ field }) => <div className="mt-2 flex flex-wrap gap-2">
        {[1,2,3,4,5].map((value) => <label key={value} className="cursor-pointer"><input ref={value === 1 ? field.ref : undefined} type="radio" name={field.name} value={value} checked={field.value === value} onBlur={field.onBlur} onChange={() => field.onChange(value)} aria-label={starLabel(value)} className="peer sr-only" /><span className="flex size-12 items-center justify-center rounded-full border bg-white text-stone transition peer-checked:border-ocean peer-checked:bg-ocean/10 peer-checked:text-ocean peer-focus-visible:ring-2 peer-focus-visible:ring-ocean peer-focus-visible:ring-offset-2"><Star aria-hidden="true" className={`size-6 ${value <= field.value ? "fill-current" : ""}`} /></span></label>)}
      </div>} />{errors.rating?.message ? <p id="review-rating-error" role="alert" className="mt-2 text-sm font-semibold text-red-700">{errors.rating.message}</p> : null}</fieldset>
      <div className="sm:col-span-2"><Field id="review-message" label={content.message} error={errors.message?.message}><textarea id="review-message" {...register("message")} rows={6} maxLength={2000} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "review-message-error" : undefined} className={`${fieldClass} resize-y py-3`} /></Field></div>
    </div>
    <div aria-live="polite" aria-atomic="true" className="mt-4 min-h-6">{errors.root?.message ? <p role="alert" className="text-sm font-semibold text-red-700">{errors.root.message}</p> : null}</div>
    <button type="submit" disabled={isSubmitting} className="mt-6 min-h-12 w-full rounded-full bg-ocean px-7 text-sm font-bold text-white hover:bg-deep-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto">{isSubmitting ? content.submitting : content.submit}</button>
  </form>;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="block text-sm font-bold">{label}</label>{children}{error ? <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-red-700">{error}</p> : null}</div>;
}
