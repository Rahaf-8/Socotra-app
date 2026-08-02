-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "durationDays" INTEGER,
    "heroImagePath" TEXT NOT NULL,
    "cardImagePath" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "needsClientConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TourTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "packageLabel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tourType" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "durationLabel" TEXT,
    "pricingAvailabilityLabel" TEXT,
    "accommodationNote" TEXT,
    "practicalNote" TEXT,
    "heroImageAlt" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    CONSTRAINT "TourTranslation_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourPricingTier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "minGuests" INTEGER,
    "maxGuests" INTEGER,
    "pricePerPerson" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'published',
    CONSTRAINT "TourPricingTier_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourPricingTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pricingTierId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "TourPricingTranslation_pricingTierId_fkey" FOREIGN KEY ("pricingTierId") REFERENCES "TourPricingTier" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "referencePrice" INTEGER,
    "currency" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'published',
    CONSTRAINT "TourListItem_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourListItemTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listItemId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "TourListItemTranslation_listItemId_fkey" FOREIGN KEY ("listItemId") REFERENCES "TourListItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourItineraryDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "imagePath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "needsClientConfirmation" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TourItineraryDay_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourItineraryDayTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itineraryDayId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "overnight" TEXT,
    "location" TEXT,
    "imageAlt" TEXT,
    CONSTRAINT "TourItineraryDayTranslation_itineraryDayId_fkey" FOREIGN KEY ("itineraryDayId") REFERENCES "TourItineraryDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'published',
    CONSTRAINT "TourImage_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourImageTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourImageId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "title" TEXT,
    CONSTRAINT "TourImageTranslation_tourImageId_fkey" FOREIGN KEY ("tourImageId") REFERENCES "TourImage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FaqCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published'
);

-- CreateTable
CREATE TABLE "FaqCategoryTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "FaqCategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FaqCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FaqItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FaqCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FaqItemTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "faqItemId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" JSONB NOT NULL,
    CONSTRAINT "FaqItemTranslation_faqItemId_fkey" FOREIGN KEY ("faqItemId") REFERENCES "FaqItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContentPageTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "ContentPageTranslation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "ContentPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "sectionType" TEXT NOT NULL,
    "imagePath" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    CONSTRAINT "ContentSection_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "ContentPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentSectionTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "paragraphs" JSONB,
    "imageAlt" TEXT,
    CONSTRAINT "ContentSectionTranslation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ContentSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "imagePath" TEXT,
    "href" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    CONSTRAINT "ContentItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ContentSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentItemTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentItemId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageAlt" TEXT,
    CONSTRAINT "ContentItemTranslation_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GalleryCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published'
);

-- CreateTable
CREATE TABLE "GalleryCategoryTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "GalleryCategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GalleryCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "mediaPath" TEXT NOT NULL,
    "postUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GalleryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GalleryCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GalleryItemTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "galleryItemId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "altText" TEXT NOT NULL,
    "location" TEXT,
    CONSTRAINT "GalleryItemTranslation_galleryItemId_fkey" FOREIGN KEY ("galleryItemId") REFERENCES "GalleryItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InstagramPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaType" TEXT NOT NULL,
    "mediaPath" TEXT NOT NULL,
    "postUrl" TEXT,
    "placeholder" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InstagramPostTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instagramPostId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    CONSTRAINT "InstagramPostTranslation_instagramPostId_fkey" FOREIGN KEY ("instagramPostId") REFERENCES "InstagramPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "href" TEXT,
    "external" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft'
);

-- CreateTable
CREATE TABLE "ContactMethodTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contactMethodId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "ContactMethodTranslation_contactMethodId_fkey" FOREIGN KEY ("contactMethodId") REFERENCES "ContactMethod" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactEnquiryType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published'
);

-- CreateTable
CREATE TABLE "ContactEnquiryTypeTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enquiryTypeId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "ContactEnquiryTypeTranslation_enquiryTypeId_fkey" FOREIGN KEY ("enquiryTypeId") REFERENCES "ContactEnquiryType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enquiryTypeId" TEXT,
    "enquiryValue" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContactRequest_enquiryTypeId_fkey" FOREIGN KEY ("enquiryTypeId") REFERENCES "ContactEnquiryType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "selectedPackageTitle" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "preferredArrivalDate" DATETIME NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "specialRequirements" TEXT,
    "locale" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookingRequest_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "valueType" TEXT NOT NULL DEFAULT 'string',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettingTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteSettingId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "SiteSettingTranslation_siteSettingId_fkey" FOREIGN KEY ("siteSettingId") REFERENCES "SiteSetting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platformKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft'
);

