import "dotenv/config";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import { getAboutContent } from "../src/i18n/content/about";
import { getBookingContent } from "../src/i18n/content/booking";
import { getContactContent } from "../src/i18n/content/contact";
import { getFAQContent } from "../src/i18n/content/faq";
import { getGalleryContent } from "../src/i18n/content/gallery";
import { getTours, getTourUI } from "../src/i18n/content/tours";
import { locales, type Locale } from "../src/i18n/config";
import type { AboutPageData } from "../src/types/about";
import type { Tour } from "../src/types/tour";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL is required for seeding.");

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: databaseUrl }),
});

const json = (value: unknown) =>
  JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;

const publication = (published: boolean) =>
  published ? ("published" as const) : ("draft" as const);

const packageType = (slug: string) => {
  if (slug === "group-tour") return "group" as const;
  if (slug === "camping-wild-tour") return "camping" as const;
  return "comfy" as const;
};

async function seedTours() {
  const localized = Object.fromEntries(
    locales.map((locale) => [locale, getTours(locale)]),
  ) as Record<Locale, readonly Tour[]>;

  for (const source of localized.en) {
    await prisma.tour.upsert({
      where: { id: source.id },
      update: {
        slug: source.slug,
        packageType: packageType(source.slug),
        durationDays: source.durationDays,
        heroImagePath: source.featuredImage.src,
        cardImagePath: source.featuredImage.src,
        featured: source.featured,
        status: publication(source.published),
        displayOrder: source.displayOrder,
        needsClientConfirmation: source.needsClientConfirmation ?? false,
      },
      create: {
        id: source.id,
        slug: source.slug,
        packageType: packageType(source.slug),
        durationDays: source.durationDays,
        heroImagePath: source.featuredImage.src,
        cardImagePath: source.featuredImage.src,
        featured: source.featured,
        status: publication(source.published),
        displayOrder: source.displayOrder,
        needsClientConfirmation: source.needsClientConfirmation ?? false,
      },
    });

    for (const locale of locales) {
      const tour = localized[locale].find((item) => item.id === source.id);
      if (!tour) throw new Error(`Missing ${locale} tour translation: ${source.id}`);
      await prisma.tourTranslation.upsert({
        where: { tourId_locale: { tourId: source.id, locale } },
        update: {
          packageLabel: tour.packageLabel,
          title: tour.title,
          tourType: tour.tourType,
          shortDescription: tour.shortDescription,
          fullDescription: tour.fullDescription,
          durationLabel: tour.durationLabel,
          pricingAvailabilityLabel: tour.pricingAvailabilityLabel,
          accommodationNote: tour.accommodationNote,
          practicalNote: tour.practicalNote,
          heroImageAlt: tour.featuredImage.alt,
          seoTitle: tour.seoTitle,
          seoDescription: tour.seoDescription,
        },
        create: {
          id: `${source.id}-${locale}`,
          tourId: source.id,
          locale,
          packageLabel: tour.packageLabel,
          title: tour.title,
          tourType: tour.tourType,
          shortDescription: tour.shortDescription,
          fullDescription: tour.fullDescription,
          durationLabel: tour.durationLabel,
          pricingAvailabilityLabel: tour.pricingAvailabilityLabel,
          accommodationNote: tour.accommodationNote,
          practicalNote: tour.practicalNote,
          heroImageAlt: tour.featuredImage.alt,
          seoTitle: tour.seoTitle,
          seoDescription: tour.seoDescription,
        },
      });
    }

    const pricingIds = (source.pricingTiers ?? []).map((tier) => tier.id);
    await prisma.tourPricingTier.deleteMany({
      where: { tourId: source.id, id: { notIn: pricingIds } },
    });
    for (const tier of source.pricingTiers ?? []) {
      await prisma.tourPricingTier.upsert({
        where: { id: tier.id },
        update: {
          minGuests: tier.minGuests,
          maxGuests: tier.maxGuests,
          pricePerPerson: tier.pricePerPerson,
          currency: tier.currency,
          displayOrder: tier.displayOrder,
          status: "published",
        },
        create: {
          id: tier.id,
          tourId: source.id,
          minGuests: tier.minGuests,
          maxGuests: tier.maxGuests,
          pricePerPerson: tier.pricePerPerson,
          currency: tier.currency,
          displayOrder: tier.displayOrder,
          status: "published",
        },
      });
      for (const locale of locales) {
        const translated = localized[locale]
          .find((item) => item.id === source.id)
          ?.pricingTiers?.find((item) => item.id === tier.id);
        if (!translated) throw new Error(`Missing ${locale} pricing translation: ${tier.id}`);
        await prisma.tourPricingTranslation.upsert({
          where: { pricingTierId_locale: { pricingTierId: tier.id, locale } },
          update: { label: translated.label, note: translated.note },
          create: {
            id: `${tier.id}-${locale}`,
            pricingTierId: tier.id,
            locale,
            label: translated.label,
            note: translated.note,
          },
        });
      }
    }

    const listGroups = [
      { type: "included" as const, values: source.included ?? [] },
      { type: "excluded" as const, values: source.excluded ?? [] },
      { type: "requiredExtra" as const, values: source.requiredExtras ?? [] },
    ];
    const listIds: string[] = [];
    for (const group of listGroups) {
      for (const [index, item] of group.values.entries()) {
        const stablePart = typeof item === "string" ? String(index + 1) : item.id;
        const id = `${source.id}-${group.type}-${stablePart}`;
        listIds.push(id);
        const referencePrice = typeof item === "string" ? undefined : item.referencePrice;
        const currency = typeof item === "string" ? undefined : item.currency;
        await prisma.tourListItem.upsert({
          where: { id },
          update: { displayOrder: index + 1, referencePrice, currency, status: "published" },
          create: { id, tourId: source.id, type: group.type, displayOrder: index + 1, referencePrice, currency, status: "published" },
        });
        for (const locale of locales) {
          const translatedTour = localized[locale].find((entry) => entry.id === source.id)!;
          const translatedValues = group.type === "included"
            ? translatedTour.included ?? []
            : group.type === "excluded"
              ? translatedTour.excluded ?? []
              : translatedTour.requiredExtras ?? [];
          const translated = translatedValues[index];
          if (translated === undefined) throw new Error(`Missing ${locale} list translation: ${id}`);
          const label = typeof translated === "string" ? translated : translated.label;
          await prisma.tourListItemTranslation.upsert({
            where: { listItemId_locale: { listItemId: id, locale } },
            update: { label },
            create: { id: `${id}-${locale}`, listItemId: id, locale, label },
          });
        }
      }
    }
    await prisma.tourListItem.deleteMany({
      where: { tourId: source.id, id: { notIn: listIds } },
    });

    const itineraryIds = (source.itinerary ?? []).map(
      (day) => `${source.id}-day-${day.day}`,
    );
    await prisma.tourItineraryDay.deleteMany({
      where: { tourId: source.id, id: { notIn: itineraryIds } },
    });
    for (const day of source.itinerary ?? []) {
      const id = `${source.id}-day-${day.day}`;
      await prisma.tourItineraryDay.upsert({
        where: { id },
        update: {
          dayNumber: day.day,
          displayOrder: day.day,
          imagePath: day.image?.src,
          status: "published",
          needsClientConfirmation: day.needsClientConfirmation ?? false,
        },
        create: {
          id,
          tourId: source.id,
          dayNumber: day.day,
          displayOrder: day.day,
          imagePath: day.image?.src,
          status: "published",
          needsClientConfirmation: day.needsClientConfirmation ?? false,
        },
      });
      for (const locale of locales) {
        const translated = localized[locale]
          .find((entry) => entry.id === source.id)
          ?.itinerary?.find((entry) => entry.day === day.day);
        if (!translated) throw new Error(`Missing ${locale} itinerary translation: ${id}`);
        await prisma.tourItineraryDayTranslation.upsert({
          where: { itineraryDayId_locale: { itineraryDayId: id, locale } },
          update: {
            title: translated.title,
            description: translated.description,
            overnight: translated.overnight,
            location: translated.location,
            imageAlt: translated.image?.alt,
          },
          create: {
            id: `${id}-${locale}`,
            itineraryDayId: id,
            locale,
            title: translated.title,
            description: translated.description,
            overnight: translated.overnight,
            location: translated.location,
            imageAlt: translated.image?.alt,
          },
        });
      }
    }
  }
}

