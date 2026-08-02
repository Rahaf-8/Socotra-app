# Sitemap and Information Architecture

## 1. Document Purpose

This document defines the Version 1 route structure, page responsibilities, navigation model, state behavior, and indexing policy for the Socotra Island tourism website.

It distinguishes:

- **Confirmed scope:** Requirements approved in `docs/project-context.md` or explicitly supplied for this architecture phase.
- **Architectural recommendation:** A proposed implementation approach intended to keep the MVP maintainable.
- **Client Information Required:** Content or business facts that have not been provided.

Version 1 supports English and Arabic through locale-prefixed public pages. Instagram is included and online payment is excluded.

## 2. Route Tree

```text
/
├── tours
│   └── [slug]
├── about
├── gallery
├── faq
├── contact
├── booking
│   └── success
├── privacy
├── terms
└── admin
    ├── login
    ├── tours
    │   ├── new
    │   └── [id]
    ├── bookings
    │   └── [id]
    ├── flights
    ├── gallery
    ├── faqs
    ├── homepage
    ├── settings
    └── integrations
        └── instagram
```

Only routes listed above are planned for Version 1. Routes mentioned as possible footer content in the design brief, such as a travel guide or packing guide, are not confirmed pages and are not included.

## 3. Booking Route Decision

### Recommendation

Use:

`/booking?tour=[slug]`

Do not use `/tours/[slug]/book` in Version 1.

### Rationale

- Booking is one workflow with one canonical route, whether opened from a tour, the navbar, the contact page, or a general CTA.
- The optional `tour` query preserves selected-tour context without duplicating booking page implementations.
- A visitor can submit a general booking request when no tour is selected.
- Future campaign or referral context can be added as validated query parameters without changing route hierarchy.
- The selected slug is treated only as an input hint. The server must resolve it to a published tour and must not trust client-supplied tour details.

If the query contains an invalid, archived, or unpublished slug, show the general booking form with a non-alarming notice that the selected tour is unavailable. Never disclose draft tour data.

### Canonical and analytics behavior

- The canonical booking URL is `/booking`.
- Query variations should not be indexed as separate pages.
- Sensitive visitor data must never be placed in the URL.
- The success route should not expose a booking identifier or personal data in its URL.

## 4. Public Routes

### `/` — Homepage

**Purpose**

Introduce Socotra and the company, establish trust, surface current tours and flight guidance, and drive booking or WhatsApp inquiries.

**Main sections**

1. Transparent navbar
2. Fullscreen hero
3. Why Choose Socotra
4. Experience highlights
5. Featured tours
6. Flight information
7. Gallery preview
8. Instagram feed
9. FAQ preview
10. Testimonials only if authentic content is later confirmed
11. Final booking and WhatsApp CTA
12. Footer

The design brief includes testimonials visually, but testimonials are not confirmed client content. The section must remain disabled or clearly absent until authentic, approved testimonials exist.

**Primary CTA**

Explore tours or submit a booking request. WhatsApp is a prominent alternative.

**Data source**

- Structured homepage content managed in the database
- Featured published tours
- Active flights
- Published gallery items selected for homepage display
- Published FAQ items selected for homepage display
- Public site settings
- Instagram service with cached or placeholder fallback
- Central static navigation configuration

**SEO requirements**

- Indexable
- Default site metadata with homepage-specific title and description
- One clear page heading
- Canonical `/`
- Approved Open Graph image
- Organization or travel structured data only when all facts are client-approved

**Empty state**

- Optional data-driven sections hide cleanly if no approved records exist.
- Required homepage sections use an administrator preview warning until content is complete; they must not publish invented copy.
- The Flight Information section remains present with the confirmed twice-weekly statement, a clear message that no approved current schedule has been entered, and a visible disclaimer that schedules may change and should be reconfirmed during booking. It must not render placeholder rows as a timetable.
- Instagram may show approved, clearly labeled placeholder content during development. Production fallback behavior must not claim placeholder items are live Instagram posts.

**Loading state**

- Render core content server-side.
- Reserve media dimensions.
- Instagram may use a contained loading skeleton but must not delay the page.

**Error state**

