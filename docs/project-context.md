# Socotra Island Tourism Website

## Project Context and Source of Truth

**Document status:** Active  
**Project type:** Real client project  
**Product languages:** English and Arabic  
**Current release scope:** Version 1 / MVP  
**Related visual reference:** [`docs/design-brief.md`](./design-brief.md)

## 1. Purpose of This Document

This document is the permanent source of truth for the Socotra Island Tourism Website. It defines the confirmed business goals, audience, product scope, content rules, design direction, functional requirements, technical principles, delivery phases, and outstanding client dependencies.

All product, design, content, and development decisions should be checked against this document. Where another project document conflicts with this one, the confirmed requirements in this document take precedence unless the client approves a documented change.

This document should be updated whenever:

- The client confirms previously missing information.
- A requirement is added, removed, or materially changed.
- Version 1 scope changes.
- A future feature is promoted into the active release.
- A technical or operational decision affects the product requirements.

No unconfirmed business information should be inferred or presented as fact.

## 2. Project Overview

The project is a premium tourism website for a company that organizes guided tours to Socotra Island, Yemen.

The website must introduce Socotra as a rare, nature-focused travel destination, present the company's available tour packages, explain relevant travel logistics, and encourage international visitors to submit booking requests or contact the company through WhatsApp.

The product must feel:

- Modern
- Premium
- Elegant
- Natural
- Trustworthy
- Professionally managed

The website is not only a marketing experience. It must also provide a simple, practical administration system so authorized team members can maintain tour, itinerary, booking, flight, gallery, FAQ, and homepage information without editing application code.

Version 1 supports English and Arabic and does not include online payment. English is the default language; Arabic is a first-class RTL experience.

### Internationalization source of truth

- Supported locales are strictly `en` and `ar`; the locale-prefixed URL is the source of truth.
- `/` and legacy unprefixed public URLs redirect deterministically to English under `/en`.
- Public routes use `/{locale}/...`; stable entity identifiers and tour slugs are not translated.
- Shared interface strings live in typed server dictionaries under `src/i18n/dictionaries`.
- Domain content remains separated under `src/i18n/content`, using one locale-selected object per domain rather than duplicated React pages.
- English renders with `lang="en"` and `dir="ltr"`; Arabic renders with `lang="ar"` and `dir="rtl"` from the server.
- No browser-language detection, local-storage locale source, database integration, or dashboard localization UI is included yet.

## 3. Product Vision

The website should position the company as a capable, reliable, and knowledgeable guide for travelers considering a remote and unfamiliar destination.

The visitor experience must balance two needs:

1. **Inspiration:** Present Socotra's landscapes, biodiversity, and adventure experiences through compelling visual storytelling.
2. **Reassurance:** Make tours, flights, booking steps, and contact options clear enough that an international traveler feels confident making an inquiry.

The intended outcome is a refined journey from destination discovery to a qualified booking request or WhatsApp conversation.

## 4. Business Goals

The website must:

- Showcase Socotra as a premium travel destination.
- Present all available tour packages.
- Allow visitors to explore detailed day-by-day itineraries.
- Encourage visitors to submit direct booking requests.
- Increase qualified WhatsApp inquiries.
- Build trust with international travelers.
- Make important travel and flight information easy to understand.
- Support the company's Instagram presence on the website.
- Give administrators a practical way to manage website content and inquiries.

### Primary conversion goals

1. Submission of a booking request
2. Initiation of a WhatsApp inquiry

### Supporting conversion goals

- Viewing a tour package
- Reading a detailed itinerary
- Reviewing flight information
- Exploring destination imagery
- Visiting the contact page

## 5. Target Audience

The website is intended for:

- International tourists
- Adventure travelers
- Nature lovers
- Eco-tourists
- Small travel groups
- Professional photographers
- Luxury adventure travelers

### Audience needs

Visitors are likely to need:

- A clear understanding of what makes Socotra distinctive
- Confidence in the company's legitimacy and local expertise
- Transparent tour details and practical expectations
- Clear information about duration, pricing, inclusions, and exclusions
- Detailed itineraries
- Reassurance about flights and arrival logistics
- Easy access to a human contact
- A booking process that does not require immediate payment
- A responsive, accessible mobile experience

### Audience concerns

The product should anticipate questions about:

- How to reach Socotra
- Flight frequency and schedules
- Safety and travel logistics
- Accommodation and tour conditions
- Fitness or preparation requirements
- Visas, permits, and documentation
- What is and is not included
- Booking and cancellation expectations
- Communication before travel

Answers must use confirmed client content. Unverified claims must never be published.

## 6. Brand and Experience Direction

The website should feel like a premium international travel brand supported by informed local expertise.

### Brand qualities

- Trustworthy
- Refined
- Adventurous
- Responsible
- Personal
- Calm
- Knowledgeable

### Communication style

All public copy should be:

- Written in English
- Clear and concise
- Warm but professional
- Confident without exaggeration
- Specific rather than generic
- Respectful of Socotra's environment and communities

Avoid:

- Unsupported safety or sustainability claims
- Generic travel clichés
- Artificial urgency or scarcity
- Exaggerated luxury language
- Invented facts, testimonials, or operational details

## 7. Design Direction

The existing design brief is the visual reference for the project and should guide all interface decisions.

### Intended visual character

- Modern
- Luxury
- Minimal
- Elegant
- Premium
- Nature-focused

### Core visual characteristics

- Large, immersive destination photography
- Generous white space
- Rounded cards and image containers
- Soft, low-opacity shadows
- Premium editorial typography
- Clean layouts with strong hierarchy
- Smooth, subtle animation
- Restrained decorative details inspired by Socotra's natural forms

### Color direction

- Ocean Turquoise
- Sand Beige
- Palm Green
- White
- Charcoal

The detailed palette, typography recommendations, layout principles, homepage composition, interaction direction, and accessibility guidance are defined in [`docs/design-brief.md`](./design-brief.md).

The project may draw inspiration from premium travel websites, but it must not copy an existing brand, layout, visual identity, or protected creative work.

## 8. Confirmed Sitemap

Version 1 must include the following public pages:

| Page | Purpose |
| --- | --- |
| Homepage | Introduce the destination and company, feature tours, explain flights, build trust, and drive inquiries |
| Tours | Present all available tour packages in a clear, comparable format |
| Tour Details | Provide complete information for one tour, including its itinerary and booking action |
| About | Introduce Socotra's island geography, biodiversity, flora, fauna, culture, history, trade, and legends |
| Gallery | Present curated destination and tour photography |
| FAQ | Answer confirmed common traveler questions |
| Contact | Provide inquiry options, company contact details, and WhatsApp access |

The administration area is a protected product surface and is not part of the public sitemap.

## 9. Homepage Requirements

The homepage must follow the visual and structural guidance in the design brief. Its confirmed content areas are:

1. Transparent navbar
2. Fullscreen hero
3. Why Choose Socotra
4. Featured tours
5. Flight schedule
6. Gallery
7. Testimonials
8. FAQ
9. Contact call to action with WhatsApp
10. Footer

Homepage content must be manageable through the administration system where practical. Exact text, imagery, claims, testimonials, contact details, and tour data remain subject to client approval.

## 10. Tour Requirements

The Tours page must present all published tour packages. Each tour must have an individual Tour Details page.

### Required tour information

Every tour must support:

- Tour title
- Short description
- Full description
- Duration
- Price
- Featured image
- Image gallery
- Day-by-day itinerary
- Included services
- Excluded services
- Important notes
- Booking button

### Tour presentation principles

- Tour information should be easy to scan and compare.
- Pricing must use client-provided values only.
- Duration must be explicit and consistently formatted.
- Included and excluded services must be clearly separated.
- Important notes should be visible before a visitor submits a request.
- The booking action should retain the selected tour context.
- Unpublished or incomplete tours must not appear publicly.
- Images must include appropriate alternative text or captions.

### Day-by-day itinerary

