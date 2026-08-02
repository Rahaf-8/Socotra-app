# Component and Module Architecture

## 1. Purpose

This document defines the planned frontend and server-module boundaries for the Socotra Island tourism website. It is an architecture guide only and does not create components or application code.

The plan is intentionally practical for one developer:

- Next.js App Router pages compose features.
- Server Components are the default.
- Client Components are limited to genuine interaction.
- Business content comes from typed services/settings, not scattered component literals.
- Database access is isolated behind repositories.
- Shared Zod schemas validate forms in browser and server contexts.
- External providers are accessed through server-only adapters.
- Version 1 supports English and Arabic, includes Instagram, and excludes online payment.

Before implementation, relevant Next.js 16.2.11 documentation under `node_modules/next/dist/docs/` must be reviewed as required by `AGENTS.md`.

## 2. Dependency Direction

```text
App routes and layouts
        ↓
Feature/presentation components
        ↓
Use-case services and shared validation
        ↓
Repository and external-service interfaces
        ↓
Prisma implementation / Instagram adapter / email adapter
```

Rules:

- Components never import Prisma Client.
- Components never read secret environment variables.
- Repositories return domain DTOs, not provider-specific result shapes.
- Services enforce business rules and compose repositories/adapters.
- Server Actions and Route Handlers are thin boundaries: authenticate, validate, call service, map result.
- External adapters do not leak vendor payload types beyond `src/lib/services`.
- Route files do not contain reusable business logic.
- Client Components receive minimal serializable props.