- Core page errors use the public error boundary.
- Optional sections fail independently.
- Instagram failure shows cached content, approved fallback content, or hides the feed while preserving layout.

### `/tours` — Tours Listing

**Purpose**

Present every published tour in an understandable, comparable layout.

**Main sections**

- Page header
- Introductory client-approved copy
- Tour grid
- Final booking or WhatsApp CTA

Filters are not included unless a real volume or filtering requirement is later confirmed.

**Primary CTA**

View a tour.

**Data source**

Published tours ordered by `displayOrder`, then by a stable tie-breaker.

**SEO requirements**

- Indexable
- Unique title and description
- Canonical `/tours`
- Crawlable links to Tour Details pages
- No fabricated offer, price, rating, or availability metadata

**Empty state**

Show a professional message that tours are being prepared and offer contact options using verified settings. Do not display mock tours in production.

**Loading state**

Prefer server rendering. Route-level loading UI may show stable card skeletons during dynamic navigation.

**Error state**

Show a recoverable page error with retry/navigation options. Do not expose database errors.

### `/tours/[slug]` — Tour Details

**Purpose**

Provide complete information for one published tour and move the visitor into the booking flow.

**Main sections**

- Breadcrumbs
- Tour hero and featured image
- Overview: duration and client-provided price/currency
- Full description
- Day-by-day itinerary
- Included and excluded items
- Important notes
- Tour gallery
- Booking CTA and WhatsApp handoff
- Related tours only if later justified; not required for MVP

**Primary CTA**

Book this tour, linking to `/booking?tour=[slug]`.

**Data source**

One published, non-archived tour resolved by unique slug, including ordered itinerary days, images, inclusions, and exclusions; public site settings for contact actions.

**SEO requirements**

- Indexable only when published and complete
- Unique SEO title and description with controlled fallback to approved tour title/short description
- Canonical `/tours/[slug]`
- Approved social image
- Breadcrumb metadata
- Structured offer data only when all required facts are accurate and approved

**Empty state**

Not applicable for a valid record. Optional gallery and notes sections hide if empty.

**Loading state**

Use stable hero and content skeletons during client navigation where needed.

**Error state**

- Unknown, draft, archived, or unpublished slug returns the public not-found experience.
- Unexpected retrieval failure uses the route error boundary.

### `/about` — About

**Purpose**

Introduce Socotra through client-provided content about the island, geography,
climate, biodiversity, flora, fauna, Soqotri culture, history, ancient trade,
and clearly identified myths and legends.

**Main sections**

- Immersive destination hero
- The Island
- Geography and Climate
- Flora
- Fauna
- People and Culture
- History, Trade and Legends
- Why Socotra Is Unique
- Compact tours and booking-request CTA

**Primary CTA**

Explore tours, with a secondary booking-request link.

**Data source**

The current route uses centralized typed About data with stable section/item
IDs, publication flags, display order, structured editorial paragraphs,
feature items, CTA content, image metadata, and SEO fields. A repository-backed
source will replace this static adapter when dashboard management is
implemented, without changing presentation components.

**SEO requirements**

- Indexable
- Unique metadata
- Existing verified local Open Graph image only
- No unsupported credentials, sustainability claims, Arabian leopard claim,
  or unverified UNDP “Top 5” ranking

**Empty state**

Unpublished or empty sections/items do not render. The route must not invent
replacement copy or reference unavailable media.

**Loading state**

Server-rendered content; stable media placeholders where necessary.

**Error state**

Standard public error boundary.

### `/gallery` — Gallery

**Purpose**

Present approved destination and tour photography with useful context.

**Main sections**

- Compact Gallery hero
- Curated editorial image grid
- Compact Instagram feed with safe optional profile/post links
- Compact tours and booking-request CTA

A category filter and lightbox are not part of the current implementation
because the verified local image set is too small to justify additional client
state. They may be introduced later when approved media volume makes them
useful and the viewer can meet the documented accessibility requirements.

**Primary CTA**

Explore tours, with a secondary booking-request action.

**Data source**