async function seedFaq() {
  const localized = Object.fromEntries(
    locales.map((locale) => [locale, getFAQContent(locale)]),
  ) as Record<Locale, ReturnType<typeof getFAQContent>>;

  for (const source of localized.en.categories) {
    const id = `faq-category-${source.key}`;
    await prisma.faqCategory.upsert({
      where: { id },
      update: { key: source.key, displayOrder: source.displayOrder, status: "published" },
      create: { id, key: source.key, displayOrder: source.displayOrder, status: "published" },
    });
    for (const locale of locales) {
      const translated = localized[locale].categories.find((entry) => entry.key === source.key)!;
      await prisma.faqCategoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: id, locale } },
        update: { label: translated.label },
        create: { id: `${id}-${locale}`, categoryId: id, locale, label: translated.label },
      });
    }
  }

  for (const source of localized.en.items) {
    const categoryId = `faq-category-${source.category}`;
    await prisma.faqItem.upsert({
      where: { id: source.id },
      update: { categoryId, displayOrder: source.displayOrder, status: publication(source.published) },
      create: { id: source.id, categoryId, displayOrder: source.displayOrder, status: publication(source.published) },
    });
    for (const locale of locales) {
      const translated = localized[locale].items.find((entry) => entry.id === source.id)!;
      await prisma.faqItemTranslation.upsert({
        where: { faqItemId_locale: { faqItemId: source.id, locale } },
        update: { question: translated.question, answer: json(translated.answer) },
        create: { id: `${source.id}-${locale}`, faqItemId: source.id, locale, question: translated.question, answer: json(translated.answer) },
      });
    }
  }
}

