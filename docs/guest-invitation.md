# Guest Invitation (Public Page)

**Owns:** The public-facing wedding invitation page — everything a guest sees and interacts with after clicking the invite link.

**Key files:**
- `app/(guest)/[slug]/page.tsx` — Next.js page; fetches event by slug, handles 404
- `components/features/guest/GuestInvitationPage.tsx` — main layout component
- `components/features/guest/invitation/InvitationContainer.tsx` — visual wrapper
- `components/features/guest/invitation/sections/` — individual invitation sections
- `components/features/guest/invitation/navbar/BottomNavbar.tsx` — sticky bottom nav
- `components/features/guest/invitation/navbar/BottomSheet.tsx` — slide-up sheet wrapper
- `components/features/guest/invitation/navbar/modals/` — modal content per feature
- `convex/guest.ts` — `getEventBySlug` (public query, no auth)
- `convex/rsvps.ts` — `submitRSVP`, `getRSVP`
- `convex/wishes.ts` — `listWishes`, `addWish`
- `convex/wishlist.ts` — `listWishlistItems`, claim mutation

---

## How it works

### Page load
1. `app/(guest)/[slug]/page.tsx` calls `getEventBySlug` — returns `null` if event doesn't exist or `published = false`.
2. If null → 404. If found → renders `GuestInvitationPage` with full event data.
3. Convex `useQuery` hooks in child components subscribe for real-time updates (wishes wall, RSVP count).

### Invitation sections
Sections rendered based on `sectionOrder` and `sectionsDisabled` fields from the event. Default order: `["landing", "details", "photos", "wishes"]`. Disabled sections are hidden entirely.

| Section | Component | Content |
|---|---|---|
| `landing` | `HeroSection.tsx` | Couple name, wedding date, hero image |
| `details` | `EventDetailsSection.tsx` | Date, time, venue, map links |
| `photos` | `CarouselSection.tsx` | Photo carousel |
| `wishes` | `WishesSection.tsx` | Wishes wall (real-time) |

### Bottom navigation
`BottomNavbar` is a sticky bar at the bottom of the page. Each button opens a `BottomSheet` containing a modal:

| Button | Modal | Convex call |
|---|---|---|
| RSVP | `RSVPModal.tsx` | `submitRSVP`, `getRSVP` |
| Location | `LocationModal.tsx` | None (static links) |
| Calendar | `CalendarModal.tsx` | None (generates .ics) |
| Donation | `DonationModal.tsx` | None (shows QR + bank info) |
| Wishlist | `WishlistModal.tsx` | `listWishlistItems`, claim mutation |
| Music | `MusicModal.tsx` | None (YouTube embed) |
| Wishes | `WishInputModal.tsx` | `addWish` |

---

## RSVP flow

1. Guest opens RSVPModal, enters name.
2. `getRSVP(eventId, guestName)` — checks if already submitted (case-insensitive via `guestNameLower`).
3. If existing RSVP found — shows their response, blocks re-submission.
4. Guest selects attending/not attending + pax count → `submitRSVP`.
5. Server validates: event published, deadline not passed, not duplicate, pax 1–10.
6. RSVP inserted — one record per guest name (no FK to guests table).

**Duplicate detection:** uses `by_event_guestNameLower` index first (fast path). Falls back to full scan for legacy records without `guestNameLower` (pre-migration data).

---

## Wishes flow

1. Guest opens WishInputModal, enters name + message.
2. `addWish` mutation inserts into `wishes` table.
3. `WishesSection` uses `useQuery(api.wishes.listWishes)` — real-time subscription. New wishes appear immediately for all viewers.

---

## Wishlist flow

1. WishlistModal lists items via `listWishlistItems`.
2. Guest clicks "Claim" on an item → mutation sets `claimedByName` + `claimedAt`.
3. Claimed items show the claimer's name — visible to all guests (no auth required).
4. Items with `addedBy = "guest"` were suggested by previous guests; `addedBy = "manager"` were added by the couple.

---

## Per-event theming

The guest page respects all event color/image fields:
- Global: `backgroundColor`, `colorPrimary`, `colorSecondary`, `colorAccent`, `backgroundImageUrl`
- Per-section overrides: `eventDetailsBg*`, `wishesBg*`

Sections without overrides fall back to global colors.

---

## Gotchas

- **`published = false` → 404.** Unpublished events are completely hidden from guests — same response as a non-existent slug.
- **No auth on guest page.** Any interaction (RSVP, wishes, wishlist claims) is anonymous. Guest identity is by name only — no account required.
- **RSVP deadline enforced server-side.** Client shows the deadline; server validates `Date.now() > deadline`. Both must agree.
- **Carousel max 10 images.** Enforced in `updateCarouselImages` mutation — more than 10 throws.
- **Wishlist affiliate URLs.** Items store both `originalUrl` and `affiliateUrl` (Shopee/Lazada converted). Guest-facing UI shows `affiliateUrl`.
- **Real-time via Convex useQuery.** Wishes and wishlist use Convex subscriptions — no polling needed.

---

## Connected to

- `convex/guest.ts` — `getEventBySlug` (read event)
- `convex/rsvps.ts` — RSVP submit/lookup
- `convex/wishes.ts` — add/list wishes
- `convex/wishlist.ts` — list items, claim
- `lib/utils/generateIcs.ts` — calendar file generation
- `lib/utils/affiliateConverter.ts` — wishlist URL conversion
