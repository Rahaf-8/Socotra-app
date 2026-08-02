# Server Operations and API Specification

## 1. Purpose

This document defines the Version 1 server-side operations required by the public website, protected dashboard, and Instagram integration. It describes contracts and responsibilities only; it does not create endpoints or implementation code.

Version 1 supports English and Arabic, includes Instagram, stores booking requests, and excludes online payment.

## 2. Operation Mechanism Strategy

The final implementation must first verify the installed Next.js 16.2.11 behavior against `node_modules/next/dist/docs/`, as required by `AGENTS.md`.

### Direct Server Component data access

Recommended for public and protected reads used only to render Next.js pages:

- Avoids unnecessary internal HTTP calls
- Keeps secrets and database access server-side
- Supports server rendering and SEO
- Returns domain/view models, not raw Prisma records

Pages call a service or query module; they do not call Prisma directly.

### Server Actions

Recommended for mutations initiated by first-party forms and dashboard controls:

- Keeps validation and authorization close to the mutation
- Works naturally with React Hook Form through an explicit adapter
- Supports targeted cache revalidation
- Avoids creating a REST API that has no external consumer

Server Actions are not trusted merely because they are server functions. Every action independently validates input and authorization.

### Route Handlers

Recommended only when a real HTTP boundary is useful:

- Public booking submission, where explicit HTTP semantics, rate limiting, abuse protection, and potential future non-React clients are valuable
- Authentication callbacks/session endpoints if required by the selected authentication solution
- Future external webhooks

Do not create public CRUD endpoints for dashboard features in Version 1.

### External adapters

Instagram and future email delivery are accessed through server-only service interfaces. UI and business services do not import vendor SDK details.

## 3. Shared Contract Rules

### Validation

- Zod schemas are the canonical input contracts.
- Shared schemas live in `src/lib/validation`.
- Browser validation improves usability; the server always validates again.
- Query strings, route parameters, form values, database results crossing trust boundaries, and external API responses are validated.
- Unknown fields are stripped or rejected according to operation risk.

### Outputs

Mutations return a small discriminated result:

- Success indicator
- Safe result data when needed
- Field errors for expected validation failures
- General user-safe error code/message

Internal exception messages, stack traces, SQL details, credentials, and provider payloads are never returned.

### Authorization

- Public reads expose published/active public DTOs only.
- Public booking submission requires no login but receives abuse controls.
- Every admin read and write verifies the authenticated user and active account server-side.
- Version 1 treats every active admin as `ADMIN`; future role checks are added in one authorization policy layer.

### Transactions and concurrency

- Parent/child reorder operations use transactions.
- Publish operations validate the complete aggregate inside or immediately before the transaction.
- Updates should carry record ID and, where practical, last-known `updatedAt` to detect stale admin edits.

### Audit and logging

- Log operation name, safe error category, request correlation identifier, and timing.
- Never log passwords, tokens, full booking messages, or unnecessary PII.
- Integration errors store sanitized status information.

## 4. Public Read Operations

### 4.1 List Published Tours

**Mechanism:** Direct Server Component data access through `TourQueryService`.

**Input**

- Optional internal limit for homepage use
- Optional `featuredOnly`
- No public filtering requirement in Version 1

**Validation**

- Validate positive bounded limit and boolean options.

**Authorization**

- Public.

**Output**

- Ordered list of public tour-card DTOs: ID, title, slug, short description, duration, formatted price data, featured image, featured status.
- Never return draft fields or administrative metadata.

**Expected errors**

- `DATA_UNAVAILABLE` as a safe page-level failure.
- Empty list is a valid result.

**Side effects**

- None.

**Cache/revalidation**

- Cache public query by `tours` tag or current framework equivalent.
- Invalidate after create, relevant update, publish, unpublish, reorder, archive, image/price change.

**Security**

- Repository query must require published and non-archived state.
- Never accept raw ordering fields from public input.

### 4.2 Get Published Tour by Slug

**Mechanism:** Direct Server Component data access.

**Input**

- `slug`

**Validation**

- Normalized slug schema with length and allowed-character limits.

**Authorization**

- Public.

**Output**

- Complete public tour DTO with ordered itinerary days, published images, inclusions, exclusions, and SEO fields.

**Expected errors**

- `NOT_FOUND` for unknown, draft, unpublished, or archived tours.
- `DATA_UNAVAILABLE` for unexpected failures.

