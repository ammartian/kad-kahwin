# Convex Backend

**Owns:** All database reads/writes, auth verification, file storage, and server-side business logic.

**Key files:**
- `convex/schema.ts` — table definitions and indexes
- `convex/events.ts` — event CRUD
- `convex/guests.ts` — guest list management + RSVP analytics
- `convex/guest.ts` — public guest-facing queries (no auth required)
- `convex/rsvps.ts` — RSVP submission and lookup
- `convex/wishes.ts` — wishes CRUD
- `convex/wishlist.ts` — wishlist items CRUD
- `convex/waitlist.ts` — pre-launch waitlist
- `convex/storage.ts` — file upload/retrieval helpers
- `convex/auth.ts` — better-auth setup; exports `authComponent`
- `convex/http.ts` — HTTP routes (auth endpoints)

---

## Schema

### Tables

| Table | Purpose | Key indexes |
|---|---|---|
| `users` | Registered users (created by better-auth) | `by_email` |
| `waitlist` | Pre-launch email capture | `by_email`, `by_subscribed_at` |
| `events` | Wedding events (core entity) | `by_slug` |
| `managers` | Event access control (owner / co-manager) | `by_event`, `by_event_user`, `by_user` |
| `guests` | Guest list per event | `by_event` |
| `rsvps` | RSVP responses (not linked to guests table) | `by_event`, `by_event_and_name`, `by_event_guestNameLower` |
| `wishlist_items` | Gift registry items | `by_event`, `by_event_visible` |
| `wishes` | Guest messages/wishes | `by_event` |

### Important schema notes

- **RSVPs are not foreign-keyed to guests.** Guests in the `guests` table are the invite list managed by the couple. RSVPs are submitted by guests themselves using their name — matched by `guestNameLower` (lowercase) for case-insensitive lookup.
- **Images stored as `_storage` IDs.** `events` stores `backgroundImageId`, `carouselImageIds`, `donationQrId`, etc. as Convex storage IDs — never raw URLs. URLs are resolved at query time via `ctx.storage.getUrl()`.
- **`events.published`** controls whether the public invitation is accessible. `events.paid` tracks payment status (future gating).
- **`wishlist_items.addedBy`** distinguishes items added by the couple (`"manager"`) vs. suggested by guests (`"guest"`).

---

## Auth pattern

Every protected query/mutation authenticates via:

```ts
import { authComponent } from "./auth";

const user = await authComponent.getAuthUser(ctx);
if (!user) throw new Error("Unauthorized");
```

`authComponent` is the `@convex-dev/better-auth` component mounted in `convex/convex.config.ts`. It reads the session token from the Convex request context — no manual token parsing needed.

`user._id` is a string (not a Convex `Id<"users">`) — cast explicitly when needed: `user._id as string`.

---

## Authorization pattern (manager check)

All event mutations verify the caller is a manager of that event:

```ts
const manager = await ctx.db
  .query("managers")
  .withIndex("by_event_user", (q) =>
    q.eq("eventId", args.eventId).eq("userId", user._id as string)
  )
  .first();

if (!manager) throw new Error("Unauthorized: not a manager of this event");
```

There is no shared `requireManager()` helper — each handler does this inline. If adding a new protected mutation, copy this pattern.

---

## Public queries (no auth)

`convex/guest.ts` contains queries used by the public invitation page — these do NOT call `authComponent.getAuthUser`. They are accessible by anyone with the slug. Primary query: `getEventBySlug`.

---

## Storage pattern

Images are handled in two steps:

1. **Upload:** client calls `generateUploadUrl` mutation → gets a short-lived upload URL → POSTs file directly to Convex storage → receives a `storageId`.
2. **Save:** client calls `updateEvent` (or relevant mutation) with the `storageId` field.
3. **Read:** query resolves `storageId` → URL via `ctx.storage.getUrl(id)` and returns the URL to the client.

Storage IDs are `Id<"_storage">` type. Never store raw CDN URLs in the DB — always store the ID and resolve at read time.

---

## updateEvent patch pattern

`updateEvent` does not accept a free-form object. It uses an explicit `SCALAR_FIELDS` allowlist:

```ts
const patch: Record<string, unknown> = {};
for (const key of SCALAR_FIELDS) {
  if (updates[key] !== undefined) patch[key] = updates[key];
}
await ctx.db.patch(eventId, patch);
```

Only fields present in `SCALAR_FIELDS` are written. To add a new editable field: add it to the schema, add it to `updateEvent` args, add it to `SCALAR_FIELDS`, add it to `editorStore`, and add it to `useAutoSave`.

Clear flags (`clearBackgroundImage`, `clearDonationQr`, etc.) explicitly set the storage ID field to `undefined` — used to remove images.

---

## Gotchas

- **`listMyEvents` caps at 50 events.** Comment in code notes this is acceptable for MVP. Each `ctx.db.get` is O(1) by `_id`.
- **Slug is immutable after creation.** `updateEvent` does not accept a `slug` field — slug changes would break existing invitation URLs.
- **YouTube URL validated server-side.** `updateEvent` rejects non-YouTube URLs for `musicYoutubeUrl` — client-side validation should mirror the regex in `events.ts`.
- **No formal relations.** Convex has no joins. Guests + RSVPs are correlated in application code by matching names (`guestNameLower`). Wishlist + claimants are self-contained in `wishlist_items`.

---

## Connected to

- `stores/editorStore.ts` — builder reads/writes via `getEvent` + `updateEvent`
- `hooks/useAutoSave.ts` — debounced writes to `updateEvent`
- `lib/auth-client.ts` / `lib/auth-server.ts` — client and server auth helpers wrapping `authComponent`
- `convex/storage.ts` — image upload/retrieval
