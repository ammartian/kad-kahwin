# Finalized PRD: Kad Kahwin — Digital Wedding Invitation Platform

## Document Information

- **Product Name:** Kad Kahwin
- **Version:** 2.0 (Finalized)
- **Author:** ammartian
- **Date:** March 17, 2026
- **Status:** Finalized
- **Supersedes:** `kad-kahwin-technical-prd.md` v1.0, `kad-kahwin-landing-page-prd.md` v1.0
- **References:** `docs/dev-progress.md`, kadkahwinmy.com invitation reference

---

## 1. Executive Summary

### 1.1 Product Vision

Kad Kahwin is a Malaysian digital wedding invitation platform that enables couples to create, customize, and share cinematic mobile-first wedding invitations with integrated RSVP management, real-time wishes, wishlists, and donation features. The platform generates affiliate revenue through Shopee/Lazada wishlist links.

### 1.2 Current Build Status (as of March 17, 2026)

**Completed (Phase 1 Backend & Core UI):**
- Project setup: Next.js App Router, Convex, BetterAuth, TailwindCSS, Shadcn/ui
- Authentication: Google OAuth via BetterAuth
- Event creation with custom slug validation
- Landing page builder UI with live preview (Zustand store → Convex)
- Background image upload (5MB limit, Convex storage)
- Color theming fields (backgroundColor, colorPrimary, colorSecondary, colorAccent)
- YouTube music embed (auto-play, loop)
- Event info fields (date, time, Waze/Google/Apple Maps links)
- Guest list management (CRUD table, Excel import/export)
- RSVP form + deadline enforcement + analytics cards
- Real-time wishes feed (chat-like)
- Wishlist CRUD (add/edit/delete/hide) + affiliate link conversion (Shopee/Lazada)
- Guest claim/unclaim wishlist items (atomic Convex mutation)
- Guest add wishlist item (auto-claimed)
- Donation section (QR upload, bank info, clipboard copy)
- Custom guest URL route `(guest)/[slug]`
- Co-manager data model and invite mutation
- Desktop 9:16 invitation view (centered frame) — basic implementation
- Publish/draft toggle for events
- Dual-language setup (Malay/English translation files)
- Unit tests for events, RSVP, wishlist claim/unclaim, affiliate converter, Zustand stores

**Remaining for MVP Completion:**
- Invitation view full redesign (this PRD — primary focus)
- Bottom Navbar modal system
- Framer Motion animation layer
- Image carousel section for couple photos
- Calendar integration (add to Google/iCal)
- Co-manager invite acceptance flow + UI
- SEO meta tags, sitemap, structured data
- Language switcher on guest page
- PostHog events wired
- Sentry monitoring verified
- Production Vercel deployment

### 1.3 Key Success Metrics

- 100 events created in first 3 months
- 30% of created events proceed to payment (Phase 2)
- 70% RSVP completion rate
- RM500/month affiliate revenue
- Top 5 ranking for "kad kahwin digital Malaysia" within 3 months
- <3s initial load time for invitation pages

---

## 2. Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js App Router | 16+ |
| Frontend | React | 19+ |
| Language | TypeScript | 5.x (strict) |
| Styling | TailwindCSS | 4.x |
| UI Components | Shadcn/ui | Latest |
| Animations | Framer Motion | Latest |
| State Management | Zustand | 5.x |
| Server State | Convex React | Latest |
| Backend | Convex | Latest |
| Auth | BetterAuth | Latest |
| Analytics | PostHog | Latest |
| Error Monitoring | Sentry | Latest |
| Payment | Stripe (disabled MVP) | Latest |
| Hosting | Vercel | N/A |

---

## 3. Invitation View — Full Specification

This is the primary design deliverable. The invitation view is the public-facing page guests see when they open the shared link.

### 3.1 Design Philosophy

Inspired by kadkahwinmy.com, the invitation view is a **cinematic, mobile-locked experience** — not a generic web page. It feels like an interactive digital card, with layered animations, a persistent bottom action bar, and template-driven visual identity.

