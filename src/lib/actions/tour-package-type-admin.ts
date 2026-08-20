"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { tourPackageTypeSchema } from "@/lib/validation/tour-package-type-admin";

export type TourPackageTypeActionState = { ok: boolean; error?: string; fieldErrors?: Record<string, string[]> };
const fields = (error: { flatten(): { fieldErrors: Record<string, string[] | undefined> } }) => Object.fromEntries(Object.entries(error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1])));
function revalidatePackageTypes() { for (const path of ["/admin/tours", "/admin/tours/package-types", "/admin/dashboard"]) revalidatePath(path); }

export async function saveTourPackageType(input: unknown): Promise<TourPackageTypeActionState> {
  await requireAdmin(); const parsed = tourPackageTypeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Review the package type fields.", fieldErrors: fields(parsed.error) };
  const data = parsed.data;
  if (data.originalKey && data.originalKey !== data.key) return { ok: false, error: "The stable key cannot be changed after creation." };
  if (!data.originalKey && await prisma.tourPackageType.findUnique({ where: { key: data.key }, select: { key: true } })) return { ok: false, error: "That package type key is already in use.", fieldErrors: { key: ["Choose a unique key."] } };
  try { await prisma.$transaction(async (tx) => {
    await tx.tourPackageType.upsert({ where: { key: data.key }, update: { displayOrder: data.displayOrder, status: data.status }, create: { key: data.key, displayOrder: data.displayOrder, status: data.status } });
    for (const locale of ["en", "ar"] as const) await tx.tourPackageTypeTranslation.upsert({ where: { packageKey_locale: { packageKey: data.key, locale } }, update: { label: data[locale] }, create: { id: `tour-package-type-${data.key}-${locale}`, packageKey: data.key, locale, label: data[locale] } });
  }); } catch { return { ok: false, error: "The package type could not be saved. Its key must be unique." }; }
  revalidatePackageTypes(); return { ok: true };
}

export async function deleteTourPackageType(formData: FormData) {
  await requireAdmin(); const key = String(formData.get("key") ?? "");
  if (!key || formData.get("confirm") !== "on") redirect("/admin/tours/package-types?result=confirmation-required");
  const value = await prisma.tourPackageType.findUnique({ where: { key }, select: { _count: { select: { tours: true } } } });
  if (!value) redirect("/admin/tours/package-types?result=missing");
  if (value._count.tours) redirect("/admin/tours/package-types?result=in-use");
  await prisma.tourPackageType.delete({ where: { key } }); revalidatePackageTypes(); redirect("/admin/tours/package-types?result=deleted");
}
