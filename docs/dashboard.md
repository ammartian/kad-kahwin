# Dashboard

**Owns:** All authenticated couple-facing pages — event list, event overview, builder, guest management, and wishlist management.

**Key files:**
- `app/(dashboard)/dashboard/page.tsx` — events list page
- `app/(dashboard)/dashboard/events/[eventId]/page.tsx` — single event overview
- `app/(dashboard)/dashboard/events/[eventId]/layout.tsx` — shared event layout (nav, auth guard)
- `app/(dashboard)/dashboard/events/[eventId]/builder/page.tsx` — invitation builder
- `app/(dashboard)/dashboard/events/[eventId]/guests/page.tsx` — guest list + import
- `app/(dashboard)/dashboard/events/[eventId]/wishlist/page.tsx` — gift registry management

---

## Route structure

```
/dashboard                          → events list (listMyEvents)
/dashboard/events/[eventId]         → event overview (stats, share link, publish toggle)
/dashboard/events/[eventId]/builder → invitation builder (split panel editor + preview)
/dashboard/events/[eventId]/guests  → guest list, add/delete, import via xlsx
/dashboard/events/[eventId]/wishlist → wishlist items, add/delete/toggle visibility
```

All routes under `/dashboard/events/[eventId]/` share `layout.tsx` which:
- Guards auth (redirects to `/sign-in` if not authenticated)
- Provides the event sidebar/nav
- Fetches event summary for nav display

---

## Events list (`/dashboard`)

- Calls `listMyEvents` — returns events where caller is a manager
- Capped at 50 events (MVP limit)
- Shows: couple name, wedding date, published status
- CTA: "Create new event" → opens event creation form (slug check + create)

---

## Event overview (`/dashboard/events/[eventId]`)

- Shows: invite URL, publish toggle, RSVP summary, quick links to sub-pages
- Publish toggle → `updateEvent({ published: true/false })`
- Share link uses the event slug: `{SITE_URL}/{slug}`

---

## Guest management (`/dashboard/events/[eventId]/guests`)

Convex functions used: `listGuests`, `addGuest`, `deleteGuest`, `importGuests`, `getRSVPAnalytics`

**Manual add:** form with name, phone (optional), email (optional), maxPax (optional).

**Import via xlsx:** guest list uploaded as spreadsheet → parsed client-side with `xlsx` library → `importGuests` mutation bulk-inserts.

**RSVP analytics:** `getRSVPAnalytics` returns counts (total guests, RSVPs received, attending, not attending, total pax). Displayed as summary cards.

**Guest ↔ RSVP relationship:** guests table = invite list. RSVPs table = submissions by name. No FK. Analytics cross-references by name match — not a join.

---

## Wishlist management (`/dashboard/events/[eventId]/wishlist`)

Convex functions used: `listWishlistItems`, `addWishlistItem`, `deleteWishlistItem`, `toggleWishlistItemVisibility`

**Add item:** couple pastes a Shopee/Lazada URL → `affiliateConverter` converts to affiliate link → saved with both `originalUrl` and `affiliateUrl`.

**Visibility toggle:** `isVisible = false` hides item from guests (but keeps it in DB). Couple can re-enable.

**Guest-suggested items:** `addedBy = "guest"` items appear here too — couple can approve (set visible) or delete.

---

## Gotchas

- **`listMyEvents` returns summary fields only** — no image URLs, no colors. Full event data (with image URLs) only comes from `getEvent` which is called in the builder.
- **Event creation sets `published: false` and `paid: false` by default.** Couple must explicitly publish.
- **Builder carousel images managed separately** from other event fields — `updateCarouselImages` mutation, not `updateEvent`. Max 10 images enforced server-side.
- **Donation QR and bank details** are edited in the builder (DonationSection) but displayed in the guest page's DonationModal. Both storage ID and text fields involved.

---

## Connected to

- `convex/events.ts` — `listMyEvents`, `getEvent`, `updateEvent`, `createEvent`
- `convex/guests.ts` — guest CRUD + analytics
- `convex/wishlist.ts` — wishlist CRUD
- `components/features/builder/` — builder UI (see `docs/builder.md`)
- `lib/utils/affiliateConverter.ts` — wishlist URL conversion