### 3.2 Container & Layout

**Mobile-locked frame:**
- Max-width: `390px` (iPhone 14 Pro width)
- Rendered centered on desktop with a blurred/dimmed full-screen background behind the frame
- The background behind the frame uses the event's `backgroundColor` or background image blurred at 20px and dimmed with a dark overlay
- On mobile devices (<640px): full viewport width, no surrounding frame
- Frame has subtle box-shadow to give depth on desktop

**Scroll behavior:**
- Single continuous vertical scroll
- Each section fills at least the viewport height (`min-h-screen`) before the next begins
- Smooth scroll-snapping optional per section (configurable per template)
- No horizontal scrolling

**Route:** `/(guest)/[slug]/page.tsx` — already exists, will be fully redesigned

### 3.3 Invitation Sections (Top to Bottom)

#### Section 1: Hero / Cover

**Purpose:** First impression. Couple names, date, background image/color, animated entrance.

**Layout:**
- Full viewport height (`100vh`)
- Background: event `backgroundImageUrl` (with overlay) or `backgroundColor`
- Centered content, vertically and horizontally

**Content:**
- Couple names (`coupleName`) — large display font, styled per template
- Wedding date formatted (e.g., "Sabtu, 15 Mac 2026")
- Wedding time (e.g., "11:00 pagi")
- Optional: tagline or verse (template-defined decorative text)
- Scroll indicator at bottom (animated chevron or floating element)

**Animations (Framer Motion):**
- Background image: Ken Burns effect (slow scale 100%→110% over 8s, loop)
- Couple names: fade-in + slide-up, 0.5s delay
- Date/time: fade-in, 0.8s delay
- Decorative elements (e.g., floral divider, rings): stagger fade-in 1.0s–1.4s
- Scroll indicator: float up-down loop (infinite)

---

#### Section 2: Event Details

**Purpose:** Display venue, date, time clearly.

**Layout:**
- Styled info cards, centered
- Uses `colorPrimary`, `colorAccent`, `colorSecondary` for theming

**Content:**
- Date (formatted long form)
- Time
- Venue name (if provided — new field, see §6.1)
- Address (if provided — new field)
- Decorative dividers per template

**Animations:**
- Cards slide up on scroll-into-view (Framer Motion `whileInView`)
- Staggered 0.15s between cards

---

#### Section 3: Image Carousel

**Purpose:** Display couple photos in a swipeable carousel.

**Layout:**
- Full-width within the 390px frame
- 16:9 or square aspect ratio per image
- Dots indicator below carousel
- Touch swipe on mobile, arrow buttons on desktop

**Content:**
- Up to 10 photos uploaded by the manager (new feature — see §6.2)
- Fallback: if no photos uploaded, section is hidden

**Animations:**
- Slide transition between photos (300ms ease-in-out)
- Auto-advance every 4 seconds
- Fade-in on section scroll-into-view

**Builder support:**
- Manager uploads photos in builder under a new "Photos" tab
- Photos stored in Convex file storage
- Drag to reorder

---

#### Section 4: Wishes Timeline

**Purpose:** Real-time guest wishes in a chat-like timeline.

**Layout:**
- Vertically stacked message bubbles
- Alternating left/right alignment or single-side — per template
- Guest name above each bubble
- Relative timestamp (e.g., "2 minit lepas")

**Content:**
- All submitted wishes via `getWishes(eventId)` (Convex real-time subscription)
- Write wish form at bottom of section: name input + message input + send button
- Character counter (255 max)

**Animations:**
- New wish slides in from bottom (Framer Motion `AnimatePresence`)
- Section fade-in on scroll
- Send button pulse on success

---

#### Section 5: RSVP Attendance

**Purpose:** Allow guests to RSVP directly from the page (also accessible via Bottom Navbar).

**Layout:**
- Centered form card
- Radio: "Hadir" / "Tidak Hadir"
- Pax count input (1–10, shown only if attending)
- Name input
- Submit button
- After submit: "Terima kasih! Kami menantikan kehadiran anda." — form becomes disabled

