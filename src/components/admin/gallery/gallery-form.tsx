"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { AdminImagePicker } from "@/components/admin/images/admin-image-picker";
import { saveGalleryItem, type GalleryActionState } from "@/lib/actions/gallery-admin";
import { type GalleryItemInput } from "@/lib/validation/gallery-admin";

const input = "mt-2 min-h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20";
const panel = "rounded-2xl border bg-white p-5 shadow-soft sm:p-7";
export const emptyGalleryItem: GalleryItemInput = { categoryId: "", mediaPath: "", cloudinaryPublicId: "", featured: false, displayOrder: 0, status: "draft", en: { title: "", description: "", altText: "", location: "" }, ar: { title: "", description: "", altText: "", location: "" } };

export function GalleryForm({ initialValue, categories }: { initialValue: GalleryItemInput; categories: { id: string; label: string }[] }) {
  const router = useRouter(), [pending, startTransition] = useTransition(), [result, setResult] = useState<GalleryActionState>({ ok: false });
  const form = useForm<GalleryItemInput>({ defaultValues: initialValue, mode: "onBlur" });
  const mediaPath = useWatch({ control: form.control, name: "mediaPath", defaultValue: initialValue.mediaPath ?? "" }) ?? "";
  const publicId = useWatch({ control: form.control, name: "cloudinaryPublicId", defaultValue: initialValue.cloudinaryPublicId ?? "" }) ?? "";
  const submit = form.handleSubmit((values) => startTransition(async () => { const response = await saveGalleryItem(values); setResult(response); if (response.ok) { router.push(`/admin/gallery/${response.id}/edit?saved=1`); router.refresh(); } }));
  const translation = (locale: "en" | "ar") => <fieldset dir={locale === "ar" ? "rtl" : "ltr"} className={panel}><legend className="px-2 font-display text-2xl font-semibold">{locale === "en" ? "English content" : "Arabic content"}</legend><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Title / caption<input {...form.register(`${locale}.title`)} className={input} /></label><label className="text-sm font-semibold">Location (optional)<input {...form.register(`${locale}.location`)} className={input} /></label><label className="text-sm font-semibold sm:col-span-2">Meaningful image alt text<input {...form.register(`${locale}.altText`)} className={input} /></label><label className="text-sm font-semibold sm:col-span-2">Description / extended caption<textarea {...form.register(`${locale}.description`)} className={`${input} min-h-28 resize-y`} /></label></div></fieldset>;
  return <form onSubmit={submit} className="space-y-7" noValidate>
    {result.error ? <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"><p className="font-semibold">{result.error}</p>{result.fieldErrors ? <ul className="mt-2 list-disc ps-5">{Object.entries(result.fieldErrors).flatMap(([key, messages]) => messages.map((message) => <li key={`${key}-${message}`}>{key}: {message}</li>))}</ul> : null}</div> : null}
    <fieldset className={panel}><legend className="px-2 font-display text-2xl font-semibold">Shared image data</legend><AdminImagePicker label="Gallery image" context="gallery" value={mediaPath} publicId={publicId} required onChange={(path, nextPublicId) => { form.setValue("mediaPath", path, { shouldDirty: true, shouldValidate: true }); form.setValue("cloudinaryPublicId", nextPublicId, { shouldDirty: true }); }} /><div className="mt-5 grid content-start gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Category<select {...form.register("categoryId")} className={input}>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label><label className="text-sm font-semibold">Display order<input type="number" {...form.register("displayOrder", { valueAsNumber: true })} className={input} /></label><label className="text-sm font-semibold">Publication status<select {...form.register("status")} className={input}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" {...form.register("featured")} className="size-5 accent-ocean" />Feature on homepage</label></div></fieldset>
    {translation("en")}{translation("ar")}
    <div className="sticky bottom-4 z-10 flex flex-wrap justify-end gap-3 rounded-2xl border bg-white/95 p-4 shadow-soft backdrop-blur"><Link href="/admin/gallery" className="inline-flex min-h-11 items-center rounded-full border px-5 font-semibold">Cancel</Link><button disabled={pending} className="min-h-11 rounded-full bg-ocean px-6 font-semibold text-white disabled:opacity-60">{pending ? "Saving…" : "Save Gallery item"}</button></div>
  </form>;
}
