## Kad Kahwin MVP – Dev Progress

> **Reference PRD:** `docs/PRD/finalized-prd.md` (v2.1, March 18, 2026)

---

### High-Level Status

- MVP complete
- Backend core (users, events, managers, guests, rsvps, wishlist, wishes)
- Builder UI (event editor + live preview)
- Authentication (Google via BetterAuth)
- Invitation view redesign (cinematic, mobile-locked, bottom navbar)
- Code review pass — all critical/warning findings resolved
- Test suite: 17 files, 233 tests passing

---

### Phase 1 – Foundation (Done)

- Project setup (Next.js, Convex, BetterAuth, TailwindCSS, Shadcn)
- Authentication (Google OAuth sign-in screen + BetterAuth client)
- Event creation with custom slug (Convex `events` + slug validation)
- Landing page builder UI (builder route + layout)
- Background image support in schema (`backgroundImageId` on `events`)
- Color theming fields in schema (`backgroundColor`, `colorPrimary`, `colorSecondary`, `colorAccent`)
- YouTube music field in schema (`musicYoutubeUrl`)
- Event info fields in schema (date, time, location links)
- Live preview wiring (builder → Zustand store → Convex update)
- Background image upload flow (5MB limit, Convex storage, UI)
- Color picker UI + full theming integration
- Music embed (YouTube auto-play + loop on guest page)
- Guest list management UI (CRUD table)
- Excel import (upload, parse, validate, bulk insert)
- Excel export (generate file, download)
- RSVP form (attending/not, pax 1–10) on guest page
- RSVP deadline enforcement in mutation + UI
- RSVP analytics cards (attending, pax total, not attending, pending)
- Real-time wishes feed UI (chat-like section)
- Manager delete wish action (Convex + UI)
- Wishlist CRUD dashboard (add/edit/delete)
- Affiliate link converter (Shopee/Lazada → affiliate URL)
- Guest claim/unclaim wishlist item (atomic Convex mutation)
- Guest add wishlist item (auto-claimed)
- Manager hide/show wishlist items (visibility toggle)
- Donation section UI (QR upload, bank info, copy-to-clipboard)
- Custom guest URL route `(guest)/[slug]`
- Dual-language setup (Malay/English translation files)
- Co-manager data model and invite mutation
- Desktop 9:16 invitation view — basic centered frame
- Publish/draft toggle for events (share link when published)

---

### Phase 1 – Invitation View Redesign (PRD §3) — Done ✓

#### Schema & Backend ✓

- `venueName` and `venueAddress` fields added to `events` schema (PRD §6.1)
- `carouselImageIds` field added to `events` schema (PRD §6.2)
- Convex mutation: `updateCarouselImages(eventId, imageIds[])` with auth + max-10 enforcement (PRD §5.2)
- ICS generation implemented client-side in `lib/utils/generateIcs.ts` (PRD §5.2)
- `getEvent` updated to resolve `carouselImageUrls` via `ctx.storage.getUrl`
- `getEventBySlug` updated with explicit field allowlist — raw storage IDs not exposed to public (security)
- `convex/storage.ts` — added `getStorageUrl` query for client-side URL resolution after upload
- `updateEvent` mutation — simplified patch builder using `SCALAR_FIELDS` loop; removed dead return values

#### Builder Updates ✓

- Builder "Details" section — venue name + venue address fields added (PRD §4.2)
- Builder "Photos" section — upload up to 10 carousel photos, parallel upload via `Promise.all` (PRD §4.2, §6.2)
- Drag-to-reorder photos, per-photo delete (PRD §6.2)
- `useAutoSave` extended with `venueName` + `venueAddress` debounced save
- `editorStore` — `carouselImageUrls` removed (was server state in Zustand, anti-pattern); now flows as prop from `BuilderPage` through `BuilderLayout` → `EditorPanel` → `PhotosSection`
- `BackgroundSection` — resolved background image URL via new `getStorageUrl` query after upload

#### URL Route Update

- Deferred (keep existing `app/(guest)/[slug]` route for now)

#### Invitation View — Sections ✓

