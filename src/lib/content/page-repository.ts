import "server-only";

import type { Locale } from "@/i18n/config";
import { getAboutContent } from "@/i18n/content/about";
import { localizedHref as rawLocalizedHref } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import type { AboutPageData } from "@/types/about";
import type { ContactPageData } from "@/types/contact";

export function getAdminContentPage(key: "about" | "contact") {
  return prisma.contentPage.findUnique({ where: { key }, include: { translations: true, sections: { orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: true, items: { orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: true } } } } } });
}

export async function getAdminContentPageInput(key: "about" | "contact") {
  const [page, seo] = await Promise.all([getAdminContentPage(key), prisma.seoMetadata.findMany({ where: { pageKey: key } })]);
  if (!page) return null;
  const localeValue = <T extends { locale: string }>(values: T[], locale: Locale) => values.find((value) => value.locale === locale)!;
  const pageCopy = (locale: Locale) => { const value = localeValue(page.translations, locale); return { eyebrow: value.eyebrow ?? "", title: value.title, description: value.description ?? "" }; };
  return { pageId: page.id, status: page.status, en: pageCopy("en"), ar: pageCopy("ar"), sections: page.sections.map((section) => { const copy = (locale: Locale) => { const value = localeValue(section.translations, locale); return { eyebrow: value.eyebrow ?? "", title: value.title, description: value.description ?? "", paragraphs: paragraphs(value.paragraphs), imageAlt: value.imageAlt ?? "" }; }; return { id: section.id, displayOrder: section.displayOrder, status: section.status, en: copy("en"), ar: copy("ar"), items: section.items.map((item) => { const itemCopy = (locale: Locale) => { const value = localeValue(item.translations, locale); return { label: value.label ?? "", title: value.title, description: value.description ?? "", imageAlt: value.imageAlt ?? "" }; }; return { id: item.id, displayOrder: item.displayOrder, status: item.status, href: item.href ?? "", en: itemCopy("en"), ar: itemCopy("ar") }; }) }; }), seo: { en: { title: localeValue(seo, "en").title, description: localeValue(seo, "en").description }, ar: { title: localeValue(seo, "ar").title, description: localeValue(seo, "ar").description } } };
}

function paragraphs(value: unknown) { return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : []; }
function managedHref(locale: Locale, href: string) { const path = href.replace(/^\/(en|ar)(?=\/|$)/, "") || "/"; return rawLocalizedHref(locale, path as "/tours"); }
const localizedHref = managedHref;

export async function getAboutPageContent(locale: Locale): Promise<AboutPageData | null> {
  const [page, seo] = await Promise.all([
    prisma.contentPage.findUnique({ where: { key: "about" }, include: { translations: { where: { locale } }, sections: { where: { status: "published", translations: { some: { locale } } }, orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: { where: { locale } }, items: { where: { status: "published", translations: { some: { locale } } }, orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: { where: { locale } } } } } } } }),
    prisma.seoMetadata.findUnique({ where: { pageKey_locale: { pageKey: "about", locale } } }),
  ]);
  if (!page || page.status !== "published" || !page.translations[0] || !seo) return null;
  const section = (key: string) => page.sections.find((value) => value.key === key);
  const editorial = (key: string) => { const value = section(key); const copy = value?.translations[0]; if (!value || !copy) return null; return { id: value.key, eyebrow: copy.eyebrow ?? undefined, title: copy.title, paragraphs: paragraphs(copy.paragraphs), image: value.imagePath && copy.imageAlt ? { src: value.imagePath, alt: copy.imageAlt } : undefined, displayOrder: value.displayOrder, published: true }; };
  const feature = (key: string) => { const value = section(key); const copy = value?.translations[0]; if (!value || !copy) return null; return { id: value.key, eyebrow: copy.eyebrow ?? undefined, title: copy.title, description: copy.description ?? undefined, displayOrder: value.displayOrder, published: true, items: value.items.map((item) => { const text = item.translations[0]!; return { id: item.key, title: text.title, description: text.description ?? "", image: item.imagePath && text.imageAlt ? { src: item.imagePath, alt: text.imageAlt } : undefined, displayOrder: item.displayOrder, published: true }; }) }; };
  const approvedHeroImage = getAboutContent(locale).hero.image, hero = { imagePath: approvedHeroImage.src }, heroCopy = { ...page.translations[0], imageAlt: approvedHeroImage.alt }, highlights = section("highlights"), cta = section("final-cta");
  const required = { island: editorial("the-island"), geography: editorial("geography-and-climate"), flora: feature("flora"), fauna: feature("fauna"), culture: editorial("people-and-culture"), history: feature("history-trade-and-legends") };
  if (!heroCopy || Object.values(required).some((value) => !value) || !highlights || !cta?.translations[0]) return null;
  const action = (key: string) => cta.items.find((item) => item.key === key);
  const primary = action("primaryAction"), secondary = action("secondaryAction");
  if (!primary?.translations[0] || !primary.href) return null;
  return { hero: { eyebrow: heroCopy.eyebrow ?? "", title: heroCopy.title, description: heroCopy.description ?? "", image: { src: hero.imagePath, alt: heroCopy.imageAlt } }, ...(required as Required<typeof required>), highlights: highlights.items.map((item) => ({ id: item.key, title: item.translations[0]!.title, description: item.translations[0]!.description ?? "", displayOrder: item.displayOrder, published: true })), cta: { title: cta.translations[0].title, description: cta.translations[0].description ?? "", primaryAction: { label: primary.translations[0].title, href: managedHref(locale, primary.href) }, secondaryAction: secondary?.translations[0] && secondary.href ? { label: secondary.translations[0].title, href: managedHref(locale, secondary.href) } : undefined }, seo: { title: seo.title, description: seo.description, image: seo.imagePath ?? undefined } } as AboutPageData;
}

