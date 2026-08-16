This is a bilingual English/Arabic Socotra tourism website built with Next.js App Router, Prisma, SQLite, and Auth.js.

## Administrator content management

Authenticated, active administrators with a current session and no forced password change can use:

- `/admin/tours` for the existing Tours CRUD.
- `/admin/faq`, `/admin/faq/new`, and `/admin/faq/[faqId]/edit` for bilingual FAQ items, answer blocks, category assignment, order, and publication status.
- `/admin/about` for the structured About page, its existing sections/items, publication state, order, and bilingual SEO.
- `/admin/contact` for structured Contact-page copy, public contact methods, enquiry-type labels, publication state, order, and bilingual SEO.
- `/admin/gallery`, `/admin/gallery/new`, and `/admin/gallery/[galleryItemId]/edit` for bilingual Gallery image records, preview, categories, publication, featured state, and order.
- `/admin/booking-requests` and `/admin/booking-requests/[requestId]` for the Booking Requests inbox, request details, workflow status, internal notes, and manual customer contact actions.
- `/admin/contact-requests` and `/admin/contact-requests/[requestId]` for the Contact Requests inbox, request details, workflow status, internal notes, and manual email replies.
- `/admin/reviews` and `/admin/reviews/[reviewId]` for filtered pending, approved, rejected, and archived customer-review moderation.

All mutations are authenticated Server Actions. Zod validates explicit allow-listed payloads on the server, and multi-translation writes run in Prisma transactions. Arabic fields are independent and RTL; the application does not translate or copy content between locales.

Public `/en` and `/ar` FAQ, About, and Contact pages read published records through server-only Prisma repositories. Exact locale translations are required and the repositories never fall back to the other language. Mutations revalidate the affected admin and bilingual public routes, the dashboard, and sitemap path. About imagery remains in the approved structural source because the existing page model does not store a hero image.

FAQ items may be deliberately hard-deleted after confirmation. FAQ category relations use `onDelete: Restrict`, preventing orphaned items. Contact methods may be hard-deleted after confirmation. A Contact enquiry type with historical `ContactRequest` relations is archived instead; an unreferenced type may be deleted. Public reads include only `published` records with the requested translation and, for contact methods, a non-empty real value.

## Request management

Public English and Arabic Booking and Contact forms now validate on both the client and server before creating real Prisma records. Booking submission resolves a currently published Tour by stable slug and stores its ID plus a locale-specific title snapshot. Contact submission resolves a currently published enquiry type and stores both its optional relation and stable value snapshot. Exact duplicate submissions within a restrained two-minute window return the existing successful receipt state without creating a second row. Both forms include a hidden honeypot, field-length limits, meaningful minimums, and malformed-input rejection.

Booking requests use the existing `new`, `reviewing`, `contacted`, `confirmed`, `declined`, and `archived` workflow. Contact requests use the existing `new`, `inProgress`, `resolved`, and `archived` workflow. Each request has one optional administrator-only plain-text note; notes are never loaded by public pages. Request lists are server-rendered, newest first, status-filterable, and bounded to 100 records so pagination can be added without moving personal data into a client-side grid.

The administrator's **Reply by Email** action opens a safe `mailto:` link with only a restrained subject. Booking requests with a valid international WhatsApp number receive a **Contact on WhatsApp** action using `https://wa.me/`; spaces, parentheses, and hyphens are removed and invalid/non-international values produce no link. The approved Contact form does not collect a phone number, so Contact Requests currently offer email only.

Email is not sent by the website and no provider is configured. WhatsApp is not automated and no Business/Cloud API is integrated; both actions open external communication tools for a human administrator. There is no online payment, automatic availability decision, or automatic booking confirmation. Future notification-provider work remains outside this phase.

`BookingRequest.tour` remains `onDelete: Restrict`, and Tours with request history are archived by Tours CRUD. `ContactRequest.enquiryType` remains optional with `onDelete: SetNull`, while `enquiryValue` preserves historical context and Contact Content archives referenced enquiry types. Request mutations revalidate only the appropriate protected inbox/detail route and dashboard.

## Customer reviews

The existing Reviews section on `/en` and `/ar` now reads Prisma records instead of placeholder testimonials. It shows at most three newest reviews for the current submission locale and calculates its rating/count summary from all approved reviews in that locale. Pending and rejected records, reviewer email addresses, and moderation data are never selected for public rendering. User text is preserved as plain text and is not translated.

The responsive **Write a Review** form is embedded in the existing homepage section. It collects name, private email, an accessible 1–5 star radio choice, and a 20–2,000 character review. Client and server Zod validation, a hidden honeypot, strict field lengths, and a two-minute exact-duplicate window provide restrained abuse protection. Successful submissions always enter `pending`; the receipt explains that administrator approval is required.