-- CreateTable
CREATE TABLE "SocialLinkTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "socialLinkId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "SocialLinkTranslation_socialLinkId_fkey" FOREIGN KEY ("socialLinkId") REFERENCES "SocialLink" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SeoMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageKey" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imagePath" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

-- CreateIndex
CREATE INDEX "Tour_status_displayOrder_idx" ON "Tour"("status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "TourTranslation_tourId_locale_key" ON "TourTranslation"("tourId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "TourPricingTier_tourId_displayOrder_key" ON "TourPricingTier"("tourId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "TourPricingTranslation_pricingTierId_locale_key" ON "TourPricingTranslation"("pricingTierId", "locale");

-- CreateIndex
CREATE INDEX "TourListItem_tourId_type_status_idx" ON "TourListItem"("tourId", "type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TourListItem_tourId_type_displayOrder_key" ON "TourListItem"("tourId", "type", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "TourListItemTranslation_listItemId_locale_key" ON "TourListItemTranslation"("listItemId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "TourItineraryDay_tourId_dayNumber_key" ON "TourItineraryDay"("tourId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TourItineraryDayTranslation_itineraryDayId_locale_key" ON "TourItineraryDayTranslation"("itineraryDayId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "TourImage_tourId_displayOrder_key" ON "TourImage"("tourId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "TourImageTranslation_tourImageId_locale_key" ON "TourImageTranslation"("tourImageId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "FaqCategory_key_key" ON "FaqCategory"("key");

-- CreateIndex
CREATE INDEX "FaqCategory_status_displayOrder_idx" ON "FaqCategory"("status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "FaqCategoryTranslation_categoryId_locale_key" ON "FaqCategoryTranslation"("categoryId", "locale");

-- CreateIndex
CREATE INDEX "FaqItem_categoryId_status_displayOrder_idx" ON "FaqItem"("categoryId", "status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "FaqItemTranslation_faqItemId_locale_key" ON "FaqItemTranslation"("faqItemId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ContentPage_key_key" ON "ContentPage"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ContentPageTranslation_pageId_locale_key" ON "ContentPageTranslation"("pageId", "locale");

-- CreateIndex
CREATE INDEX "ContentSection_pageId_status_displayOrder_idx" ON "ContentSection"("pageId", "status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ContentSection_pageId_key_key" ON "ContentSection"("pageId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "ContentSectionTranslation_sectionId_locale_key" ON "ContentSectionTranslation"("sectionId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ContentItem_sectionId_key_key" ON "ContentItem"("sectionId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "ContentItemTranslation_contentItemId_locale_key" ON "ContentItemTranslation"("contentItemId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCategory_key_key" ON "GalleryCategory"("key");

-- CreateIndex
CREATE INDEX "GalleryCategory_status_displayOrder_idx" ON "GalleryCategory"("status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCategoryTranslation_categoryId_locale_key" ON "GalleryCategoryTranslation"("categoryId", "locale");

-- CreateIndex
CREATE INDEX "GalleryItem_status_displayOrder_idx" ON "GalleryItem"("status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryItemTranslation_galleryItemId_locale_key" ON "GalleryItemTranslation"("galleryItemId", "locale");

-- CreateIndex
CREATE INDEX "InstagramPost_status_displayOrder_idx" ON "InstagramPost"("status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramPostTranslation_instagramPostId_locale_key" ON "InstagramPostTranslation"("instagramPostId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ContactMethod_key_key" ON "ContactMethod"("key");

-- CreateIndex
CREATE INDEX "ContactMethod_status_displayOrder_idx" ON "ContactMethod"("status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ContactMethodTranslation_contactMethodId_locale_key" ON "ContactMethodTranslation"("contactMethodId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ContactEnquiryType_value_key" ON "ContactEnquiryType"("value");

-- CreateIndex
CREATE INDEX "ContactEnquiryType_status_displayOrder_idx" ON "ContactEnquiryType"("status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ContactEnquiryTypeTranslation_enquiryTypeId_locale_key" ON "ContactEnquiryTypeTranslation"("enquiryTypeId", "locale");

-- CreateIndex
CREATE INDEX "ContactRequest_status_createdAt_idx" ON "ContactRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BookingRequest_status_createdAt_idx" ON "BookingRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BookingRequest_tourId_createdAt_idx" ON "BookingRequest"("tourId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettingTranslation_siteSettingId_locale_key" ON "SiteSettingTranslation"("siteSettingId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_platformKey_key" ON "SocialLink"("platformKey");

-- CreateIndex
CREATE INDEX "SocialLink_status_displayOrder_idx" ON "SocialLink"("status", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLinkTranslation_socialLinkId_locale_key" ON "SocialLinkTranslation"("socialLinkId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "SeoMetadata_pageKey_locale_key" ON "SeoMetadata"("pageKey", "locale");