**Business Rules (unchanged):**
- One RSVP per guest name
- RSVP deadline enforced
- Pax: 1–10
- Cannot modify after submission

**Animations:**
- Form card scale-in on scroll
- Submit button shimmer while loading
- Success state: checkmark animation + message fade-in

---

### 3.4 Bottom Navbar

A persistent fixed bottom bar visible at all times while scrolling the invitation.

**Design:**
- Height: 64px
- Background: semi-transparent (`backdrop-blur`, themed with `backgroundColor` + opacity)
- 6 icon buttons, evenly spaced
- Each button: icon + label underneath (12px)
- Active state: icon highlighted with `colorAccent`
- Tap opens corresponding modal (slides up from bottom — bottom sheet pattern)

**6 Navbar Items:**

| # | Icon | Label | Opens |
|---|------|-------|-------|
| 1 | `Music2` | Muzik | Music modal |
| 2 | `CalendarDays` | Tarikh | Calendar modal |
| 3 | `QrCode` | Bayar | Donation / QR modal |
| 4 | `MapPin` | Lokasi | Location modal |
| 5 | `ClipboardList` | RSVP | RSVP modal |
| 6 | `Gift` | Hadiah | Wishlist modal |

#### Bottom Sheet Modal Behavior
- All modals use the same bottom sheet pattern
- Slides up from bottom with spring animation (Framer Motion `y: "100%" → y: 0`)
- Drag down to dismiss, or tap backdrop to close
- Max height: 80vh, scrollable content inside
- Rounded top corners (`rounded-t-2xl`)
- Drag handle indicator at top center

---

#### Modal 1: Music

**Content:**
- Now playing: YouTube video title (fetched via YouTube oEmbed API or stored title)
- Album art placeholder (event background image thumbnail)
- Play / Pause toggle button
- Music note floating animation when playing
- "Powered by YouTube" attribution

**Logic:**
- Controls the hidden YouTube iframe (`MusicEmbed` component)
- Uses `postMessage` to communicate play/pause to iframe
- State: `isPlaying` (Zustand or local state)

---

#### Modal 2: Calendar

**Content:**
- Event title: "[Couple Names] Wedding"
- Date, time, venue
- "Add to Google Calendar" button → opens Google Calendar URL with pre-filled event
- "Add to Apple Calendar" button → downloads `.ics` file
- "Add to Outlook" button → downloads `.ics` file (same file)

**Google Calendar URL format:**
```
https://calendar.google.com/calendar/render?action=TEMPLATE
  &text=[COUPLE_NAMES]+Wedding
  &dates=[START_DATETIME]/[END_DATETIME]
  &details=Majlis+perkahwinan+[COUPLE_NAMES]
  &location=[VENUE]
```

**.ics file generation:**
- Generated client-side as a Blob
- Fields: SUMMARY, DTSTART, DTEND, LOCATION, DESCRIPTION

---

#### Modal 3: Donation / QR

**Content:**
- QR code image (from `donationQrUrl`)
- Bank name, account number, account holder
- Copy-to-clipboard button for account number
- "Copied!" feedback toast

**Fallback:** if no donation info configured, show "Tiada maklumat pembayaran" message

---

#### Modal 4: Location

**Content:**
- Venue name + address (if provided)
- 3 buttons:
  - "Waze" → opens `locationWaze` URL
  - "Google Maps" → opens `locationGoogle` URL
  - "Apple Maps" → opens `locationApple` URL
- Buttons show only if corresponding URL is set
- If none set: "Tiada maklumat lokasi"

---

#### Modal 5: RSVP

**Content:**
- Same RSVP form as Section 5 (inline)
- If already submitted: show submission summary ("Anda telah RSVP sebagai hadir, 2 orang")
- RSVP deadline shown if set

---

#### Modal 6: Wishlist