**Side effects**

- None.

**Cache/revalidation**

- Cache by tour ID/slug and public tours tag.
- Invalidate old and new paths if a slug changes.

**Security**

- Return identical not-found behavior for absent and nonpublic tours.

### 4.3 List Active Flights

**Mechanism:** Direct Server Component data access.

**Input**

- No input for the complete homepage weekly schedule.

**Validation**

- Validate stored records through the public flight DTO schema before rendering.

**Authorization**

- Public.

**Output**

- Active flight DTOs ordered by `displayOrder` with a stable tie-breaker.
- Each DTO may contain approved `operatingDay`, `routeTitle`, `departureLocation`, `arrivalLocation`, `departureTime`, `arrivalTime`, `airline`, optional `flightNumber`, `scheduleNotes`, and `updatedAt`.
- Nullable or absent values are omitted from presentation rather than replaced with invented defaults.
- The containing homepage view model also supplies the confirmed twice-weekly statement and visible schedule-change/reconfirmation disclaimer.

**Expected errors**

- Empty list is valid.
- An empty result or `DATA_UNAVAILABLE` permits the UI to retain the approved twice-weekly statement, show an honest schedule empty state, and display the reconfirmation disclaimer.

**Side effects**

- None.

**Cache/revalidation**

- Cache by `flights` tag; invalidate after any flight or flight-introduction change.

**Security**

- Do not expose internal IDs unless needed as stable UI keys.
- Never supply invented missing schedule fields.
- Never return inactive entries from the public operation.

### 4.4 List Published FAQs

**Mechanism:** Direct Server Component data access.

**Input**

- Optional `homepageOnly`
- Optional bounded limit

**Validation**

- Boolean and bounded integer validation.

**Authorization**

- Public.

**Output**

- Published FAQ DTOs grouped by ordered category, with stable IDs, display
  order, and validated paragraph/list/subheading/quotation answer blocks.

**Expected errors**

- Empty list or safe `DATA_UNAVAILABLE`.

**Side effects**

- None.

**Cache/revalidation**

- `faqs` tag; invalidate after FAQ changes.

**Security**

- Only published records.
- Render content through an approved safe text/rich-text strategy.

**Current implementation state**

The `/faq` Server Component currently reads the same DTO shape from a
centralized typed static source. It does not call an API or Prisma. The planned
repository-backed operation will replace that source when dashboard management
is implemented.

### 4.5 List Gallery Items

**Mechanism:** Direct Server Component data access.

**Input**

- Optional `featuredOnly`
- Optional bounded limit

**Validation**

- Validate selection options.

**Authorization**

- Public.

**Output**

- Ordered public Gallery DTOs: stable ID, media URL, alt text, approved
  title/description/location/credit, category, featured/publication state
  projection, and stable dimensions if available.

**Expected errors**

- Empty list or safe retrieval error.

**Side effects**

- None.

**Cache/revalidation**

- `gallery` tag; invalidate after gallery mutations.

**Security**

- Only published records.
- Media URLs must pass the approved asset-source policy.

**Current implementation state**

`/gallery` and the homepage preview currently read this shape from one
centralized typed static source. They do not call an API, Prisma, or an upload
service. Only existing local assets are referenced.

### 4.6 Get Homepage Content

**Mechanism:** Direct Server Component data access through `HomepageService`.

**Input**

- Locale fixed to `en` in Version 1.

**Validation**

- Resolve only supported static locales.

**Authorization**

- Public.

**Output**

- A composed homepage DTO containing enabled ordered section metadata, typed copy, highlights, and section-specific public data references.
- Tours, flights, gallery, FAQ, and Instagram may be loaded by their dedicated services and composed at the page boundary.

**Expected errors**

- Missing required content produces a controlled configuration state, not invented content.
- Optional section failures remain isolated.

**Side effects**

- Instagram sub-load may refresh cache as documented below.

**Cache/revalidation**

- `homepage` plus dependent tags.
- Invalidate after homepage content/settings changes; child feature changes invalidate their own fragments.

**Security**

- Select a public DTO only; never expose integration states, notification recipients, or admin fields.

### 4.7 Load Instagram Content

**Mechanism:** Direct Server Component access to `InstagramFeedService`; optional scheduled/manual server refresh behind the same service.

The current Gallery implementation uses an adapter-compatible centralized
temporary source instead of this service. It performs no network request,
scraping, cache write, or credential access. Missing profile and post URLs
produce non-interactive content rather than invented or broken links.