async function upsertPage(key: string, contents: Record<Locale, { hero: { eyebrow?: string; title: string; description?: string } }>) {
  const id = `page-${key}`;
  await prisma.contentPage.upsert({
    where: { id }, update: { status: "published" }, create: { id, key, status: "published" },
  });
  for (const locale of locales) {
    const hero = contents[locale].hero;
    await prisma.contentPageTranslation.upsert({
      where: { pageId_locale: { pageId: id, locale } },
      update: { eyebrow: hero.eyebrow, title: hero.title, description: hero.description },
      create: { id: `${id}-${locale}`, pageId: id, locale, eyebrow: hero.eyebrow, title: hero.title, description: hero.description },
    });
  }
  return id;
}

async function seedAbout() {
  const localized = Object.fromEntries(
    locales.map((locale) => [locale, getAboutContent(locale)]),
  ) as Record<Locale, AboutPageData>;
  const pageId = await upsertPage("about", localized);
  const sectionKeys = ["island", "geography", "flora", "fauna", "culture", "history"] as const;
  for (const key of sectionKeys) {
    const source = localized.en[key];
    const id = `about-${source.id}`;
    const feature = "items" in source;
    await prisma.contentSection.upsert({
      where: { id },
      update: { key: source.id, sectionType: feature ? "feature" : "editorial", imagePath: "image" in source ? source.image?.src : undefined, displayOrder: source.displayOrder, status: publication(source.published) },
      create: { id, pageId, key: source.id, sectionType: feature ? "feature" : "editorial", imagePath: "image" in source ? source.image?.src : undefined, displayOrder: source.displayOrder, status: publication(source.published) },
    });
    for (const locale of locales) {
      const translated = localized[locale][key];
      await prisma.contentSectionTranslation.upsert({
        where: { sectionId_locale: { sectionId: id, locale } },
        update: { eyebrow: translated.eyebrow, title: translated.title, description: "description" in translated ? translated.description : undefined, paragraphs: "paragraphs" in translated ? json(translated.paragraphs) : undefined, imageAlt: "image" in translated ? translated.image?.alt : undefined },
        create: { id: `${id}-${locale}`, sectionId: id, locale, eyebrow: translated.eyebrow, title: translated.title, description: "description" in translated ? translated.description : undefined, paragraphs: "paragraphs" in translated ? json(translated.paragraphs) : undefined, imageAlt: "image" in translated ? translated.image?.alt : undefined },
      });
    }
    if (feature) {
      for (const item of source.items) {
        const itemId = `about-${item.id}`;
        await prisma.contentItem.upsert({
          where: { id: itemId },
          update: { key: item.id, imagePath: item.image?.src, displayOrder: item.displayOrder, status: publication(item.published) },
          create: { id: itemId, sectionId: id, key: item.id, imagePath: item.image?.src, displayOrder: item.displayOrder, status: publication(item.published) },
        });
        for (const locale of locales) {
          const translatedSection = localized[locale][key];
          if (!("items" in translatedSection)) continue;
          const translated = translatedSection.items.find((entry) => entry.id === item.id)!;
          await prisma.contentItemTranslation.upsert({
            where: { contentItemId_locale: { contentItemId: itemId, locale } },
            update: { title: translated.title, description: translated.description, imageAlt: translated.image?.alt },
            create: { id: `${itemId}-${locale}`, contentItemId: itemId, locale, title: translated.title, description: translated.description, imageAlt: translated.image?.alt },
          });
        }
      }
    }
  }

  const highlightsId = "about-highlights";
  await prisma.contentSection.upsert({ where: { id: highlightsId }, update: { displayOrder: 7, status: "published" }, create: { id: highlightsId, pageId, key: "highlights", sectionType: "highlights", displayOrder: 7, status: "published" } });
  for (const locale of locales) {
    await prisma.contentSectionTranslation.upsert({ where: { sectionId_locale: { sectionId: highlightsId, locale } }, update: { title: locale === "en" ? "Why Socotra Is Unique" : "ما الذي يجعل سقطرى فريدة" }, create: { id: `${highlightsId}-${locale}`, sectionId: highlightsId, locale, title: locale === "en" ? "Why Socotra Is Unique" : "ما الذي يجعل سقطرى فريدة" } });
  }
  for (const source of localized.en.highlights) {
    const id = `about-${source.id}`;
    await prisma.contentItem.upsert({ where: { id }, update: { displayOrder: source.displayOrder, status: publication(source.published) }, create: { id, sectionId: highlightsId, key: source.id, displayOrder: source.displayOrder, status: publication(source.published) } });
    for (const locale of locales) {
      const translated = localized[locale].highlights.find((item) => item.id === source.id)!;
      await prisma.contentItemTranslation.upsert({ where: { contentItemId_locale: { contentItemId: id, locale } }, update: { title: translated.title, description: translated.description }, create: { id: `${id}-${locale}`, contentItemId: id, locale, title: translated.title, description: translated.description } });
    }
  }

  const ctaId = "about-final-cta";
  await prisma.contentSection.upsert({
    where: { id: ctaId },
    update: { displayOrder: 8, status: "published" },
    create: { id: ctaId, pageId, key: "final-cta", sectionType: "cta", displayOrder: 8, status: "published" },
  });
  for (const locale of locales) {
    const cta = localized[locale].cta;
    await prisma.contentSectionTranslation.upsert({
      where: { sectionId_locale: { sectionId: ctaId, locale } },
      update: { title: cta.title, description: cta.description },
      create: { id: `${ctaId}-${locale}`, sectionId: ctaId, locale, title: cta.title, description: cta.description },
    });
  }
  for (const [index, key] of ["primaryAction", "secondaryAction"].entries()) {
    const source = localized.en.cta[key as "primaryAction" | "secondaryAction"];
    if (!source) continue;
    const id = `${ctaId}-${key}`;
    await prisma.contentItem.upsert({
      where: { id },
      update: { href: source.href, displayOrder: index + 1, status: "published" },
      create: { id, sectionId: ctaId, key, href: source.href, displayOrder: index + 1, status: "published" },
    });
    for (const locale of locales) {
      const translated = localized[locale].cta[key as "primaryAction" | "secondaryAction"];
      if (!translated) continue;
      await prisma.contentItemTranslation.upsert({
        where: { contentItemId_locale: { contentItemId: id, locale } },
        update: { title: translated.label },
        create: { id: `${id}-${locale}`, contentItemId: id, locale, title: translated.label },
      });
    }
  }
}