The current route reads centralized typed categories, Gallery items, temporary
Instagram posts, hero copy, CTA content, and SEO metadata. Items are filtered
by publication state and ordered by `displayOrder`. Instagram profile and post
links render only when valid centralized values exist. Repository-backed
Gallery and Instagram sources will replace the static adapter later without
changing the page components.

**SEO requirements**

- Indexable
- Unique metadata
- Descriptive alternative text and approved captions
- Stable image URLs and dimensions
- Existing verified local Open Graph image only

**Empty state**

Hide empty groups and preserve the tours CTA. Never populate the page with
unlabelled stock content, broken paths, or invented social links.

**Loading state**

Server-render metadata and item frames; progressively load media without layout shift.

**Error state**

If media fails, retain caption/alt context and avoid breaking the grid. Data retrieval failures use the route error boundary.

### `/faq` — Frequently Asked Questions

**Purpose**

Answer client-approved traveler questions and reduce booking friction.

**Main sections**

- Compact page hero
- Compact ordered category navigation
- Category headings and ordered FAQ accordion groups
- Compact contact prompt

**Primary CTA**

Contact through WhatsApp or the Contact page.

**Data source**

The current page uses centralized typed FAQ content with structured answer
blocks, category definitions, publication flags, and display order. Public
contact actions use centralized site settings. A repository-backed database
source will replace the static adapter when FAQ dashboard management is
implemented, without changing page components.

**SEO requirements**

- Indexable
- Unique metadata
- FAQ structured data only when content is visible, approved, and compliant with current search-engine requirements

**Empty state**

Offer verified contact channels and explain that assistance is available. Do not invent answers.

**Loading state**

Prefer server-rendered FAQ data.

**Error state**

Standard public error with a contact fallback.

### `/contact` — Contact

**Purpose**

Provide verified contact routes for booking and general questions.

**Main sections**

- Compact Contact hero
- Introductory general-enquiry guidance
- Verified contact methods only when configured
- General enquiry form
- Concise “What to Include” guidance and FAQ link
- Compact booking-request CTA

**Primary CTA**

Submit a general enquiry when server delivery is configured, or continue to
the existing booking-request flow for tour-specific details.

**Data source**

Centralized typed Contact content supplies hero, form labels and feedback copy,
ordered enquiry types, guidance, CTA, and SEO. Verified public site settings
will supply optional contact methods. The current form uses a reusable Zod
schema and a non-persisting client boundary that honestly reports delivery as
not configured.

**SEO requirements**

- Indexable
- Unique metadata
- Organization/contact structured data only with verified client details

**Empty state**

Missing contact methods do not block the page. The method section is omitted,
while the guidance and booking CTA remain useful. Placeholder values must not
appear publicly.

**Loading state**

Static content is server-rendered. The Client Component form owns a
deterministic submitting state and prevents duplicate submission.

**Error state**

Field errors remain associated with controls. Until a server submission
operation exists, valid submission produces an explicit “not sent” message
rather than false success. Never expose raw configuration or provider errors.

### `/booking` — Booking Request

**Purpose**

Collect a booking inquiry, optionally tied to a published tour.

**Main sections**

- Page header
- Selected-tour summary when valid
- Booking form
- Privacy/terms consent
- WhatsApp alternative

**Primary CTA**

Submit booking request.

**Data source**

- Optional published tour resolved from the validated `tour` query
- Public site settings
- Confirmed privacy and terms links/content

**SEO requirements**

- Recommended `noindex, follow`
- Canonical `/booking`
- Query variants must not create indexable duplicates

**Empty state**

No selected tour produces a valid general booking form. Invalid tour context produces a safe notice and general form.

**Loading state**

Form submission uses an explicit pending state, disables duplicate submission, and preserves accessible status messaging.

**Error state**

- Field-level and summary validation errors
- Generic submission failure without internal details
- Entered non-sensitive values remain available where safe
- WhatsApp/contact fallback remains accessible

### `/booking/success` — Booking Request Confirmation

**Purpose**

Confirm that a request was received without implying payment or guaranteed reservation.

**Main sections**

- Confirmation message
- Explanation of the next step using approved language
- Tours/home navigation
- Optional WhatsApp handoff

**Primary CTA**