**Input**

- Bounded item count
- Locale fixed to `en`

**Validation**

- Validate count.
- Validate every Meta API response through a server-side schema.

**Authorization**

- Public read of approved normalized feed content; refresh credentials remain server-only.

**Output**

- Feed items plus safe metadata: source (`API` or `PLACEHOLDER`), stale flag, and availability state.
- UI must clearly distinguish development placeholders from live content.

**Expected errors**

- `DISABLED`
- `NOT_CONFIGURED`
- `TEMPORARILY_UNAVAILABLE`
- These are normal integration states and should not break the page.

**Side effects**

- When cache is stale, may trigger a controlled refresh/upsert.
- Records last safe integration status.

**Cache/revalidation**

- Check database `expiresAt`.
- Fresh cache returns immediately.
- Stale cache attempts refresh.
- Refresh success invalidates `instagram` and homepage feed cache.
- Refresh failure may return stale data inside the approved stale-if-error window, then approved placeholders or no section.

**Security**

- No browser calls to Meta requiring credentials.
- No scraping.
- Never return tokens, account IDs deemed secret, raw provider errors, or unvalidated URLs.

### 4.8 Load Public Site Settings

**Mechanism:** Direct Server Component data access through `SiteSettingsService`.

**Input**

- None, or fixed public setting projection.

**Validation**

- Validate database record into a public settings schema.

**Authorization**

- Public.

**Output**

- Company name, approved logo paths, public contact details, WhatsApp configuration, approved social URLs, default SEO, footer content, and public flight copy.

**Expected errors**

- Missing required settings returns a controlled configuration result.
- Production readiness should fail before launch rather than invent fallbacks.

**Side effects**

- None.

**Cache/revalidation**

- Long-lived `site-settings` tag; invalidate after settings changes.

**Security**

- Explicit allowlist DTO.
- Exclude notification recipients, integration diagnostics, and all secrets.

### 4.9 Get Published Informational Page Content

**Mechanism:** Direct Server Component data access through `PageContentService`.

**Input**

- Allowlisted page key: `ABOUT`, `PRIVACY`, or `TERMS`
- Locale fixed to `en` in Version 1

For `ABOUT`, the contract is a typed aggregate containing hero, ordered
editorial sections, ordered feature sections/items, highlights, CTA, image
metadata, publication flags, and SEO fields. It is not an arbitrary HTML body.
The current `/about` Server Component reads this shape from a centralized
static adapter; it does not call Prisma or an API yet.

**Validation**

- Validate the page key and supported locale; never derive a table or field name from arbitrary input.

**Authorization**

- Public.

**Output**

- Published typed page DTO. About returns its structured aggregate; Privacy and
  Terms retain their controlled legal-content shape.

**Expected errors**

- `NOT_FOUND` for absent or unpublished content
- `DATA_UNAVAILABLE` for unexpected retrieval failure

**Side effects**

- None.

**Cache/revalidation**

- Cache by page key and locale under a `page-content` tag.
- Invalidate the affected public route after a content or publication update.

**Security**

- Render only through the approved safe content format.
- Do not expose draft content, administrative metadata, or arbitrary HTML.

## 5. Public Write Operation

### 5.1 Submit Booking Request

**Mechanism:** Route Handler called by the first-party booking form.

This explicit boundary is recommended for rate limiting, abuse protection, HTTP response semantics, and future reuse. A Server Action is also technically viable, but it must implement identical protections. Use one mutation path only.

**Input**

- Optional selected tour slug or ID resolved server-side
- Full name
- Email
- Phone number
- WhatsApp number when different
- Country
- Preferred travel date
- Number of travelers
- Additional message
- Applicable terms consent
- Honeypot/timing metadata used only for abuse detection

No price, currency, booking status, notification state, or tour title is trusted from the browser.

**Validation**

- Shared Zod booking schema in the browser for usability
- Same schema plus server-only refinements on submission
- Trim and normalize text/email/phone values
- Enforce conservative minimum/maximum lengths
- Validate traveler count as a bounded positive integer
- Validate preferred date semantics after the client confirms policy
- Require consent value and record server time/current terms version
- Resolve selected tour to a published, non-archived record
- Reject unknown fields or ignore only explicitly harmless framework fields

**Authorization**

- Public.

**Spam protection**

Layered recommendation:

1. Invisible honeypot field
2. Minimum form-completion time signal, used cautiously
3. Per-IP and normalized-email rate limits
4. Request body size limit
5. Duplicate submission detection over a short window
6. Optional privacy-respecting challenge only if observed abuse requires it

The production rate-limit store depends on hosting. In-memory limits are insufficient across multiple instances.

**Output**

On success:

- HTTP success status
- Safe booking reference if needed
- Redirect destination `/booking/success`
- Optional generated WhatsApp handoff URL based on server-approved settings

On expected failure:

- Validation field errors or generic safe error code
- Never echo sensitive values unnecessarily

**Expected errors**

- `VALIDATION_FAILED`
- `INVALID_TOUR`
- `TERMS_REQUIRED`
- `RATE_LIMITED`
- `DUPLICATE_SUBMISSION`
- `SERVICE_UNAVAILABLE`

Database/provider details are logged safely and mapped to `SERVICE_UNAVAILABLE`.

**Side effects**

1. Create `Booking` with status `NEW`.
2. Snapshot approved tour title when a tour is selected.
3. Mark notification readiness according to central settings.
4. Invoke an email notification service after durable booking creation.

Email notification is a separate service. Booking persistence succeeds independently; a notification failure records safe operational state for retry and does not lose the request.

WhatsApp behavior is either:

- A generated `wa.me`/official deep link using the centrally managed number and URL-encoded, non-sensitive approved template; or
- A controlled admin handoff.

It is not a browser-side call using a secret WhatsApp API credential.

**Cache/revalidation**

- Do not invalidate public content.
- Revalidate protected booking list/overview data if the framework cache is used.

**Security**

- CSRF/origin protections appropriate to the chosen submission mechanism
- Strict content type and body size
- Never accept admin-only fields
- PII-minimizing logs
- Generic failure messages
- Database writes through service/repository
- Privacy and retention policy required before launch

### 5.2 Submit Contact Request (future; not implemented)

**Mechanism:** Server Action is recommended because the operation originates
from the first-party Contact form and has no external webhook requirement.

**Input**

- Name
- Email
- Published enquiry-type value
- Optional subject
- Message

**Validation**

- Reuse the shared Contact Zod schema server-side.
- Trim all strings, enforce bounded lengths, validate email, and reject
  unpublished or unknown enquiry-type values.
- Apply honeypot/time-based spam checks initially and a deployment-appropriate
  server-side rate limit before launch.

**Authorization**

- Public, with abuse controls.

**Output**

- A safe success result only after the request is durably stored.
- Field-safe validation errors or a generic submission failure.

**Expected errors**

- Validation failure
- Rate limit or spam rejection
- Storage unavailable
- Notification unavailable

**Side effects**

- Future: create one `ContactRequest`.
- Future email notification is a separate best-effort service and must not
  determine whether durable storage succeeded.

**Security**

- Never return database or provider details.
- Do not log message bodies unnecessarily.
- Never render user input as HTML.
- Never place enquiry data in URLs or client storage.

**Current implementation state**

No Server Action, API route, database model, record, or email provider exists.
The client service deliberately transmits nothing and returns
`NOT_CONFIGURED`; the form therefore reports that the message was not sent and
cannot show false success.

## 6. Protected Authentication Operations

### 6.1 Authenticate Admin

**Mechanism:** Server Action or authentication-library server endpoint, depending on the selected solution.

**Input**

- Email
- Password

**Validation**

- Zod shape/length validation
- Normalize email

**Authorization**

- Public login boundary; active authenticated admins should be redirected away.

**Output**

- Secure server-managed session and safe redirect to `/admin`
- Generic authentication failure

**Expected errors**

- `INVALID_CREDENTIALS`
- `RATE_LIMITED`
- `ACCOUNT_UNAVAILABLE`
- `SERVICE_UNAVAILABLE`

**Side effects**

- Verify password hash
- Create/rotate session
- Update `lastLoginAt` on success

**Cache/revalidation**

- None for public data.

**Security**

- Rate limit by IP and normalized identifier
- Generic errors prevent account enumeration
- Secure, HTTP-only, same-site cookies
- Session rotation and expiration
- No public registration
- Password and session strategy requires an approved implementation decision

## 7. Protected Tour Operations

All operations use Server Actions, require an active admin, validate through shared/admin Zod schemas, return domain DTOs or safe mutation results, and never expose Prisma errors.

