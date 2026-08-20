"use client";

import { useState, useTransition } from "react";
import { deleteFaqCategory, saveFaqCategory, type ContentActionState } from "@/lib/actions/content-admin";
import type { z } from "zod";
import type { faqCategorySchema } from "@/lib/validation/content-admin";

type Value = z.infer<typeof faqCategorySchema>;
const control = "mt-1 min-h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20";

export function FaqCategoryEditor({ initialValue, itemCount = 0 }: { initialValue: Value; itemCount?: number }) {
  const [value, setValue] = useState(initialValue), [pending, startTransition] = useTransition(), [result, setResult] = useState<ContentActionState>({ ok: false });
  const existing = Boolean(initialValue.id);
  return <article className="rounded-xl border bg-white p-4 shadow-soft">
    {result.error ? <p role="alert" className="mb-3 text-sm text-red-700">{result.error}</p> : result.ok ? <p role="status" className="mb-3 text-sm text-deep-ocean">Category saved.</p> : null}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><label className="text-sm font-semibold">Key<input value={value.key} disabled={existing} onChange={(event) => setValue({ ...value, key: event.target.value })} className={control}/></label><label className="text-sm font-semibold">English label<input value={value.en} onChange={(event) => setValue({ ...value, en: event.target.value })} className={control}/></label><label dir="rtl" className="text-sm font-semibold">Arabic label<input value={value.ar} onChange={(event) => setValue({ ...value, ar: event.target.value })} className={control}/></label><label className="text-sm font-semibold">Order<input type="number" min="0" value={value.displayOrder} onChange={(event) => setValue({ ...value, displayOrder: Number(event.target.value) })} className={control}/></label><label className="text-sm font-semibold">Status<select value={value.status} onChange={(event) => setValue({ ...value, status: event.target.value as Value["status"] })} className={control}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label></div>
    <div className="mt-4 flex flex-wrap items-center gap-4"><button type="button" disabled={pending} onClick={() => startTransition(async () => setResult(await saveFaqCategory(value)))} className="min-h-11 rounded-full bg-ocean px-5 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-ocean disabled:opacity-60">{pending ? "Saving…" : existing ? "Save category" : "Add category"}</button>{existing ? <span className="text-xs text-charcoal/60">{itemCount} FAQ item(s). The key stays stable.</span> : null}</div>
    {existing ? <form action={deleteFaqCategory} className="mt-4 border-t pt-4"><input type="hidden" name="id" value={initialValue.id}/><label className="flex items-start gap-2 text-sm"><input type="checkbox" name="confirm" required className="mt-0.5 size-5 accent-ocean"/><span>Delete this category only if it contains no FAQ items.</span></label><button className="mt-3 text-sm font-semibold text-red-700 underline focus-visible:ring-2 focus-visible:ring-red-700">Delete category</button></form> : null}
  </article>;
}
