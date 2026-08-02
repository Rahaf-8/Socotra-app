"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { submitContactRequest } from "@/lib/services/contact-request";
import {
  createContactRequestSchema,
  type ContactRequestInput,
} from "@/lib/validation/contact-request";
import type { Locale } from "@/i18n/config";
import type { ContactFormOption, ContactPageData } from "@/types/contact";

type ContactFormProps = {
  content: ContactPageData["form"];
  enquiryTypes: readonly ContactFormOption[];
  locale: Locale;
  labels: { name: string; email: string; enquiryType: string; subject: string; message: string; selectType: string; optional: string };
};

const fieldClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-warm-line bg-white px-4 text-base text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-ocean focus:ring-2 focus:ring-ocean/15";

export function ContactForm({
  content,
  enquiryTypes,
  locale,
  labels,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ContactRequestInput>({
    defaultValues: {
      name: "",
      email: "",
      enquiryType: "",
      subject: "",
      message: "",
    },
  });

  const visibleEnquiryTypes = enquiryTypes
    .filter((option) => option.published && option.label && option.value)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  async function onSubmit(values: ContactRequestInput) {
    clearErrors();
    const validation = createContactRequestSchema(locale).safeParse(values);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactRequestInput;
        if (field) {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    const result = await submitContactRequest(validation.data);

    if (!result.success) {
      setError("root", {
        message:
          result.code === "NOT_CONFIGURED"
            ? content.unavailableMessage
            : content.errorMessage,
      });
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
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

  function errorFor(field: keyof ContactRequestInput) {
    return errors[field]?.message;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-[1.75rem] border border-warm-line bg-white p-6 shadow-soft sm:p-8"
    >
      {content.eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-ocean">
          {content.eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal">
        {content.title}
      </h2>
      {content.description ? (
        <p className="mt-3 max-w-xl text-sm leading-7 text-charcoal/62">
          {content.description}
        </p>
      ) : null}

      <div className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <FormField
          id="contact-name"
          label={labels.name}
          error={errorFor("name")}
          required
        >
          <input
            id="contact-name"
            {...register("name")}
            autoComplete="name"
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "contact-name-error" : undefined
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          id="contact-email"
          label={labels.email}
          error={errorFor("email")}
          required
        >
          <input
            id="contact-email"
            {...register("email")}
            type="email"
            autoComplete="email"
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? "contact-email-error" : undefined
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          id="contact-enquiry-type"
          label={labels.enquiryType}
          error={errorFor("enquiryType")}
          required
        >
          <select
            id="contact-enquiry-type"
            {...register("enquiryType")}
            aria-invalid={Boolean(errors.enquiryType)}
            aria-describedby={
              errors.enquiryType
                ? "contact-enquiry-type-error"
                : undefined
            }
            className={fieldClassName}
          >
            <option value="">{labels.selectType}</option>
            {visibleEnquiryTypes.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="contact-subject"
          label={labels.subject}
          optionalLabel={labels.optional}
          optional
          error={errorFor("subject")}
        >
          <input
            id="contact-subject"
            {...register("subject")}
            maxLength={120}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={
              errors.subject ? "contact-subject-error" : undefined
            }
            className={fieldClassName}
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField
            id="contact-message"
            label={labels.message}
            error={errorFor("message")}
            required
          >
            <textarea
              id="contact-message"
              {...register("message")}
              rows={7}
              maxLength={2000}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
              className={`${fieldClassName} resize-y py-3`}
            />
          </FormField>
        </div>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="mt-5 min-h-6"
      >
        {errors.root?.message ? (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {errors.root.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ocean px-7 text-sm font-bold text-white outline-none transition-colors hover:bg-deep-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? content.submittingLabel : content.submitLabel}
      </button>
    </form>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  optionalLabel?: string;
  children: React.ReactNode;
};

function FormField({
  id,
  label,
  error,
  required = false,
  optional = false,
  optionalLabel = "optional",
  children,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-charcoal">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {optional ? (
          <span className="ms-1 font-normal text-charcoal/55">({optionalLabel})</span>
        ) : null}
      </label>
      {children}
      <div className="min-h-6">
        {error ? (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-1.5 text-sm font-semibold text-red-700"
          >
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
