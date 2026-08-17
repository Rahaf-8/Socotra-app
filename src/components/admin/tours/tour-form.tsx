"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { AdminImagePicker, discardUncommittedImage } from "@/components/admin/images/admin-image-picker";
import { saveTour, type TourActionState } from "@/lib/actions/tour-admin";
import type { TourAdminInput } from "@/lib/validation/tour-admin";

const input = "min-h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20";
const textarea = `${input} min-h-28 resize-y`;
const panel = "rounded-2xl border bg-white p-5 shadow-soft sm:p-7";
const defaultTranslation = { packageLabel: "", title: "", tourType: "", shortDescription: "", fullDescription: "", durationLabel: "", pricingAvailabilityLabel: "", accommodationNote: "", practicalNote: "", heroImageAlt: "", seoTitle: "", seoDescription: "" };

export const emptyTour: TourAdminInput = { slug: "", packageType: "group", durationDays: 8, heroImagePath: "", heroImagePublicId: "", cardImagePath: "", cardImagePublicId: "", featured: false, status: "draft", displayOrder: 0, needsClientConfirmation: false, en: { ...defaultTranslation }, ar: { ...defaultTranslation }, pricingTiers: [], included: [], excluded: [], requiredExtras: [], itineraryDays: [], images: [] };

function StatusSelect({ registration }: { registration: ReturnType<ReturnType<typeof useForm<TourAdminInput>>["register"]> }) {
  return <select {...registration} className={input}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select>;
}

