# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Jemputan Digital** (jemputandigital.my) — a digital wedding invitation SaaS for Malaysian couples. Couples create and customise an invitation (slug-based public URL), manage guests, track RSVPs, and collect wishes/wishlists.

## Commands

```bash
# Development (run both concurrently)
bun run dev          # Next.js dev server on :3000
npx convex dev       # Convex backend (separate terminal)

bun run build        # Production build
bun run lint         # ESLint
bun run test         # Vitest (single run)
bun run test:watch   # Vitest watch mode

# Run a single test file
bun run test -- convex/functions/__tests__/events.test.ts
```

## Architecture

### Route Groups (Next.js App Router)
- `app/(auth)/` — sign-in page (Google OAuth only)
- `app/(dashboard)/dashboard/` — events list + per-event builder at `events/[eventId]`
- `app/(guest)/[slug]/` — public invitation page viewed by wedding guests

### Backend: Convex
All server logic lives in `convex/`. The schema defines these tables: `users`, `waitlist`, `events`, `managers`, `guests`, `rsvps`, `wishlist_items`, `wishes`.

- `convex/functions/` — query/mutation handlers (one file per domain: events, guests, rsvps, wishes, wishlist, guest, waitlist)
- `convex/auth.ts` — better-auth setup with Google OAuth; requires `SITE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` env vars
- `convex/convex.config.ts` — mounts the `betterAuth` Convex component
- `convex/storage.ts` — Convex file storage (images, QR codes)
- `convex/http.ts` — HTTP action routes

### Authentication
Uses `@convex-dev/better-auth` (not NextAuth). Client: `lib/auth-client.ts` (exports `authClient`). Server: `lib/auth-server.ts` (exports `getToken`). The root layout fetches `initialToken` server-side and passes it to `ConvexBetterAuthProvider` in `app/ConvexClientProvider.tsx`.

### Invitation Builder
The editor at `app/(dashboard)/dashboard/events/[eventId]` uses a split-panel layout:
- `components/features/builder/BuilderLayout.tsx` — top-level layout with save status indicator
- `components/features/builder/EditorPanel.tsx` — left panel with accordion sections (`builder/sections/`)
- `components/features/builder/PreviewPanel.tsx` — right panel live-preview
- `stores/editorStore.ts` — Zustand store holding all editable event fields
- `hooks/useAutoSave.ts` — debounces (500ms) Convex `updateEvent` mutation on any store change; skips until `initialized = true`

### State Management
- `stores/editorStore.ts` — editor fields; call `initFromEvent()` to seed from Convex data, `setField()` to update individual fields
- `stores/landing-store.ts` — landing page UI state

### Internationalisation
- Default language: **Malay (`ms`)**, fallback also `ms`
- Translations: `locales/ms.json` and `locales/en.json`
- Setup: `lib/i18n.ts` (react-i18next); use `useTranslation()` in components
- Events have a `language` field (`"ms"` | `"en"`) that controls the guest invitation language

### App Status Flag
`lib/config.ts` reads `NEXT_PUBLIC_APP_STATUS` (`"waitlist"` | `"live"`). In `waitlist` mode, sign-up is disabled and landing CTAs show a waitlist form. Check `isWaitlistMode` / `isLiveMode` exports before adding gated features.

### UI Components
`components/ui/` — shadcn/ui-style primitives (button, card, dialog, input, etc.). `components.json` holds shadcn config. Use `cn()` from `lib/utils.ts` for class merging.

### Utilities (`lib/utils/`)
- `slug.ts` — event slug helpers
- `youtube.ts` — YouTube URL parsing/embed
- `affiliateConverter.ts` — converts Shopee/Lazada URLs to affiliate links
- `validateEmail.ts`, `generateIcs.ts`

### Analytics
PostHog via `lib/posthog.ts` and `lib/posthog-events.ts`. Next.js rewrites `/ingest/*` to PostHog to avoid ad-blockers (`next.config.ts`).

## Environment Variables

| Variable | Where used |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Client Convex connection |
| `NEXT_PUBLIC_APP_STATUS` | `"waitlist"` or `"live"` |
| `NEXT_PUBLIC_SITE_URL` | SSR invite URL fallback |
| `SITE_URL` | Convex auth (server-side) |
| `GOOGLE_CLIENT_ID` | Convex auth |
| `GOOGLE_CLIENT_SECRET` | Convex auth |

## Test Locations

Tests live under `__tests__/` subdirectories:
- `convex/functions/__tests__/` — per-domain Convex function tests
- `lib/utils/__tests__/` — utility function tests
- `lib/validators/__tests__/` — Zod validator tests
- `stores/__tests__/` — Zustand store tests

## Module Documentation

Detailed docs live in `docs/`. **Read the relevant doc before working on a module** — they capture non-obvious flows, patterns, and gotchas that can't be derived from code alone.

| Module | Doc | When to read |
|---|---|---|
| Invitation builder, editorStore, auto-save | `docs/builder.md` | Touching `components/features/builder/`, `stores/editorStore.ts`, `hooks/useAutoSave.ts` |
| Convex schema, patterns, auth helpers | `docs/convex.md` | Touching any `convex/*.ts` file |
| Overall system, data flow, decisions | `docs/architecture.md` | Starting a cross-cutting feature |
| Auth token lifecycle, better-auth/Convex | `docs/auth.md` | Touching `lib/auth-*.ts`, `convex/auth.ts` |
| Public guest page, modals, RSVP flow | `docs/guest-invitation.md` | Touching `app/(guest)/`, `components/features/guest/` |
| Dashboard routes, event management | `docs/dashboard.md` | Touching `app/(dashboard)/` |
| Zustand stores, state ownership | `docs/state.md` | Adding new state or stores |
| Translations, per-event language | `docs/i18n.md` | Adding UI strings or language features |
| Test patterns, Convex test setup | `docs/testing.md` | Writing or fixing tests |

**After making significant changes** (new feature, schema change, new pattern, flow change), update the relevant doc in `docs/`. Keep docs current — a stale doc is worse than no doc.
