import Image from "next/image";

import type { TourImage } from "@/types/tour";

export function TourGallery({ images, heading }: { images?: readonly TourImage[]; heading: string }) {
  if (!images?.length) return null;
  return <section aria-labelledby="tour-gallery-heading"><h2 id="tour-gallery-heading" className="font-display text-4xl font-semibold text-charcoal">{heading}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{images.map((image, index) => <figure key={`${image.src}-${index}`} className={`relative overflow-hidden rounded-2xl bg-soft-sand ${index === 0 && images.length % 2 ? "sm:col-span-2" : ""}`}><div className="relative aspect-[4/3]"><Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 35vw, (min-width: 640px) 50vw, 100vw" className="object-cover" /></div></figure>)}</div></section>;
}
