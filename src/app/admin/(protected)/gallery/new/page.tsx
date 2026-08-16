import Link from "next/link";
import { emptyGalleryItem, GalleryForm } from "@/components/admin/gallery/gallery-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminGalleryCategories } from "@/lib/gallery/gallery-repository";

export default async function NewGalleryItemPage() { await requireAdmin(); const categories = (await getAdminGalleryCategories()).filter((category) => category.key !== "all").map((category) => ({ id: category.id, label: category.translations.find((value) => value.locale === "en")?.label ?? category.key })); return <section><nav aria-label="Breadcrumb" className="text-sm text-charcoal/60"><Link href="/admin/gallery" className="underline">Gallery</Link> / New</nav><h1 className="mt-5 font-display text-4xl font-semibold sm:text-5xl">Create Gallery item</h1><p className="mb-8 mt-3 text-charcoal/65">New items begin as drafts unless explicitly published. Upload a photograph from your device, then add independent English and Arabic metadata.</p><GalleryForm initialValue={{ ...emptyGalleryItem, categoryId: categories[0]?.id ?? "", displayOrder: 0 }} categories={categories} /></section>; }