## 3. Recommended Folder Structure

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── tours/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── booking/
│   │   │   ├── page.tsx
│   │   │   └── success/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── (protected)/
│   │   │   ├── page.tsx
│   │   │   ├── tours/
│   │   │   ├── bookings/
│   │   │   ├── flights/
│   │   │   ├── gallery/
│   │   │   ├── faqs/
│   │   │   ├── homepage/
│   │   │   ├── settings/
│   │   │   ├── integrations/instagram/
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── bookings/route.ts
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/
│   ├── layout/
│   ├── home/
│   ├── tours/
│   ├── booking/
│   ├── gallery/
│   └── admin/
├── config/
├── lib/
│   ├── actions/
│   ├── auth/
│   ├── repositories/
│   ├── seo/
│   ├── services/
│   │   └── adapters/
│   ├── validation/
│   ├── db/
│   └── utils/
└── types/
```

Names are recommendations, not created files. Exact route-group syntax and boundary-file behavior must be confirmed against the installed Next.js documentation before implementation.

## 4. Folder Responsibilities

### `src/app`

Owns routing, layouts, metadata entry points, route-level loading/error/not-found behavior, and composition.

Route modules should:

- Load data through services/query modules.
- Select the appropriate page/feature components.
- Set page metadata through `src/lib/seo`.
- Keep route-specific orchestration concise.
- Avoid Prisma queries and reusable business rules.

### `src/components`

Contains reusable visual components. No component should know whether data came from SQLite, PostgreSQL, Prisma, an external API, or placeholder source.

### `src/components/ui`

Small shared UI primitives with no business knowledge:

- Button
- LinkButton
- Input
- Textarea
- Select
- Checkbox
- Label
- FormField
- Alert
- Dialog
- Accordion primitives
- Card
- Badge
- Skeleton
- Spinner
- IconButton
- VisuallyHidden

Characteristics:

- Typed visual variants with class-variance-authority
- Class composition with clsx
- Accessible states and focus treatment
- Minimal Client Component usage
- No database/service imports
- No client-specific content

### `src/components/layout`

Global public layout and navigation:

- `Navbar`
- `MobileNavigation`
- `Footer`
- `WhatsAppButton`
- `PageHeader`
- `Breadcrumbs`
- `Container`
- `SectionHeading`
- `EmptyState`
- `ErrorState`

Navigation paths/labels come from `src/config/navigation`. Company identity, contact details, and WhatsApp data arrive through a public site-settings DTO loaded by the layout.

### `src/components/home`

Homepage feature components:

- `Hero`
- `WhySocotra`
- `ExperienceHighlights`
- `FeaturedTours`
- `FlightInformation`
- `GalleryPreview`
- `InstagramFeed`
- `FinalBookingCTA`
- `Testimonials` only as a dormant/planned feature if authentic content is later confirmed

Each component receives a typed section view model. It does not query its data or embed client copy.

### `src/components/tours`

- `TourCard`
- `TourGrid`
- `TourHero`
- `TourOverview`
- `ItineraryTimeline`
- `IncludedExcludedList`
- `TourGallery`
- `TourBookingCTA`

`TourFilters` is not planned for the initial version. Add it only after a real requirement and sufficient tour volume justify filtering.

### `src/components/booking`

- `BookingForm`
- `BookingSummary`
- `BookingSuccessState`

The form owns interactive field behavior, not persistence. It consumes the shared booking schema through a form adapter and submits to the single approved server operation.

### `src/components/contact`

- `ContactHero`
- `ContactMethods`
- `ContactForm`
- `ContactGuidance`
- `ContactBookingCTA`

The page, hero, optional methods, guidance, and CTA remain Server Components.
Only `ContactForm` is client-rendered for React Hook Form state. It receives
centralized form copy and ordered enquiry options, consumes the shared Contact
Zod schema, and calls one isolated service boundary. The current boundary does
not transmit or retain messages and returns an honest not-configured result.
Contact methods render only when published label, value, and safe link data
exist.

### `src/components/gallery`

- `GalleryGrid`
- `GalleryItem`
- `GalleryPreview`
- `InstagramFeed`
- `GalleryCTA`

These components are Server Components and receive typed source-independent
data. `GalleryGrid` and `GalleryItem` render stable responsive image frames;
the homepage preview reuses the same centralized published Gallery records.
`InstagramFeed` accepts normalized temporary, future API, or future
dashboard-managed post data and never calls Meta directly.

No lightbox or filter Client Component is currently implemented because the
approved local media set does not justify that complexity. If added later,
keep the client boundary isolated and provide dialog semantics, focus trapping
and restoration, Escape handling, keyboard previous/next controls, and
background-scroll locking.

### `src/components/admin`

- `AdminSidebar`
- `AdminHeader`
- `DataTable`
- `StatusBadge`
- `TourForm`
- `ItineraryEditor`
- `TourImageManager`
- `IncludedExcludedEditor`
- `BookingDetails`
- `BookingStatusForm`
- `FlightForm`
- `GalleryManager`
- `FaqEditor`
- `HomepageContentEditor`
- `SiteSettingsForm`
- `PageContentEditor`
- `InstagramIntegrationStatus`
- `ConfirmActionDialog`

Admin components receive authorization-filtered DTOs. They do not perform authorization themselves or import repositories.

### `src/lib/actions`

Thin protected mutation boundaries grouped by feature:

- Tours
- Itineraries and tour media/items
- Bookings
- Flights
- Gallery
- FAQs
- Homepage
- Settings
- Instagram refresh
- Authentication when compatible with the chosen auth design

Each action:

1. Verifies authentication/authorization.
2. Parses input with a Zod schema.
3. Calls one service use case.
4. Maps domain errors to safe action results.
5. Revalidates only affected routes/tags.

No action should contain raw Prisma operations or provider calls.

### `src/lib/validation`

Canonical reusable Zod contracts:

- `booking`
- `contact-request`
- `tour`
- `itinerary`
- `tour-image`
- `tour-item`
- `flight`
- `gallery`

`contact-request` trims and bounds all strings, validates email, and restricts
enquiry type to the centralized published allowlist. The Contact Client
Component and future server operation must reuse this contract; browser
validation is never the only trust boundary.
- `faq`
- `homepage`
- `page-content`
- `site-settings`
- `social-link`
- `auth`
- `instagram`
- Shared scalar schemas for IDs, slugs, currency, money input, URLs, email, phone, order lists

Separate:

- Shared form shape
- Server-only refinements
- Publish-readiness schema where draft requirements differ from public requirements

### `src/lib/services`

Business use cases and orchestration:

- `TourService`
- `BookingService`
- `FlightService`
- `GalleryService`
- `FaqService`
- `HomepageService`
- `SiteSettingsService`
- `PageContentService`
- `InstagramFeedService`
- `NotificationService`
- `MediaService`

Services:

- Enforce lifecycle and publication rules.
- Compose repositories.
- Map records into domain/public/admin DTOs.
- Control transactions through repository/unit-of-work abstractions kept as simple as practical.
- Know interfaces for external adapters, not their vendor implementation.

### `src/lib/services/adapters`

Server-only external-provider implementations:

- Official Meta/Instagram API adapter
- Placeholder Instagram adapter or fixture provider
- Email provider adapter once selected
- Media storage adapter once selected
- Future payment provider adapter only when payment enters scope

Adapters validate external responses and map them to internal types.

### `src/lib/repositories`

Database access contracts and Prisma-backed implementations grouped by aggregate:

- Tour repository
- Booking repository
- Flight repository
- Gallery repository
- FAQ repository
- Homepage repository
- Site settings repository
- Page content repository
- Instagram cache repository
- Admin user repository

Repositories:

- Encapsulate Prisma query shapes.
- Apply public publication filters in explicit public methods.
- Return internal records/domain data, never React elements.
- Own provider-specific transactions and ordering writes.
- Avoid a generic repository abstraction; domain-specific methods are clearer for this MVP.

### `src/lib/auth`

Authentication and authorization:

- Session read/create/destroy
- Password verification boundary
- Protected-layout guard
- Active-admin requirement
- Version 1 `ADMIN` policy
- Future role/permission policy interface
- Login rate-limit integration

No authentication logic belongs in visual components.

### `src/lib/seo`

Central SEO helpers:

- Default metadata composition
- Per-page title/description composition
- Canonical URLs
- Open Graph/Twitter metadata
- Published tour metadata
- Breadcrumb data
- Structured-data builders that accept verified DTOs only
- Robots/sitemap inclusion policies

Never generate fabricated ratings, availability, prices, organization data, or testimonials.

### `src/lib/db`

Server-only Prisma client lifecycle and database utilities. This is the only low-level database foundation imported by Prisma repository implementations.

The implemented equivalent is `src/lib/prisma.ts`. It creates one Prisma 7 client through the SQLite driver adapter, caches the development instance, requires `DATABASE_URL`, and must never be imported by Client Components. Generated client code lives under `src/generated/prisma` and is not a presentation-layer dependency.

### `src/lib/utils`

Pure, provider-independent helpers:

- Class name composition
- Money formatting from minor units
- Date presentation
- WhatsApp URL generation from approved settings
- Order normalization
- Safe text helpers

Helpers must not become a miscellaneous home for business logic.

### `src/config`

Typed, version-controlled application structure:

- `navigation`
- `admin-navigation`
- `routes`
- `locales` (`en` only)
- `design-tokens` where not exclusively represented by Tailwind
- `feature-capabilities`
- `icon-registry`
- Validation/display limits

Do not put client contact data, API credentials, or changeable homepage copy here.

### `src/types`

Provider-independent types and DTOs:

- Public tour summary/detail
- Booking form/result/admin detail
- Public/admin site settings
- Homepage section view models
- Flight/gallery/FAQ DTOs
- Instagram normalized post/feed result
- Safe action result/error union
- Navigation types

Prefer types inferred from Zod for input contracts. Define explicit output/domain types where they prevent ORM/provider leakage.

## 5. Server and Client Component Policy

### Server Components by default

Use Server Components for:

- Pages and layouts
- Public site settings composition
- Homepage section shells
- Tour lists/details
- Flight information
- FAQ data
- Gallery grid shells
- Booking summary
- Admin data-loading pages
- SEO and structured content

Benefits:

- Minimal browser JavaScript
- Server-only data access
- Better initial content and SEO
- No credential exposure

### Client Components only for interaction

Use Client Components for:

- Mobile navigation open/close behavior
- Sticky navbar state if CSS alone is insufficient
- FAQ accordion interaction
- Gallery lightbox
- Booking and admin forms
- Reorder controls
- Dialogs and confirmation flows
- Interactive data-table controls
- Optional restrained motion

Keep client boundaries low in the tree. Do not mark an entire page as client-rendered because one child is interactive.

The FAQ implementation follows this boundary explicitly: the route, category
grouping, metadata, and content loading remain server-rendered; only
`FAQAccordion` is a Client Component for one-open-at-a-time disclosure state.
`FAQCategorySection` remains source-independent and receives typed items.
Client-provided FAQ copy and ordered category labels live in centralized typed
configuration until the planned FAQ repository and dashboard replace that
adapter. No database integration is present yet.

The About route is also server-rendered from centralized typed data.
`AboutHero`, `AboutEditorialSection`, `AboutFeatureSection`,
`AboutHighlights`, and `AboutCTA` receive source-independent props; they do not
own destination copy. Section and feature publication/order fields are applied
before rendering. The current local image is referenced through content data,
including meaningful alternative text. A future About repository and typed
editor may replace the static adapter without changing these components.

### Shared UI primitives

Primitives may be server-compatible unless browser state/events are required. A client primitive should remain free of feature/business imports.

## 6. Global Component Contracts

### `Navbar`

- Server-rendered shell receiving navigation items and public brand settings.
- Composes `MobileNavigation` for client behavior.
- Supports transparent-over-hero and solid states.
- Contains no hardcoded company name, logo path, contact number, or duplicated route list.

### `MobileNavigation`

- Client Component.
- Receives the same navigation items as desktop.
- Owns disclosure state, focus return, keyboard escape, and scroll-lock behavior.
- Includes booking and WhatsApp actions only when settings permit.

### `Footer`

- Server Component receiving central footer navigation and public settings.
- Hides absent optional contact values rather than inventing them.
- Legal links use confirmed routes.

### `WhatsAppButton`

- Presentation component receiving a prebuilt safe URL and accessible label.
- URL is generated server-side or by a pure helper from public settings; no secret API integration.
- Handles disabled/unconfigured state by omission or alternate contact, not fake details.

### `PageHeader`

- Reusable visual page introduction supporting title, approved description, eyebrow, and optional media.
- Does not fetch page content.

### `Breadcrumbs`

- Receives typed breadcrumb items.
- Uses semantic navigation and optionally coordinates with SEO breadcrumb data.

### `Container` and `SectionHeading`

- Encode design-brief spacing and hierarchy.
- Remain content-agnostic.

### `EmptyState` and `ErrorState`

- Accept safe titles, descriptions, and actions.
- Avoid internal error text.
- Feature components decide whether absence means hide, empty state, or launch-blocking configuration.

## 7. Homepage Composition

The homepage route loads a typed `HomepageViewModel` and composes enabled sections in approved order.

The renderer should use an explicit map from `HomepageSectionKey` to known component. It must not accept arbitrary database component names or executable markup.

### `Hero`

- Server-first component.
- Receives typed copy, media, and CTA destinations.
- Immersive photography and overlay follow the design brief.
- Optional motion is isolated and respects reduced-motion.

### `WhySocotra` and `ExperienceHighlights`

- Receive typed copy and ordered highlight records.
- Do not contain claims or statistics unless approved content is supplied.

### `FeaturedTours`

- Receives published featured tour-card DTOs.
- Composes shared `TourCard`.
- Hides or displays an honest empty state when no featured tours exist.

### `FlightInformation`

- Receives approved flight introduction, visible reconfirmation disclaimer, and ordered active flight DTOs from the server page composition.
- Clearly communicates confirmed twice-weekly frequency.
- Renders the current weekly schedule when approved active entries exist.
- Supports operating day, route title, departure/arrival locations and times, airline, optional flight number, schedule notes, and last-updated information without requiring structural component changes.
- Omits optional unknown fields rather than inventing values.
- Shows a purposeful empty state when no approved active entries exist.
- Replaces the current development placeholder status content once database-managed entries are available.
- Never imports Prisma or queries the database directly.

### `GalleryPreview`

- Receives published Gallery items from the same centralized source as
  `/gallery`.
- Composes gallery primitives.

### `InstagramFeed`

- Currently receives centralized temporary posts and an optional profile URL
  from public site settings.
- In the future, receives normalized feed state and posts from the server
  service without presentation changes.
- Knows whether content is API cache, approved placeholder, stale, unavailable, or disabled.
- Does not fetch Meta directly.
- Does not block other homepage sections.

### `Testimonials`

Testimonials are not confirmed client content. Do not render this component publicly until authentic content and publishing permission are provided. A future component may be planned, but Version 1 implementation must not invent quotes, identities, ratings, or portraits.

### `FinalBookingCTA`

- Receives approved homepage copy and public contact settings.
- Links to `/booking` and verified WhatsApp/contact channels.

## 8. Tours Composition

### `TourCard`

- Pure presentation of a public summary DTO.
- Formats money through the central money formatter.
- Uses approved image/alt text.
- Links to the slug route.

### `TourGrid`

- Receives an ordered list.
- Owns responsive grid layout and empty-state composition.
- No initial filtering or sorting UI beyond database-managed order.

### `TourHero` and `TourOverview`

- Receive complete public tour data.
- Keep operational fields separate from editorial body content.

### `ItineraryTimeline`

- Receives already ordered itinerary DTOs.
- No database assumptions or reorder logic.

### `IncludedExcludedList`

- Receives separate ordered arrays.
- Preserves clear accessible headings.

### `TourGallery`

- Composes the shared gallery/lightbox behavior with tour-scoped media.

### `TourBookingCTA`

- Receives tour slug/title and verified contact settings.
- Produces `/booking?tour=[slug]`.
- WhatsApp message uses an approved central template.

## 9. Booking Architecture

### `BookingForm`

- Client Component using React Hook Form.
- Uses a resolver/adapter built from the shared Zod booking schema.
- Accepts server-resolved selected-tour summary and public consent configuration.
- Submits only user-editable fields.
- Shows pending, field-error, general-error, and success behavior accessibly.
- Does not accept or compute trusted tour price/status.

### `BookingSummary`

- Server-compatible presentation component.
- Receives selected published tour DTO or general-request state.
- No client-supplied tour details.

### `BookingSuccessState`

- Presentation component.
- Does not claim payment, availability, or confirmed reservation.
- Receives approved next-step/contact content.

## 10. Admin Architecture

### Admin layout

The protected admin layout performs the server-side session guard and supplies a minimal admin identity DTO. Visual navigation consumes typed static admin navigation.

### `AdminSidebar` and `AdminHeader`

- Use central route configuration.
- Can later filter items through authorization capabilities.
- Do not determine permission by hiding links alone; server operations enforce authorization.

### `DataTable`

- Reusable for simple admin lists.
- Receives column definitions and serializable rows.
- Avoid a highly generic enterprise table system.
- Add sorting/filtering only where required, especially for bookings.

### `StatusBadge`

- Maps controlled enum values to accessible label/color variants.
- Never relies on color alone.

### `TourForm`

- Client Component using shared draft/edit schema.
- Separates saving a draft from explicit publishing.
- Handles price input as a user-friendly value converted/validated into minor units at the boundary.

### `ItineraryEditor`

- Independently creates/edits/deletes/reorders itinerary days.
- Uses stable IDs and server-validated complete order lists.

### `BookingDetails`

- Receives protected DTO.
- Keeps internal notes visibly separate.
- Provides controlled status and contact handoff actions.

### `FlightForm`, `GalleryManager`, and `FaqEditor`

- Each uses feature-specific schemas/actions.
- Empty optional fields remain empty; no invented values.
- Publication/activation is explicit.

`FlightForm` and its manager support creating, editing, activating, deactivating, deleting, and reordering entries through `/admin/flights`. The flight schema includes operating day, route title, departure/arrival locations and times, airline, optional flight number, schedule notes, active state, display order, and stale-update metadata. Accessible move controls are sufficient for Version 1; drag-and-drop is not required.

### `HomepageContentEditor`

- Composes section-specific typed editors.
- Uses a fixed section registry.
- Allows copy/media updates and approved enable/order controls.
- Cannot inject arbitrary components, scripts, or untyped blobs.
- Keeps testimonials disabled until requirements/content are confirmed.

### `SiteSettingsForm`

- Edits only non-secret public/operational settings.
- Manages ordered approved social links through typed platform keys rather than hardcoded component URLs.
- Does not render secret environment variables.
- Shows whether required external configuration exists only as a boolean/status.

### `PageContentEditor`

- Edits typed About, Privacy, and Terms records from the settings area.
- Uses a fixed page-key registry and a dedicated validation schema.
- Does not permit arbitrary pages, components, scripts, or untyped page-builder data.
- Keeps client copy out of route and presentation components.

## 11. Shared Form Validation

Each form follows one contract flow:

```text
Zod base schema
   ├── inferred TypeScript input type
   ├── React Hook Form client validation
   └── server action/route parse
          └── server-only refinements and service rules
