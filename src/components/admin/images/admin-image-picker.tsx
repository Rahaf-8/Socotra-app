"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isSafeImageReference, MAX_IMAGE_UPLOAD_BYTES, type ImageUploadContext, validateImageFile } from "@/lib/validation/image-upload";

type UploadResponse = { ok: true; asset: { secureUrl: string; publicId: string; width: number; height: number; format: string; originalFilename: string } } | { ok: false; error: string };
type ManagedAsset = { publicId: string; secureUrl: string; context: string; createdAt: string };
type AssetListResponse = { ok: true; assets: ManagedAsset[] } | { ok: false; error: string };
type AdminImagePickerProps = { label: string; context: ImageUploadContext; value?: string | null; publicId?: string | null; required?: boolean; allowExisting?: boolean; helperText?: React.ReactNode; onChange: (value: string, publicId: string) => void };

export async function discardUncommittedImage(publicId: string | null | undefined) {
  if (!publicId) return;
  await fetch("/api/admin/images", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId }) }).catch(() => undefined);
}

export function AdminImagePicker({ label, context, value, publicId, required = false, allowExisting = false, helperText, onChange }: AdminImagePickerProps) {
  const controlledValue = value ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const initialPublicId = useRef(publicId ?? "");
  const [file, setFile] = useState<File>();
  const [objectUrl, setObjectUrl] = useState<string>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [assets, setAssets] = useState<ManagedAsset[]>();
  const [loadingAssets, setLoadingAssets] = useState(false);
  const preview = objectUrl ?? (isSafeImageReference(controlledValue) ? controlledValue : undefined);

  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, [objectUrl]);
  async function discardUncommitted(assetPublicId: string | null | undefined) { if (assetPublicId && assetPublicId !== initialPublicId.current) await discardUncommittedImage(assetPublicId); }
  function selectFile(selected?: File) {
    setError(undefined); if (!selected) return;
    const validationError = validateImageFile(selected);
    if (validationError) { setFile(undefined); setObjectUrl(undefined); setError(validationError); return; }
    setFile(selected); setObjectUrl(URL.createObjectURL(selected));
  }
  async function upload() {
    if (!file || pending) return;
    setPending(true); setError(undefined);
    const formData = new FormData(); formData.set("file", file); formData.set("context", context);
    try {
      const response = await fetch("/api/admin/images", { method: "POST", body: formData });
      const result = await response.json() as UploadResponse;
      if (!response.ok || !result.ok) { setError(result.ok ? "The image could not be uploaded." : result.error); return; }
      await discardUncommitted(publicId); onChange(result.asset.secureUrl, result.asset.publicId); setFile(undefined); setObjectUrl(undefined);
      if (inputRef.current) inputRef.current.value = "";
    } catch { setError("The image could not be uploaded. Check the connection and try again."); }
    finally { setPending(false); }
  }
  async function loadAssets() {
    if (!allowExisting || assets || loadingAssets) return;
    setLoadingAssets(true); setError(undefined);
    try {
      const response = await fetch("/api/admin/images", { cache: "no-store" });
      const result = await response.json() as AssetListResponse;
      if (!response.ok || !result.ok) { setError(result.ok ? "Managed images could not be loaded." : result.error); return; }
      setAssets(result.assets);
    } catch { setError("Managed images could not be loaded. Check the connection and try again."); }
    finally { setLoadingAssets(false); }
  }
  async function selectManagedAsset(asset: ManagedAsset) {
    await discardUncommitted(publicId); onChange(asset.secureUrl, asset.publicId); setFile(undefined); setObjectUrl(undefined); setError(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }
  async function remove() {
    await discardUncommitted(publicId); onChange("", ""); setFile(undefined); setObjectUrl(undefined); setError(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }

  return <section className="min-w-0 rounded-xl border bg-soft-sand/35 p-4" aria-busy={pending}>
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-start">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}{required ? " *" : ""}</p>
        <p className="mt-1 text-xs leading-5 text-charcoal/60">JPEG/JFIF, PNG, WebP, or AVIF · maximum {MAX_IMAGE_UPLOAD_BYTES / 1024 / 1024} MB.</p>
        {helperText ? <div className="mt-2 text-xs leading-5 text-charcoal/65">{helperText}</div> : null}
        <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border bg-white px-5 text-sm font-semibold hover:border-ocean focus-within:ring-2 focus-within:ring-ocean focus-within:ring-offset-2"><span>{controlledValue ? "Choose replacement" : "Choose image"}</span><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,.jfif" onChange={(event) => selectFile(event.target.files?.[0])} className="sr-only" /></label>
        {file ? <div className="mt-3 min-w-0"><p className="break-all text-sm text-charcoal/70">Selected: {file.name}</p><button type="button" disabled={pending} onClick={upload} className="mt-3 min-h-11 rounded-full bg-ocean px-5 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Uploading…" : "Upload selected image"}</button></div> : null}
        {controlledValue && !required ? <button type="button" disabled={pending} onClick={remove} className="mt-3 ms-2 min-h-11 rounded-full border border-red-200 bg-white px-4 text-sm font-semibold text-red-800 disabled:opacity-60">Remove image</button> : null}
        {error ? <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}
        {allowExisting ? <details className="mt-4" onToggle={(event) => { if (event.currentTarget.open) void loadAssets(); }}><summary className="cursor-pointer text-sm font-semibold underline underline-offset-4">Select an existing managed image</summary>{loadingAssets ? <p className="mt-3 text-sm text-charcoal/60">Loading managed images…</p> : null}{assets ? <div className="mt-3 grid max-h-80 grid-cols-2 gap-3 overflow-y-auto rounded-xl border bg-white p-3 sm:grid-cols-3">{assets.length ? assets.map((asset) => <button key={asset.publicId} type="button" onClick={() => void selectManagedAsset(asset)} aria-label={`Select managed image ${asset.publicId}`} className={`rounded-lg border p-1 text-start outline-none hover:border-ocean focus-visible:ring-2 focus-visible:ring-ocean ${asset.publicId === publicId ? "border-ocean ring-2 ring-ocean/20" : ""}`}><span className="relative block aspect-video overflow-hidden rounded-md bg-soft-sand"><Image src={asset.secureUrl} alt="" fill sizes="160px" className="object-cover" /></span><span className="mt-1 block truncate px-1 text-[0.65rem] text-charcoal/60">{asset.context}</span></button>) : <p className="col-span-full p-3 text-center text-sm text-charcoal/55">No managed images are available yet.</p>}</div> : null}</details> : null}
        <details className="mt-4"><summary className="cursor-pointer text-sm font-semibold underline underline-offset-4">Advanced: use an existing path or approved URL</summary><label className="mt-3 block text-sm">Image reference<input value={controlledValue} onChange={(event) => { void discardUncommitted(publicId); onChange(event.target.value, ""); }} className="mt-2 min-h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm" /></label><p className="mt-2 text-xs leading-5 text-charcoal/55">Legacy local paths and approved HTTPS references remain supported. Manual references are never treated as application-owned Cloudinary assets.</p></details>
      </div>
      <div><p className="text-xs font-semibold text-charcoal/60">{objectUrl ? "Local preview" : "Current image"}</p><div className="relative mt-2 aspect-square overflow-hidden rounded-xl border bg-white">{preview ? <Image src={preview} alt={`Administrator preview: ${label}`} fill unoptimized={preview.startsWith("blob:")} sizes="160px" className="object-cover" /> : <div className="flex h-full items-center justify-center p-3 text-center text-xs text-charcoal/50">No image selected</div>}</div></div>
    </div>
  </section>;
}
