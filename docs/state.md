# State Management

**Owns:** Client-side UI state not held in Convex — editor fields and landing page UI.

**Key files:**
- `stores/editorStore.ts` — all invitation builder fields
- `stores/landing-store.ts` — landing page language + waitlist modal state

---

## editorStore

**Type:** Zustand (no persistence — resets on page reload)

**Purpose:** Single source of truth for all editable event fields in the invitation builder. Decouples the UI from Convex latency — edits feel instant, saves happen in the background.

### Lifecycle

```
page.tsx loads event via useQuery(getEvent)
  → initFromEvent(event) called once
  → initialized flips to true
  → useAutoSave starts watching fields
  → setField(key, value) on each user interaction
  → useAutoSave debounces → Convex updateEvent
  → reset() called on unmount or navigation away
```

### Fields

| Group | Fields |
|---|---|
| Core content | `coupleName`, `weddingDate`, `weddingTime`, `venueName`, `venueAddress`, `musicYoutubeUrl` |
| Location links | `locationWaze`, `locationGoogle`, `locationApple` |
| Global appearance | `backgroundColor`, `colorPrimary`, `colorSecondary`, `colorAccent`, `backgroundImageUrl` |
| Event Details section overrides | `eventDetailsBgImageUrl`, `eventDetailsBgColor`, `eventDetailsColorPrimary/Secondary/Accent` |
| Wishes section overrides | `wishesBgImageUrl`, `wishesBgColor`, `wishesColorPrimary/Secondary/Accent` |
| Section layout | `sectionOrder` (string[]), `sectionsDisabled` (string[]) |
| Meta | `eventId`, `initialized` |

### Important: image URLs vs storage IDs

`editorStore` holds **resolved image URLs** (for preview rendering) — NOT Convex storage IDs. The IDs live only in Convex. After an image upload, the URL is set in the store directly; the ID is written to Convex via a separate `updateEvent` call outside of `useAutoSave`.

### Key methods

```ts
setField(key, value)    // update one field; triggers useAutoSave
initFromEvent(event)    // seed all fields from Convex data; sets initialized = true
reset()                 // clear all fields; set initialized = false
```

**`initialized` is the auto-save gate.** Never set it to `true` manually — only `initFromEvent` does this. If `initialized = false`, `useAutoSave` skips all saves.

---

## landing-store

**Type:** Zustand with `persist` middleware (persists `language` to `localStorage`)

**Purpose:** Landing page UI state — language preference and waitlist modal open/close.

### Fields

| Field | Type | Purpose |
|---|---|---|
| `isWaitlistModalOpen` | boolean | Controls waitlist modal visibility |
| `waitlistModalTrigger` | `"hero" \| "secondary_cta" \| "footer" \| null` | Tracks which CTA opened the modal (for analytics) |
| `language` | `"ms" \| "en"` | UI language on landing page (persisted) |

### Persistence

Only `language` is persisted to `localStorage` under key `"kad-kahwin-language"`. Modal state is ephemeral — always starts closed.

**SSR safety:** storage is guarded with `typeof window !== "undefined"` — falls back to a no-op storage object during server render.

---

## What is NOT in Zustand

- **Convex query results** — managed by Convex's own React hooks (`useQuery`, `useMutation`). Never copy Convex data into Zustand except via `initFromEvent`.
- **Auth state** — managed by `authClient` (better-auth). Read via `authClient.useSession()`.
- **Per-page local state** — use React `useState`/`useReducer` for UI-only state that doesn't need to cross component boundaries.

---

## Connected to

- `hooks/useAutoSave.ts` — watches `editorStore`, debounces Convex writes
- `components/features/builder/` — all editor sections read/write `editorStore`
- `components/landing/` — landing page reads `landing-store`
- `convex/events.ts` — `getEvent` seeds `editorStore`; `updateEvent` receives its output