- `InvitationContainer.tsx` — mobile-locked 390px frame, blurred desktop bg (PRD §3.2)
- `HeroSection.tsx` — couple names, date, Ken Burns background, entrance animations, i18n tagline (PRD §3.3 §1)
- `EventDetailsSection.tsx` — venue name, date, time styled cards with scroll animations, i18n section title (PRD §3.3 §2)
- `CarouselSection.tsx` — swipeable photo carousel, auto-advance, dots indicator (PRD §3.3 §3)
- `WishesSection.tsx` — new timeline layout with `AnimatePresence`, `getRelativeTime` i18n-aware and memoized (PRD §3.3 §4)
- RSVP: modal only (moved to RSVPModal in bottom navbar) (PRD §3.3 §5)

#### Bottom Navbar ✓

- `BottomNavbar.tsx` — 6-icon fixed bottom bar, semi-transparent, themed (PRD §3.4)
- `BottomSheet.tsx` — reusable bottom sheet, spring animation, drag-to-dismiss (PRD §3.4)
- `MusicModal.tsx` — play/pause toggle, postMessage to hidden YouTube iframe (PRD §3.4 Modal 1)
- `CalendarModal.tsx` — Google Calendar URL, Apple/Outlook `.ics` download (PRD §3.4 Modal 2)
- `DonationModal.tsx` — QR code image, bank details, copy-to-clipboard (PRD §3.4 Modal 3)
- `LocationModal.tsx` — Waze/Google Maps/Apple Maps buttons (PRD §3.4 Modal 4)
- `RSVPModal.tsx` — RSVP form, pax stepper, success state; deadline-passed banner only shown when deadline is actually past (PRD §3.4 Modal 5)
- `WishlistModal.tsx` — wishlist items, claim/unclaim, inline name prompt, add item form; hardcoded "Batal" replaced with i18n key (PRD §3.4 Modal 6)

#### Animations (Framer Motion) ✓

- Framer Motion already installed (^12.29.2)
- Scroll-triggered section animations (`whileInView`, `once: true`) (PRD §3.5)
- Stagger children on section entries (PRD §3.5)
- Ken Burns effect on hero background (PRD §3.5)
- Floating scroll indicator animation (PRD §3.5)
- New wish entrance animation (`AnimatePresence`) (PRD §3.5)
- `useReducedMotion()` support — all animations disabled if set (PRD §3.5)

#### i18n ✓

- All navbar/modal keys in `ms.json` and `en.json` (PRD Appendix B)
- New keys added: `guest.hero_tagline`, `guest.event_details_title`, `wishlist.cancel`
- New relative-time keys: `wishes.just_now`, `wishes.minutes_ago`, `wishes.hours_ago`, `wishes.days_ago`
- Language detection extracted into `hooks/useEventLanguage.ts` hook (SRP)

#### Code Quality Fixes (March 18, 2026) ✓

- `getEventBySlug` — explicit field allowlist; raw storage IDs (`backgroundImageId`, `donationQrId`, `carouselImageIds`) no longer in public response
- `editorStore` — `carouselImageUrls` removed; server-derived state stays out of Zustand
- `getCarouselImages` query deleted (dead code — carousel URLs resolved inside `getEvent`/`getEventBySlug`)
- `updateEvent` — 20-line repeated patch block replaced with `SCALAR_FIELDS` loop
- `updateEvent` — removed dead conditional return of `backgroundImageUrl`/`donationQrUrl`
- `PhotosSection` — uploads parallelised with `Promise.all` (was serial `for` loop)
- `WishesSection` — `getRelativeTime` wrapped in `useMemo` (was re-running on every Convex re-render)
- `RSVPModal` — deadline-passed copy now only shows when `isDeadlinePassed` is true
- Hardcoded strings (`"Walimatul Urus"`, `"Butiran Majlis"`, `"Batal"`) replaced with i18n keys

---

### Phase 1 – Remaining (Non-Invitation)

