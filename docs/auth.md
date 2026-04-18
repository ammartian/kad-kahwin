# Authentication

**Owns:** Session management, Google OAuth, token hydration, and per-request auth verification in Convex.

**Key files:**
- `convex/auth.ts` — server-side: `authComponent`, `createAuth()`, `getCurrentUser` query
- `convex/auth.config.ts` — auth configuration
- `lib/auth-client.ts` — client-side: `authClient` (used in React components)
- `lib/auth-server.ts` — server-side Next.js helpers: `getToken`, `isAuthenticated`, `preloadAuthQuery`, etc.
- `app/ConvexClientProvider.tsx` — wraps app in `ConvexBetterAuthProvider` with `initialToken`
- `app/layout.tsx` — fetches `initialToken` server-side via `getToken()`
- `app/api/auth/[...all]/route.ts` — catch-all route for better-auth HTTP endpoints
- `convex/http.ts` — Convex HTTP routes for auth

---

## How it works

### Token lifecycle

1. **Server render (root layout):** `getToken()` from `lib/auth-server.ts` runs server-side. Returns the session token from the request cookies if the user is logged in, otherwise `null`.
2. **Hydration:** `initialToken` is passed as a prop to `ConvexClientProvider`, which passes it to `ConvexBetterAuthProvider`. This lets Convex use the token immediately on first render — no client-side auth flash.
3. **Client-side:** `ConvexBetterAuthProvider` keeps the token fresh via `authClient` (better-auth React client). On token expiry, better-auth transparently refreshes it.
4. **Convex mutations/queries:** Each handler calls `authComponent.getAuthUser(ctx)`. The `authComponent` reads the token from the Convex request context — no manual token parsing.

### Google OAuth flow

```
User clicks "Sign in with Google"
  → authClient.signIn.social({ provider: "google" })
  → Redirects to Google OAuth
  → Google redirects to /api/auth/callback/google
  → app/api/auth/[...all]/route.ts handles via better-auth handler
  → Session created, token stored in cookie
  → User redirected back to dashboard
```

---

## Key exports

### `lib/auth-client.ts`
```ts
authClient  // use in React components for sign-in, sign-out, session
```
Created with `convexClient()` plugin — makes better-auth aware of Convex token format.

### `lib/auth-server.ts`
```ts
getToken()          // returns session token string | null (server-side only)
isAuthenticated()   // returns boolean (server-side only)
preloadAuthQuery()  // preloads a Convex query with auth for SSR
fetchAuthQuery()    // fetches a Convex query server-side with auth
fetchAuthMutation() // calls a Convex mutation server-side with auth
fetchAuthAction()   // calls a Convex action server-side with auth
handler             // Next.js route handler for auth API routes
```

### `convex/auth.ts`
```ts
authComponent       // Convex component client — use in queries/mutations
createAuth(ctx)     // creates better-auth instance (used in HTTP handler)
getCurrentUser      // Convex query: returns current user or null
```

---

## Protecting routes

**Server-side (dashboard pages):** Use `isAuthenticated()` or `getToken()` from `lib/auth-server.ts` in `layout.tsx` or `page.tsx`. Redirect to `/sign-in` if not authenticated.

**Convex handlers:** Always call `authComponent.getAuthUser(ctx)` and throw `"Unauthorized"` if null. Never trust client-passed user IDs.

**Public routes:** `app/(guest)/[slug]/` — no auth check. `convex/guest.ts` queries are unauthenticated by design.

---

## Gotchas

- **Two env vars for the URL.** `lib/auth-server.ts` requires both `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL`. The site URL is the Convex HTTP endpoint (different from the WebSocket URL).
- **`user._id` is a string, not `Id<"users">`.** The better-auth user object returns `_id` as a plain string. Cast with `user._id as string` when using in Convex index queries.
- **`initialToken` prevents auth flash.** Without it, the first server render would show the unauthenticated state briefly. Always pass it from `getToken()` in `app/layout.tsx`.
- **Sign-out:** call `authClient.signOut()` on the client — better-auth clears the cookie and invalidates the session.

---

## Connected to

- `convex/events.ts`, `convex/guests.ts`, etc. — all protected mutations use `authComponent`
- `app/layout.tsx` — initialToken hydration
- `app/ConvexClientProvider.tsx` — provider setup
