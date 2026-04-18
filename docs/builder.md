# Invitation Builder

**Owns:** All editable event customisation fields — appearance, content, section layout, and live preview.

**Key files:**
- `app/(dashboard)/dashboard/events/[eventId]/builder/page.tsx` — entry point; fetches event, seeds store
- `components/features/builder/BuilderLayout.tsx` — header with save status + split-panel shell
- `components/features/builder/EditorPanel.tsx` — left panel, accordion sections
- `components/features/builder/PreviewPanel.tsx` — right panel, live iframe-style preview
- `components/features/builder/sections/` — one component per editor section
- `stores/editorStore.ts` — Zustand store holding all editable fields
- `hooks/useAutoSave.ts` — watches store fields, debounces Convex `updateEvent` call

---

## How it works

**Initialization:**
1. `builder/page.tsx` calls `useQuery(api.events.getEvent, { eventId })`.
2. When data arrives, it calls `initFromEvent(event)` on the editor store — sets all fields and flips `initialized = true`.
3. `useAutoSave` guards on `initialized`: if `false`, it skips saving. This prevents the initial store population from triggering a spurious save back to Convex.

**Edit cycle:**
1. User interacts with any section in `EditorPanel`.
2. Section calls `setField(key, value)` on the store — triggers a React re-render.
3. `PreviewPanel` reads from the same store — updates immediately (no network round-trip).
4. `useAutoSave` detects the changed field via its dependency array, clears the previous timer, starts a 500 ms debounce.
5. After 500 ms of no changes, `persist()` fires — calls `updateEvent` mutation via Convex.
6. `BuilderLayout` header shows `saving` → `idle` (or `error`) based on `saveStatus` returned by `useAutoSave`.

**Image fields (not via useAutoSave):**
Background, carousel, donation QR, and section background images are uploaded separately. They call `updateEvent` directly with the storage ID — they are NOT routed through `useAutoSave` because the storage ID is not in the editor store. After upload, `onCarouselIdsChange` / `onCarouselUrlsChange` callbacks update parent state in `page.tsx`.

---

## Editor sections

Located in `components/features/builder/sections/`:

| Section component | Controls |
|---|---|
| `EventDetailsSection.tsx` | Couple name, wedding date, time, RSVP deadline |
| `BackgroundSection.tsx` | Main background image or color |
| `ColorsSection.tsx` | Global primary / secondary / accent colors |
| `PhotosSection.tsx` | Carousel image uploads (multi-image) |
| `LocationSection.tsx` | Venue name, address, Waze/Google/Apple map links |
| `MusicSection.tsx` | YouTube URL for background music |
| `DonationSection.tsx` | QR code upload, bank name/account/holder |
| `SectionsManagerSection.tsx` | Show/hide and reorder invitation sections |
| `SectionBackground.tsx` | Per-section background image or color override |
| `SectionColors.tsx` | Per-section color overrides |

---

## editorStore fields

Default values (used as fallback when Convex returns `undefined`):

```
backgroundColor: "#f8f4f0"
colorPrimary:    "#1a1a1a"
colorSecondary:  "#c9bfb0"
colorAccent:     "#c9a86c"
sectionOrder:    ["landing", "details", "photos", "wishes"]
sectionsDisabled: []
```

Per-section overrides follow the pattern `{section}BgColor`, `{section}ColorPrimary`, etc. Currently supported sections with overrides: `eventDetails`, `wishes`.

---

## Gotchas

- **`initialized` guard is critical.** Without it, `useAutoSave` fires on mount with empty defaults, overwriting valid Convex data.
- **Color fields validated before save.** `useAutoSave` calls `isValidHex()` before including a color in the mutation payload — invalid hex values are dropped (sent as `undefined`), not rejected with an error.
- **Image fields bypass the store.** Storage IDs live only in Convex — never in `editorStore`. The store only holds resolved URLs (for preview rendering).
- **useAutoSave dependency array must stay in sync.** Every field in the store that should trigger a save must be listed in both the `useCallback` deps AND the `useEffect` deps. Missing a field means edits to it won't auto-save.
- **Layout is responsive.** On mobile (`< lg`), EditorPanel stacks above PreviewPanel. On desktop, they're side-by-side at a 6:4 ratio.

---

## Connected to

- `convex/events.ts` — `getEvent` (read) and `updateEvent` (write)
- `convex/storage.ts` — image upload URL generation
- `stores/editorStore.ts` — single source of truth for all editor fields
- `components/features/guest/` — PreviewPanel renders the same guest invitation components