The star selector is a controlled React Hook Form field: its checked/fill state and submitted integer use the same value, with localized screen-reader labels, visible keyboard focus, and 48-pixel touch targets. The public summary displays no numeric average when there are zero approved reviews. Review cards and the administrator moderation list use wrapping responsive grids/cards rather than horizontally scrolling tables. Reviews remain scoped to their submission locale because the public content architecture requires exact `en` or `ar` context; text is preserved and never translated.

Authenticated administrators moderate real records at `/admin/reviews` and inspect complete records at `/admin/reviews/[reviewId]`. The allow-listed workflow is `pending`, `approved`, `rejected`, or `archived`; only `approved` is public. Rejection and archival preserve the record while hiding it. Permanent deletion requires an explicit confirmation checkbox. Every mutation is a protected Server Action that calls `requireAdmin()` and revalidates the admin list/detail/dashboard plus both locale homepages.

The `20260816140000_rebuild_reviews_system` migration records the non-destructive archival status addition. Reviewer email is selected only by protected administrator queries and is never included in public cards, aggregates, metadata, or structured data. There are no reviewer accounts, notification providers, server-sent email, WhatsApp API, Instagram integration, uploads, or payment behavior. Email/WhatsApp notification integrations remain possible future work but are not configured.

## Gallery architecture

Public `/en/gallery`, `/ar/gallery`, and featured homepage previews read published Gallery items from a server-only Prisma repository. Queries require the requested locale translation, published category and item status, `image` media type, and deterministic order. Page-level Gallery metadata comes from the existing bilingual `SeoMetadata` records. The Gallery page's approved hero, CTA, and temporary Instagram presentation copy remain in the locale adapter; Instagram CRUD, APIs, OAuth, and scraping are outside this phase.

Gallery mutations are authenticated Server Actions and transactionally write the shared `GalleryItem` plus its independent English and Arabic `GalleryItemTranslation` records. Confirmed item deletion removes the database record and cascading translations, but never deletes the referenced local/remote image asset. Existing category labels, order, and status can be edited; stable keys, category creation/deletion, and the structural `all` category are intentionally protected. `GalleryItem.category` uses `onDelete: Restrict`, preventing orphaned items.

Administrators normally choose Gallery and Tour images from their devices. One authenticated `/api/admin/images` Route Handler validates JPEG/JFIF, PNG, WebP, or AVIF content up to 12 MB, then performs a signed server-side Cloudinary upload. The secret is never exposed to client code. Upload contexts map to `socotra/gallery`, `socotra/tours/hero`, `socotra/tours/cards`, `socotra/tours/gallery`, or `socotra/tours/itinerary`; browser input cannot choose a folder or public ID.

Prisma stores the secure delivery reference and a nullable Cloudinary public ID beside each existing image field. `CloudinaryAsset` is an ownership registry used to validate newly uploaded IDs and authorize later destruction; no image binary is stored in SQLite. Existing local paths and approved Unsplash URLs remain supported and never trigger remote deletion. `res.cloudinary.com/**/image/upload/**` is the only new Next Image host pattern.

Replacement uploads the new asset first, transactionally saves and claims it, and only then attempts deletion of the previous registered asset. A failed database save attempts cleanup of the new upload and preserves the old reference. Removing optional images clears the database reference first; Gallery, required Tour hero, and Tour-gallery records still require a valid image. Failed post-save provider deletion leaves ownership metadata available for operational cleanup rather than corrupting database state.

Required server environment names are `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. They must be configured in each runtime environment and never use `NEXT_PUBLIC_`. Missing configuration affects upload controls safely without breaking unrelated public pages.

### Manual checks

1. Sign in at `/admin/login` with an independently provisioned administrator.
2. Open FAQ, About, and Contact from the protected navigation; verify a signed-out browser is redirected to login.
3. Create a bilingual draft FAQ, publish it, verify both locale pages and FAQ structured data, then delete the temporary item.
4. Edit and restore one About field and one Contact field; verify each locale independently.
5. Submit temporary English and Arabic Booking and Contact requests; verify each appears in its protected inbox, then archive or remove the temporary verification records deliberately.
6. Open each request detail, update its status and internal note, and verify the note never appears on public pages.
7. Verify email links use the submitted address and WhatsApp appears only for a valid international Booking number with an `https://wa.me/` URL.
8. Verify invalid/unpublished Tours and enquiry types, malformed input, honeypot input, and immediate exact duplicates are handled safely.
9. Verify empty/unpublished contact methods do not render and published enquiry labels populate the Contact form.
10. Verify Arabic pages remain RTL, Tours/Gallery/FAQ/About/Contact management still opens, logout works, and admin pages emit `noindex, nofollow`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
