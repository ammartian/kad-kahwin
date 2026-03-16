## Kad Kahwin MVP – Dev Progress

### High-Level Status
- **Overall MVP**: In progress
- **Backend core (users, events, managers)**: Implemented (missing guests, RSVPs, wishlist, wishes tables)
- **Builder UI (event editor + live preview)**: Implemented (auto-save + layout in place)
- **Auth (Google via BetterAuth)**: Implemented

### Phase 1 – Must-Have MVP Features (from PRD 8.1)
- **Landing page builder + live preview**  
  - **Done**: Core builder route + layout, editor/preview split, auto-save hook, background/color/music sections wired to Convex.  
  - **Not done**: Undo/redo, “View on Mobile” helper, final 9:16 preview polish.
- **Event creation with custom slug**  
  - **Done**: Convex `events` table, slug validation + uniqueness, `createEvent`, `listMyEvents`, manager linkage, co‑manager invite mutation.  
  - **Not done**: Public event slug route `(guest)/[slug]`, publish/draft toggle, SEO fields in UI.
- **Authentication (Google OAuth)**  
  - **Done**: Google sign-in screen, BetterAuth client, Convex `users` table.  
  - **Not done**: Account settings UI, multi-event dashboard polish.
- **Guest list management + Excel import/export**  
  - **Done**: None.  
  - **Not done**: `guests`/`rsvps` tables, Convex queries/mutations, Excel parser + exporter, dashboard UI.
- **RSVP system + analytics + deadline**  
  - **Done**: RSVP-related validation rules outlined in Convex tests/PRD.  
  - **Not done**: `rsvps` table, `submitRSVP` + `getRSVPAnalytics` functions, guest-side RSVP UI, deadline enforcement in code.
- **Wishlist CRUD + affiliate conversion + claims**  
  - **Done**: None.  
  - **Not done**: `wishlist_items` table, add/claim/unclaim/toggle mutations, affiliate converter util, manager + guest UIs.
- **Real-time wishes (chat-like UI)**  
  - **Done**: None.  
  - **Not done**: `wishes` table, get/add/delete Convex functions, chat UI, real-time subscription wiring.
- **Donation section (QR + bank info + copy)**  
  - **Done**: Schema fields for QR + bank details on `events`.  
  - **Not done**: Upload flow, guest-facing donation section, copy-to-clipboard.
- **Custom URL per event + SEO basics**  
  - **Done**: Slug field + validation in Convex, event creation enforcing uniqueness.  
  - **Not done**: Guest slug route, per-event meta tags/OG image, sitemap/structured data.
- **Language switcher (Malay/English)**  
  - **Done**: i18n setup, `locales/en.json` and `locales/ms.json`, language toggle in builder header.  
  - **Not done**: Full translation coverage across dashboard + guest pages, language preference persistence for guests.
- **PostHog analytics + Sentry monitoring**  
  - **Done**: Packages and basic config stubs.  
  - **Not done**: Wiring all listed PostHog events, verifying Sentry error/performance capture in prod.
- **Co‑manager invitation and acceptance**  
  - **Done**: `managers` table, invite mutation with validations + max-2-managers rule.  
  - **Not done**: Email delivery/acceptance flow, co‑manager UI indicators, real-time co-edit awareness.
- **Desktop 9:16 view + Vercel deployment**  
  - **Done**: Core builder layout responsive; dev environment running.  
  - **Not done**: Final desktop guest-view frame (centered 9:16), production deployment checklist.

### Phase 2+ – Deferred or Post-MVP (from PRD 8.2+)
- **Stripe FPX payment + enforcement + refunds**: Not started (intentionally deferred; only `paid` flag exists in schema).
- **Admin panel, advanced analytics, event templates, marketplace, etc.**: Not started (all post-MVP).

### Testing
- **Convex events functions**: Unit tests present and being expanded.
- **Editor/builder state (Zustand stores)**: Store + tests present.
- **Other Convex domains (guests, RSVP, wishlist, wishes, donation, guest invitation page)**: Not started (pending implementation).