### 7.1 Create Tour

- **Input:** Confirmed tour fields; incomplete values allowed for a draft.
- **Validation:** Slug format/uniqueness; price minor units; currency format; media URLs; field lengths.
- **Output:** Created draft ID and edit destination.
- **Errors:** Validation, duplicate slug, unauthorized, persistence failure.
- **Side effects:** Create `DRAFT` tour; no public publication.
- **Revalidation:** Admin tours list only.
- **Security:** Ignore client-supplied status timestamps and ownership metadata.

### 7.2 Update Tour

- **Input:** Tour ID, editable fields, optional last-known `updatedAt`.
- **Validation:** Full field schema; unique slug excluding current record; archived-state rules.
- **Output:** Updated admin tour DTO.
- **Errors:** Not found, stale edit, duplicate slug, invalid data, unauthorized.
- **Side effects:** Update record; if public fields changed on a published tour, preserve publication only if it remains valid.
- **Revalidation:** Admin detail/list; `/tours`; old/new `/tours/[slug]`; homepage if featured.
- **Security:** Do not mass-assign lifecycle fields.

### 7.3 Publish Tour

- **Input:** Tour ID and expected record version/time.
- **Validation:** Complete publish schema including title, unique slug, descriptions, duration, price/currency, featured image/alt text, required itinerary/inclusion/exclusion decisions, and approved content.
- **Output:** Published state and public path.
- **Errors:** Incomplete content, conflict, not found, unauthorized.
- **Side effects:** Set status and publication time.
- **Revalidation:** Tours listing, detail, homepage featured tours, sitemap/metadata caches.
- **Security:** Publication is a protected explicit action, never inferred from save.

### 7.4 Unpublish Tour

- **Input:** Tour ID.
- **Validation:** Current state.
- **Output:** Draft state.
- **Errors:** Not found, conflict, unauthorized.
- **Side effects:** Remove public visibility; retain bookings/data.
- **Revalidation:** All tour public paths, homepage, sitemap.
- **Security:** Require explicit confirmation in UI.

### 7.5 Reorder Tours

- **Input:** Complete ordered list of in-scope active tour IDs.
- **Validation:** Unique IDs, same collection, complete set, bounded count.
- **Output:** Normalized order.
- **Errors:** Invalid set, stale collection, unauthorized, transaction failure.
- **Side effects:** Transactional order updates.
- **Revalidation:** `/tours`, homepage if featured ordering depends on it, admin list.
- **Security:** Never accept arbitrary model/field names.

### 7.6 Archive/Restore Tour

- **Input:** Tour ID and desired archived state.
- **Validation:** Existing record and lifecycle transition.
- **Output:** Updated lifecycle state.
- **Errors:** Not found, invalid transition, unauthorized.
- **Side effects:** Set/clear `archivedAt`; retain children/bookings.
- **Revalidation:** Public tour routes, homepage, sitemap, admin list.
- **Security:** Confirmation required; archived tour is never public.

## 8. Protected Tour Child Operations

### 8.1 Manage Itinerary Days

**Mechanism:** Server Actions for create, update, delete, and reorder.

- **Input:** Tour ID; day ID when applicable; day number, title, description, display order; ordered IDs for reorder.
- **Validation:** Parent exists; positive/unique day number; length limits; membership checks.
- **Authorization:** Active admin.
- **Output:** Ordered itinerary admin DTO.
- **Errors:** Not found, duplicate day, invalid order, conflict, unauthorized.
- **Side effects:** Transactional child writes; deleting requires confirmation.
- **Revalidation:** Tour admin detail and public detail if published.
- **Security:** Scope every child operation to its parent tour.

### 8.2 Manage Tour Images

- **Input:** Tour ID, image metadata, approved media reference, publication state, ordered IDs.
- **Validation:** URL/source policy, alt text before publish, lengths, membership/order.
- **Authorization:** Active admin.
- **Output:** Ordered image DTOs.
- **Errors:** Invalid media, not found, conflict, storage failure.
- **Side effects:** Record changes; media cleanup delegated to media service.
- **Revalidation:** Tour detail and admin edit; listing/homepage if featured image changes.
- **Security:** Reject arbitrary remote hosts and unsafe uploads; do not trust client MIME/type.

### 8.3 Manage Inclusions and Exclusions