An itinerary should support an ordered sequence of days. Each day should be capable of presenting:

- Day number or sequence
- Day title
- Description

Any additional itinerary information is unconfirmed and should be treated as a future decision unless approved by the client.

## 11. Booking Request Requirements

Version 1 must allow visitors to submit booking requests. A booking request is an inquiry and does not constitute payment or automatic booking confirmation.

### Confirmed behavior

The booking system must:

- Collect visitor information.
- Retain the tour context when a request starts from a tour.
- Store booking requests for administrative review.
- Make submitted requests visible to authorized administrators.
- Be structured to support future email notifications.
- Provide WhatsApp as an additional contact path.
- Clearly communicate submission success or failure.

### Booking information

The exact booking fields require final product confirmation. Only information necessary to respond to and qualify a request should be collected. Potential fields must not be treated as confirmed until approved.

### Version 1 constraints

- No online payment
- No customer account
- No automated booking confirmation
- No availability calendar unless separately approved

### Privacy and consent

Before launch, the client must approve:

- The personal information collected
- Privacy notice language
- Consent language
- Data retention expectations
- Who can access booking requests
- Any future email notification recipients

Sensitive credentials or unnecessary personal information must never be exposed publicly.

## 12. WhatsApp Requirements

WhatsApp is a primary contact and conversion channel.

The website must:

- Provide clear WhatsApp actions in appropriate high-intent locations.
- Make it clear when an action opens WhatsApp.
- Use the official client-provided WhatsApp number only.
- Support an editable prefilled message where helpful.
- Preserve relevant context, such as the selected tour, when practical.
- Provide a non-WhatsApp contact alternative.

The WhatsApp number and any final prefilled messaging are marked **Client Information Required** until confirmed.

## 13. Flight Information Requirements

The website must clearly explain that flights to Socotra operate twice every week.

### Administrator capabilities

The homepage Flight Information section will ultimately display the current weekly Socotra flight schedule from database-managed entries. Authorized administrators must manage those entries through `/admin/flights` without editing application code.

Administrators must be able to:

- Create flight schedule entries
- Edit existing entries
- Activate or deactivate entries
- Delete entries
- Reorder entries

Each entry must support:

- Operating day
- Route title
- Departure location
- Arrival location
- Departure time
- Arrival time
- Airline
- Flight number when provided
- Schedule notes
- Active status
- Display order
- Last updated timestamp

Exact schedule fields may remain empty until the client provides approved information. Activation and public-display validation must prevent incomplete or unapproved values from being presented as confirmed facts.

### Public flight information

The homepage must:

- Keep the confirmed statement that flights operate twice weekly.
- Show only active flight schedule entries, ordered by administrator-managed display order.
- Present only fields that contain approved client data.
- Support a clear empty state when no approved active schedule entries exist.
- Include a visible disclaimer that schedules may change and should be reconfirmed during booking.
- Show last-updated information where appropriate.

The exact routes, days, times, airlines, flight numbers, locations, and notes remain **Client Information Required** and must not be invented.

The current temporary homepage status card is development-only placeholder content. It will be replaced by the active database-managed schedule entries when the client supplies and approves the schedule.

## 14. Gallery Requirements

The public gallery must present client-approved images of Socotra, the tours, or relevant company experiences.

Gallery content should support:

- Image
- Descriptive alternative text
- Optional title
- Optional description or caption
- Category
- Optional location
- Featured state
- Display order
- Published or unpublished state

Authorized administrators must be able to manage gallery images. Image rights, photographer credits, consent, and usage permissions must be confirmed before publication.

The current `/gallery` route uses a centralized typed static adapter for
curated Gallery categories/items and temporary Instagram posts. It is
server-rendered and contains no Prisma, upload-provider, or Instagram API
integration. Only verified local asset paths may be referenced. The available
local destination library is currently limited, so incomplete categories are
omitted rather than filled with unrelated or remote stock imagery.

The Gallery and Instagram presentation components are source-independent. A
future dashboard/repository may replace the static adapter to manage images,
categories, publication, ordering, featured state, captions, post URLs, hero
copy, CTA, and SEO without rewriting those components.