```

Guidelines:

- Keep base schemas free of server-only imports so the browser can reuse them.
- Keep database uniqueness, authorization, publication readiness, and external checks in server services or server-only schemas.
- Map Zod issues into a common field-error format.
- Never accept a client “validated” result without parsing again.
- Draft and publish actions may use different schemas: drafts can be incomplete; publishing cannot.
- Normalize data once at the server boundary.

## 12. Content and Configuration Ownership

| Information | Owner | How components receive it |
| --- | --- | --- |
| Navigation routes/labels | Typed static config | Layout props |
| Footer route groups | Typed static config | Footer props |
| Company name/logos | Database site settings | Public settings DTO |
| Contact/WhatsApp/email | Database site settings | Public settings DTO |
| Homepage copy/media | Structured database content | Homepage view model |
| About/privacy/terms copy | Typed page-content records | Page content DTO |
| Tours/itineraries/prices | Database aggregates | Tour DTOs |
| Flights | Database | Flight DTOs |
| FAQs | Database | FAQ DTOs |
| Gallery | Database/media service | Gallery DTOs |
| Instagram posts | Server adapter + database cache | Normalized feed DTO |
| Public social links | Database site-settings relation | Ordered public settings DTO |
| Instagram/email secrets | Environment variables | Server adapters only |
| Booking notification recipients | Protected database settings | Notification service |
| UI labels and supported locale | Static message/config layer | Typed imports/props |

Changing content should alter data/configuration, not require editing several components.

## 13. External Service Boundaries

### Instagram

`InstagramFeedService` depends on:

- `InstagramAdapter` for official API access
- `InstagramCacheRepository`
- `IntegrationStateRepository`
- `SiteSettingsService` for enable/fallback behavior

The homepage depends only on the feed service's normalized result.

### Email notifications

`NotificationService` depends on:

- An email provider adapter
- Booking repository
- Protected notification settings

Booking persistence does not depend on successful email delivery.

### Media

`MediaService` owns upload/replacement/removal behavior and approved-source validation. Components and repositories store/use normalized media references.

### Future payment

A future `PaymentService` and provider adapter can be added beside current services. Booking UI/data does not contain payment-provider logic in Version 1.

## 14. SEO Architecture

- Pages provide verified content to central metadata builders.
- Public tour metadata is generated only for published records.
- Default metadata comes from public settings.
- Sitemap generation uses route configuration plus published tour slugs.
- Admin, booking success, draft, preview, and error routes are excluded as documented in the sitemap.
- Structured data builders accept narrow verified DTOs and omit incomplete properties.

## 15. Accessibility and Design-System Responsibilities

The component library enforces:

- WCAG 2.2 AA target
- Visible focus
- Semantic structure
- 44 by 44px touch targets
- Reduced-motion behavior
- Correct menu/dialog/accordion/lightbox semantics
- Sufficient contrast using the design-brief palette
- Responsive image dimensions and alt text requirements

Feature components supply correct content hierarchy; UI primitives supply reliable interaction behavior.

Visual tokens should encode the design brief's Ocean Turquoise, Sand Beige, Palm Green, White, Charcoal, typography pairing, rounded surfaces, soft shadows, spacing, and motion. Content editors must not expose arbitrary styling controls that can erode consistency.

## 16. Error and Loading Architecture

- Route-level `loading` states reserve expected layout dimensions.
- Route-level `error` boundaries show safe recovery actions.
- Feature-level optional integrations isolate errors.
- Form errors use field messages plus an accessible summary.
- `EmptyState` is used for legitimate empty collections.
- Missing required client configuration is distinguished from ordinary empty content in admin views.
- Public pages never expose stack traces, database details, provider responses, or configuration keys.

## 17. Future Extensibility

### Multiple languages

Future localization should add:

- Locale-aware route strategy
- Central message catalogs for UI labels
- Translation records for managed content
- Localized SEO metadata and slugs

Current components receive localized text as props/view models. Version 1 exposes one shared English/Arabic switcher in desktop and mobile navigation.

### Admin roles

Authorization calls a central capability policy even though Version 1 has one `ADMIN` role. Future role tables and policies can be introduced without rewriting visual components.

### Online payments

A future payment feature adds:

- Payment domain model
- Payment service/adapter
- Provider webhook Route Handler
- Payment-specific validation and UI
- Environment secrets

It does not replace booking requests or mix provider concerns into `BookingForm`.

## 18. Client Change Management

| Change | Architectural path | Requires code? | Requires migration? |
| --- | --- | ---: | ---: |
| Company name | Site settings dashboard → layout DTO | No | No |
| Logo | Site settings/media update | No | No |
| Phone/WhatsApp | Site settings dashboard | No | No |
| Booking email | Site settings dashboard | No | No |
| Add/edit/reorder/hide tour | Tour dashboard/services | No | No |
| Edit tour price | Tour form/service | No | No |
| Change itinerary | Itinerary editor/service | No | No |
| Change flight details | Flight manager/service | No | No |
| Add FAQ | FAQ editor/service | No | No |
| Homepage text | Typed homepage editor | No | No |
| About/privacy/terms text | Typed page-content editor in settings | No | No |
| Add/reorder/disable a social profile | Site settings social-link editor | No | No |
| Replace images | Relevant media manager | No | No |
| Disable Instagram | Settings/integration control | No | No |
| Change Instagram credentials | Server environment update | No component change; deployment/config update | No |
| Change notification recipients | Site settings dashboard | No | No |
| Change email provider | Adapter/config change | Yes | Usually no |
| Add admin role | Auth policy and likely data model | Yes | Likely |
| Add language | Routing, messages, translation editors/data | Yes | Likely |
| Add online payment | New feature/service/adapter/UI | Yes | Yes |

## 19. Practical MVP Boundaries

To keep the project maintainable for one developer:

- Do not build a generic page builder.
- Do not build a generic repository framework.
- Do not add tour filters without confirmed need.
- Do not add drag-and-drop if accessible move controls satisfy reordering initially.
- Do not add configurable roles before permissions are confirmed.
- Do not build payments or localization in Version 1.
- Do not add a testimonial management feature until authentic testimonials are confirmed.
- Do not make Instagram availability a page dependency.
- Do centralize content, validation, route definitions, settings, and external adapters from the start.

## 20. Client Information Required

- Final company identity, logos, contact and WhatsApp details
- Navigation label approval if the recommended labels change
- Homepage copy/media and whether testimonials will ever be supplied
- Complete tour, flight, FAQ, gallery, and legal content
- Booking form policy, consent, privacy, retention, and notification recipients
- Initial administrator and authentication ownership
- Instagram/Meta account, credentials, approved fallback posts, and public profile URL
- Media storage and email provider decisions
- Hosting constraints affecting SQLite, uploads, cache, rate limiting, and secrets
# Implemented Bilingual Frontend Boundary

```text
src/app/[locale]/             # Shared localized public routes and locale root layout
src/i18n/config.ts            # Typed locales, default locale, labels and direction
src/i18n/routing.ts           # Locale-safe public, tour, booking and switch helpers
src/i18n/get-dictionary.ts    # Server-only active-dictionary loader
src/i18n/dictionaries/        # Shared English and Arabic UI dictionaries
src/i18n/content/             # Domain-localized public content
src/proxy.ts                  # Deterministic default-English redirect
```

Shared components are not duplicated by language. Server routes select localized content and pass only required strings to interactive components. The language switcher is the sole client route-replacement boundary and preserves the current path, query string, and hash. Form components receive locale-specific copy and create validation schemas from shared rule factories.

## 21. Database Foundation Boundary

The Prisma schema, migration, generated client, and deterministic seed exist. Tours now use a server-only repository that maps Prisma entities plus one requested translation into the established public DTO; other public content domains remain on typed static adapters. Client Components must never query Prisma directly, and mixed static/database fallback is not used.
## Admin authentication boundary

- `src/auth.ts` configures the credentials provider and minimal JWT session claims.
- `src/lib/auth/admin.ts` is the server-only database-backed authorization boundary.
- `src/lib/actions/admin-auth.ts` owns login, password-change, and logout actions.
- `src/app/admin/(protected)/layout.tsx` enforces authorization before rendering the compact admin shell.
- `/admin/dashboard` is read-only and reports real database counts; no management links or CRUD components exist yet.

Future admin Server Actions and Route Handlers must call the same authorization boundary before sensitive reads or mutations.

### Tours CRUD boundary

- `src/lib/tours/tour-repository.ts` owns public published queries, admin reads, and conversion to the public `Tour` view model.
- `src/lib/validation/tour-admin.ts` defines the allow-listed bilingual and nested Zod payload.
- `src/lib/actions/tour-admin.ts` authorizes, validates, writes owned relations in one transaction, and revalidates affected routes.
- `src/components/admin/tours/tour-form.tsx` uses React Hook Form for the structured editor.

Public Tour components remain presentation-focused. Missing locale translations and non-published Tours are never returned publicly.