**Content:**
- List of visible wishlist items
- Each item card:
  - Item title
  - Platform badge (Shopee / Lazada / Other)
  - "Beli" button → opens affiliate link in new tab
  - "Saya akan beli" claim button (if unclaimed)
  - "Batalkan" unclaim button (if claimed by this guest)
  - "Dituntut" badge (if claimed by another guest — no name shown to guests)
- "Tambah Hadiah" button at bottom → inline form to add new wishlist item (auto-claimed)
- If no items: "Tiada item dalam senarai hadiah"

**Guest claim flow:**
- Guest taps "Saya akan beli"
- If `guestName` already known (from RSVP): proceed directly
- If not: prompt for name (inline input, not a new modal)
- Atomic claim via `claimWishlistItem` mutation
- On conflict: toast "Item ini telah dituntut oleh orang lain"

---

### 3.5 Animation System

All animations use Framer Motion. Animations respect `prefers-reduced-motion` (all animations disabled if user has set reduced motion preference).

**Scroll-triggered (whileInView):**
```
initial: { opacity: 0, y: 40 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.5, ease: "easeOut" }
viewport: { once: true, margin: "-80px" }
```

**Stagger children:**
```
staggerChildren: 0.15
delayChildren: 0.1
```

**Bottom sheet modal:**
```
initial: { y: "100%" }
animate: { y: 0 }
exit: { y: "100%" }
transition: { type: "spring", stiffness: 300, damping: 30 }
```

**Ken Burns (hero background):**
```css
@keyframes kenBurns {
  0%   { transform: scale(1); }
  100% { transform: scale(1.1); }
}
animation: kenBurns 8s ease-in-out infinite alternate;
```

**Floating scroll indicator:**
```
animate: { y: [0, 8, 0] }
transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
```

**New wish entrance:**
```
initial: { opacity: 0, x: -20 }
animate: { opacity: 1, x: 0 }
transition: { duration: 0.3 }
```

### 3.6 Template System

The invitation view is template-driven. The first template ("Classic") is the MVP implementation. Template selection is Phase 2.

**MVP Template: "Classic"**
- Font pairing: Playfair Display (display) + Lato (body)
- Color scheme: uses event's custom colors
- Decorative elements: floral dividers, bismillah calligraphy placeholder
- Section layouts: centered, portrait-oriented

**Phase 2 Templates (planned):**
- Modern Minimalist
- Rustic / Earthy
- Bold & Colorful
- Islamic Geometric

**Template schema addition (Phase 2):**
```typescript
// events table
templateId: v.optional(v.string()) // "classic" | "modern" | "rustic" ...
```

---

## 4. Dashboard / Builder

### 4.1 Overview

The builder is the manager-facing interface for customizing the invitation. Accessed at `/(dashboard)/events/[eventId]/builder`.

Split view: editor panel (left/top) + live preview (right/bottom, locked to 9:16).

### 4.2 Builder Tabs

| Tab | Content |
|-----|---------|
| Design | Background image upload, color pickers (4 colors) |
| Details | Couple name, wedding date, time, venue name, venue address |
| Music | YouTube URL input |
| Photos | Upload up to 10 photos for carousel (new — §6.2) |
| Wishlist | Add/edit/delete wishlist items, toggle visibility |
| Guests | Link to guest management |
| Donation | Upload QR, enter bank details |
| Settings | Slug, language, RSVP deadline, publish toggle |

### 4.3 Live Preview

- Reflects all Zustand store changes in real-time
- Debounced Convex saves (500ms)
- Preview renders actual `GuestInvitationPage` component inside an iframe or scaled div
- Preview scrollable, shows bottom navbar

### 4.4 Share / Publish

- Toggle: Draft ↔ Published
- When published: show share URL with copy button
- URL format: `[domain]/invite/[eventId]/[slug]` (matches kadkahwinmy.com pattern) — see §6.3

---

## 5. Backend / Convex Architecture

### 5.1 Schema (Current + Additions)

**events table additions:**

