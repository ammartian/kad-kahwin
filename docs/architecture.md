# Architecture

## System overview

Jemputan Digital is a wedding invitation SaaS. Three distinct surfaces:

1. **Landing page** — marketing, waitlist capture
2. **Dashboard** — authenticated couple manages their event (builder, guests, wishlist)
3. **Guest invitation** — public, slug-based page viewed by wedding guests

Backend is **Convex** (serverless DB + real-time queries + mutations). Frontend is **Next.js App Router** with React 19.

---

## Route groups

| Route group | Path | Who sees it |
|---|---|---|
| `(auth)` | `/sign-in` | Unauthenticated users |
| `(dashboard)` | `/dashboard/**` | Authenticated couples |
| `(guest)` | `/[slug]` | Anyone with the invitation link |
| Root | `/` | Public landing page |

Route groups are Next.js layout boundaries — each has its own `layout.tsx` with appropriate auth guards.

---

## Data flow

### Invitation builder (authenticated write path)
```
User edits field
  → setField() in editorStore (Zustand)
  → PreviewPanel re-renders immediately (reads same store)
  → useAutoSave fires after 500ms debounce
  → updateEvent mutation → Convex DB
```

### Guest invitation (public read path)
```
Guest visits /{slug}
  → Next.js SSR: getEventBySlug query
  → GuestInvitationPage renders with event data
  → Convex useQuery subscribes for real-time updates (wishes, RSVP status)
  → Guest submits RSVP / wish → Convex mutation → real-time update propagates
```

### Auth flow
```
User clicks "Sign in with Google"
  → better-auth handles OAuth redirect
  → Token stored via @convex-dev/better-auth
  → Root layout fetches initialToken server-side (getToken())
  → ConvexClientProvider hydrates ConvexBetterAuthProvider with token
  → All Convex queries/mutations authenticated via authComponent.getAuthUser(ctx)
```

---

## Module map

```
app/
  layout.tsx                    ← root: fetches initialToken, mounts ConvexClientProvider
  ConvexClientProvider.tsx      ← Convex + better-auth provider wrapper
  (auth)/                       ← sign-in page
  (dashboard)/dashboard/
    page.tsx                    ← events list
    events/[eventId]/
      page.tsx                  ← event overview
      layout.tsx                ← shared event layout
      builder/page.tsx          ← invitation builder
      guests/page.tsx           ← guest list + import
      wishlist/page.tsx         ← gift registry management
  (guest)/[slug]/
    page.tsx                    ← public invitation page

components/
  features/builder/             ← builder UI (EditorPanel, PreviewPanel, sections/)
  features/guest/               ← guest invitation UI (GuestInvitationPage, modals)
  landing/                      ← landing page sections
  ui/                           ← shadcn primitives (button, card, dialog, etc.)

convex/
  schema.ts                     ← DB tables + indexes
  events.ts                     ← event CRUD
  guest.ts                      ← public guest queries (no auth)
  guests.ts                     ← guest list management
  rsvps.ts                      ← RSVP submission + lookup
  wishes.ts                     ← guest wishes
  wishlist.ts                   ← gift registry items
  waitlist.ts                   ← pre-launch waitlist
  auth.ts                       ← better-auth + authComponent
  storage.ts                    ← file upload/retrieval
  http.ts                       ← HTTP routes for auth

stores/
  editorStore.ts                ← builder editor state
  landing-store.ts              ← landing page UI state (language, waitlist modal)

hooks/
  useAutoSave.ts                ← debounced Convex write
  useEventLanguage.ts           ← event language detection
  useInviteUrl.ts               ← shareable invitation URL generation
  useSlugCheck.ts               ← real-time slug availability
  use-slug-tracking.ts          ← slug-based event tracking
  use-is-mobile.ts              ← responsive breakpoint

lib/
  auth-client.ts                ← client-side authClient
  auth-server.ts                ← server-side getToken, isAuthenticated
  config.ts                     ← APP_STATUS flag (waitlist | live)
  i18n.ts                       ← react-i18next setup
  posthog.ts / posthog-events.ts ← analytics
  utils/                        ← slug, youtube, affiliateConverter, etc.
  validators/                   ← Zod schemas

locales/
  ms.json                       ← Malay translations (default)
  en.json                       ← English translations
```

---

## Key architectural decisions

| Decision | Choice | Reason |
|---|---|---|
| Backend | Convex | Real-time subscriptions, serverless, no separate API layer needed |
| Auth | better-auth + Google OAuth | Works natively with Convex; no session management overhead |
| Client state | Zustand | Lightweight; editorStore decouples UI from Convex latency |
| Auto-save | Debounced hook | Avoids per-keystroke mutations; 500ms feels instant |
| Public slug page | SSR + Convex subscription | Fast first load + real-time wishes/RSVP updates |
| Images | Convex storage (IDs, not URLs) | URLs resolved at read time; avoids stale URL issues |
| i18n | react-i18next, default Malay | Malaysian market; per-event language for guest page |
| App status flag | Env var `NEXT_PUBLIC_APP_STATUS` | Zero-deploy toggle between waitlist and live mode |

---

## Data model relationships

```
users (1)
  └─ managers (n) ─── events (1)
                         ├─ managers (n)   ← access control
                         ├─ guests (n)     ← invite list
                         │    └─ (no FK)
                         ├─ rsvps (n)      ← matched by guestNameLower
                         ├─ wishlist_items (n)
                         └─ wishes (n)

waitlist                 ← independent, no relation to users
```

No foreign key joins — Convex has no relations. All cross-table lookups done in application code via indexes.

---

## Connected to

- `docs/auth.md` — auth token lifecycle detail
- `docs/builder.md` — editor state + auto-save detail
- `docs/convex.md` — schema + patterns detail
- `docs/guest-invitation.md` — public page + modal system detail