async function seedGallery() {
  const localized = Object.fromEntries(locales.map((locale) => [locale, getGalleryContent(locale)])) as Record<Locale, ReturnType<typeof getGalleryContent>>;
  for (const source of localized.en.categories) {
    const id = `gallery-category-${source.id}`;
    await prisma.galleryCategory.upsert({ where: { id }, update: { key: source.id, displayOrder: source.displayOrder, status: publication(source.published) }, create: { id, key: source.id, displayOrder: source.displayOrder, status: publication(source.published) } });
    for (const locale of locales) {
      const translated = localized[locale].categories.find((item) => item.id === source.id)!;
      await prisma.galleryCategoryTranslation.upsert({ where: { categoryId_locale: { categoryId: id, locale } }, update: { label: translated.label }, create: { id: `${id}-${locale}`, categoryId: id, locale, label: translated.label } });
    }
  }
  for (const source of localized.en.items) {
    await prisma.galleryItem.upsert({ where: { id: source.id }, update: { categoryId: `gallery-category-${source.category}`, mediaPath: source.imageUrl, featured: source.featured, displayOrder: source.displayOrder, status: publication(source.published) }, create: { id: source.id, categoryId: `gallery-category-${source.category}`, mediaType: "image", mediaPath: source.imageUrl, featured: source.featured, displayOrder: source.displayOrder, status: publication(source.published) } });
    for (const locale of locales) {
      const translated = localized[locale].items.find((item) => item.id === source.id)!;
      await prisma.galleryItemTranslation.upsert({ where: { galleryItemId_locale: { galleryItemId: source.id, locale } }, update: { title: translated.title, description: translated.description, altText: translated.altText, location: translated.location }, create: { id: `${source.id}-${locale}`, galleryItemId: source.id, locale, title: translated.title, description: translated.description, altText: translated.altText, location: translated.location } });
    }
  }
  for (const source of localized.en.instagram.posts) {
    await prisma.instagramPost.upsert({ where: { id: source.id }, update: { mediaType: source.type, mediaPath: source.imageUrl, postUrl: source.postUrl, placeholder: source.placeholder, displayOrder: source.displayOrder, status: publication(source.published) }, create: { id: source.id, mediaType: source.type, mediaPath: source.imageUrl, postUrl: source.postUrl, placeholder: source.placeholder, displayOrder: source.displayOrder, status: publication(source.published) } });
    for (const locale of locales) {
      const translated = localized[locale].instagram.posts.find((item) => item.id === source.id)!;
      await prisma.instagramPostTranslation.upsert({ where: { instagramPostId_locale: { instagramPostId: source.id, locale } }, update: { altText: translated.altText, caption: translated.caption }, create: { id: `${source.id}-${locale}`, instagramPostId: source.id, locale, altText: translated.altText, caption: translated.caption } });
    }
  }
}