```typescript
venueName: v.optional(v.string()),      // New: venue display name
venueAddress: v.optional(v.string()),   // New: venue address text
carouselImageIds: v.optional(v.array(v.id("_storage"))), // New: photo carousel
```

**All other tables remain unchanged** (guests, rsvps, wishlist_items, wishes, managers).

### 5.2 New Convex Functions

**query: getCarouselImages**
```typescript
args: { eventId: v.id("events") }
returns: string[] // array of CDN URLs for carousel images
auth: Public
```

**mutation: updateCarouselImages**
```typescript
args: {
  eventId: v.id("events"),
  imageIds: v.array(v.id("_storage"))
}
returns: void
auth: Manager
description: Replace carousel image list (ordered array)
```

**action: generateIcsFile**
```typescript
args: { eventId: v.id("events") }
returns: string // .ics file content as string
auth: Public
description: Generate iCal file content for calendar download
```

### 5.3 Existing Functions (Unchanged)

All existing queries and mutations from the original PRD remain. Key ones used by the invitation view:

- `guest.getEventBySlug` — fetch full event data
- `wishes.getWishes` — real-time subscription
- `wishes.addWish` — post a wish
- `rsvps.submitRSVP` — submit RSVP
- `wishlist.getWishlist` — fetch visible items
- `wishlist.claimWishlistItem` — atomic claim
- `wishlist.unclaimWishlistItem` — unclaim
- `wishlist.addWishlistItem` — guest adds item

---

## 6. New Fields & Features

### 6.1 Venue Name & Address

**Why:** The invitation view Event Details section needs a venue name and address to display alongside the map links.

**Schema addition to `events`:**
```typescript
venueName: v.optional(v.string()),
venueAddress: v.optional(v.string()),
```

**Builder UI:** New fields in the "Details" tab.

**Validation:**
- `venueName`: max 200 chars
- `venueAddress`: max 500 chars

---

### 6.2 Photo Carousel

**Why:** Couples want to showcase their photos in the invitation — this is a core feature of reference implementations.

**Schema addition to `events`:**
```typescript
carouselImageIds: v.optional(v.array(v.id("_storage"))),
```

**Upload constraints:**
- Up to 10 photos
- Same file constraints as background: JPG, PNG, WEBP, max 5MB each
- Stored in Convex file storage

**Builder UI:**
- New "Photos" tab in builder
- Drag-to-reorder functionality
- Individual delete per photo
- Upload progress per file

**Guest view:**
- Auto-advancing carousel (4s interval)
- Touch swipe on mobile
- Dots navigation indicator
- Section hidden if no photos

---

### 6.3 URL Structure Update

**Current:** `[domain]/[slug]`

**Updated to match kadkahwinmy.com pattern:** `[domain]/invite/[eventId]/[slug]`

This provides:
- Cleaner URL hierarchy
- Easier routing disambiguation (avoids conflicts with `/settings`, `/dashboard`, etc.)
- Matches the established competitor pattern guests are familiar with

**Route file:** `app/(guest)/invite/[eventId]/[slug]/page.tsx`

**Existing route `app/(guest)/[slug]` should redirect** to the new URL format for backward compatibility.

---

## 7. Feature Specifications (Carry-Forward)

### 7.1 Authentication

- Google OAuth via BetterAuth — **Done**
- Session management via HTTP-only cookies — **Done**
- Dashboard protected routes — **Done**
- Facebook/Apple login — Phase 2

### 7.2 Event Creation

- Custom slug with uniqueness validation — **Done**
- Co-manager invite mutation — **Done**
- Co-manager invite acceptance flow — **Remaining**

### 7.3 Wishlist

- CRUD dashboard — **Done**
- Affiliate link conversion (Shopee/Lazada) — **Done**
- Guest claim/unclaim (atomic) — **Done**
- Guest add items — **Done**
- Manager hide/show — **Done**
- Wishlist in Bottom Navbar modal — **Remaining** (UI redesign)

### 7.4 Guest Management & RSVP

