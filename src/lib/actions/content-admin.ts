"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { contactMethodSchema, contentPageInputSchema, enquiryTypeSchema, faqCategorySchema, faqInputSchema } from "@/lib/validation/content-admin";

export type ContentActionState = { ok: boolean; id?: string; error?: string; fieldErrors?: Record<string, string[]> };
const locales = ["en", "ar"] as const;
const clean = (value: string) => value || null;
const recordId = (provided: string | undefined, prefix: string) => provided || `${prefix}-${crypto.randomUUID()}`;
const fields = (error: { flatten(): { fieldErrors: Record<string, string[] | undefined> } }) => Object.fromEntries(Object.entries(error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1])));

function revalidate(paths: string[]) { for (const path of [...new Set([...paths, "/admin/dashboard", "/sitemap.xml"])]) revalidatePath(path); }
const faqPaths = () => revalidate(["/admin/faq", "/en/faq", "/ar/faq"]);
const pagePaths = (key: "about" | "contact") => revalidate([`/admin/${key}`, `/en/${key}`, `/ar/${key}`]);

export async function saveFaq(input: unknown): Promise<ContentActionState> {
  await requireAdmin();
  const parsed = faqInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Review the highlighted FAQ fields.", fieldErrors: fields(parsed.error) };
  const data = parsed.data, id = recordId(data.id, "faq");
  try {
    await prisma.$transaction(async (tx) => {
      if (!(await tx.faqCategory.findUnique({ where: { id: data.categoryId }, select: { id: true } }))) throw new Error("category");
      await tx.faqItem.upsert({ where: { id }, update: { categoryId: data.categoryId, displayOrder: data.displayOrder, status: data.status }, create: { id, categoryId: data.categoryId, displayOrder: data.displayOrder, status: data.status } });
      for (const locale of locales) await tx.faqItemTranslation.upsert({ where: { faqItemId_locale: { faqItemId: id, locale } }, update: data[locale], create: { id: `${id}-${locale}`, faqItemId: id, locale, ...data[locale] } });
    });
  } catch { return { ok: false, error: "The FAQ item could not be saved. No partial changes were applied." }; }
  faqPaths(); return { ok: true, id };
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin(); const id = String(formData.get("id") ?? "");
  if (!id || formData.get("confirm") !== "on") redirect("/admin/faq?result=confirmation-required");
  const result = await prisma.faqItem.deleteMany({ where: { id } }); faqPaths();
  redirect(`/admin/faq?result=${result.count ? "deleted" : "missing"}`);
}

export async function saveFaqCategory(input: unknown): Promise<ContentActionState> {
  await requireAdmin(); const parsed = faqCategorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Review the category fields.", fieldErrors: fields(parsed.error) };
  const data = parsed.data;
  try { await prisma.$transaction(async (tx) => { await tx.faqCategory.update({ where: { id: data.id }, data: { displayOrder: data.displayOrder, status: data.status } }); for (const locale of locales) await tx.faqCategoryTranslation.upsert({ where: { categoryId_locale: { categoryId: data.id, locale } }, update: { label: data[locale] }, create: { id: `${data.id}-${locale}`, categoryId: data.id, locale, label: data[locale] } }); }); } catch { return { ok: false, error: "The category could not be saved." }; }
  faqPaths(); return { ok: true, id: data.id };
}

export async function saveContentPage(input: unknown): Promise<ContentActionState> {
  await requireAdmin(); const parsed = contentPageInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Review the page fields.", fieldErrors: fields(parsed.error) };
  const data = parsed.data; const existing = await prisma.contentPage.findUnique({ where: { id: data.pageId }, select: { key: true } });
  if (!existing || !["about", "contact"].includes(existing.key)) return { ok: false, error: "The managed page no longer exists." };
  try { await prisma.$transaction(async (tx) => {
    await tx.contentPage.update({ where: { id: data.pageId }, data: { status: data.status } });
    for (const locale of locales) await tx.contentPageTranslation.update({ where: { pageId_locale: { pageId: data.pageId, locale } }, data: { eyebrow: clean(data[locale].eyebrow), title: data[locale].title, description: clean(data[locale].description) } });
    for (const section of data.sections) { await tx.contentSection.update({ where: { id: section.id }, data: { displayOrder: section.displayOrder, status: section.status } }); for (const locale of locales) await tx.contentSectionTranslation.update({ where: { sectionId_locale: { sectionId: section.id, locale } }, data: { eyebrow: clean(section[locale].eyebrow), title: section[locale].title, description: clean(section[locale].description), paragraphs: section[locale].paragraphs, imageAlt: clean(section[locale].imageAlt) } }); for (const item of section.items) { await tx.contentItem.update({ where: { id: item.id }, data: { displayOrder: item.displayOrder, status: item.status, href: clean(item.href) } }); for (const locale of locales) await tx.contentItemTranslation.update({ where: { contentItemId_locale: { contentItemId: item.id, locale } }, data: { label: clean(item[locale].label), title: item[locale].title, description: clean(item[locale].description), imageAlt: clean(item[locale].imageAlt) } }); } }
    for (const locale of locales) await tx.seoMetadata.update({ where: { pageKey_locale: { pageKey: existing.key, locale } }, data: data.seo[locale] });
  }); } catch { return { ok: false, error: "The page could not be saved. No partial changes were applied." }; }
  pagePaths(existing.key as "about" | "contact"); return { ok: true, id: data.pageId };
}