- Co-manager invite acceptance flow + UI
- Language switcher on guest page + dashboard
- SEO implementation (per-event meta tags, sitemap, structured data) (PRD §7.8)
- PostHog events wired — all events including new navbar events (PRD §7.9)
- Sentry error/performance monitoring verified
- Production Vercel deployment with environment variables

---

### Phase 2 – Post-MVP (PRD §10.2)

- Stripe FPX payment integration (RM39 per event)
- Payment enforcement (block share until paid)
- Refund behaviour (deactivate link)
- Image optimization on upload (resize to 1200px)
- Custom email templates for co-manager invites
- Guest list filtering/sorting UI
- Bulk guest actions (e.g. delete many)
- Event templates system (Modern Minimalist, Rustic, Bold, Islamic Geometric) (PRD §3.6)
- Template picker UI in builder
- Admin/superadmin panel
- Usage analytics dashboard (events per user, revenue)
- Facebook / Apple / email login

---

### Phase 3–4 – Future (PRD §10.3)

- Multi-event support UI (event list dashboard)
- Event duplication
- Guest broadcast messaging
- White-label option for planners
- Blog / content SEO features
- Vendor marketplace
- Wedding planning tools (checklists, budgets)
- RSVP meal preferences
- Seating chart management
- Thank you card generator

---

### Testing Status (PRD §11)

**17 test files — 233 tests passing**

| File | Tests | Coverage |
|------|-------|----------|
| `convex/functions/__tests__/events.test.ts` | Updated | `checkSlugAvailable`, `createEvent`, `inviteCoManager`, `updateEvent` (all fields incl. venue, bank, carousel, YOUTUBE validation, clearDonationQr) |
| `convex/functions/__tests__/guest.test.ts` | Updated | `getEventBySlug` field allowlist (no storage IDs exposed), URL resolution for bg/qr/carousel, `updateCarouselImages` (auth, max-10, empty array) |
| `convex/functions/__tests__/rsvp.test.ts` | — | `submitRSVP` (duplicate, deadline, pax 1–10, not-attending) |
| `convex/functions/__tests__/wishlist.test.ts` | — | `claimWishlistItem`, `unclaimWishlistItem`, `addWishlistItem` validation |
| `convex/functions/__tests__/wishes.test.ts` | — | `addWish`, `deleteWish` |
| `convex/functions/__tests__/guests.test.ts` | — | Guest import validation |
| `convex/functions/__tests__/waitlist.test.ts` | — | Waitlist join |
| `stores/__tests__/editorStore.test.ts` | Updated | `initFromEvent` (all fields incl. venue, `carouselImageUrls` absent assertion), `setField`, `reset`, initialized flag |
| `lib/utils/__tests__/generateIcs.test.ts` | New | ICS structure, SUMMARY, DTSTART/DTEND, LOCATION, DESCRIPTION, RFC 5545 escaping, CRLF, `buildGoogleCalendarUrl` |
| `lib/utils/__tests__/affiliateConverter.test.ts` | — | Shopee/Lazada URL conversion, unknown platform fallback |
| `lib/utils/__tests__/slug.test.ts` | — | Slug uniqueness, invalid chars, length bounds |
| `lib/utils/__tests__/youtube.test.ts` | — | YouTube URL extraction |
| `lib/utils/__tests__/isValidHex.test.ts` | — | Hex color validation |
| `lib/utils/__tests__/validateEmail.test.ts` | — | Email validation |
| `lib/utils/__tests__/eventDateFormat.test.ts` | — | Date/time formatting |
| `lib/validators/__tests__/event.test.ts` | — | Event creation Zod schema |
| `stores/__tests__/landing-store.test.ts` | — | Landing page store |

**Skipped (intentional):**
- UI rendering tests (no Playwright for MVP)
- `downloadIcsFile` — browser DOM (`document.createElement`, `URL.createObjectURL`)
- Manual end-to-end flows (auth → create event → customize → share → guest actions)
- Manual verification of SEO tags, PostHog events, Sentry reporting
- Manual test: bottom navbar — all 6 modals open/close, drag-to-dismiss
- Manual test: wishlist modal — claim conflict handled correctly
- Manual test: calendar modal — Google URL pre-filled, `.ics` downloads correctly