async function seedContact() {
  const localized = Object.fromEntries(locales.map((locale) => [locale, getContactContent(locale)])) as Record<Locale, ReturnType<typeof getContactContent>>;
  const pageId = await upsertPage("contact", localized);

  const sections = [
    { key: "intro", order: 1, type: "editorial" },
    { key: "form", order: 2, type: "form" },
    { key: "guidance", order: 3, type: "guidance" },
    { key: "bookingCTA", order: 4, type: "cta" },
  ] as const;
  for (const descriptor of sections) {
    const id = `contact-${descriptor.key}`;
    await prisma.contentSection.upsert({
      where: { id },
      update: { displayOrder: descriptor.order, status: "published" },
      create: { id, pageId, key: descriptor.key, sectionType: descriptor.type, displayOrder: descriptor.order, status: "published" },
    });
    for (const locale of locales) {
      const content = localized[locale][descriptor.key];
      if (!content) continue;
      const title = "title" in content ? content.title : localized[locale].form.title;
      const description = "description" in content ? content.description : undefined;
      const eyebrow = "eyebrow" in content ? content.eyebrow : undefined;
      await prisma.contentSectionTranslation.upsert({
        where: { sectionId_locale: { sectionId: id, locale } },
        update: { eyebrow, title, description },
        create: { id: `${id}-${locale}`, sectionId: id, locale, eyebrow, title, description },
      });
    }
  }

  const formItemKeys = ["submitLabel", "submittingLabel", "successTitle", "successMessage", "errorMessage", "unavailableMessage"] as const;
  for (const [index, key] of formItemKeys.entries()) {
    const id = `contact-form-${key}`;
    await prisma.contentItem.upsert({
      where: { id },
      update: { displayOrder: index + 1, status: "published" },
      create: { id, sectionId: "contact-form", key, displayOrder: index + 1, status: "published" },
    });
    for (const locale of locales) {
      await prisma.contentItemTranslation.upsert({
        where: { contentItemId_locale: { contentItemId: id, locale } },
        update: { title: localized[locale].form[key] },
        create: { id: `${id}-${locale}`, contentItemId: id, locale, title: localized[locale].form[key] },
      });
    }
  }

  for (const source of localized.en.guidance?.items ?? []) {
    const id = `contact-guidance-${source.id}`;
    await prisma.contentItem.upsert({
      where: { id },
      update: { displayOrder: source.displayOrder, status: publication(source.published) },
      create: { id, sectionId: "contact-guidance", key: source.id, displayOrder: source.displayOrder, status: publication(source.published) },
    });
    for (const locale of locales) {
      const translated = localized[locale].guidance?.items.find((item) => item.id === source.id);
      if (!translated) continue;
      await prisma.contentItemTranslation.upsert({
        where: { contentItemId_locale: { contentItemId: id, locale } },
        update: { title: translated.text },
        create: { id: `${id}-${locale}`, contentItemId: id, locale, title: translated.text },
      });
    }
  }

  for (const [index, key] of ["primaryAction", "secondaryAction"].entries()) {
    const actionKey = key as "primaryAction" | "secondaryAction";
    const source = localized.en.bookingCTA?.[actionKey];
    if (!source) continue;
    const id = `contact-booking-cta-${key}`;
    await prisma.contentItem.upsert({
      where: { id },
      update: { href: source.href, displayOrder: index + 1, status: "published" },
      create: { id, sectionId: "contact-bookingCTA", key, href: source.href, displayOrder: index + 1, status: "published" },
    });
    for (const locale of locales) {
      const translated = localized[locale].bookingCTA?.[actionKey];
      if (!translated) continue;
      await prisma.contentItemTranslation.upsert({
        where: { contentItemId_locale: { contentItemId: id, locale } },
        update: { title: translated.label },
        create: { id: `${id}-${locale}`, contentItemId: id, locale, title: translated.label },
      });
    }
  }

  for (const source of localized.en.enquiryTypes) {
    await prisma.contactEnquiryType.upsert({ where: { id: source.id }, update: { value: source.value, displayOrder: source.displayOrder, status: publication(source.published) }, create: { id: source.id, value: source.value, displayOrder: source.displayOrder, status: publication(source.published) } });
    for (const locale of locales) {
      const translated = localized[locale].enquiryTypes.find((item) => item.id === source.id)!;
      await prisma.contactEnquiryTypeTranslation.upsert({ where: { enquiryTypeId_locale: { enquiryTypeId: source.id, locale } }, update: { label: translated.label }, create: { id: `${source.id}-${locale}`, enquiryTypeId: source.id, locale, label: translated.label } });
    }
  }
}