Return to tours or contact through WhatsApp.

**Data source**

Public site settings and static approved UI copy. No booking PII should be fetched from a URL.

**SEO requirements**

- `noindex, nofollow`
- Excluded from XML sitemap

**Empty state**

Direct visits should show a neutral confirmation/help state or redirect to `/booking`; they must not claim a request was submitted.

**Loading state**

None expected.

**Error state**

Standard public error fallback.

### `/privacy` — Privacy

**Purpose**

Present the client-approved privacy notice governing booking data, analytics, contact channels, and integrations.

**Main sections**

- Legal page header
- Approved privacy content
- Last updated date

**Primary CTA**

Contact the company with privacy questions, if approved.

**Data source**

Published typed `PageContent` for Privacy. Client-approved text is required.

**SEO requirements**

- Indexable unless legal counsel directs otherwise
- Canonical `/privacy`
- Unique metadata

**Empty state**

Production launch is blocked until required privacy language is supplied and approved.

**Loading/error states**

Server-rendered; standard public error boundary.

### `/terms` — Terms

**Purpose**

Present client-approved terms relevant to site use and booking requests.

**Main sections**

- Legal page header
- Approved terms
- Last updated date

**Primary CTA**

Return to booking or contact.

**Data source**

Published typed `PageContent` for Terms. Client approval is required.

**SEO requirements**

- Indexable unless legal counsel directs otherwise
- Canonical `/terms`
- Unique metadata

**Empty state**

Production booking consent is blocked until applicable terms are supplied and approved.

**Loading/error states**

Server-rendered; standard public error boundary.

## 5. Admin Routes

All admin routes except `/admin/login` require a valid authenticated admin session, use `noindex, nofollow`, and are excluded from the XML sitemap.

### `/admin/login`

- **Purpose:** Secure administrator authentication; no public registration.
- **Main content:** Login form and generic authentication errors.
- **Operation:** Server-side credential validation and session creation.
- **States:** Pending, invalid credentials, rate-limited, and temporary service failure.
- **Security:** Never reveal whether a specific account exists.

### `/admin`

- **Purpose:** Simple operational overview.
- **Main content:** Counts or summaries for new bookings, published/draft tours, active flights, and outstanding content configuration.
- **Data source:** Protected aggregate reads.
- **Empty state:** Helpful setup links rather than fictional metrics.

### `/admin/tours`

- **Purpose:** List, reorder, publish, unpublish, archive, and access tour editing.
- **Main content:** Search or basic status view only as needed; ordered table/list; create action.
- **States:** No tours, validation conflicts, stale update, action success/failure.

### `/admin/tours/new`

- **Purpose:** Create a draft tour.
- **Main content:** Tour form with required fields and save-as-draft behavior.
- **Rule:** A tour may not be published until required public content passes validation.

### `/admin/tours/[id]`

- **Purpose:** Edit one tour and its independently managed itinerary, images, inclusions, and exclusions.
- **Main content:** Tour fields, publication controls, itinerary editor, image manager, inclusion/exclusion editor.
- **Errors:** Unknown ID returns an admin not-found state; authorization and conflicts remain generic.

### `/admin/bookings`

- **Purpose:** Review booking requests.
- **Main content:** Status filters, date sorting, limited summary fields.
- **Privacy:** Display only operationally necessary personal data.

### `/admin/bookings/[id]`

- **Purpose:** Review one request, update status, add internal notes, and access controlled contact handoff.
- **Main content:** Submitted data, audit timestamps, status control, internal notes, email notification readiness, generated WhatsApp link where permitted.
- **Rule:** Internal notes are never returned publicly.

### `/admin/flights`

- **Purpose:** Create, edit, activate, deactivate, delete, and reorder the weekly flight schedule shown in the homepage Flight Information section.
- **Main content:** Ordered flight list and inline or dedicated editor for operating day, route title, departure and arrival locations, departure and arrival times, airline, optional flight number, schedule notes, active state, display order, and last-updated timestamp.
- **Public rule:** Only active entries appear publicly, in administrator-defined order. Normal schedule changes require no code change.
- **Empty state:** If no entries exist, guide the administrator to create one. Inactive or incomplete entries remain available for editing but do not appear publicly.
- **Rule:** Exact days, locations, airline, flight number, times, and notes remain **Client Information Required** until supplied. Activation must not manufacture missing facts.

