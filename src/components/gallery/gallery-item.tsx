import Image from "next/image";

import { clsx } from "clsx";

import type { GalleryPreviewItemData } from "@/types/gallery";

type GalleryItemProps = {
  item: GalleryPreviewItemData;
  className?: string;
  sizes: string;
};

export function GalleryItem({
  item,
  className,
  sizes,
}: GalleryItemProps) {
  return (
    <figure
      className={clsx(
        "group relative isolate min-h-64 overflow-hidden rounded-[1.75rem] bg-sand shadow-soft",
        className,
      )}
    >
      <Image
        src={item.imageUrl}
        alt={item.altText}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-charcoal/32 via-transparent to-charcoal/5 opacity-75 transition-opacity duration-500 group-hover:opacity-95"
      />

      <figcaption className="absolute inset-x-0 bottom-0 p-5 font-display text-2xl font-semibold text-white sm:p-6">
        {item.title}
      </figcaption>
    </figure>
  );
}