export function TourForm({ initialValue }: { initialValue: TourAdminInput }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<TourActionState>({ ok: false });
  const form = useForm<TourAdminInput>({ defaultValues: initialValue, mode: "onBlur" });
  const pricing = useFieldArray({ control: form.control, name: "pricingTiers" });
  const included = useFieldArray({ control: form.control, name: "included" });
  const excluded = useFieldArray({ control: form.control, name: "excluded" });
  const extras = useFieldArray({ control: form.control, name: "requiredExtras" });
  const itinerary = useFieldArray({ control: form.control, name: "itineraryDays" });
  const images = useFieldArray({ control: form.control, name: "images" });
  const heroImagePath = useWatch({ control: form.control, name: "heroImagePath", defaultValue: initialValue.heroImagePath ?? "" }) ?? "";
  const heroImagePublicId = useWatch({ control: form.control, name: "heroImagePublicId", defaultValue: initialValue.heroImagePublicId ?? "" }) ?? "";
  const cardImagePath = useWatch({ control: form.control, name: "cardImagePath", defaultValue: initialValue.cardImagePath ?? "" }) ?? "";
  const cardImagePublicId = useWatch({ control: form.control, name: "cardImagePublicId", defaultValue: initialValue.cardImagePublicId ?? "" }) ?? "";
  const watchedItinerary = useWatch({ control: form.control, name: "itineraryDays" });
  const watchedImages = useWatch({ control: form.control, name: "images" });
  const numberOrNull = {
    setValueAs: (value: string | number | null | undefined) =>
      value === "" || value == null ? null : Number(value),
  };

  const submit = form.handleSubmit((values) => startTransition(async () => {
    const response = await saveTour(values);
    setResult(response);
    if (response.ok && response.id) {
      router.push(`/admin/tours/${response.id}/edit?saved=1`);
      router.refresh();
    }
  }));

  const languagePanel = (locale: "en" | "ar", label: string) => <fieldset className={panel} dir={locale === "ar" ? "rtl" : "ltr"}>
    <legend className="px-2 font-display text-2xl font-semibold">{label}</legend>
    <div className="grid gap-5 sm:grid-cols-2">
      {[['packageLabel','Package label'],['title','Title'],['tourType','Tour type'],['durationLabel','Duration label'],['pricingAvailabilityLabel','Pricing availability label'],['seoTitle','SEO title']] .map(([name, fieldLabel]) => <label key={name} className="block text-sm font-semibold">{fieldLabel}<input {...form.register(`${locale}.${name}` as `en.title`)} className={`${input} mt-2`} /></label>)}
      <label className="block text-sm font-semibold sm:col-span-2">Short description<textarea {...form.register(`${locale}.shortDescription`)} className={`${textarea} mt-2`} /></label>
      <label className="block text-sm font-semibold sm:col-span-2">Full description<textarea {...form.register(`${locale}.fullDescription`)} className={`${textarea} mt-2 min-h-40`} /></label>
      <label className="block text-sm font-semibold sm:col-span-2">Accommodation note<textarea {...form.register(`${locale}.accommodationNote`)} className={`${textarea} mt-2`} /></label>
      <label className="block text-sm font-semibold sm:col-span-2">Practical note<textarea {...form.register(`${locale}.practicalNote`)} className={`${textarea} mt-2`} /></label>
      <label className="block text-sm font-semibold sm:col-span-2">Hero image alt text<input {...form.register(`${locale}.heroImageAlt`)} className={`${input} mt-2`} /></label>
      <label className="block text-sm font-semibold sm:col-span-2">SEO description<textarea {...form.register(`${locale}.seoDescription`)} className={`${textarea} mt-2`} /></label>
    </div>
  </fieldset>;

  return <form onSubmit={submit} className="space-y-7" noValidate>
    {result.error ? <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"><p className="font-semibold">{result.error}</p>{result.fieldErrors ? <ul className="mt-2 list-disc ps-5">{Object.entries(result.fieldErrors).flatMap(([key, messages]) => messages.map((message) => <li key={`${key}-${message}`}>{key}: {message}</li>))}</ul> : null}</div> : null}

    <fieldset className={panel}><legend className="px-2 font-display text-2xl font-semibold">Shared business data</legend>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-semibold">Slug<input {...form.register("slug")} className={`${input} mt-2`} /></label>
        <label className="text-sm font-semibold">Package type<select {...form.register("packageType")} className={`${input} mt-2`}><option value="group">Group</option><option value="camping">Camping</option><option value="comfy">Comfy</option></select></label>
        <label className="text-sm font-semibold">Publication status<span className="mt-2 block"><StatusSelect registration={form.register("status")} /></span></label>
        <label className="text-sm font-semibold">Duration days<input type="number" {...form.register("durationDays", numberOrNull)} className={`${input} mt-2`} /></label>
        <label className="text-sm font-semibold">Display order<input type="number" {...form.register("displayOrder", { valueAsNumber: true })} className={`${input} mt-2`} /></label>
        <div className="sm:col-span-2"><AdminImagePicker label="Tour hero image" context="tour-hero" value={heroImagePath} publicId={heroImagePublicId} required onChange={(path, publicId) => { form.setValue("heroImagePath", path, { shouldDirty: true, shouldValidate: true }); form.setValue("heroImagePublicId", publicId, { shouldDirty: true }); }} /></div>
        <div className="sm:col-span-2"><AdminImagePicker label="Tour card image (optional; falls back to hero)" context="tour-card" value={cardImagePath} publicId={cardImagePublicId} onChange={(path, publicId) => { form.setValue("cardImagePath", path, { shouldDirty: true, shouldValidate: true }); form.setValue("cardImagePublicId", publicId, { shouldDirty: true }); }} /></div>
        <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" {...form.register("featured")} className="size-5 accent-ocean" />Featured</label>
        <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" {...form.register("needsClientConfirmation")} className="size-5 accent-ocean" />Needs client confirmation</label>
      </div>
    </fieldset>

    {languagePanel("en", "English content")}{languagePanel("ar", "Arabic content")}

    <fieldset className={panel}><legend className="px-2 font-display text-2xl font-semibold">Pricing tiers</legend>
      <button type="button" onClick={() => pricing.append({ minGuests: null, maxGuests: null, pricePerPerson: 0, currency: "USD", displayOrder: pricing.fields.length + 1, status: "published", en: { label: "", note: "" }, ar: { label: "", note: "" } })} className="mb-5 rounded-full border px-4 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ocean">Add pricing tier</button>
      <div className="space-y-4">{pricing.fields.map((field, index) => <div key={field.id} className="grid gap-3 rounded-xl border bg-soft-sand/50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input type="hidden" {...form.register(`pricingTiers.${index}.id`)} />
        <label className="text-sm">English label<input {...form.register(`pricingTiers.${index}.en.label`)} className={`${input} mt-1`} /></label><label className="text-sm" dir="rtl">Arabic label<input {...form.register(`pricingTiers.${index}.ar.label`)} className={`${input} mt-1`} /></label>
        <label className="text-sm">Price per person<input type="number" {...form.register(`pricingTiers.${index}.pricePerPerson`, { valueAsNumber: true })} className={`${input} mt-1`} /></label><label className="text-sm">Currency<input {...form.register(`pricingTiers.${index}.currency`)} className={`${input} mt-1`} /></label>
        <label className="text-sm">Minimum guests<input type="number" {...form.register(`pricingTiers.${index}.minGuests`, numberOrNull)} className={`${input} mt-1`} /></label><label className="text-sm">Maximum guests<input type="number" {...form.register(`pricingTiers.${index}.maxGuests`, numberOrNull)} className={`${input} mt-1`} /></label>
        <label className="text-sm">Order<input type="number" {...form.register(`pricingTiers.${index}.displayOrder`, { valueAsNumber: true })} className={`${input} mt-1`} /></label><StatusSelect registration={form.register(`pricingTiers.${index}.status`)} />
        <label className="text-sm sm:col-span-2">English note<input {...form.register(`pricingTiers.${index}.en.note`)} className={`${input} mt-1`} /></label><label className="text-sm sm:col-span-2" dir="rtl">Arabic note<input {...form.register(`pricingTiers.${index}.ar.note`)} className={`${input} mt-1`} /></label>
        <button type="button" onClick={() => pricing.remove(index)} className="justify-self-start text-sm font-semibold text-red-700 underline">Remove tier</button>
      </div>)}</div>
    </fieldset>

    {(["included", "excluded"] as const).map((group) => { const collection = group === "included" ? included : excluded; return <fieldset key={group} className={panel}><legend className="px-2 font-display text-2xl font-semibold">{group === "included" ? "Included items" : "Excluded items"}</legend>
      <button type="button" onClick={() => collection.append({ en: "", ar: "", displayOrder: collection.fields.length + 1, status: "published" })} className="mb-5 rounded-full border px-4 py-2 text-sm font-semibold">Add item</button>
      <div className="space-y-3">{collection.fields.map((field, index) => <div key={field.id} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_1fr_6rem_auto]">
        <input type="hidden" {...form.register(`${group}.${index}.id`)} /><input aria-label="English label" placeholder="English label" {...form.register(`${group}.${index}.en`)} className={input} /><input dir="rtl" aria-label="Arabic label" placeholder="Arabic label" {...form.register(`${group}.${index}.ar`)} className={input} /><input aria-label="Display order" type="number" {...form.register(`${group}.${index}.displayOrder`, { valueAsNumber: true })} className={input} /><StatusSelect registration={form.register(`${group}.${index}.status`)} /><button type="button" onClick={() => collection.remove(index)} className="text-sm font-semibold text-red-700 underline">Remove</button>
      </div>)}</div></fieldset>; })}

    <fieldset className={panel}><legend className="px-2 font-display text-2xl font-semibold">Required extras / not included</legend>
      <button type="button" onClick={() => extras.append({ en: "", ar: "", descriptionEn: "", descriptionAr: "", referencePrice: null, currency: "USD", displayOrder: extras.fields.length + 1, status: "published" })} className="mb-5 rounded-full border px-4 py-2 text-sm font-semibold">Add extra</button>
      <div className="space-y-4">{extras.fields.map((field, index) => <div key={field.id} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-4"><input type="hidden" {...form.register(`requiredExtras.${index}.id`)} /><input placeholder="English label" {...form.register(`requiredExtras.${index}.en`)} className={input} /><input dir="rtl" placeholder="Arabic label" {...form.register(`requiredExtras.${index}.ar`)} className={input} /><input type="number" placeholder="Reference price" {...form.register(`requiredExtras.${index}.referencePrice`, numberOrNull)} className={input} /><input placeholder="Currency" {...form.register(`requiredExtras.${index}.currency`)} className={input} /><input placeholder="English description" {...form.register(`requiredExtras.${index}.descriptionEn`)} className={input} /><input dir="rtl" placeholder="Arabic description" {...form.register(`requiredExtras.${index}.descriptionAr`)} className={input} /><input type="number" aria-label="Display order" {...form.register(`requiredExtras.${index}.displayOrder`, { valueAsNumber: true })} className={input} /><StatusSelect registration={form.register(`requiredExtras.${index}.status`)} /><button type="button" onClick={() => extras.remove(index)} className="text-sm font-semibold text-red-700 underline">Remove</button></div>)}</div>
    </fieldset>

    <fieldset className={panel}><legend className="px-2 font-display text-2xl font-semibold">Itinerary</legend>
      <button type="button" onClick={() => itinerary.append({ dayNumber: itinerary.fields.length + 1, displayOrder: itinerary.fields.length + 1, imagePath: "", imagePublicId: "", status: "published", needsClientConfirmation: false, en: { title: "", description: "", overnight: "", location: "", imageAlt: "" }, ar: { title: "", description: "", overnight: "", location: "", imageAlt: "" } })} className="mb-5 rounded-full border px-4 py-2 text-sm font-semibold">Add day</button>
      <div className="space-y-5">{itinerary.fields.map((field, index) => <div key={field.id} className="rounded-xl border p-4"><input type="hidden" {...form.register(`itineraryDays.${index}.id`)} /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="text-sm">Day<input type="number" {...form.register(`itineraryDays.${index}.dayNumber`, { valueAsNumber: true })} className={`${input} mt-1`} /></label><label className="text-sm">Order<input type="number" {...form.register(`itineraryDays.${index}.displayOrder`, { valueAsNumber: true })} className={`${input} mt-1`} /></label><StatusSelect registration={form.register(`itineraryDays.${index}.status`)} /></div><div className="mt-4"><AdminImagePicker label={`Itinerary day ${index + 1} image (optional)`} context="itinerary" value={watchedItinerary?.[index]?.imagePath ?? ""} publicId={watchedItinerary?.[index]?.imagePublicId} onChange={(path, publicId) => { form.setValue(`itineraryDays.${index}.imagePath`, path, { shouldDirty: true, shouldValidate: true }); form.setValue(`itineraryDays.${index}.imagePublicId`, publicId, { shouldDirty: true }); }} /></div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">{(["en", "ar"] as const).map((locale) => <div key={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="space-y-3 rounded-xl bg-soft-sand/60 p-4"><p className="font-semibold">{locale === "en" ? "English" : "Arabic"}</p><input placeholder="Title" {...form.register(`itineraryDays.${index}.${locale}.title`)} className={input} /><textarea placeholder="Description" {...form.register(`itineraryDays.${index}.${locale}.description`)} className={textarea} /><input placeholder="Overnight" {...form.register(`itineraryDays.${index}.${locale}.overnight`)} className={input} /><input placeholder="Location" {...form.register(`itineraryDays.${index}.${locale}.location`)} className={input} /><input placeholder="Image alt text" {...form.register(`itineraryDays.${index}.${locale}.imageAlt`)} className={input} /></div>)}</div><button type="button" onClick={() => { void discardUncommittedImage(watchedItinerary?.[index]?.imagePublicId); itinerary.remove(index); }} className="mt-3 text-sm font-semibold text-red-700 underline">Remove day</button></div>)}</div>
    </fieldset>

    <fieldset className={panel}><legend className="px-2 font-display text-2xl font-semibold">Tour gallery images</legend><p className="mb-4 text-sm text-charcoal/65">Upload photographs and maintain independent English and Arabic alt text and optional titles.</p>
      <button type="button" onClick={() => images.append({ imagePath: "", cloudinaryPublicId: "", displayOrder: images.fields.length + 1, status: "published", en: { altText: "", title: "" }, ar: { altText: "", title: "" } })} className="mb-5 rounded-full border px-4 py-2 text-sm font-semibold">Add gallery image</button>
      <div className="space-y-4">{images.fields.map((field, index) => <div key={field.id} className="rounded-xl border p-4"><input type="hidden" {...form.register(`images.${index}.id`)} /><AdminImagePicker label={`Tour gallery image ${index + 1}`} context="tour-gallery" value={watchedImages?.[index]?.imagePath ?? ""} publicId={watchedImages?.[index]?.cloudinaryPublicId} required onChange={(path, publicId) => { form.setValue(`images.${index}.imagePath`, path, { shouldDirty: true, shouldValidate: true }); form.setValue(`images.${index}.cloudinaryPublicId`, publicId, { shouldDirty: true }); }} /><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><input type="number" aria-label="Display order" {...form.register(`images.${index}.displayOrder`, { valueAsNumber: true })} className={input} /><StatusSelect registration={form.register(`images.${index}.status`)} /><input placeholder="English alt text" {...form.register(`images.${index}.en.altText`)} className={input} /><input dir="rtl" placeholder="Arabic alt text" {...form.register(`images.${index}.ar.altText`)} className={input} /><input placeholder="English title" {...form.register(`images.${index}.en.title`)} className={input} /><input dir="rtl" placeholder="Arabic title" {...form.register(`images.${index}.ar.title`)} className={input} /><button type="button" onClick={() => { void discardUncommittedImage(watchedImages?.[index]?.cloudinaryPublicId); images.remove(index); }} className="text-sm font-semibold text-red-700 underline">Remove image</button></div></div>)}</div>
    </fieldset>

    <div className="sticky bottom-4 z-10 flex flex-wrap justify-end gap-3 rounded-2xl border bg-white/95 p-4 shadow-soft backdrop-blur"><Link href="/admin/tours" className="inline-flex min-h-11 items-center rounded-full border px-5 font-semibold">Cancel</Link><button type="submit" disabled={pending} className="min-h-11 rounded-full bg-ocean px-6 font-semibold text-white hover:bg-deep-ocean disabled:opacity-60">{pending ? "Saving…" : "Save tour"}</button></div>
  </form>;
}