export async function saveContactMethod(input: unknown): Promise<ContentActionState> {
  await requireAdmin(); const parsed = contactMethodSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Review the contact method fields.", fieldErrors: fields(parsed.error) };
  const data = parsed.data, id = recordId(data.id, "contact-method"), key = data.id ? undefined : `method-${crypto.randomUUID()}`;
  try { await prisma.$transaction(async (tx) => { await tx.contactMethod.upsert({ where: { id }, update: { type: data.type, value: data.value, href: clean(data.href), external: data.external, displayOrder: data.displayOrder, status: data.status }, create: { id, key: key!, type: data.type, value: data.value, href: clean(data.href), external: data.external, displayOrder: data.displayOrder, status: data.status } }); for (const locale of locales) await tx.contactMethodTranslation.upsert({ where: { contactMethodId_locale: { contactMethodId: id, locale } }, update: { label: data[locale].label, description: clean(data[locale].description) }, create: { id: `${id}-${locale}`, contactMethodId: id, locale, label: data[locale].label, description: clean(data[locale].description) } }); }); } catch { return { ok: false, error: "The contact method could not be saved." }; }
  pagePaths("contact"); return { ok: true, id };
}

export async function deleteContactMethod(formData: FormData) { await requireAdmin(); const id = String(formData.get("id") ?? ""); if (!id || formData.get("confirm") !== "on") redirect("/admin/contact?result=confirmation-required"); await prisma.contactMethod.deleteMany({ where: { id } }); pagePaths("contact"); redirect("/admin/contact?result=method-deleted"); }

export async function saveEnquiryType(input: unknown): Promise<ContentActionState> {
  await requireAdmin(); const parsed = enquiryTypeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Review the enquiry type fields.", fieldErrors: fields(parsed.error) };
  const data = parsed.data, id = recordId(data.id, "enquiry-type");
  try { await prisma.$transaction(async (tx) => { await tx.contactEnquiryType.upsert({ where: { id }, update: { value: data.value, displayOrder: data.displayOrder, status: data.status }, create: { id, value: data.value, displayOrder: data.displayOrder, status: data.status } }); for (const locale of locales) await tx.contactEnquiryTypeTranslation.upsert({ where: { enquiryTypeId_locale: { enquiryTypeId: id, locale } }, update: { label: data[locale] }, create: { id: `${id}-${locale}`, enquiryTypeId: id, locale, label: data[locale] } }); }); } catch { return { ok: false, error: "The enquiry type could not be saved. Its value must be unique." }; }
  pagePaths("contact"); return { ok: true, id };
}

export async function deleteOrArchiveEnquiryType(formData: FormData) { await requireAdmin(); const id = String(formData.get("id") ?? ""); if (!id || formData.get("confirm") !== "on") redirect("/admin/contact?result=confirmation-required"); const item = await prisma.contactEnquiryType.findUnique({ where: { id }, select: { _count: { select: { contactRequests: true } } } }); if (!item) redirect("/admin/contact?result=missing"); if (item._count.contactRequests) { await prisma.contactEnquiryType.update({ where: { id }, data: { status: "archived" } }); pagePaths("contact"); redirect("/admin/contact?result=enquiry-archived"); } await prisma.contactEnquiryType.delete({ where: { id } }); pagePaths("contact"); redirect("/admin/contact?result=enquiry-deleted"); }
