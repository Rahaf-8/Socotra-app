import { GalleryItem } from "@/components/gallery/gallery-item";
import type { GalleryCategoryData, GalleryItemData } from "@/types/gallery";

type GalleryGridProps = {
  items: readonly GalleryItemData[];
  categories: readonly GalleryCategoryData[];
  categoryLabel: string;
};

const layout = [
  "md:col-span-8 md:row-span-2",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-5",
  "md:col-span-7",
] as const;

export function GalleryGrid({ items, categories, categoryLabel }: GalleryGridProps) {
  const visibleItems = items
    .filter((item) => item.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const categoryLabels = new Map(
    categories
      .filter((category) => category.published)
      .map((category) => [category.id, category.label]),
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-5 md:grid-cols-12 md:auto-rows-[18rem] lg:auto-rows-[21rem]">
      {visibleItems.map((item, index) => (
        <article
          key={item.id}
          className={layout[index % layout.length] ?? "md:col-span-6"}
        >
          <GalleryItem
            item={item}
            className="h-full min-h-80"
            sizes={
              index === 0
                ? "(min-width: 768px) 66vw, 100vw"
                : "(min-width: 768px) 42vw, 100vw"
            }
          />
          <p className="sr-only">
            {categoryLabel}: {categoryLabels.get(item.category) ?? item.category}.
            {item.description ? ` ${item.description}` : ""}
          </p>
        </article>
      ))}
    </div>
  );
}