## 15. FAQ Requirements

The `/faq` page currently reads client-provided content from a centralized,
typed static data source. This is the implementation-stage adapter until the
planned administrator-managed database source is available; components must
not contain FAQ business copy.

Each FAQ item should support:

- Question
- Structured answer blocks for paragraphs, lists, subheadings, and quotations
- Category
- Display order
- Published or unpublished state

The client has supplied the current FAQ answers covering travel and flights,
weather, activities, safety, accommodation, connectivity, visas, travel
restrictions, and cancellation policy. Future changes will be managed through
the dashboard without component edits. Design-brief prompts that are not part
of this supplied set must not be treated as verified answers.

## 16. Contact Requirements

The `/contact` page provides a distinct general-enquiry path and directs
tour-specific visitors to the existing booking-request flow. Its hero, form
copy, enquiry types, guidance, optional methods, booking CTA, and SEO content
currently come from a centralized typed static source.

It must support confirmed client contact channels, including:

- WhatsApp
- Booking email
- Other approved contact information
- Instagram link when supplied

No phone number, email address, location, social media URL, response time, or business hour may be invented.

Official contact details have not been supplied. Unconfigured methods are
omitted entirely from the Contact page and footer; they must not appear as
empty cards or public “Client Information Required” values.

The general enquiry form collects only name, email, enquiry type, optional
subject, and message. React Hook Form owns interaction state and a shared Zod
schema performs trimming, length checks, email validation, and an allowlist
check against published enquiry types. There is currently no server action,
API route, database storage, or email provider. The temporary client boundary
always reports that the message was not sent and must never display a success
state until a future server operation confirms persistence or delivery.

Future implementation should store contact requests separately from booking
requests, apply server-side validation and spam/rate-limit controls, support
email notification as a separate service, and allow administrators to review
and update request status.

## 17. Instagram Integration Requirements

Instagram integration is required in Version 1.

### Public experience

The website must:

- Display Instagram posts in an appropriate public section.
- Use temporary, clearly identifiable placeholder data until credentials and approved content are provided.
- Degrade gracefully if Instagram is unavailable.
- Preserve the surrounding page layout when API data cannot be loaded.
- Avoid blocking important content or page rendering on an external API response.
- Never present placeholder content as live client content.

### Integration readiness

The project must be prepared for Instagram Graph API integration. The final integration should:

- Retrieve only the information required for the approved display.
- Keep all credentials and tokens server-side.
- Never expose secrets to the browser, repository, logs, or public error messages.
- Handle expired tokens, rate limits, malformed responses, and network failures.
- Provide a safe fallback when fresh data cannot be retrieved.
- Follow Meta's current platform, permission, review, and token requirements.

### Required Instagram and Meta information

The following are marked **Client Information Required**:

- Instagram account
- Confirmation of the Instagram account type
- Associated Meta Business information
- Required Meta application information
- Instagram Graph API credentials
- Approved access token or token-generation access
- Required account and page identifiers
- Approved fallback images or posts

Exact credentials and platform requirements must be documented before integration. Secret values themselves must never be included in public documentation or committed files.

## 18. Admin Dashboard Requirements

Version 1 must include a simple, practical administration dashboard.

### Authentication

Administrators must be able to log in securely. Public registration is not part of Version 1.

The final authentication method and initial administrator provisioning process require a documented technical decision before implementation.

### Confirmed management capabilities

Authorized administrators must be able to:

- Manage tours
- Manage tour itineraries
- Review and manage booking requests
- Manage flight information
- Manage gallery images
- Manage FAQ items
- Manage homepage content

### Dashboard principles

- Keep workflows straightforward and task-focused.
- Prioritize clear data entry and reliable content management over advanced analytics.
- Validate all administrator input.
- Require confirmation for destructive actions.
- Distinguish draft or unpublished content from public content.
- Protect every dashboard route and administrative operation.
- Avoid exposing secrets or sensitive booking data.
- Provide clear empty, loading, success, and error states.