- **Input:** Tour ID, item ID, text, ordered IDs.
- **Validation:** Nonempty length-limited text, membership, complete reorder set.
- **Authorization:** Active admin.
- **Output:** Ordered item DTOs.
- **Errors:** Validation, not found, conflict.
- **Side effects:** Child record changes.
- **Revalidation:** Public tour detail and admin edit.
- **Security:** Parent scoping and safe text rendering.

## 9. Protected Booking Operations

### 9.1 List Booking Requests

**Mechanism:** Direct protected Server Component data access.

- **Input:** Validated pagination, status filter, sort direction; no broad search unless operationally required.
- **Validation:** Allowlisted filters and bounded page size.
- **Authorization:** Active admin.
- **Output:** Paged minimal booking summaries.
- **Errors:** Unauthorized or safe data failure.
- **Side effects:** None.
- **Cache:** Prefer dynamic protected reads; do not publicly cache PII.
- **Security:** Select only fields required for the list; prevent PII from entering shared caches.

### 9.2 Get Booking Request

**Mechanism:** Direct protected Server Component access.

- **Input:** Booking ID.
- **Validation:** ID shape.
- **Authorization:** Active admin.
- **Output:** Full operational booking DTO, excluding internal system secrets.
- **Errors:** Not found, unauthorized, data failure.
- **Side effects:** None unless a separately approved viewed-state is introduced.
- **Cache:** Dynamic/no shared cache.
- **Security:** Sensitive response; no public serialization or analytics capture.

### 9.3 Update Booking Status

**Mechanism:** Server Action.

- **Input:** Booking ID, `BookingStatus`, expected `updatedAt`.
- **Validation:** Enum and allowed transition policy.
- **Authorization:** Active admin.
- **Output:** Updated status/timestamp.
- **Errors:** Not found, invalid transition, stale edit, unauthorized.
- **Side effects:** Update workflow state. No automatic customer communication unless separately approved.
- **Revalidation:** Booking list/detail and dashboard overview.
- **Security:** Status value comes from server enum; `CONFIRMED` does not imply payment.

### 9.4 Add or Update Internal Booking Notes

**Mechanism:** Server Action.

- **Input:** Booking ID, length-limited notes, expected update time.
- **Validation:** String length and normalization.
- **Authorization:** Active admin.
- **Output:** Updated safe admin DTO.
- **Errors:** Not found, stale edit, invalid input.
- **Side effects:** Persist notes.
- **Revalidation:** Booking detail.
- **Security:** Notes never enter public DTOs, notifications, URLs, or client analytics.

## 10. Protected Flight Operations

### 10.1 Manage Flights

**Mechanism:** Server Actions for create/update/activate/deactivate/delete/reorder; protected direct read for page rendering.

- **Input:** Optional schedule fields (`operatingDay`, `routeTitle`, `departureLocation`, `arrivalLocation`, `departureTime`, `arrivalTime`, `airline`, `flightNumber`, `scheduleNotes`), `isActive`, ID where applicable, expected update timestamp for stale-write protection, and a complete ordered ID list for reordering.
- **Validation:** Field lengths and formats; departure/arrival consistency where sufficient information exists; flight number only when supplied; complete reorder set; active records require an approved, meaningful public display; no invented defaults. Exact fields may remain optional while a record is inactive and awaiting client data.
- **Authorization:** Active admin.
- **Output:** Flight admin DTO/list.
- **Errors:** Validation, not found, stale edit, invalid order, unauthorized.
- **Side effects:** Create, edit, activate, deactivate, delete, or transactionally reorder database entries. Deletion requires explicit confirmation at the UI boundary.
- **Revalidation:** Homepage flight section, protected flights page, site metadata only if relevant.
- **Security:** Treat free-text notes as untrusted input; do not expose internal fields.

## 11. Protected Gallery Operations

### 11.1 Manage Gallery Items

**Mechanism:** Server Actions for metadata/publication/order; media service for asset operations.

- **Input:** Media reference, metadata, featured/published state, ordered IDs.
- **Validation:** Approved source/type/size, alt text before publication, field lengths, complete order set.
- **Authorization:** Active admin.
- **Output:** Gallery admin DTO.
- **Errors:** Invalid media, storage failure, not found, conflict.
- **Side effects:** Record changes and controlled media lifecycle.
- **Revalidation:** `/gallery`, homepage gallery preview, admin gallery.
- **Security:** Upload validation, safe filenames/provider keys, no arbitrary file execution or remote URL proxying.

