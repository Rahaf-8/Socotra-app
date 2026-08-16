import { z } from "zod";

export const statusSchema = z.enum(["draft", "published", "archived"]);
const id = z.string().trim().min(1).max(120).regex(/^[A-Za-z0-9_-]+$/);
const order = z.coerce.number().int().min(0).max(10_000);
const short = z.string().trim().min(1).max(200);
const long = z.string().trim().min(1).max(20_000);

const answerBlock = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: long }),
  z.object({ type: z.literal("subheading"), text: short }),
  z.object({ type: z.literal("quote"), text: long }),
  z.object({ type: z.literal("list"), items: z.array(short).min(1).max(30) }),
]);

export const faqInputSchema = z.object({ id: id.optional(), categoryId: id, displayOrder: order, status: statusSchema, en: z.object({ question: short.max(300), answer: z.array(answerBlock).min(1).max(40) }), ar: z.object({ question: short.max(300), answer: z.array(answerBlock).min(1).max(40) }) });
export const faqCategorySchema = z.object({ id, displayOrder: order, status: statusSchema, en: short, ar: short });

const nullableText = (maximum: number) => z.string().trim().max(maximum);
const safeInternalHref = z.string().trim().max(500).refine((value) => value === "" || /^\/(?!\/)[A-Za-z0-9/_?=&%#.-]*$/.test(value), "Use a safe internal path.");
export const pageTranslationSchema = z.object({ eyebrow: nullableText(120), title: short.max(200), description: nullableText(2_000) });
export const sectionTranslationSchema = z.object({ eyebrow: nullableText(120), title: short.max(200), description: nullableText(4_000), paragraphs: z.array(z.string().trim().min(1).max(4_000)).max(30), imageAlt: nullableText(300) });
export const itemTranslationSchema = z.object({ label: nullableText(120), title: short.max(300), description: nullableText(2_000), imageAlt: nullableText(300) });
export const contentPageInputSchema = z.object({ pageId: id, status: statusSchema, en: pageTranslationSchema, ar: pageTranslationSchema, sections: z.array(z.object({ id, displayOrder: order, status: statusSchema, en: sectionTranslationSchema, ar: sectionTranslationSchema, items: z.array(z.object({ id, displayOrder: order, status: statusSchema, href: safeInternalHref, en: itemTranslationSchema, ar: itemTranslationSchema })).max(50) })).max(30), seo: z.object({ en: z.object({ title: short.max(70), description: short.max(170) }), ar: z.object({ title: short.max(70), description: short.max(170) }) }) });

export const contactMethodSchema = z.object({ id: id.optional(), type: z.enum(["email", "phone", "whatsapp", "location", "social"]), value: short.max(500), href: nullableText(500), external: z.boolean(), displayOrder: order, status: statusSchema, en: z.object({ label: short, description: nullableText(500) }), ar: z.object({ label: short, description: nullableText(500) }) }).superRefine((data, context) => {
  if (!data.href) return;
  let valid = false;
  if (data.type === "email") valid = /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(data.href);
  else if (["phone", "whatsapp"].includes(data.type)) valid = /^(tel:\+?[0-9 ()-]{6,}|https:\/\/(wa\.me|api\.whatsapp\.com)\/)/i.test(data.href);
  else valid = /^https:\/\//i.test(data.href);
  if (!valid) context.addIssue({ code: "custom", path: ["href"], message: "Use a safe link appropriate for the selected method type." });
});
export const enquiryTypeSchema = z.object({ id: id.optional(), value: id, displayOrder: order, status: statusSchema, en: short, ar: short });

export type FaqInput = z.infer<typeof faqInputSchema>;
export type ContentPageInput = z.infer<typeof contentPageInputSchema>;
export type ContactMethodInput = z.infer<typeof contactMethodSchema>;
export type EnquiryTypeInput = z.infer<typeof enquiryTypeSchema>;
