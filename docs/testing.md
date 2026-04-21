# Testing

**Owns:** Test structure, patterns for Convex function tests, and how to run tests.

**Key files:**
- `convex/functions/__tests__/` — Convex handler logic tests
- `lib/utils/__tests__/` — utility function tests
- `lib/validators/__tests__/` — Zod schema tests
- `stores/__tests__/` — Zustand store tests
- `vitest.config.ts` (or `vite.config.ts`) — Vitest configuration

---

## Test runner

**Vitest** with `jsdom` environment. Tests are co-located under `__tests__/` subdirectories next to the code they test.

```bash
bun run test              # single run
bun run test:watch        # watch mode
bun run test -- convex/functions/__tests__/events.test.ts  # single file
```

---

## Convex function tests

Convex functions cannot run inside Vitest — there is no local Convex runtime. The approach used in this project:

**Replicate handler logic inline.** Extract the business logic (slug validation, date checks, pax constraints, etc.) into plain functions within the test file, then test those functions against mocked `db` and `auth` objects.

Example pattern from `events.test.ts`:
```ts
// Inline replication of handler logic
async function checkSlugAvailableLogic(db, args) {
  const slug = args.slug.toLowerCase().trim();
  if (!slug) return { available: false, reason: "empty" };
  // ... same logic as the real handler
}

// Test against a mock db
it("rejects empty slug", async () => {
  const db = { queryEventBySlug: vi.fn() };
  const result = await checkSlugAvailableLogic(db, { slug: "" });
  expect(result).toEqual({ available: false, reason: "empty" });
});
```

**Files in `convex/functions/__tests__/`:**
- `events.test.ts` — slug validation, event creation logic, updateEvent patch logic
- `guests.test.ts` — guest add/import validation
- `rsvp.test.ts` — RSVP submission rules (pax range, deadline check, duplicate detection)
- `wishes.test.ts` — wish add validation
- `wishlist.test.ts` — wishlist item validation, affiliate URL conversion
- `guest.test.ts` — getEventBySlug logic (published check, etc.)
- `waitlist.test.ts` — email capture validation

---

## Utility tests (`lib/utils/__tests__/`)

Pure functions — no mocking needed. Tests cover:
- `slug.ts` — slug generation, validation rules
- `youtube.ts` — YouTube URL parsing, embed URL generation
- `affiliateConverter.ts` — Shopee/Lazada URL → affiliate URL conversion
- `validateEmail.ts` — email format validation
- `generateIcs.ts` — .ics calendar file generation

---

## Validator tests (`lib/validators/__tests__/`)

Zod schema tests — assert valid inputs pass and invalid inputs produce correct error messages.

---

## Store tests (`stores/__tests__/`)

Zustand store tests — test `setField`, `initFromEvent`, `reset` behaviour in `editorStore`. No React rendering needed — call store methods directly.

---

## Gotchas

- **No Convex test environment.** Do not import from `convex/_generated/` in tests — it requires a running Convex backend. Replicate logic inline as shown above.
- **`initialized` must be set before auto-save tests.** When testing `useAutoSave`, call `initFromEvent` (or manually set `initialized = true`) before asserting any save calls.
- **`vi.mock` for Convex React hooks.** If testing components that call `useQuery` or `useMutation`, mock `convex/react` — e.g. `vi.mock("convex/react", () => ({ useQuery: vi.fn(), useMutation: vi.fn() }))`.
- **jsdom lacks some browser APIs.** `localStorage`, `matchMedia`, and `ResizeObserver` may need manual stubs depending on what the tested code uses.

---

## Connected to

- `convex/events.ts`, `convex/guests.ts`, etc. — logic replicated in Convex tests
- `lib/utils/` — directly tested (pure functions)
- `stores/editorStore.ts` — tested in `stores/__tests__/`