export async function getContactPageContent(locale: Locale): Promise<ContactPageData | null> {
  const [page, methods, enquiryTypes, seo] = await Promise.all([
    prisma.contentPage.findUnique({ where: { key: "contact" }, include: { translations: { where: { locale } }, sections: { where: { status: "published", translations: { some: { locale } } }, include: { translations: { where: { locale } }, items: { where: { status: "published", translations: { some: { locale } } }, orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: { where: { locale } } } } } } } }),
    prisma.contactMethod.findMany({ where: { status: "published", value: { not: "" }, translations: { some: { locale } } }, orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: { where: { locale } } } }),
    prisma.contactEnquiryType.findMany({ where: { status: "published", translations: { some: { locale } } }, orderBy: [{ displayOrder: "asc" }, { value: "asc" }], include: { translations: { where: { locale } } } }),
    prisma.seoMetadata.findUnique({ where: { pageKey_locale: { pageKey: "contact", locale } } }),
  ]);
  if (!page || page.status !== "published" || !page.translations[0] || !seo) return null;
  const section = (key: string) => page.sections.find((value) => value.key === key), copy = (key: string) => section(key)?.translations[0];
  const intro = copy("intro"), form = section("form"), formCopy = form?.translations[0], guidance = section("guidance"), guidanceCopy = guidance?.translations[0], booking = section("bookingCTA"), bookingCopy = booking?.translations[0];
  if (!form || !formCopy) return null;
  const formText = (key: string) => form.items.find((item) => item.key === key)?.translations[0]?.title ?? "";
  const bookingAction = (key: string) => booking?.items.find((item) => item.key === key);
  const primary = bookingAction("primaryAction"), secondary = bookingAction("secondaryAction");
  return { hero: { eyebrow: page.translations[0].eyebrow ?? "", title: page.translations[0].title, description: page.translations[0].description ?? "" }, intro: intro ? { title: intro.title, description: intro.description ?? "" } : undefined, methods: methods.map((method) => ({ id: method.id, type: method.type, icon: method.type, label: method.translations[0]!.label, description: method.translations[0]!.description ?? undefined, value: method.value, href: method.href ?? undefined, external: method.external, displayOrder: method.displayOrder, published: true })), form: { eyebrow: formCopy.eyebrow ?? undefined, title: formCopy.title, description: formCopy.description ?? undefined, submitLabel: formText("submitLabel"), submittingLabel: formText("submittingLabel"), successTitle: formText("successTitle"), successMessage: formText("successMessage"), errorMessage: formText("errorMessage"), unavailableMessage: formText("unavailableMessage") }, enquiryTypes: enquiryTypes.map((item) => ({ id: item.id, value: item.value, label: item.translations[0]!.label, displayOrder: item.displayOrder, published: true })), guidance: guidance && guidanceCopy ? { eyebrow: guidanceCopy.eyebrow ?? undefined, title: guidanceCopy.title, description: guidanceCopy.description ?? undefined, items: guidance.items.map((item) => ({ id: item.key, text: item.translations[0]!.title, displayOrder: item.displayOrder, published: true })) } : undefined, bookingCTA: booking && bookingCopy && primary?.href && primary.translations[0] ? { eyebrow: bookingCopy.eyebrow ?? undefined, title: bookingCopy.title, description: bookingCopy.description ?? "", primaryAction: { label: primary.translations[0].title, href: localizedHref(locale, primary.href as "/booking") }, secondaryAction: secondary?.href && secondary.translations[0] ? { label: secondary.translations[0].title, href: localizedHref(locale, secondary.href as "/tours") } : undefined } : undefined, seo: { title: seo.title, description: seo.description, image: seo.imagePath ?? undefined } };
}

export function getAdminContactEntities() { return Promise.all([prisma.contactMethod.findMany({ orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: true } }), prisma.contactEnquiryType.findMany({ orderBy: [{ displayOrder: "asc" }, { value: "asc" }], include: { translations: true, _count: { select: { contactRequests: true } } } })]); }