- Guest list CRUD — **Done**
- Excel import/export — **Done**
- RSVP form + deadline — **Done**
- RSVP analytics — **Done**
- RSVP in Bottom Navbar modal — **Remaining** (UI move)

### 7.5 Wishes

- Real-time chat feed — **Done**
- Manager delete — **Done**
- Wishes as invitation section — **Remaining** (UI redesign to match new layout)

### 7.6 Donation

- QR upload, bank info, clipboard — **Done**
- Accessible via Bottom Navbar modal only (removed as inline section) — **Remaining** (UI move)

### 7.7 Multi-Language

- Translation files (Malay/English) — **Done**
- Language switcher on guest page — **Remaining**
- i18n: all new invitation section strings must have translations in both `ms.json` and `en.json`

### 7.8 SEO

- Per-event meta tags — **Remaining**
- Sitemap including published events — **Remaining**
- JSON-LD structured data — **Remaining**
- OG image: event background image or branded default

### 7.9 Analytics (PostHog)

All events from the original PRD apply. Additional events for new features:

| Event | Trigger |
|-------|---------|
| `navbar_music_opened` | Music modal opened |
| `navbar_calendar_opened` | Calendar modal opened |
| `navbar_qr_opened` | QR/Donation modal opened |
| `navbar_location_opened` | Location modal opened |
| `navbar_rsvp_opened` | RSVP modal opened |
| `navbar_wishlist_opened` | Wishlist modal opened |
| `calendar_add_clicked` | Add to calendar button clicked (with `platform: "google"/"apple"/"outlook"`) |
| `carousel_swiped` | Guest swipes photo carousel |

### 7.10 Payment (Disabled for MVP)

Stripe FPX RM39 one-time payment remains stubbed. Share button works without payment check during MVP.

---

## 8. Data Validation Rules

All validation rules from original PRD apply. New additions:

| Field | Rule |
|-------|------|
| `venueName` | Optional, max 200 chars |
| `venueAddress` | Optional, max 500 chars |
| `carouselImageIds` | Optional array, max 10 items |
| Carousel image file | JPG/PNG/WEBP, max 5MB each |

---

## 9. Edge Cases

All edge cases from original PRD apply. New additions:

| Scenario | Handling |
|----------|----------|
| Guest opens invitation with no carousel photos | Carousel section hidden entirely |
| Guest opens invitation with no venue set | Event Details shows date/time only, no venue row |
| Guest opens invitation with no donation info | QR modal shows "Tiada maklumat pembayaran" |
| Guest opens invitation with no wishlist items | Wishlist modal shows "Tiada item dalam senarai hadiah" |
| Guest taps calendar on device without Google Calendar | Falls back to `.ics` download |
| Two guests claim same wishlist item simultaneously | Second claim fails with "Item ini telah dituntut" toast |
| Carousel auto-advance while guest is reading | Pause auto-advance on user interaction (touch/click), resume after 8s |
| Bottom navbar overlaps page content | All sections have `pb-20` (80px) padding at bottom to clear navbar |

---

## 10. Development Phases (Updated)

### 10.1 MVP Remaining Tasks (Phase 1 Completion)

**Priority order:**

1. **Invitation view redesign** — full rebuild of `GuestInvitationPage.tsx` per §3
   - Hero section with animations
   - Event Details section
   - Image Carousel section
   - Wishes Timeline section
   - RSVP Attendance section
   - Bottom Navbar with 6 modals
   - Framer Motion animation layer

2. **Schema additions** — `venueName`, `venueAddress`, `carouselImageIds`

3. **New Convex functions** — `getCarouselImages`, `updateCarouselImages`, `generateIcsFile`

4. **Builder updates** — Photos tab, venue name/address fields

5. **URL route update** — `invite/[eventId]/[slug]` + redirect from old route

6. **Co-manager invite acceptance flow**

7. **Language switcher** on guest page

8. **SEO** — meta tags per event, sitemap, JSON-LD

9. **PostHog events** — all remaining events wired