### Out of scope for the Version 1 dashboard

- Advanced analytics
- Complex staff roles or permissions unless later confirmed
- Customer account management
- Payment administration
- Advanced availability management
- Reviews management

## 19. Content Rules

The public website supports English and Arabic; English is the default locale.

The following information must never be invented:

- Company information
- Prices
- Tour names
- Tour descriptions presented as factual
- Tour itineraries
- Testimonials
- Phone numbers
- Email addresses
- WhatsApp numbers
- Social media links
- Flight details beyond confirmed requirements
- Safety, certification, partnership, or sustainability claims

Whenever required information is missing, documentation, content drafts, administrative previews, and approved placeholder states must clearly mark it as:

> **Client Information Required**

Placeholder content must be unmistakably temporary and must not be published in a way that could mislead visitors.

## 20. Technical Foundation

The confirmed project stack is:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- SQLite
- Zod
- React Hook Form
- Lucide React
- clsx
- class-variance-authority

The project uses the `src` directory structure and `@/*` import alias established in the project foundation.

### Framework guidance

The repository's `AGENTS.md` states that the installed Next.js version contains breaking changes and that relevant documentation under `node_modules/next/dist/docs/` must be reviewed before implementation. This is a mandatory development constraint.

`CLAUDE.md` delegates to `AGENTS.md`, so the same guidance applies.

No framework behavior should be assumed from older Next.js versions when current local documentation is available.

## 21. Development Principles

All implementation work must follow these principles:

### Clean architecture

Business rules, data access, validation, presentation, and external integrations should have clear responsibilities and boundaries.

### Reusable components

Shared visual and interaction patterns should be implemented consistently. Reuse should improve clarity and maintenance, not produce overly generic abstractions.

### Type safety

Data boundaries, forms, administrative inputs, and external API responses must be typed and validated.

### Responsive design

All public and administrative experiences must work across mobile, tablet, laptop, and large desktop viewports.

### SEO first

Public pages should use meaningful page structure, indexable content, appropriate metadata, stable URLs, and useful social sharing information. Only real, approved content may appear in metadata or structured data.

### Accessibility

The public website and dashboard should target WCAG 2.2 AA, following the detailed accessibility direction in the design brief.

### Performance

Large photography and third-party integrations must be optimized so they do not compromise loading performance, responsiveness, or layout stability.

### Maintainability

Code and content structures should remain understandable, modular, and practical for future developers and administrators.

### Security and privacy

Authentication, booking data, administrator operations, API secrets, contact data, and integration credentials must be handled according to least-access principles.

## 22. Data and Content Management Principles

Version 1 data structures should support the confirmed requirements without prematurely implementing future features.

The managed content areas are:

- Tours
- Tour itineraries
- Booking requests
- Flight information
- Gallery images
- FAQ items
- Homepage content

Content management should account for:

- Clear published and unpublished states where public visibility matters
- Stable ordering where administrators control presentation
- Validation of required content
- Safe handling of incomplete records
- Created and updated timestamps where operationally useful
- Clear distinction between client content and temporary placeholders

The final data model must be reviewed against the confirmed requirements before implementation. This document does not authorize or define a database schema.

## 23. SEO Requirements

SEO is a project-wide requirement.

The public website should support:

- Unique page titles and descriptions
- Human-readable URLs
- Semantic heading hierarchy
- Crawlable tour content
- Descriptive image alternative text
- Canonical URL decisions
- Open Graph and social sharing metadata
- Sitemap and crawler directives
- Appropriate structured data when supported by real, verified content

No fabricated rating, review, price, availability, organization, or travel data may be added for SEO purposes.

## 24. Accessibility Requirements

The website and dashboard should target WCAG 2.2 AA.

At minimum, the product must provide:

- Keyboard-operable navigation and controls
- Visible focus states
- Sufficient color contrast
- Logical heading and landmark structure
- Meaningful labels and validation messages
- Descriptive alternative text
- Accessible forms and error summaries
- Minimum 44 by 44px touch targets
- Reduced-motion support
- Accessible menus, dialogs, accordions, galleries, and carousels
- Content that remains usable with browser zoom and text resizing