## 12. Protected FAQ Operations

### 12.1 Manage FAQs

**Mechanism:** Server Actions.

- **Input:** Question, answer, homepage flag, published flag, order/IDs.
- **Validation:** Required text, length limits, publication completeness, unique ID/order membership.
- **Authorization:** Active admin.
- **Output:** Ordered FAQ admin DTO.
- **Errors:** Validation, not found, stale update, invalid reorder.
- **Side effects:** Create/update/unpublish/delete/reorder.
- **Revalidation:** `/faq`, homepage FAQ preview, admin FAQs; structured metadata if enabled.
- **Security:** Use approved safe content format; never render unsafe HTML.

## 13. Protected Homepage Operations

### 13.1 Manage Homepage Content

**Mechanism:** Server Actions grouped by typed section, not one arbitrary payload.

- **Input:** Section-specific fields, highlight items, enabled state, allowed section order.
- **Validation:** Dedicated Zod schema per section; media/alt requirements; controlled section keys; testimonials cannot enable without approved records/content design.
- **Authorization:** Active admin.
- **Output:** Updated typed homepage admin DTO.
- **Errors:** Incomplete section, unsupported key, invalid media, stale update.
- **Side effects:** Update singleton content and related structured items.
- **Revalidation:** Homepage and relevant metadata caches.
- **Security:** No arbitrary component names, scripts, HTML, or JSON layouts.

## 14. Protected Site Settings Operations

### 14.1 Manage Public Site Settings

**Mechanism:** Server Action.

- **Input:** Explicit editable public fields: identity, logo references, contact details, WhatsApp, SEO defaults, footer, flight introduction, business hours, non-secret notification choices, integration enable flags; separate ordered social-link records containing platform key, label, URL, active state, and order.
- **Validation:** Field-specific shared Zod schemas; normalized email/phone/URL; recipient validation; safe WhatsApp template placeholders; allowlisted social platform keys and complete reorder sets.
- **Authorization:** Active admin.
- **Output:** Updated admin settings DTO with secrets absent.
- **Errors:** Validation, stale update, configuration conflict.
- **Side effects:** Update singleton/recipient records.
- **Revalidation:** Public layout, contact, homepage, metadata, flight section, and admin settings.
- **Security:** Reject unknown or secret-like fields. Never accept Meta tokens, provider API keys, session secrets, or database credentials.

### 14.2 Manage Informational Page Content

**Mechanism:** Protected Server Actions exposed as typed page-content editors within the settings area.

- **Input:** Page key and its typed English content. About input includes hero,
  ordered sections and feature items, images and alt text, publication
  controls, CTA, and SEO; legal pages retain their dedicated title/body
  contract.
- **Validation:** Allowlisted page key; page-specific Zod schema; safe content
  format; alt text when media is present; stable keys; valid ordering;
  publication completeness; legal text must be client-approved.
- **Authorization:** Active admin.
- **Output:** Updated protected page-content DTO and publication state.
- **Errors:** Validation, unsupported key, stale update, missing approval/content, unauthorized.
- **Side effects:** Create, update, publish, or unpublish the relevant `PageContent` record.
- **Revalidation:** Affected About, Privacy, or Terms route; metadata and sitemap if publication changes.
- **Security:** No arbitrary route names, scripts, executable markup, or draft leakage.

## 15. External Integration Operations

### 15.1 Check Instagram Integration

**Mechanism:** Protected server service called from admin Server Component.

- **Input:** None beyond integration key.
- **Validation:** Validate environment presence without returning values.
- **Authorization:** Active admin.
- **Output:** Enabled/configured flags, last attempt/success time, cache counts/freshness, sanitized last error category.
- **Errors:** `NOT_CONFIGURED`, `DISABLED`, `PROVIDER_UNAVAILABLE`.
- **Side effects:** None for a passive check.
- **Cache:** Dynamic protected status.
- **Security:** Never return token fragments, secret values, or raw Meta responses.

### 15.2 Refresh Instagram Integration

**Mechanism:** Protected Server Action invoking `InstagramFeedService.refresh`.

- **Input:** Explicit refresh intent; integration key fixed server-side.
- **Validation:** Ensure configured/enabled state; debounce manual refresh.
- **Authorization:** Active admin.
- **Output:** Safe refreshed item count, refresh time, status.
- **Errors:** Not configured, rate limited, credentials expired, provider unavailable, invalid provider response.
- **Side effects:** Fetch through adapter, validate/normalize, transactional cache upsert, update integration status.
- **Revalidation:** Instagram feed, homepage, admin integration status.
- **Security:** Server-only credentials, outbound timeout, response size limits, URL validation, sanitized errors.

