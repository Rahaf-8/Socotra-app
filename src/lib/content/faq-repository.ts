import "server-only";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import type { FAQAnswerBlock, FAQCategoryDefinition, FAQItem } from "@/types/faq";

type MutableFAQAnswerBlock = Exclude<FAQAnswerBlock, { type: "list" }> | { type: "list"; items: string[] };
function answerBlocks(value: unknown): MutableFAQAnswerBlock[] {
  if (!Array.isArray(value)) return [];
  const result: MutableFAQAnswerBlock[] = [];
  for (const block of value) {
    if (!block || typeof block !== "object" || !("type" in block)) continue;
    const candidate = block as { type?: unknown; text?: unknown; items?: unknown };
    if (candidate.type === "list" && Array.isArray(candidate.items) && candidate.items.every((item) => typeof item === "string")) result.push({ type: "list", items: [...candidate.items] });
    else if (["paragraph", "subheading", "quote"].includes(String(candidate.type)) && typeof candidate.text === "string") result.push({ type: candidate.type as "paragraph" | "subheading" | "quote", text: candidate.text });
  }
  return result;
}

export async function getPublishedFaqContent(locale: Locale) {
  const categories = await prisma.faqCategory.findMany({
    where: { status: "published", translations: { some: { locale } }, items: { some: { status: "published", translations: { some: { locale } } } } },
    orderBy: [{ displayOrder: "asc" }, { key: "asc" }],
    select: { key: true, displayOrder: true, translations: { where: { locale }, select: { label: true } }, items: { where: { status: "published", translations: { some: { locale } } }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }], select: { id: true, displayOrder: true, translations: { where: { locale }, select: { question: true, answer: true } } } } },
  });
  return {
    categories: categories.map((category) => ({ key: category.key, label: category.translations[0]!.label, displayOrder: category.displayOrder })) as FAQCategoryDefinition[],
    items: categories.flatMap((category) => category.items.map((item) => ({ id: item.id, category: category.key, displayOrder: item.displayOrder, published: true, question: item.translations[0]!.question, answer: answerBlocks(item.translations[0]!.answer) }))) as FAQItem[],
  };
}

export function getAdminFaqItems() {
  return prisma.faqItem.findMany({ orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }, { id: "asc" }], include: { translations: true, category: { include: { translations: true } } } });
}

export function getAdminFaqItemById(id: string) {
  return prisma.faqItem.findUnique({ where: { id }, include: { translations: true } });
}

export function getAdminFaqCategories() {
  return prisma.faqCategory.findMany({ orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: true, _count: { select: { items: true } } } });
}

export function getFaqSeo(locale: Locale) {
  return prisma.seoMetadata.findUnique({ where: { pageKey_locale: { pageKey: "faq", locale } }, select: { title: true, description: true, imagePath: true } });
}

export { answerBlocks };