Accessibility must be considered during design and development, not deferred to final testing.

## 25. Performance Requirements

The project should prioritize:

- Optimized responsive imagery
- Stable media dimensions to prevent layout shift
- Minimal client-side JavaScript
- Server-rendered public content where appropriate
- Lazy loading for below-the-fold media
- Controlled font families and weights
- Graceful handling of third-party API delays
- Fast, responsive interactions on mobile devices

Instagram content must not become a single point of failure for any public page.

## 26. Security and Privacy Requirements

The product must:

- Protect all administrative routes and operations.
- Validate public and administrative input.
- Avoid exposing API credentials or secret environment values.
- Store only booking information necessary for the business process.
- Limit access to personal booking data.
- Avoid logging secrets or unnecessary personal information.
- Handle public form abuse and automated submissions appropriately.
- Provide safe error messages that do not reveal internal details.

Privacy, cookie, analytics, retention, and legal requirements must be confirmed before launch.

## 27. Version 1 MVP Scope

Version 1 must include:

- Public website
- Homepage
- Tours listing
- Individual Tour Details pages
- Booking request flow
- Admin dashboard
- Instagram integration
- Flight information
- Gallery
- FAQ
- Contact page
- WhatsApp contact

### Explicitly excluded from Version 1

- Online payment
- Multiple languages

The future features below are also excluded unless the client formally changes the scope.

## 28. Future Features

Future versions may include:

- Multiple languages
- Advanced booking management
- Online payments
- Customer accounts
- Tour availability calendar
- Reviews management
- Analytics dashboard

These items should not be implemented during Version 1. Architectural decisions may avoid unnecessarily blocking future expansion, but future functionality must not add current complexity without a confirmed need.

## 29. Client Information Required

The following information or assets must be supplied or formally approved by the client before the relevant feature or content can be completed.

### Brand and company

- **Client Information Required:** Company name
- **Client Information Required:** Official logo and approved logo variants
- **Client Information Required:** Brand usage guidance, if available
- **Client Information Required:** Company description
- **Client Information Required:** About-page content
- **Client Information Required:** Approved trust claims, credentials, or affiliations
- **Client Information Required:** Responsible tourism or sustainability statements

### Contact and booking

- **Client Information Required:** WhatsApp number
- **Client Information Required:** Booking email
- **Client Information Required:** General contact information
- **Client Information Required:** Approved contact location details
- **Client Information Required:** Business hours or response expectations, if displayed
- **Client Information Required:** Booking-request fields
- **Client Information Required:** Booking process and status definitions
- **Client Information Required:** Cancellation or booking policy
- **Client Information Required:** Privacy, consent, and data-retention requirements
- **Client Information Required:** Email notification recipients and wording for future notifications

### Tours

- **Client Information Required:** Tour names
- **Client Information Required:** Short tour descriptions
- **Client Information Required:** Full tour descriptions
- **Client Information Required:** Tour prices and currencies
- **Client Information Required:** Tour durations
- **Client Information Required:** Tour itineraries
- **Client Information Required:** Included services
- **Client Information Required:** Excluded services
- **Client Information Required:** Important tour notes
- **Client Information Required:** Featured images and tour gallery images
- **Client Information Required:** Image alternative text, captions, locations, and credits
- **Client Information Required:** Publishing priority and featured-tour selections

### Flights

- **Client Information Required:** Flight schedule details
- **Client Information Required:** Departure and arrival locations
- **Client Information Required:** Operating days and times
- **Client Information Required:** Carrier information, if displayed
- **Client Information Required:** Seasonal or validity dates
- **Client Information Required:** Flight duration, if displayed
- **Client Information Required:** Flight booking and confirmation process
- **Client Information Required:** Approved schedule-change disclaimer
- **Client Information Required:** Confirmation of how “twice every week” should be presented

### Gallery and media