### 15.3 Send Booking Notification

**Mechanism:** Internal `NotificationService`; not a public endpoint.

- **Input:** Booking reference/ID loaded server-side and active notification settings.
- **Validation:** Revalidate required recipient/configuration data.
- **Authorization:** Called only after accepted booking or controlled admin retry.
- **Output:** Delivery result containing safe provider reference/status.
- **Errors:** Not configured, provider unavailable, rejected delivery.
- **Side effects:** External email attempt and booking notification state update.
- **Cache:** Revalidate booking detail/overview if notification state is shown.
- **Security:** Provider key from environment; escape untrusted booking content; do not send internal notes; avoid provider error leakage.

## 16. Error Model

Recommended public-safe categories:

- `VALIDATION_FAILED`
- `UNAUTHENTICATED`
- `UNAUTHORIZED`
- `NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`
- `NOT_CONFIGURED`
- `TEMPORARILY_UNAVAILABLE`
- `INTERNAL_ERROR`

Only development server logs may contain deeper diagnostic context, and those logs must still avoid secrets and unnecessary PII.

## 17. Cache Invalidation Matrix

| Mutation | Revalidate |
| --- | --- |
| Tour content/status/order | Tours list, affected tour path, homepage featured tours, sitemap |
| Itinerary/inclusion/exclusion/tour image | Affected tour path and admin editor |
| Booking submission/status/notes | Protected booking list/detail and dashboard overview only |
| Flight mutation/settings flight copy | Homepage flight section and admin flights |
| Gallery mutation | Gallery page and homepage preview |
| FAQ mutation | FAQ page and homepage preview |
| Homepage mutation | Homepage and homepage metadata |
| Public site settings | Public layout, contact, homepage CTAs, default metadata |
| About/privacy/terms content | Affected informational page, metadata, sitemap |
| Instagram refresh/toggle | Homepage Instagram section and admin integration status |

Use current supported Next.js cache APIs after reviewing the installed documentation. Do not build an independent cache framework.

## 18. Client Change Management

- Routine tours, itinerary, pricing, ordering, flights, FAQs, homepage content, gallery, and public settings updates use protected operations and require no component changes.
- Company/contact/WhatsApp/booking email changes use the site-settings action.
- Instagram can be disabled through a non-secret setting without deployment; changing credentials requires environment configuration and deployment/restart according to hosting.
- Booking notification recipients use database settings; changing the email provider or provider key requires code/configuration or environment changes.
- A new admin role requires authorization-policy work and likely a database migration.
- Another language requires new locale-aware operations, translation data, and routing; not Version 1.
- Online payments require a new payment adapter, route/webhook boundary, data model, secrets, and security review; not Version 1.

## 19. Client Information Required

- Approved booking field constraints, terms text/version, privacy wording, and retention policy
- Initial administrator and authentication decision
- Company/contact/WhatsApp/settings values
- Tour and flight data
- Homepage, gallery, FAQ, and legal content
- Email provider, notification recipients, and notification wording
- Instagram/Meta account, credentials, identifiers, refresh requirements, and approved fallback content
- Hosting environment and rate-limit storage capability
# Locale Contract

Public read operations should accept a validated `Locale` (`en` or `ar`) when returning user-facing content. Stable inputs and outputs such as tour slugs, booking option values, prices, statuses, and IDs remain language-independent. Validation rules are shared; localized error messages are selected at the presentation or server-operation boundary. Future repository responses should combine one business entity with its requested translation. No localized API routes or database queries are implemented yet.

## 20. Database Foundation Status

The Prisma database foundation and deterministic bilingual seed are implemented, but this API specification remains prospective: no route handlers, Server Actions, public database reads, or request writes were added. Future implementations must reuse the existing Zod rules on the server, map stable submitted values rather than translated labels, select exactly one requested locale translation, return domain DTOs instead of Prisma records, and keep notification/email delivery separate from persistence.

`BookingRequest` and `ContactRequest` tables exist only as storage foundations. Current browser submission behavior is unchanged until an explicitly approved server operation adds validation, spam protection, rate limiting, persistence, safe errors, and notification handoff.