async function seedSeo() {
  const entries = locales.flatMap((locale) => {
    const tourUi = getTourUI(locale);
    const faq = getFAQContent(locale);
    const about = getAboutContent(locale);
    const gallery = getGalleryContent(locale);
    const contact = getContactContent(locale);
    const booking = getBookingContent(locale);
    return [
      ["tours", tourUi.metadata.title, tourUi.metadata.description, undefined, false],
      ["faq", faq.seo.title, faq.seo.description, undefined, false],
      ["about", about.seo.title, about.seo.description, about.seo.image, false],
      ["gallery", gallery.seo.title, gallery.seo.description, gallery.seo.image, false],
      ["contact", contact.seo.title, contact.seo.description, contact.seo.image, false],
      ["booking", booking.seo.title, booking.seo.description, undefined, true],
    ].map(([pageKey, title, description, imagePath, noIndex]) => ({ locale, pageKey: String(pageKey), title: String(title), description: String(description), imagePath: imagePath ? String(imagePath) : undefined, noIndex: Boolean(noIndex) }));
  });
  for (const entry of entries) {
    const id = `seo-${entry.pageKey}-${entry.locale}`;
    await prisma.seoMetadata.upsert({ where: { pageKey_locale: { pageKey: entry.pageKey, locale: entry.locale } }, update: { title: entry.title, description: entry.description, imagePath: entry.imagePath, noIndex: entry.noIndex }, create: { id, ...entry } });
  }
}

async function seedVerifiedSettings() {
  await prisma.siteSetting.upsert({
    where: { key: "logoPath" },
    update: { value: "/logo.png", valueType: "string", isPublic: true },
    create: { id: "setting-logo-path", key: "logoPath", value: "/logo.png", valueType: "string", isPublic: true },
  });
}

async function main() {
  await seedTours();
  await seedFaq();
  await seedAbout();
  await seedGallery();
  await seedContact();
  await seedSeo();
  await seedVerifiedSettings();

  const counts = {
    tours: await prisma.tour.count(),
    tourTranslations: await prisma.tourTranslation.count(),
    pricingTiers: await prisma.tourPricingTier.count(),
    itineraryDays: await prisma.tourItineraryDay.count(),
    faqItems: await prisma.faqItem.count(),
    faqTranslations: await prisma.faqItemTranslation.count(),
    contentPages: await prisma.contentPage.count(),
    galleryItems: await prisma.galleryItem.count(),
    instagramPosts: await prisma.instagramPost.count(),
    enquiryTypes: await prisma.contactEnquiryType.count(),
    bookingRequests: await prisma.bookingRequest.count(),
    contactRequests: await prisma.contactRequest.count(),
    reviews: await prisma.review.count(),
  };
  console.info("Seed complete", counts);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