10. **Production Vercel deployment**

### 10.2 Phase 2 (Post-MVP)

- Stripe FPX payment (RM39 per event)
- Payment enforcement (block share until paid)
- Event templates system (Modern, Rustic, Bold, Islamic Geometric)
- Template picker UI in builder
- Image optimization on upload (resize to 1200px)
- Custom email templates for co-manager invites
- Guest list filtering/sorting UI
- Bulk guest actions
- Facebook/Apple/Email login
- Admin panel

### 10.3 Phase 3–4 (Future)

- Multi-event support dashboard
- Event duplication
- Guest broadcast messaging
- White-label for planners
- Blog / content SEO
- Vendor marketplace
- Photo gallery uploads by guests
- RSVP meal preferences
- Seating chart
- Thank you card generator

---

## 11. Testing Strategy

### 11.1 What to Test

- Convex mutations: business logic, validation, auth checks
- Convex queries: correct data returned, index usage
- Utility functions: affiliate link converter, Excel parser, slug validator, ICS generator
- Skip: UI rendering tests, Convex infrastructure, third-party libs

### 11.2 Test File Locations

- Convex functions: `/convex/functions/__tests__/[domain].test.ts`
- Utilities: `/lib/utils/__tests__/[util].test.ts`

### 11.3 Current Test Coverage

- [x] Unit tests for Convex `events` mutations/queries
- [x] Unit tests for editor/builder Zustand stores
- [x] Unit tests for RSVP logic (duplicate, deadline, pax validation)
- [x] Unit tests for wishlist claim/unclaim and affiliate converter
- [ ] Unit tests for guest import (Excel parsing/validation)
- [ ] Unit tests for ICS file generation
- [ ] Manual end-to-end flows (auth → create event → customize → share → guest actions)
- [ ] Manual verification of SEO tags, PostHog events, and Sentry reporting

### 11.4 Priority Test Cases for New Features

- Carousel: max 10 images enforced, empty state handling
- Calendar: ICS file generates valid format, Google Calendar URL encodes correctly
- Bottom Navbar: each modal opens/closes, drag-to-dismiss works
- Wishlist modal: claim conflict handled atomically
- RSVP modal: same validation as inline form

---

## 12. Security

All security measures from original PRD apply. No new security surface area added by the invitation view redesign — all data access uses existing Convex public queries. Bottom Navbar modals are client-side UI only.

---

## 13. Performance Targets

| Metric | Target |
|--------|--------|
| Invitation page LCP | <2.5s |
| Invitation page TTI | <3s |
| Animation frame rate | 60fps (use `will-change: transform`) |
| Carousel image load | Lazy load off-screen images |
| Framer Motion bundle | Use dynamic import for non-critical animations |

**Optimization notes:**
- Framer Motion: import only used components (`motion.div`, not entire library)
- Carousel images: use Next.js `Image` with `loading="lazy"` for all but the first
- Bottom sheet modals: render lazily (only mount DOM when first opened)
- `prefers-reduced-motion`: disable all Framer Motion animations if set

---

## 14. Folder Structure (Invitation View)

```
/components
  /features
    /guest
      /invitation               # New — all invitation view components
        /InvitationContainer.tsx    # Mobile-locked frame wrapper
        /sections
          /HeroSection.tsx
          /EventDetailsSection.tsx
          /CarouselSection.tsx
          /WishesSection.tsx          # Refactored from existing
          /RSVPSection.tsx            # Refactored from existing
        /navbar
          /BottomNavbar.tsx           # Main navbar component
          /modals
            /MusicModal.tsx
            /CalendarModal.tsx
            /DonationModal.tsx        # Refactored from DonationSection.tsx
            /LocationModal.tsx        # Refactored from EventInfoSection.tsx
            /RSVPModal.tsx
            /WishlistModal.tsx        # Refactored from WishlistSection.tsx
        /GuestInvitationPage.tsx      # Root — orchestrates above
      /DonationSection.tsx        # Deprecated (moved to modal)
      /EventInfoSection.tsx       # Deprecated (moved to modal)
      /WishlistSection.tsx        # Deprecated (moved to modal)
      /MusicEmbed.tsx             # Keep — hidden YouTube iframe
      /RSVPSection.tsx            # Deprecated (keep logic, refactor UI)
      /WishesSection.tsx          # Deprecated (keep logic, refactor UI)
```

