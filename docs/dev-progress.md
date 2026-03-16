## Kad Kahwin MVP – Dev Progress

### High-Level Status
- [ ] MVP complete
- [x] Backend core (users, events, managers)
- [x] Builder UI (event editor + live preview)
- [x] Authentication (Google via BetterAuth)

### Phase 1 – Must-Have MVP Features (PRD §8.1 checklist)
- [x] Project setup (Next.js, Convex, BetterAuth, TailwindCSS, Shadcn)
- [x] Authentication (Google OAuth sign-in screen + BetterAuth client)
- [x] Event creation with custom slug (Convex `events` + slug validation)
- [x] Landing page builder UI (builder route + layout)
- [x] Background image support in schema (`backgroundImageId` on `events`)
- [x] Color theming fields in schema (`backgroundColor`, `colorPrimary`, `colorSecondary`, `colorAccent`)
- [x] YouTube music field in schema (`musicYoutubeUrl`)
- [x] Event info fields in schema (date, time, location links)
- [x] Live preview wiring (builder → Zustand store → Convex update)
- [x] Background image upload flow (5MB limit, Convex storage, UI)
- [x] Color picker UI + full theming integration
- [x] Music embed (YouTube auto-play + loop on guest page)
- [x] Guest-facing event info section (date, time, location buttons)
- [ ] Guest list management UI (CRUD table)
- [ ] Excel import (upload, parse, validate, bulk insert)
- [ ] Excel export (generate file, download)
- [ ] RSVP form (attending/not, pax 1–10) on guest page
- [ ] RSVP deadline enforcement in mutation + UI
- [ ] RSVP analytics cards (attending, pax total, not attending, pending)
- [ ] Real-time wishes feed UI (chat-like section)
- [ ] Manager delete wish action (Convex + UI)
- [ ] Wishlist CRUD dashboard (add/edit/delete)
- [ ] Affiliate link converter (Shopee/Lazada → affiliate URL)
- [ ] Guest claim/unclaim wishlist item (atomic Convex mutation)
- [ ] Guest add wishlist item (auto-claimed)
- [ ] Manager hide/show wishlist items (visibility toggle)
- [ ] Donation section UI (QR upload, bank info, copy-to-clipboard)
- [x] Custom guest URL route `(guest)/[slug]`
- [ ] SEO implementation (per-event meta tags, sitemap, structured data)
- [x] Dual-language setup (Malay/English translation files)
- [ ] Language switcher everywhere needed (guest + dashboard)
- [ ] PostHog events wired (per PRD list)
- [ ] Sentry error/performance monitoring verified
- [x] Co‑manager data model and invite mutation
- [ ] Co‑manager invite acceptance flow + UI
- [x] Desktop 9:16 invitation view (centered frame) implemented
- [ ] Production Vercel deployment with environment variables

### Phase 2 – Post-MVP (PRD §8.2)
- [ ] Stripe FPX payment integration (RM39 per event)
- [ ] Payment enforcement (block share until paid)
- [ ] Refund behaviour (deactivate link)
- [ ] Image optimization on upload (resize to 1200px)
- [ ] Custom email templates for co‑manager invites
- [ ] Guest list filtering/sorting UI
- [ ] Bulk guest actions (e.g. delete many)
- [ ] Event templates (pre-designed themes)
- [ ] Admin/superadmin panel
- [ ] Usage analytics dashboard (events per user, revenue)
- [ ] Facebook / Apple / email login

### Phase 3–4 – Future (PRD §8.3–8.4)
- [ ] Multi-event support UI (event list dashboard)
- [ ] Event duplication
- [ ] Guest broadcast messaging
- [ ] White-label option for planners
- [ ] Blog / content SEO features
- [ ] Vendor marketplace
- [ ] Wedding planning tools (checklists, budgets)
- [ ] Photo gallery uploads
- [ ] RSVP meal preferences
- [ ] Seating chart management
- [ ] Thank you card generator

### Testing Checklist (PRD §10.1–10.3)
- [x] Unit tests for Convex `events` mutations/queries
- [x] Unit tests for editor/builder Zustand stores
- [ ] Unit tests for RSVP logic (duplicate, deadline, pax validation)
- [ ] Unit tests for wishlist claim/unclaim and affiliate converter
- [ ] Unit tests for guest import (Excel parsing/validation)
- [ ] Manual end-to-end flows (auth → create event → customize → share → guest actions)
- [ ] Manual verification of SEO tags, PostHog events, and Sentry reporting
