"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminImagePicker } from "@/components/admin/images/admin-image-picker";
import { saveHomeHeroImage, type HomeHeroActionState } from "@/lib/actions/home-admin";
import type { HomeHeroImageInput } from "@/lib/validation/home-admin";

export function HomeHeroForm({ initialValue, usingFallback }: { initialValue: HomeHeroImageInput; usingFallback: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [result, setResult] = useState<HomeHeroActionState>({ ok: false });
  const [pending, startTransition] = useTransition();
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => { const response = await saveHomeHeroImage(value); setResult(response); if (response.ok) router.refresh(); });
  }
  return <form onSubmit={submit} className="space-y-6">
    {result.error ? <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-800">{result.error}</p> : null}
    {result.ok ? <p role="status" className="rounded-xl border border-ocean/25 bg-ocean/5 p-4 text-sm font-semibold text-deep-ocean">Home hero image saved for English and Arabic.</p> : null}
    {usingFallback ? <p className="rounded-xl border bg-soft-sand p-4 text-sm text-charcoal/70">No Home hero image has been saved yet. The current built-in image is shown as the safe fallback.</p> : null}
    <AdminImagePicker label="Home Hero Image" context="home-hero" value={value.imagePath} publicId={value.publicId} required allowExisting
      helperText={<><p>Recommended: 1920 × 1080 px (16:9 landscape). Keep the main subject near the center for the best display across desktop, tablet, and mobile; edges may crop on some screens.</p><p lang="ar" dir="rtl" className="mt-1">يُنصح بمقاس 1920 × 1080 بكسل (أفقي بنسبة 16:9). ضع العنصر الرئيسي قرب المنتصف لأفضل عرض على الشاشات المختلفة، فقد تُقص الحواف على بعض الأجهزة.</p></>}
      onChange={(imagePath, publicId) => { setValue({ imagePath, publicId }); setResult({ ok: false }); }} />
    <div className="flex justify-end rounded-2xl border bg-white p-4 shadow-soft"><button disabled={pending || !value.imagePath} className="min-h-11 rounded-full bg-ocean px-6 font-semibold text-white disabled:opacity-60">{pending ? "Saving…" : "Save Home hero image"}</button></div>
  </form>;
}