### `/admin/gallery`

- **Purpose:** Add, edit, publish/unpublish, reorder, replace, and remove gallery records.
- **Main content:** Media grid, metadata form, ordering controls, publication controls.
- **Rule:** Image rights and approved alt text must be tracked operationally.

### `/admin/faqs`

- **Purpose:** Create, edit, publish/unpublish, reorder, and remove FAQ items.
- **Main content:** Ordered list and FAQ editor.

### `/admin/homepage`

- **Purpose:** Manage typed homepage sections without editing page code.
- **Main content:** Section-specific editors, enable/disable controls where allowed, display order controls within approved constraints, and preview guidance.
- **Rule:** Testimonials remain disabled until approved authentic content exists.

### `/admin/settings`

- **Purpose:** Manage public site settings and booking notification settings.
- **Main content:** Company identity, public contact details, WhatsApp details, ordered public social links, default SEO, footer content, flight introduction, notification recipients/configuration that are not secrets, plus typed About/Privacy/Terms content editors.
- **Rule:** Secret credentials are environment-managed and never editable as plain database settings.

### `/admin/integrations/instagram`

- **Purpose:** Show integration state, configuration guidance, last successful refresh, cache health, enable/disable control, and manual refresh.
- **Main content:** Non-secret status only.
- **Rule:** Tokens and secrets are never displayed or persisted as ordinary site settings.

## 6. Main Navigation

### Recommended desktop navigation

- Home
- Tours
- About
- Gallery
- FAQ
- Contact
- Primary CTA: Plan your journey

The actual labels are centrally defined in static typed configuration. They are not duplicated across components. The primary CTA resolves to `/booking`.

Flights are presented on the homepage in Version 1; a dedicated Flights page is not confirmed. Navigation may link to the homepage flight section using `/#flights` only if the section anchor remains stable and accessible.

### Data ownership

- Route paths and application-owned labels: typed static configuration
- Company name, logos, public contact details, and CTA contact values: database-managed site settings
- Admin navigation: typed static configuration with future authorization metadata

Normal content updates should not require component edits.

## 7. Footer Navigation

Recommended groups:

- **Explore:** Home, Tours, Gallery
- **Company:** About, Contact
- **Help:** FAQ, Booking
- **Legal:** Privacy, Terms

Contact information and approved social links come from public site settings. Do not include unconfirmed travel-guide, newsletter, responsible-tourism, or packing-guide destinations as active links.

## 8. Breadcrumb Behavior

- Home has no breadcrumb.
- First-level public pages may omit visible breadcrumbs when the page hierarchy is obvious.
- Tour Details shows `Home / Tours / [Tour title]`.
- Admin detail/edit pages show their parent list and current record label.
- Breadcrumb labels come from central route configuration or resolved entity titles.
- The current page is text, not a link.
- Breadcrumbs use semantic navigation markup and may support structured metadata on indexable public pages.
- Draft or personal information must never appear in public breadcrumb metadata.

## 9. Mobile Navigation

- Use the same central navigation source as desktop.
- Show a clearly labeled menu button with correct expanded state and focus management.
- Provide all primary routes, booking CTA, and WhatsApp action when configured.
- Keep minimum touch targets at 44 by 44px.
- Close on successful navigation and restore focus when dismissed.
- Include the shared English/Arabic language switcher in desktop and mobile navigation.

## 10. Indexing Policy

### Indexable

- `/`
- `/tours`
- Published `/tours/[slug]`
- `/about`
- `/gallery`
- `/faq`
- `/contact`
- `/privacy` and `/terms`, subject to approved legal strategy

### Excluded from indexing

- `/booking`
- `/booking/success`
- `/admin` and every descendant
- Draft, unpublished, or archived tour URLs
- Framework error and not-found pages
- Preview URLs, if introduced
- Any internal integration or authentication callback endpoints

The XML sitemap contains only canonical, indexable, published routes.

## 11. Not-Found Behavior