- **Client Information Required:** Gallery images
- **Client Information Required:** Homepage hero media
- **Client Information Required:** Image usage rights and photographer credits
- **Client Information Required:** Captions, locations, and alternative text
- **Client Information Required:** Approved video assets, if any

### FAQ and trust content

- Client-provided FAQ content is centralized for the `/faq` implementation and
  remains subject to final publication approval.
- **Client Information Required:** Packing and preparation guidance
- **Client Information Required:** Authentic testimonials and permission to publish
- **Client Information Required:** Traveler names, countries, dates, and portraits where applicable

### Instagram and Meta

- **Client Information Required:** Instagram account
- **Client Information Required:** Approved Instagram profile URL
- **Client Information Required:** Confirmation of professional Instagram account type
- **Client Information Required:** Meta Business information
- **Client Information Required:** Associated Facebook Page information where required
- **Client Information Required:** Meta application details
- **Client Information Required:** Instagram API credentials
- **Client Information Required:** Required account, page, and application identifiers
- **Client Information Required:** Access-token provisioning or authorization
- **Client Information Required:** Approved fallback posts or placeholder replacement content

### Administration and operations

- **Client Information Required:** Initial administrator identity
- **Client Information Required:** Additional administrator access needs
- **Client Information Required:** Content approval workflow
- **Client Information Required:** Hosting and deployment ownership
- **Client Information Required:** Domain and DNS access
- **Client Information Required:** Legal documents, including privacy and terms content
- **Client Information Required:** Analytics and cookie-consent expectations

## 30. Recommended Development Phases

The phases below define the recommended delivery sequence. A phase should be reviewed before dependent work proceeds.

### Phase 1: Project Foundation

Purpose:

- Confirm the framework and project configuration.
- Establish code quality, validation, environment, and project conventions.
- Review current local Next.js documentation before implementation.
- Confirm initial technical decisions and deployment assumptions.
- Translate approved design direction into a maintainable visual system.

Completion criteria:

- Foundation checks pass.
- Required environments and secret-handling conventions are documented.
- Scope and unresolved client dependencies are visible.

### Phase 2: Shared Layout

Purpose:

- Establish the global visual language and responsive layout.
- Prepare the public navigation, footer, typography, spacing, interaction, and accessibility patterns.
- Define reusable interface foundations without adding unapproved content.

Completion criteria:

- Shared layouts are responsive and accessible.
- Visual direction matches the design brief.
- Placeholder content is clearly identified.

### Phase 3: Homepage

Purpose:

- Deliver the homepage structure defined in the design brief.
- Establish the primary destination story and conversion journey.
- Connect approved homepage content to manageable sources.

Completion criteria:

- All confirmed homepage sections are present.
- Responsive, accessibility, SEO, and performance requirements are met.
- WhatsApp and booking actions use approved contact information.

### Phase 4: Tours

Purpose:

- Create the public tours listing.
- Establish consistent presentation and comparison of all published tour packages.
- Prepare practical tour administration.

Completion criteria:

- All approved tours can be managed and published.
- Visitors can navigate from the listing to each Tour Details page.
- No invented tour content is visible.

### Phase 5: Tour Details

Purpose:

- Present complete tour information.
- Display the ordered day-by-day itinerary.
- Clearly distinguish inclusions, exclusions, important notes, and booking actions.

Completion criteria:

- Every required tour field is represented.
- Tour imagery and itinerary content are accessible and responsive.
- Booking actions retain tour context.

### Phase 6: Booking Flow

Purpose:

- Collect and store qualified visitor booking requests.
- Provide clear confirmation and error experiences.
- Make requests available to authorized administrators.
- Prepare the workflow for future email notifications.

Completion criteria:

- Validation, privacy messaging, abuse controls, storage, and dashboard review are verified.
- No payment behavior exists.
- WhatsApp remains available as an alternate contact route.

### Phase 7: Admin Dashboard

Purpose:

- Secure administrator access.
- Provide practical management of tours, itineraries, bookings, flights, gallery images, FAQ items, and homepage content.

Completion criteria:

- All required administrative workflows function reliably.
- Unauthorized access is prevented.
- Destructive actions are confirmed.
- Draft and published content are clearly distinguishable.

### Phase 8: Instagram Integration

Purpose:

- Introduce placeholder content in a clearly temporary state.
- Prepare and connect the Instagram Graph API when credentials are available.
- Implement secure credential handling and resilient fallback behavior.

Completion criteria:

- Credentials are never exposed.
- API errors do not break the public experience.
- Approved fallback behavior is verified.
- Credential and maintenance requirements are documented.

### Phase 9: Client Content

Purpose:

- Replace placeholders with approved client content.
- Validate tour, flight, contact, FAQ, gallery, Instagram, brand, and legal information.
- Confirm image rights and final metadata.

Completion criteria:

- No “Client Information Required” placeholder is unintentionally public.
- All factual and operational content has client approval.
- Final imagery, contact routes, and metadata are accurate.

### Phase 10: Testing

Purpose:

- Verify functionality, security, content, responsiveness, accessibility, SEO, and performance.
- Test public and administrative workflows.
- Test Instagram and WhatsApp fallback paths.

Coverage should include:

- Supported browsers and viewport sizes
- Keyboard and screen-reader-critical flows
- Booking submission success and failure
- Authentication and authorization
- Content publishing behavior
- Form validation and abuse scenarios
- Image and third-party API failures
- Metadata, indexing, and structured data
- Production build and deployment readiness

Completion criteria:

- Critical and high-severity defects are resolved.
- Client acceptance review is complete.
- Launch checklist is approved.

### Phase 11: Deployment

Purpose:

- Configure the approved production environment.
- Set production secrets without committing them.
- Apply the production data and content process.
- Configure domain, analytics, monitoring, and operational ownership as approved.

Completion criteria:

- Production deployment is healthy.
- Public pages, booking flow, dashboard, Instagram fallback, and contact actions are verified.
- Backup, credential, content, and maintenance ownership is documented.
- The client approves launch.

## 31. Definition of Version 1 Complete

Version 1 is complete only when:

- Every confirmed public page is available.
- Approved tours and Tour Details pages are manageable and published.
- Booking requests can be submitted, stored, and reviewed.
- Secure administrator access and all confirmed management capabilities work.
- Flight information is manageable and accurately presented.
- Gallery and FAQ content are manageable.
- Instagram integration or its approved credential-dependent final state is complete and resilient.
- WhatsApp and contact actions use verified client information.
- No unapproved or invented content is presented as fact.
- Responsive, accessibility, SEO, performance, privacy, and security checks are complete.
- Production deployment and operational ownership are confirmed.
- The client has completed acceptance review.

## 32. Change Control

Any request that changes Version 1 scope should be documented before implementation.

A scope change should identify:

- The requested change
- The business reason
- Whether it replaces or adds to an existing requirement
- Its impact on design, data, administration, testing, timeline, and deployment
- Whether it belongs in Version 1 or a future release
- Client approval status

Unconfirmed ideas remain out of scope until formally approved.

## 33. Current Decisions Summary

| Area | Decision |
| --- | --- |
| Product | Premium tourism and guided-tour website for Socotra Island, Yemen |
| Audience | International adventure, nature, eco, photography, small-group, and luxury adventure travelers |
| Language | English and Arabic (`en`, `ar`) |
| Primary conversions | Booking requests and WhatsApp inquiries |
| Public scope | Homepage, Tours, Tour Details, About, Gallery, FAQ, Contact |
| Administration | Secure management of tours, itineraries, bookings, flights, gallery, FAQ, and homepage content |
| Flights | Publicly explain twice-weekly operation; exact details remain client-dependent |
| Instagram | Required in Version 1 with secure Graph API readiness and graceful fallback |
| Payment | Excluded from Version 1 |
| Multiple languages | Excluded from Version 1 |
| Visual reference | `docs/design-brief.md` |
| Missing information | Must be labeled “Client Information Required” |
| Framework guidance | Review installed Next.js documentation before implementation |
