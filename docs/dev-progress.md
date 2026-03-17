## Kad Kahwin MVP – Dev Progress

> **Reference PRD:** `docs/PRD/finalized-prd.md` (v2.0, March 17, 2026)

---

### High-Level Status

- MVP complete
- Backend core (users, events, managers, guests, rsvps, wishlist, wishes)
- Builder UI (event editor + live preview)
- Authentication (Google via BetterAuth)
- Invitation view redesign (cinematic, mobile-locked, bottom navbar)

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
- Convex query: `getCarouselImages(eventId)` → returns CDN URLs (PRD §5.2)
- Convex mutation: `updateCarouselImages(eventId, imageIds[])` (PRD §5.2)
- ICS generation implemented client-side in `lib/utils/generateIcs.ts` (PRD §5.2)
- `getEvent` and `getEventBySlug` updated to resolve `carouselImageUrls`

#### Builder Updates ✓

- Builder "Details" section — venue name + venue address fields added (PRD §4.2)
- Builder "Photos" section — upload up to 10 carousel photos (PRD §4.2, §6.2)
- Drag-to-reorder photos, per-photo delete (PRD §6.2)
- `useAutoSave` extended with `venueName` + `venueAddress` debounced save
- `editorStore` extended with `venueName`, `venueAddress`, `carouselImageUrls` fields

#### URL Route Update

- Deferred (keep existing `app/(guest)/[slug]` route for now)

#### Invitation View — Sections ✓

- `InvitationContainer.tsx` — mobile-locked 390px frame, blurred desktop bg (PRD §3.2)
- `HeroSection.tsx` — couple names, date, Ken Burns background, entrance animations (PRD §3.3 §1)
- `EventDetailsSection.tsx` — venue name, date, time styled cards with scroll animations (PRD §3.3 §2)
- `CarouselSection.tsx` — swipeable photo carousel, auto-advance, dots indicator (PRD §3.3 §3)
- `WishesSection.tsx` — new timeline layout with AnimatePresence (PRD §3.3 §4)
- RSVP: modal only (moved to RSVPModal in bottom navbar) (PRD §3.3 §5)

#### Bottom Navbar ✓

- `BottomNavbar.tsx` — 6-icon fixed bottom bar, semi-transparent, themed (PRD §3.4)
- `BottomSheet.tsx` — reusable bottom sheet, spring animation, drag-to-dismiss (PRD §3.4)
- `MusicModal.tsx` — play/pause toggle, music note animation, postMessage to iframe (PRD §3.4 Modal 1)
- `CalendarModal.tsx` — Google Calendar URL, Apple/Outlook `.ics` download (PRD §3.4 Modal 2)
- `DonationModal.tsx` — QR code image, bank details, copy-to-clipboard (PRD §3.4 Modal 3)
- `LocationModal.tsx` — Waze/Google Maps/Apple Maps buttons (PRD §3.4 Modal 4)
- `RSVPModal.tsx` — RSVP form, pax stepper, success state, deadline display (PRD §3.4 Modal 5)
- `WishlistModal.tsx` — wishlist items, claim/unclaim, inline name prompt, add item form (PRD §3.4 Modal 6)

#### Animations (Framer Motion) ✓

- Framer Motion already installed (^12.29.2)
- Scroll-triggered section animations (`whileInView`, `once: true`) (PRD §3.5)
- Stagger children on section entries (PRD §3.5)
- Ken Burns effect on hero background (PRD §3.5)
- Floating scroll indicator animation (PRD §3.5)
- New wish entrance animation (`AnimatePresence`) (PRD §3.5)
- `useReducedMotion()` support — all animations disabled if set (PRD §3.5)

#### i18n — New Keys ✓

- All new navbar/modal translation keys added to `ms.json` and `en.json` (PRD Appendix B)

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

### Testing Checklist (PRD §11)

- Unit tests for Convex `events` mutations/queries
- Unit tests for editor/builder Zustand stores
- Unit tests for RSVP logic (duplicate, deadline, pax validation)
- Unit tests for wishlist claim/unclaim and affiliate converter
- Unit tests for guest import (Excel parsing/validation)
- Unit tests for ICS file generation (PRD §11.4)
- Unit tests for carousel image management (max 10, empty state)
- Manual end-to-end flows (auth → create event → customize → share → guest actions)
- Manual verification of SEO tags, PostHog events, and Sentry reporting
- Manual test: bottom navbar — all 6 modals open/close, drag-to-dismiss
- Manual test: wishlist modal — claim conflict handled correctly
- Manual test: calendar modal — Google URL pre-filled, `.ics` downloads correctly