The public not-found page should:

- Use the shared public layout.
- State clearly that the requested page could not be found.
- Offer links to Home and Tours.
- Preserve verified WhatsApp/contact access without overemphasizing conversion.
- Avoid revealing whether an unpublished or archived record exists.
- Be excluded from indexing.

The admin not-found state should:

- Remain inside the protected admin layout.
- Link to the relevant collection or dashboard.
- Avoid exposing record details the user is not authorized to access.

## 12. Client Change Management

| Client request | Primary mechanism | Code change | Database migration | Environment update |
| --- | --- | ---: | ---: | ---: |
| Change company name | Site settings update | No | No | No |
| Replace logo | Site settings/media update | No | No | No |
| Change phone or WhatsApp | Site settings update | No | No | No |
| Change booking email | Site settings update | No | No | No |
| Add a tour | Dashboard content update | No | No | No |
| Edit a tour price | Dashboard content update | No | No | No |
| Reorder tours | Dashboard content update | No | No | No |
| Change an itinerary | Dashboard content update | No | No | No |
| Temporarily hide a tour | Unpublish in dashboard | No | No | No |
| Change flight details | Dashboard content update | No | No | No |
| Add FAQ items | Dashboard content update | No | No | No |
| Update homepage text | Homepage dashboard update | No | No | No |
| Replace images | Dashboard media/content update | No | No | No |
| Disable Instagram | Integration/site setting update | No | No | No |
| Add a new admin role | Authorization design and code change; likely data update | Yes | Possibly | No |
| Add another language | Future localization project | Yes | Likely | Possibly |
| Add online payments | Future payment/booking project | Yes | Likely | Yes |

Static navigation destinations are centrally configured. Changing a label or link is one configuration edit, not changes across multiple components. If the client later requires administrators to manage navigation itself, that is a new dashboard/content-model requirement and should be assessed separately.

## 13. Client Information Required

- Company name, logo, and company description
- Final approval and dedicated imagery for the supplied About content
- WhatsApp number, phone number, booking email, contact email, address, and business hours
- Tour names, slugs, descriptions, prices, currencies, durations, itineraries, media, inclusions, exclusions, and notes
- Flight routes, days, times, airline, notes, and approved schedule disclaimer
- FAQ answers
- Gallery media, metadata, credits, and rights
- Homepage copy and media
- Testimonials and permissions, if the section is to be enabled
- Privacy and terms content
- Instagram account, Meta configuration, credentials, and approved fallback content
- Final booking consent wording and post-submission expectations
# Implemented Locale Routing

English and Arabic public pages use locale-prefixed URLs. English is the deterministic default and `/` redirects to `/en`.

| English | Arabic | Notes |
| --- | --- | --- |
| `/en` | `/ar` | Homepage |
| `/en/tours` | `/ar/tours` | Tours listing |
| `/en/tours/[slug]` | `/ar/tours/[slug]` | Same stable slug in both locales |
| `/en/about` | `/ar/about` | About |
| `/en/faq` | `/ar/faq` | FAQ |
| `/en/gallery` | `/ar/gallery` | Gallery and Instagram |
| `/en/contact` | `/ar/contact` | General enquiry |
| `/en/booking` | `/ar/booking` | Booking request; query-string tour context is preserved |

The language switcher replaces only the first locale segment and preserves the remaining path, query parameters, and hash. Unsupported first segments are treated as unprefixed legacy paths and redirected under `/en`, where normal not-found behavior applies. Static assets, Next.js internals, API routes, and future `/admin` routes are excluded from locale redirection.
## Private administrator routes

- `/admin/login` — credentials login
- `/admin/change-password` — mandatory first-login password change
- `/admin` — protected redirect to the dashboard
- `/admin/dashboard` — protected read-only database overview
- `/admin/tours` — protected Tour list and safe deletion/archive controls
- `/admin/tours/new` — protected bilingual Tour creation
- `/admin/tours/[tourId]/edit` — protected shared and bilingual Tour editor

Admin routes are outside locale routing, use no public Navbar/Footer, are marked `noindex, nofollow`, and are excluded from the public sitemap and navigation.