---

## 15. Open Questions

| Question | Decision Needed By |
|----------|--------------------|
| Should the RSVP section in the main page scroll area remain, or only in the bottom navbar? | Before invitation view implementation |
| Should wishes show in both the inline section AND a modal, or only inline? | Before invitation view implementation |
| Should the URL structure change to `/invite/[eventId]/[slug]` be done in MVP or deferred? | Before routing implementation |
| Should photo carousel images be stored separately or as a JSON array of storage IDs in the events table? | Before schema migration |
| Should the first template ("Classic") use Google Fonts loaded at runtime or statically bundled? | Before animation implementation |

---

## Appendix A: Database Schema (Complete)

### events

| Field | Type | Description |
|-------|------|-------------|
| _id | Id<"events"> | Convex auto ID |
| slug | string | Unique URL slug |
| coupleName | string | Display names |
| weddingDate | string | ISO date |
| weddingTime | string | Time string |
| venueName | string? | **New** Venue display name |
| venueAddress | string? | **New** Venue address |
| locationWaze | string? | Waze link |
| locationGoogle | string? | Google Maps link |
| locationApple | string? | Apple Maps link |
| backgroundImageId | Id<"_storage">? | Background image |
| backgroundColor | string? | Hex color |
| colorPrimary | string | Hex color |
| colorSecondary | string | Hex color |
| colorAccent | string | Hex color |
| musicYoutubeUrl | string? | YouTube URL |
| carouselImageIds | Id<"_storage">[]? | **New** Carousel photos |
| language | "ms" \| "en" | Default language |
| rsvpDeadline | string? | ISO date |
| donationQrId | Id<"_storage">? | QR code image |
| bankName | string? | Bank name |
| bankAccount | string? | Account number |
| bankHolder | string? | Account holder |
| paid | boolean | Payment status |
| published | boolean | Published status |
| templateId | string? | Template (Phase 2) |
| createdAt | number | Timestamp |

All other tables (managers, guests, rsvps, wishlist_items, wishes) are unchanged from original PRD.

---

## Appendix B: Translation Keys (New)

All new invitation view strings require entries in both `/locales/ms.json` and `/locales/en.json`:

```json
// ms.json additions
{
  "navbar.music": "Muzik",
  "navbar.calendar": "Tarikh",
  "navbar.donation": "Bayar",
  "navbar.location": "Lokasi",
  "navbar.rsvp": "RSVP",
  "navbar.wishlist": "Hadiah",
  "calendar.add_google": "Tambah ke Google Calendar",
  "calendar.add_apple": "Tambah ke Apple Calendar",
  "calendar.add_outlook": "Tambah ke Outlook",
  "wishlist.claim_button": "Saya akan beli",
  "wishlist.unclaim_button": "Batalkan",
  "wishlist.claimed_badge": "Dituntut",
  "wishlist.add_item": "Tambah Hadiah",
  "wishlist.empty": "Tiada item dalam senarai hadiah",
  "wishlist.already_claimed": "Item ini telah dituntut oleh orang lain",
  "donation.empty": "Tiada maklumat pembayaran",
  "location.empty": "Tiada maklumat lokasi",
  "rsvp.already_submitted": "Anda telah RSVP"
}
```

---

## Appendix C: Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 31, 2026 | Initial Technical PRD |
| 1.1 | Feb 1, 2026 | Landing Page PRD added |
| 2.0 | Mar 17, 2026 | Finalized PRD: consolidated, added invitation view redesign spec, bottom navbar, photo carousel, venue fields, calendar integration, template system, updated dev status |

---

**END OF FINALIZED PRD**
