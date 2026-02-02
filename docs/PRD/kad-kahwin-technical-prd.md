# Technical PRD: Kad Kahwin - Digital Wedding Invitation Platform

## Document Information
- **Product Name:** Kad Kahwin
- **Version:** 1.0
- **Author:** ammartian
- **Date:** January 31, 2026
- **Status:** Draft
- **Target Launch:** Within 1 week (MVP)

---

## 1. Executive Summary

### 1.1 Product Vision
Kad Kahwin is a Malaysian digital wedding invitation platform that enables couples to create, customize, and share beautiful mobile-first wedding invitations with integrated RSVP management, wishlists, guest wishes, and donation features. The platform simplifies wedding planning while generating revenue through Shopee/Lazada affiliate links.

### 1.2 Target Audience
- **Primary Users:** Engaged couples in Malaysia planning their wedding
- **Secondary Users:** Wedding guests receiving and interacting with invitations
- **Market:** Malaysian wedding industry, targeting tech-savvy couples seeking modern digital invitation solutions

### 1.3 Key Success Metrics
- **User Acquisition:** 100 events created in first 3 month
- **Conversion Rate:** 30% of created events proceed to payment
- **Guest Engagement:** 70% RSVP completion rate
- **Affiliate Revenue:** RM500/month from wishlist affiliate links
- **SEO Performance:** Top 5 ranking for "kad kahwin digital Malaysia" within 3 months
- **Page Performance:** <3s initial load time for invitation pages

### 1.4 MVP Scope

**Included in MVP:**
- Landing page builder with live preview (mobile-locked 9:16 aspect ratio)
- Background customization (image upload up to 5MB or solid color)
- Color theming (background, primary, secondary, accent)
- Music embed (YouTube auto-play, looped)
- Event information management (date, time, location links)
- Wishlist CRUD with affiliate link conversion (Shopee/Lazada)
- Guest list management with Excel import/export
- Guest RSVP system (attending/not attending, pax count up to 10)
- Real-time wishes feature (chat-like UI, 255 char limit)
- Donation display (QR code, bank info)
- Custom URL slugs ([domain].com/[bridename]-[groomname])
- Dual language support (Malay default, English)
- Google OAuth authentication
- Multi-manager support (bride & groom co-editing)
- PostHog analytics integration
- Sentry error monitoring
- SEO optimization
- Stripe FPX payment (RM39 per event) - **DISABLED FOR INITIAL LAUNCH**

**Explicitly Deferred (Post-MVP):**
- Admin/Superadmin roles and features
- Image optimization for backgrounds
- Facebook/Apple social login
- Staging/preview environments
- Payment enforcement (free sharing during MVP)
- Refund system
- Advanced analytics dashboard

---

## 2. Functional Requirements

### 2.1 User Stories

| ID | As a... | I want to... | So that... | Priority | Acceptance Criteria |
|----|---------|--------------|------------|----------|---------------------|
| US-01 | Couple | Create an account with Google OAuth | I can quickly get started without manual registration | Must | - [ ] Google OAuth works<br>- [ ] Account created in Convex<br>- [ ] Redirected to dashboard |
| US-02 | Couple | Create a new wedding event | I can start building my invitation | Must | - [ ] Event form with basic info<br>- [ ] Custom URL slug validation<br>- [ ] Event saved to database |
| US-03 | Couple | Invite my partner as co-manager | We can both edit the invitation together | Must | - [ ] Email invitation sent<br>- [ ] Partner can accept and gain full edit access<br>- [ ] Both see real-time updates |
| US-04 | Couple | Upload a background image (≤5MB) | My invitation looks personalized | Must | - [ ] File upload to Convex storage<br>- [ ] Image preview in builder<br>- [ ] 5MB size validation |
| US-05 | Couple | Choose background/theme colors via hex code | I can match my wedding theme | Must | - [ ] Hex color picker/input<br>- [ ] Live preview updates<br>- [ ] Colors persist to database |
| US-06 | Couple | Embed YouTube music that auto-plays | Guests hear our song when opening invitation | Must | - [ ] YouTube URL input<br>- [ ] Auto-play on page load<br>- [ ] Loop continuously<br>- [ ] Music player hidden in modal |
| US-07 | Couple | Add/edit event details (date, time, location) | Guests know when and where to attend | Must | - [ ] Date/time picker<br>- [ ] Location link inputs (Waze, Google Maps, Apple Maps)<br>- [ ] Info displays on guest page |
| US-08 | Couple | Create/edit/delete wishlist items | I can manage gift preferences | Must | - [ ] CRUD operations for wishlist<br>- [ ] Items save to database<br>- [ ] Shopee/Lazada link conversion to affiliate |
| US-09 | Couple | View which guest is buying each wishlist item | I know who's getting what gift | Must | - [ ] Guest name displayed on claimed items<br>- [ ] Only visible to managers<br>- [ ] Updates in real-time |
| US-10 | Couple | Import guest list from Excel | I can quickly add many guests at once | Must | - [ ] Excel file upload (.xlsx, .csv)<br>- [ ] Parse name, phone, email, pax<br>- [ ] Bulk insert to database |
| US-11 | Couple | Export guest list to Excel | I can use the data elsewhere | Must | - [ ] Export all guest data<br>- [ ] Include RSVP status and pax<br>- [ ] Download as Excel file |
| US-12 | Couple | See RSVP analytics (count, pax total) | I can plan for the right number of guests | Must | - [ ] Total attending count<br>- [ ] Total pax count<br>- [ ] Not attending count<br>- [ ] Pending count |
| US-13 | Couple | Set an RSVP deadline | Guests know when to respond by | Should | - [ ] Date picker for deadline<br>- [ ] Display on guest page<br>- [ ] Block RSVP after deadline |
| US-14 | Couple | Hide/show individual wishlist items | I can control what guests see | Must | - [ ] Toggle visibility per item<br>- [ ] Hidden items not shown to guests<br>- [ ] Still visible in manager view |
| US-15 | Couple | Delete inappropriate guest wishes | I can moderate content | Must | - [ ] Delete button per wish (manager only)<br>- [ ] Wish removed from display<br>- [ ] Action logged |
| US-16 | Couple | Add QR code and bank info for donations | Guests can easily send monetary gifts | Must | - [ ] Upload QR code image<br>- [ ] Input bank details<br>- [ ] Clipboard copy for account number |
| US-17 | Couple | Share my invitation via custom URL | Guests can easily access it | Must | - [ ] Custom slug (e.g., /aminah-razak)<br>- [ ] Slug uniqueness validation<br>- [ ] SEO-friendly URL structure |
| US-18 | Couple | View my invitation in real-time preview | I see changes immediately while editing | Must | - [ ] Live preview panel<br>- [ ] Updates via Zustand state<br>- [ ] Mobile 9:16 locked view |
| US-19 | Guest | Receive invitation link | I can view the wedding details | Must | - [ ] Accessible via custom URL<br>- [ ] No login required<br>- [ ] Mobile-optimized view |
| US-20 | Guest | RSVP as attending or not attending | The couple knows if I'm coming | Must | - [ ] RSVP form with radio buttons<br>- [ ] Pax count input (1-10)<br>- [ ] Submit saves to database |
| US-21 | Guest | Cannot change RSVP after submitting | Responses are final for planning | Must | - [ ] RSVP form disabled after submit<br>- [ ] Confirmation message shown<br>- [ ] Data locked in database |
| US-22 | Guest | Post a wish to the couple | I can share my congratulations | Must | - [ ] Text input (255 char max)<br>- [ ] Submit adds to real-time wishes feed<br>- [ ] Name required (from RSVP or manual input) |
| US-23 | Guest | See all wishes in real-time chat UI | I can read others' messages | Must | - [ ] Auto-scroll to latest<br>- [ ] Display newest first<br>- [ ] Live updates via Convex subscriptions |
| US-24 | Guest | Claim a wishlist item | The couple knows I'm buying it | Must | - [ ] Click to claim button<br>- [ ] Use stored name when on input (if any), else input name<br>- [ ] Item marked as claimed<br>- [ ] One claim per item |
| US-25 | Guest | Unclaim a wishlist item | I can change my mind | Must | - [ ] Unclaim button if I claimed it<br>- [ ] Item becomes available again<br>- [ ] Updates immediately |
| US-26 | Guest | Add new items to the wishlist | I can suggest gifts | Must | - [ ] Add item form<br>- [ ] Include title, link<br>- [ ] Appears immediately (no approval) |
| US-27 | Guest | Click wishlist links | I'm directed to purchase with affiliate link | Must | - [ ] Links converted to Shopee/Lazada affiliate<br>- [ ] Opens in new tab<br>- [ ] Tracking for analytics |
| US-28 | Guest | View location on map apps | I can navigate to the venue | Must | - [ ] Waze link button<br>- [ ] Google Maps link button<br>- [ ] Apple Maps link button |
| US-29 | Guest | Switch between Malay and English | I can read in my preferred language | Must | - [ ] Language toggle<br>- [ ] All text translates<br>- [ ] Preference not persisted (per-session) |
| US-30 | Guest | See the invitation on desktop | I can view even if not on mobile | Must | - [ ] Desktop renders at 9:16 aspect ratio<br>- [ ] Centered on screen<br>- [ ] Scrollable if needed |

### 2.2 Feature Breakdown

#### Feature 1: Authentication & User Management

**Description:** Secure authentication system supporting Google OAuth and email/password with BetterAuth.

**User Flow:**
1. User visits platform homepage
2. Clicks "Sign Up" or "Sign In"
3. Chooses Google OAuth
4. If Google: OAuth popup, consent, auto-create account
5. Redirect to dashboard with session established

**Business Rules:**
- One account can manage multiple events (each event requires separate payment)
- Email must be unique across the system
- Google OAuth auto-creates account on first login
- Session managed via BetterAuth tokens

**UI/UX Considerations:**
- Prominent "Continue with Google" button
- Loading states during OAuth flow

**Dependencies:**
- BetterAuth library
- Google OAuth credentials configured
- Convex database for user storage

---

#### Feature 2: Event Creation & Management

**Description:** Couples create wedding events with custom URLs, basic info, and co-manager invitations.

**User Flow:**
1. Authenticated user clicks "Create New Event"
2. Enters event name, wedding date, custom URL slug
3. System validates slug uniqueness (KIV for uniqueness issues)
4. Event created, user becomes first manager
5. Option to invite partner via email
6. Partner receives email invitation
7. Partner accepts, gains co-manager access
8. Both can edit simultaneously with real-time sync

**Business Rules:**
- Custom URL slug must be unique (alphanumeric + hyphens only)
- Slug auto-generated from event name if not provided
- Both managers have full edit permissions
- Real-time updates via Convex reactive queries
- Event defaults to Malay language
- Maximum 2 managers per event (bride & groom)

**UI/UX Considerations:**
- Slug availability indicator
- Preview of final URL ([domain].com/your-slug)
- Date picker with min date = today
- Invitation sent confirmation
- Co-manager badge in UI

**Dependencies:**
- Convex database for events and managers tables
- Email service for co-manager invitations
- Zustand for local state management

---

#### Feature 3: Landing Page Builder with Live Preview

**Description:** Visual editor for customizing invitation appearance with real-time preview locked to mobile 9:16 aspect ratio.

**User Flow:**
1. Manager enters event dashboard
2. Sees split view: editor (left) + preview (right). For mobile, edito (top) + preview (bottom)
3. Uploads background image (≤5MB) or sets solid color
4. Enters hex codes for theme colors (background, primary, secondary, accent)
5. Adds YouTube music URL
6. Inputs event date, time
7. Adds location links (Waze, Google Maps, Apple Maps)
8. All changes reflect instantly in preview
9. Preview locked to 9:16 mobile dimensions (even on desktop)

**Business Rules:**
- Background image max 5MB
- Accepted formats: JPG, PNG, WEBP
- If both image and color set, image takes precedence
- Hex codes validated (must be valid 6-character hex)
- YouTube URL must be valid youtube.com or youtu.be link
- Music auto-plays and loops on guest page
- Preview updates via Zustand state changes
- All data persists to Convex on change (debounced 500ms)

**UI/UX Considerations:**
- Drag-and-drop for image upload
- Color picker UI with hex input
- Preview panel fixed at 375px width (9:16 mobile)
- Loading spinner during image upload
- Preview scrollable if content exceeds viewport
- "View on Mobile" button to test actual mobile view
- Undo/redo capability

**Dependencies:**
- Convex file storage for background images
- Zustand for editor state
- React color picker library (e.g., react-colorful)
- YouTube iframe API for music embed

---

#### Feature 4: Wishlist Management with Affiliate Conversion

**Description:** CRUD interface for managing wedding gift wishlists with automatic Shopee/Lazada affiliate link conversion.

**User Flow (Manager):**
1. Navigate to "Wishlist" tab in dashboard
2. Click "Add Item"
3. Enter item title, product URL
4. System detects if URL is Shopee or Lazada
5. Converts URL to affiliate link format
6. Item saved with affiliate link
7. Manager can toggle visibility (show/hide from guests)
8. Manager sees which guest claimed each item
9. Manager can edit or delete items

**User Flow (Guest):**
1. Views wishlist on invitation page
2. Sees available items (unclaimed)
3. Clicks "I'll buy this" on desired item
4. Enters their name or fetched from inserted name
5. Item marked as claimed with their name
6. Click item link → redirected to Shopee/Lazada with affiliate link
7. Can unclaim if needed
8. Can add new items to wishlist. Automatically claimed by the user

**Business Rules:**
- Affiliate link stored in database, not generated on-the-fly
- Shopee format: `https://shopee.com.my/[product]?af_siteid=[YOUR_AFFILIATE_ID]`
- Lazada format: `https://www.lazada.com.my/[product]?spm=[YOUR_AFFILIATE_ID]`
- One claim per item (single guest ownership)
- Guest-added items appear immediately (no approval). Automatically claimed by the user
- Managers can hide items (soft delete, still in DB)
- Guest name displayed to managers only for claimed items
- Guests see "Claimed" status but not who claimed it

**UI/UX Considerations:**
- Item cards with image (optional), title
- "Claimed by [Name]" badge (manager view only)
- "Hidden" badge for managers
- Toggle switch for show/hide
- Confirmation dialog before delete
- Optimistic UI updates
- Loading states during claim/unclaim

**Dependencies:**
- Convex database for wishlist items and claims
- Affiliate link parser/converter utility
- Real-time subscriptions for claim updates

**Database Schema:**
```
wishlist_items:
- id
- event_id
- title
- description
- original_url
- affiliate_url (converted)
- platform (shopee/lazada/other)
- is_visible
- claimed_by_guest_name
- claimed_at
- added_by (manager/guest)
- created_at
```

---

#### Feature 5: Guest List Management & RSVP

**Description:** Comprehensive guest management with Excel import/export, RSVP tracking, and analytics.

**User Flow (Manager):**
1. Navigate to "Guest List" tab
2. Option A: Manually add guests (name, phone, email, pax)
3. Option B: Import Excel file with guest data
4. System parses Excel, validates data, bulk inserts
5. View guest list table with RSVP status
6. See analytics: Total Attending, Total Pax, Not Attending, Pending
7. Export current guest list to Excel

**User Flow (Guest):**
1. Opens invitation link
2. Scrolls to RSVP section
3. Selects "Attending" or "Not Attending"
4. If Attending: enters pax count (1-10)
5. Enters name (if not pre-filled)
6. Submits RSVP
7. Form becomes disabled (cannot change)
8. Confirmation message displayed

**Business Rules:**
- Excel import columns: Name, Phone, Email, Pax (optional)
- Max 3000 guests per event (soft limit, no hard enforcement in MVP)
- Pax count: 1-10 per guest
- RSVP deadline configurable (optional)
- After deadline, RSVP form disabled
- Guests cannot modify RSVP after submission
- RSVP is tied to guest name (no unique guest ID for MVP)
- Analytics calculated in real-time via Convex queries

**UI/UX Considerations:**
- Drag-and-drop Excel upload
- Progress bar during import
- Validation error messages for malformed data
- Guest list table: sortable, searchable, filterable
- Analytics cards with icons and counts
- Export downloads Excel file immediately
- RSVP form disabled state with message "Thank you, your response is recorded"

**Dependencies:**
- Excel parsing library (e.g., SheetJS/xlsx)
- Convex database for guests and RSVPs
- Excel export library

**Database Schema:**
```
guests:
- id
- event_id
- name
- phone
- email
- max_pax (from import, default 10)
- created_at

rsvps:
- id
- event_id
- guest_name (no FK, just string for MVP)
- attending (boolean)
- pax_count
- submitted_at
```

---

#### Feature 6: Real-Time Wishes (Chat-like UI)

**Description:** Interactive, real-time wishes feed where guests post congratulatory messages displayed in chat format.

**User Flow (Guest):**
1. Scrolls to "Wishes" section on invitation
2. Sees existing wishes in reverse chronological order (newest first)
3. Auto-scrolls to latest message
4. Enters name (if not from RSVP)
5. Types wish (max 255 characters)
6. Clicks "Send"
7. Wish appears immediately in feed for all users

**User Flow (Manager):**
1. Views same wishes feed
2. Sees delete button on each wish (guests don't see this)
3. Can delete inappropriate wishes
4. Deletion happens in real-time for all viewers

**Business Rules:**
- Character limit: 255
- Guest must provide name (can be anyone, no authentication)
- Real-time updates via Convex subscriptions
- Newest wishes appear first (DESC order by timestamp)
- Auto-scroll to latest on new message
- Managers can delete any wish
- Deletion is permanent (no soft delete)

**UI/UX Considerations:**
- Chat bubble design (different colors for different users)
- Timestamp on each wish
- Character counter (255/255)
- Auto-scroll smooth animation
- Optimistic UI: wish appears immediately on send
- Delete confirmation for managers
- Loading skeleton while fetching wishes

**Dependencies:**
- Convex real-time subscriptions
- Zustand for managing scroll behavior
- Text area with character limit

**Database Schema:**
```
wishes:
- id
- event_id
- guest_name
- message (max 255 chars)
- created_at
```

---

#### Feature 7: Donation Display

**Description:** Static display of QR code and bank information for monetary gifts.

**User Flow (Manager):**
1. Navigate to "Donation" settings
2. Upload QR code image (payment QR from bank)
3. Enter bank name, account number, account holder name
4. Data saved and displayed on guest page

**User Flow (Guest):**
1. Views donation section on invitation
2. Sees QR code image
3. Sees bank details with copy-to-clipboard button for account number
4. Can scan QR or manually transfer

**Business Rules:**
- QR code image stored in Convex file storage
- Bank info plain text fields
- No payment processing (just display information)

**UI/UX Considerations:**
- Image preview of QR code
- Clipboard icon next to account number
- "Copied!" feedback on click
- Clear labels for bank info

**Dependencies:**
- Convex file storage for QR code
- Clipboard API

---

#### Feature 8: Multi-Language Support (Malay/English)

**Description:** Dual-language interface with Malay as default, switchable to English.

**User Flow:**
1. Event defaults to Malay (set during creation)
2. Guest opens invitation in Malay
3. Sees language toggle (🇲🇾 / 🇬🇧)
4. Clicks to switch to English
5. All UI text translates
6. Preference stored in session (not persisted)

**Business Rules:**
- Event-level default language (Malay)
- Guest can override per session
- Manager sets default in event settings
- All static text translated (labels, buttons, placeholders)
- User-generated content (wishes, wishlist) not translated
- Language persists in browser session only (resets on new visit)

**UI/UX Considerations:**
- Flag icons for language toggle
- Smooth transition (no page reload)
- All translations pre-loaded (no API calls)
- Clear indication of current language

**Dependencies:**
- i18n library (e.g., react-i18next)
- Translation JSON files (ms.json, en.json)

---

#### Feature 9: SEO Optimization

**Description:** Comprehensive SEO implementation to win search rankings for Malaysian wedding invitation keywords.

**Implementation:**
1. **Custom URL Slugs:** `/[couple-name]` format
2. **Meta Tags per Event:**
   - Title: "[Couple Names] - Jemputan Kahwin"
   - Description: "Anda dijemput ke majlis perkahwinan [Names] pada [Date] di [Location]"
   - OG Image: Background image from event
   - OG Type: website
3. **Sitemap:** Auto-generate sitemap.xml including all published events
4. **Structured Data:** Event schema.org markup (JSON-LD)
5. **Performance:** <3s load time, optimized images (post-MVP), lazy loading
6. **Mobile-First:** Perfect mobile experience (Google's mobile-first indexing)
7. **Canonical URLs:** Prevent duplicate content
8. **robots.txt:** Allow all published events

**Business Rules:**
- Only published (shared) events appear in sitemap
- Unpublished events have `noindex` meta tag
- Event page titles include couple names and date
- OG image is event background or default branded image

**UI/UX Considerations:**
- SEO preview in manager dashboard
- "Publish" vs "Draft" status indicator
- Share button triggers SEO indexing

**Dependencies:**
- Next.js App Router for SSR
- next-sitemap for sitemap generation
- Vercel for edge caching

---

#### Feature 10: Analytics & Monitoring

**Description:** PostHog for user behavior analytics and Sentry for error monitoring.

**PostHog Events to Track:**
- `page_view`: All page views with path
- `event_created`: When new event is created
- `invitation_shared`: When share link is clicked
- `rsvp_submitted`: RSVP submission with attending status
- `wishlist_item_claimed`: When guest claims item
- `wishlist_link_clicked`: When guest clicks affiliate link
- `wishlist_item_created`: When guest creates item
- `wish_posted`: When guest posts a wish
- `donation_qr_viewed`: When donation section scrolled into view
- `language_switched`: Language toggle clicks

**Sentry Monitoring:**
- Error threshold: Page not responding >15s
- API errors (5xx responses)
- Unhandled exceptions
- Performance monitoring (LCP, FID, CLS)
- Release tracking

**Business Rules:**
- Anonymous analytics (no PII without consent)
- Opt-out option for users
- Event properties include event_id for segmentation
- Errors auto-reported to Sentry dashboard

**UI/UX Considerations:**
- No UI for analytics (background tracking)
- Privacy notice on signup

**Dependencies:**
- PostHog SDK for Next.js
- Sentry SDK for Next.js
- Environment variables for API keys

---

#### Feature 11: Payment System (DISABLED FOR MVP)

**Description:** Stripe FPX integration for RM39 one-time payment per event. **Payment enforcement DISABLED for initial launch—users can share links freely.**

**Future Flow (Post-MVP):**
1. User clicks "Share Invitation"
2. If event not paid, display modal to redirect to payment page
3. Enter payment details via Stripe (FPX)
4. FPX payment flow
5. On success, event marked as paid
6. Share link becomes active

**MVP Behavior:**
- Share button always works (no payment check)
- Payment UI hidden/disabled
- Database field `paid: false` for all events
- Payment integration code stubbed for future activation

**Business Rules:**
- RM39 per event (one-time)
- Payment required per event, not per account
- Refund triggers link deactivation (post-MVP)
- Payment status tracked in events table

**UI/UX Considerations:**
- Share button always enabled
- No payment prompt
- Future: Payment modal with Stripe Elements

**Dependencies:**
- Stripe SDK (installed but not active)
- Convex mutation for payment status update

---

## 3. Technical Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel Edge Network                   │
│                    (Next.js App Router SSR)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Manager UI  │  │   Guest UI   │  │   API Routes │
│   (Builder)  │  │ (Invitation) │  │  (Auth, etc) │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  Convex Backend  │
              │  (Database +     │
              │   File Storage + │
              │   Realtime)      │
              └─────────┬────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  BetterAuth  │ │   PostHog    │ │    Sentry    │
│ (Auth Logic) │ │  (Analytics) │ │   (Errors)   │
└──────────────┘ └──────────────┘ └──────────────┘
```

**Components:**
- **Frontend:** Next.js 16.1.6 App Router, React 19.2+, TailwindCSS, Shadcn/ui
- **Backend:** Convex (serverless functions, database, file storage, real-time)
- **Database:** Convex (built-in, real-time reactive)
- **Authentication:** BetterAuth
- **File Storage:** Convex File Storage
- **Analytics:** PostHog
- **Error Monitoring:** Sentry
- **Payment:** Stripe (disabled for MVP)
- **Deployment:** Vercel (CI/CD, Edge Functions, CDN)

### 3.2 Frontend Architecture

**Technology Stack:**
- **Framework:** Next.js 16.1.6 (App Router)
- **React:** 19.2+
- **TypeScript:** 5.9.3
- **State Management:**
  - **Client State:** Zustand (editor state, UI state)
  - **Server State:** Convex React hooks (real-time queries)
- **Styling:** TailwindCSS 4.1 + Shadcn/ui components
- **Form Handling:** React Hook Form + Zod validation
- **Routing:** Next.js App Router file-based routing

**Project Structure:**
```
/src
  /app
    /(auth)
      /login
      /signup
    /(dashboard)
      /events
        /[eventId]
          /builder      # Landing page editor
          /guests       # Guest list management
          /wishlist     # Wishlist CRUD
          /settings     # Event settings
    /(guest)
      /[slug]           # Public invitation page
    /api
      /auth             # BetterAuth routes
  /components
    /ui                 # Shadcn components
    /builder            # Editor components
    /guest              # Invitation components
  /lib
    /convex             # Convex client setup
    /utils              # Helper functions
    /hooks              # Custom React hooks
  /stores
    /editor-store.ts    # Zustand store for builder
  /types
    /index.ts           # TypeScript types
  /convex               # Convex schema and functions
```

**Key Patterns:**
- **Server Components by Default:** Use RSC for initial data fetching
- **Client Components for Interactivity:** Mark with "use client" only when needed
- **Real-Time with Convex:** useQuery hook for reactive data
- **Optimistic Updates:** Zustand local state + Convex mutations
- **Error Boundaries:** Wrap routes with error.tsx for graceful failures
- **Loading States:** loading.tsx for Suspense boundaries

### 3.3 Backend Architecture

**Technology:** Convex (serverless backend-as-a-service)

**Why Convex:**
- Built-in real-time subscriptions (critical for wishes, wishlist claims, co-editing)
- File storage included (background images, QR codes)
- TypeScript end-to-end (schema + functions + frontend)
- Automatic API generation from functions
- No infrastructure management (serverless)
- Perfect for solo developer (minimal ops overhead)

**API Design Pattern:** Convex Functions (query, mutation, action)

**Key Functions:**

**Queries (Read):**
- `getEvent(eventId)`: Fetch event details
- `getGuestList(eventId)`: Fetch all guests
- `getWishlist(eventId)`: Fetch wishlist items
- `getWishes(eventId)`: Fetch wishes (real-time)
- `getRSVPAnalytics(eventId)`: Calculate RSVP stats

**Mutations (Write):**
- `createEvent(data)`: Create new event
- `updateEvent(eventId, data)`: Update event details
- `addGuest(eventId, guestData)`: Add single guest
- `importGuests(eventId, guests[])`: Bulk import
- `submitRSVP(eventId, rsvpData)`: Guest RSVP
- `addWishlistItem(eventId, item)`: Add item
- `claimWishlistItem(itemId, guestName)`: Claim item
- `unclaimWishlistItem(itemId)`: Unclaim item
- `addWish(eventId, wish)`: Post wish
- `deleteWish(wishId)`: Delete wish (manager only)

**Actions (HTTP):**
- `uploadFile(file)`: Upload to Convex storage
- `exportGuestList(eventId)`: Generate Excel file

**Middleware/Hooks:**
- Authentication check via BetterAuth session
- Authorization check (manager vs guest)
- Rate limiting (Convex built-in)

### 3.4 Database Schema

**Database Type:** Convex (document-based with relational features)

#### Tables/Collections

**users**
| Field | Type | Description |
|-------|------|-------------|
| _id | Id<"users"> | Convex auto-generated ID |
| email | string | Unique user email |
| name | string? | Optional display name |
| googleId | string? | Google OAuth ID |
| createdAt | number | Timestamp |

**events**
| Field | Type | Description |
|-------|------|-------------|
| _id | Id<"events"> | Event ID |
| slug | string | Unique custom URL slug |
| coupleName | string | Couple's names |
| weddingDate | string | Date in ISO format |
| weddingTime | string | Time (e.g., "14:00") |
| locationWaze | string? | Waze link |
| locationGoogle | string? | Google Maps link |
| locationApple | string? | Apple Maps link |
| backgroundImageId | Id<"_storage">? | Convex file storage ID |
| backgroundColor | string? | Hex color |
| colorPrimary | string | Hex color |
| colorSecondary | string | Hex color |
| colorAccent | string | Hex color |
| musicYoutubeUrl | string? | YouTube URL |
| language | "ms" \| "en" | Default language |
| rsvpDeadline | string? | ISO date |
| donationQrId | Id<"_storage">? | QR code image |
| bankName | string? | Bank name |
| bankAccount | string? | Account number |
| bankHolder | string? | Account holder name |
| paid | boolean | Payment status (always false for MVP) |
| published | boolean | SEO index status |
| createdAt | number | Timestamp |

**managers**
| Field | Type | Description |
|-------|------|-------------|
| _id | Id<"managers"> | Manager ID |
| eventId | Id<"events"> | FK to events |
| userId | Id<"users"> | FK to users |
| role | "owner" \| "co-manager" | Manager role |
| invitedEmail | string? | If invited but not accepted |
| acceptedAt | number? | Timestamp of acceptance |
| createdAt | number | Timestamp |

**Indexes:**
- `by_event`: `(eventId)`
- `by_user`: `(userId)`

**guests**
| Field | Type | Description |
|-------|------|-------------|
| _id | Id<"guests"> | Guest ID |
| eventId | Id<"events"> | FK to events |
| name | string | Guest name |
| phone | string? | Phone number |
| email | string? | Email address |
| maxPax | number | Max pax allowed (default 10) |
| createdAt | number | Timestamp |

**Indexes:**
- `by_event`: `(eventId)`

**rsvps**
| Field | Type | Description |
|-------|------|-------------|
| _id | Id<"rsvps"> | RSVP ID |
| eventId | Id<"events"> | FK to events |
| guestName | string | Name from submission |
| attending | boolean | Attending status |
| paxCount | number | Number of people (1-10) |
| submittedAt | number | Timestamp |

**Indexes:**
- `by_event`: `(eventId)`
- `by_event_and_name`: `(eventId, guestName)` (unique)

**wishlist_items**
| Field | Type | Description |
|-------|------|-------------|
| _id | Id<"wishlist_items"> | Item ID |
| eventId | Id<"events"> | FK to events |
| title | string | Item name |
| description | string? | Optional description |
| price | number? | Price in MYR |
| originalUrl | string | Product URL |
| affiliateUrl | string | Converted affiliate URL |
| platform | "shopee" \| "lazada" \| "other" | Detected platform |
| isVisible | boolean | Show to guests |
| claimedByName | string? | Guest who claimed |
| claimedAt | number? | Timestamp |
| addedBy | "manager" \| "guest" | Who added it |
| createdAt | number | Timestamp |

**Indexes:**
- `by_event`: `(eventId)`
- `by_event_visible`: `(eventId, isVisible)`

**wishes**
| Field | Type | Description |
|-------|------|-------------|
| _id | Id<"wishes"> | Wish ID |
| eventId | Id<"events"> | FK to events |
| guestName | string | Guest name |
| message | string | Wish text (max 255) |
| createdAt | number | Timestamp |

**Indexes:**
- `by_event`: `(eventId)` (sorted DESC by createdAt)

**Relationships:**
- `users` → `managers` (one-to-many)
- `events` → `managers` (one-to-many, max 4)
- `events` → `guests` (one-to-many)
- `events` → `rsvps` (one-to-many)
- `events` → `wishlist_items` (one-to-many)
- `events` → `wishes` (one-to-many)

**Indexes:**
- All `by_event` indexes for efficient event-scoped queries
- `events.slug` unique index for URL lookups
- `rsvps.by_event_and_name` unique compound index to prevent duplicate RSVPs

### 3.5 Authentication & Authorization

**Authentication Method:** BetterAuth with Google OAuth

**Flow:**
1. User clicks "Sign in with Google"
2. BetterAuth handles OAuth flow or credential validation
3. On success, session token stored in HTTP-only cookie
4. Token included in Convex requests via middleware
5. Convex functions verify token and extract userId
6. Authorization checks based on userId and eventId

**Security Measures:**
- HTTP-only cookies prevent XSS attacks
- HTTPS enforced (Vercel default)
- CSRF protection via BetterAuth
- Session expiration: 30 days
- Refresh token rotation

**Authorization Levels:**
- **Public:** Invitation pages (no auth)
- **Guest:** RSVP submission, wishlist interaction (no auth, name-based)
- **Manager:** Event editing, guest management (requires auth + manager check)
- **Owner:** Cannot delete event if co-manager exists (business rule)

**Manager Authorization Logic:**
```typescript
async function checkManager(userId: Id<"users">, eventId: Id<"events">) {
  const manager = await db
    .query("managers")
    .withIndex("by_user", q => q.eq("userId", userId))
    .filter(q => q.eq(q.field("eventId"), eventId))
    .first();
  
  if (!manager) throw new Error("Unauthorized");
  return manager;
}
```

### 3.6 Third-Party Integrations

| Service | Purpose | Integration Method | Key Features Used |
|---------|---------|-------------------|-------------------|
| BetterAuth | Authentication | npm package + Next.js API routes | Google OAuth, session management |
| Convex | Backend + Database | Convex SDK | Real-time queries, mutations, file storage |
| PostHog | Analytics | PostHog SDK | Event tracking, user properties |
| Sentry | Error Monitoring | Sentry SDK | Error capture, performance monitoring |
| Stripe | Payment (disabled) | Stripe SDK | FPX payment (future) |
| Google OAuth | Social Login | BetterAuth integration | User authentication |
| YouTube | Music Embed | iframe embed | Auto-play, loop |
| Vercel | Hosting + CI/CD | Git integration | Auto-deploy, edge functions |

**Integration Points:**
- **BetterAuth:** `/api/auth/*` routes for OAuth callbacks
- **Convex:** All data operations via React hooks (useQuery, useMutation)
- **PostHog:** Client-side SDK, events tracked on user actions
- **Sentry:** Both client and server SDK for full coverage
- **Stripe:** Payment webhook endpoint (future)
- **YouTube:** iframe in guest invitation page

---

## 4. Tech Stack Decisions

### 4.1 Chosen Technologies

| Component | Technology | Version | Rationale |
|-----------|------------|---------|-----------|
| Framework | Next.js | 16+ | SSR for SEO, App Router for modern patterns, Vercel optimization |
| Frontend Library | React | 19+ | Component-based, large ecosystem, team familiarity |
| Language | TypeScript | 5.x | Type safety, better DX, fewer runtime errors |
| Styling | TailwindCSS | 4.x | Utility-first, fast development, consistent design |
| UI Components | Shadcn/ui | Latest | Accessible, customizable, copy-paste components |
| State Management | Zustand | 5.x | Lightweight, simple API, perfect for UI state |
| Server State | Convex React | Latest | Real-time subscriptions, automatic caching |
| Backend | Convex | Latest | Real-time by default, file storage included, TypeScript, minimal ops |
| Database | Convex | Latest | Built-in with Convex, real-time, no separate setup |
| Authentication | BetterAuth | Latest | OAuth support, session management, Next.js integration |
| Analytics | PostHog | Latest | Open-source, event tracking, privacy-friendly |
| Error Monitoring | Sentry | Latest | Industry standard, excellent Next.js support |
| Payment | Stripe | Latest | FPX support for Malaysia, developer-friendly API |
| Hosting | Vercel | N/A | Best Next.js hosting, edge network, automatic CI/CD |
| File Storage | Convex Storage | Latest | Integrated with Convex, simple API, CDN |

### 4.2 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^16 .0.0 | Framework |
| react | ^19.0.0 | UI library |
| typescript | ^5.0.0 | Type safety |
| tailwindcss | ^4.0.0 | Styling |
| @radix-ui/* | Latest | Shadcn foundation |
| convex | Latest | Backend SDK |
| better-auth | Latest | Authentication |
| zustand | ^5.0.0 | Client state |
| react-hook-form | ^7.70.0 | Form handling |
| zod | ^3.22.0 | Validation |
| @tanstack/react-query | ^5.0.0 | (If needed, Convex already handles this) |
| posthog-js | Latest | Analytics |
| @sentry/nextjs | Latest | Error monitoring |
| @stripe/stripe-js | Latest | Payment (disabled) |
| react-colorful | ^5.6.1 | Color picker |
| xlsx | ^0.18.5 | Excel import/export |
| react-i18next | ^14.0.0 | i18n |
| date-fns | ^3.0.0 | Date utilities |
---
notes: Use latest stable release for each dependencies

## 5. Cross-Cutting Concerns

### 5.1 Error Handling Strategy

**Frontend:**

**API Errors:**
- Convex mutations return error objects
- Display toast notifications with user-friendly messages
- Retry logic: 3 attempts with exponential backoff
- Fallback: "Something went wrong, please try again"

**Network Errors:**
- Detect offline status via `navigator.onLine`
- Show offline banner
- Queue mutations for retry when back online (Convex handles this)

**Validation Errors:**
- Zod schema validation before submission
- Inline error messages under form fields
- Highlight invalid fields in red
- Prevent submission until valid

**Crash Recovery:**
- React Error Boundaries around routes
- Fallback UI: "Oops! Something went wrong" with refresh button
- Errors auto-reported to Sentry

**Backend:**

**Error Response Format:**
```typescript
{
  error: {
    code: "INVALID_SLUG",
    message: "This URL is already taken",
    details: { field: "slug" }
  }
}
```

**Error Logging:**
- All errors logged to Sentry with context (userId, eventId, action)
- Critical errors trigger alerts (Sentry integrations)

### 5.2 Logging & Monitoring

**Application Logging:**
- **Tool:** Sentry
- **Log Levels:** ERROR, WARNING (no DEBUG in production)
- **What to Log:**
  - All mutation errors
  - File upload failures
  - Payment failures (future)
  - Authentication failures
  - Affiliate link conversion failures

**Performance Monitoring:**
- **Tool:** Sentry + Vercel Analytics
- **Metrics Tracked:**
  - Core Web Vitals (LCP, FID, CLS)
  - Page load time
  - API response time (Convex function duration)
  - File upload time

**Crash Reporting:**
- **Tool:** Sentry
- **Alert Thresholds:**
  - >5 errors/minute → Slack notification
  - Critical path failures → Immediate alert
  - Page load >15s → Log as error

### 5.3 Analytics Implementation

**Tool:** PostHog

**Events to Track:**

| Event Name | Description | Properties |
|------------|-------------|------------|
| page_view | User views any page | pathname, event_id (if applicable) |
| event_created | Manager creates event | event_id, slug |
| invitation_shared | Share button clicked | event_id |
| rsvp_submitted | Guest submits RSVP | event_id, attending, pax_count |
| wishlist_item_claimed | Guest claims item | event_id, item_id, platform |
| wishlist_link_clicked | Affiliate link clicked | event_id, item_id, platform |
| wishlist_item_created | Guest create item - auto claimed | event_id, item_id, platform |
| wish_posted | Guest posts wish | event_id, message_length |
| donation_qr_viewed | QR code section visible | event_id |
| language_switched | Language toggle clicked | event_id, from_lang, to_lang |
| guest_imported | Excel import completed | event_id, guest_count |
| background_uploaded | Background image uploaded | event_id, file_size |
| music_added | YouTube music added | event_id |

**User Properties:**
- user_id (if authenticated)
- role (guest/manager)
- event_count (number of events managed)

**Implementation:**
```typescript
// Example
posthog.capture('rsvp_submitted', {
  event_id: eventId,
  attending: true,
  pax_count: 4
});
```

### 5.4 Security Measures

**Data Security:**
- **Encryption at Rest:** Convex handles encryption (AWS infrastructure)
- **Encryption in Transit:** HTTPS enforced (Vercel + Convex)
- **Sensitive Data:** Passwords hashed with bcrypt, never logged

**API Security:**
- **Authentication:** BetterAuth session tokens
- **Authorization:** Manager checks on all mutations
- **Rate Limiting:** Convex built-in (100 req/sec per user)
- **Input Validation:** Zod schemas on all mutations
- **SQL Injection:** N/A (Convex is not SQL-based)
- **XSS Prevention:** React auto-escapes, DOMPurify for user HTML (if needed)

**Mobile Security:**
- **Secure Storage:** HTTP-only cookies for tokens
- **Certificate Pinning:** N/A (web-based)
- **Code Obfuscation:** Vercel build optimization
- **Jailbreak Detection:** N/A (web-based)

**Additional:**
- **CORS:** Convex configured to allow only domain
- **CSP Headers:** Next.js security headers for XSS prevention
- **Clickjacking:** X-Frame-Options: DENY
- **CSRF:** BetterAuth CSRF tokens

### 5.5 Performance Optimization

**Frontend:**

**Image Optimization:**
- Use Next.js Image component (automatic WebP conversion)
- Lazy load images below fold
- Background images: max 5MB, but served via Convex CDN
- Future: Implement on-upload resize to 1200px width

**List Rendering:**
- Guest list: Virtualized table (react-window) if >100 guests
- Wishes: Virtual scroll (react-virtual) for real-time list
- Wishlist: Standard map (limited items expected)

**Code Splitting:**
- Next.js automatic code splitting per route
- Dynamic imports for heavy components (color picker, Excel lib)

**Caching Strategy:**
- Convex handles query caching automatically
- Static assets: Vercel CDN with long cache headers
- Event pages: ISR (Incremental Static Regeneration) with 60s revalidation

**Backend:**

**Database Query Optimization:**
- Use Convex indexes for all frequent queries
- Avoid N+1 queries (fetch related data in single query)
- Paginate large lists (wishes, guests if >1000)

**Caching:**
- Convex reactive queries auto-cache
- No Redis needed (Convex handles caching)

**CDN Usage:**
- All static assets via Vercel CDN
- Convex file storage has built-in CDN

**Target Metrics:**
- **App Launch Time:** <2s for manager dashboard
- **Invitation Page Load:** <3s (for SEO)
- **RSVP Submission:** <500ms round-trip
- **Real-time Update Latency:** <100ms (Convex websocket)

### 5.6 Offline Support

**Strategy:** Online-only (no offline support for MVP)

**Rationale:**
- Real-time features (wishes, co-editing) require connectivity
- Target use case is event invitation (typically accessed with internet)
- Adds complexity not justified for MVP timeline

**Future Consideration:**
- Allow managers to view cached event data offline
- Queue mutations for sync when online

**User Feedback:**
- Offline banner displayed if network lost
- Disable submit buttons when offline
- Toast: "You're offline. Changes will sync when reconnected."

---

## 6. Edge Cases & Error Scenarios

### 6.1 Comprehensive Edge Cases

| Scenario | User Impact | Handling Strategy | Priority |
|----------|-------------|-------------------|----------|
| Network unavailable during RSVP submission | Guest loses their response | Show offline banner, queue mutation, auto-retry when online | High |
| User uploads 10MB image (exceeds 5MB limit) | Upload fails | Client-side validation before upload, error message with size limit | High |
| Two managers edit same field simultaneously | Data conflict | Convex last-write-wins, show toast "Changes by [co-manager] applied" | Medium |
| YouTube URL invalid or video deleted | Music doesn't play | Validate URL format, show error "Invalid YouTube link", allow retry | High |
| Guest submits RSVP after deadline | Late RSVP not counted | Check deadline on submit, show "RSVP deadline has passed" | High |
| Guest claims wishlist item, another guest claims same item simultaneously | Double claim | Convex atomic mutation, second claim fails with "Already claimed" | High |
| Excel import has malformed data (missing columns) | Import fails partially | Validate headers, show row-by-row errors, import valid rows only | Medium |
| Custom slug already taken | Event creation fails | Real-time slug availability check, suggest alternatives (slug-1, slug-2) | High |
| Manager deletes event while guest is viewing | 404 error | Catch 404, show "This invitation is no longer available" | Medium |
| File upload interrupted (network drop) | Upload incomplete | Show upload progress, allow retry, Convex handles partial uploads | Medium |
| Database connection lost during mutation | Action fails | Convex auto-reconnects, show error toast, allow retry | Low (Convex handles) |
| User deletes account with active events | Events orphaned | Cascade delete all user's events and data, warn user before deletion | Low |
| Affiliate link conversion fails (unknown platform) | Original link used | Log error, use original URL, notify manager "Affiliate conversion failed" | Medium |
| RSVP submitted with pax=0 | Invalid data | Validation: pax must be 1-10, show error "Please enter number of guests" | High |
| Wishlist item URL is not Shopee/Lazada | No affiliate revenue | Detect platform, if "other" don't convert, still save item | Low |
| Guest name >100 characters in RSVP | Display overflow | Truncate to 100 chars, validation on submit | Low |
| Multiple tabs open, session expires | Auth error on mutation | Detect 401, redirect to login, preserve draft state in localStorage | Medium |
| Co-manager invitation sent to non-existent email | Invitation lost | Allow resend, show "Invitation sent to [email]", no validation on send | Low |
| Event has 2000+ guests, guest list loads slowly | Performance degradation | Implement pagination (100 per page), virtualized table | Medium |
| QR code image upload fails | Donation feature incomplete | Show error, allow retry, allow saving event without QR | Medium |

### 6.2 Data Validation Rules

**Event Creation:**
- **slug:**
  - Type: string
  - Required: Yes
  - Format: alphanumeric + hyphens, no spaces
  - Constraints: 3-50 characters, unique
  - Error: "URL must be 3-50 characters and contain only letters, numbers, and hyphens"

- **weddingDate:**
  - Type: string (ISO date)
  - Required: Yes
  - Constraints: Must be future date
  - Error: "Wedding date must be in the future"

- **musicYoutubeUrl:**
  - Type: string
  - Required: No
  - Format: Valid YouTube URL (youtube.com/watch?v= or youtu.be/)
  - Error: "Please enter a valid YouTube link"

**Guest Import:**
- **name:**
  - Type: string
  - Required: Yes
  - Constraints: 1-100 characters
  - Error: "Name is required and must be under 100 characters"

- **phone:**
  - Type: string
  - Required: No
  - Format: Malaysian phone format (optional, no strict validation for MVP)

- **email:**
  - Type: string
  - Required: No
  - Format: Valid email (regex validation)
  - Error: "Invalid email format"

**RSVP:**
- **guestName:**
  - Type: string
  - Required: Yes
  - Constraints: 1-100 characters
  - Error: "Please enter your name"

- **paxCount:**
  - Type: number
  - Required: Yes (if attending)
  - Constraints: 1-10
  - Error: "Number of guests must be between 1 and 10"

**Wishlist:**
- **title:**
  - Type: string
  - Required: Yes
  - Constraints: 1-200 characters
  - Error: "Item title is required"

- **originalUrl:**
  - Type: string
  - Required: Yes
  - Format: Valid URL (starts with http/https)
  - Error: "Please enter a valid product link"

**Wish:**
- **message:**
  - Type: string
  - Required: Yes
  - Constraints: 1-255 characters
  - Error: "Wish cannot be empty or exceed 255 characters"

**File Uploads:**
- **backgroundImage:**
  - Type: File
  - Accepted: .jpg, .jpeg, .png, .webp
  - Max Size: 5MB
  - Error: "Image must be under 5MB and in JPG, PNG, or WEBP format"

- **donationQR:**
  - Type: File
  - Accepted: .jpg, .jpeg, .png
  - Max Size: 5MB
  - Error: "QR code must be under 5MB and in JPG or PNG format"

### 6.3 Recovery Strategies

**For Critical Failures:**
- **Database Outage:** Convex has 99.9% uptime SLA, auto-failover. Show maintenance page if detected.
- **Vercel Outage:** Rely on Vercel's infrastructure, no manual intervention. Status page at status.vercel.com.
- **Auth Service Down:** Queue auth requests, show "Authentication service temporarily unavailable, please try again in a moment."

**For Data Loss Scenarios:**
- **Accidental Event Deletion:** Implement soft delete with 30-day retention (post-MVP). For MVP, warn user with confirmation dialog.
- **Backup Strategy:** Convex handles backups automatically. Export guest list regularly via Excel.
- **Recovery Procedure:** Contact Convex support for point-in-time recovery if needed.

**For User Errors:**
- **Submitted wrong RSVP:** Show clear message "RSVP is final, please contact the couple to change." Provide couple contact (future feature).
- **Uploaded wrong image:** Allow delete and re-upload in builder.
- **Wrong wishlist item:** Allow managers to edit or delete items anytime.

---

## 7. API Design

### 7.1 Convex Functions (API Endpoints)

#### Authentication (BetterAuth handles via /api/auth/*)

**POST /api/auth/signin/google**
- Description: Google OAuth sign-in
- Handled by: BetterAuth
- Redirect: /events (dashboard)

#### Events

**query: getEvent**
```typescript
args: { eventId: v.id("events") }
returns: Event | null
auth: Public (for guest pages) or Manager (for dashboard)
```

**query: getEventBySlug**
```typescript
args: { slug: v.string() }
returns: Event | null
auth: Public
description: Fetch event for guest invitation page
```

**mutation: createEvent**
```typescript
args: {
  slug: v.string(),
  coupleName: v.string(),
  weddingDate: v.string(),
  language: v.optional("ms" | "en")
}
returns: Id<"events">
auth: Authenticated
errors: "SLUG_TAKEN" if slug exists
```

**mutation: updateEvent**
```typescript
args: {
  eventId: v.id("events"),
  ...updatedFields
}
returns: void
auth: Manager of event
description: Update any event field (background, colors, music, etc.)
```

**mutation: publishEvent**
```typescript
args: { eventId: v.id("events"), published: v.boolean() }
returns: void
auth: Manager
description: Toggle published status (for SEO indexing)
```

#### Managers

**mutation: inviteCoManager**
```typescript
args: {
  eventId: v.id("events"),
  email: v.string()
}
returns: void
auth: Event owner
description: Send email invitation to co-manager
```

**mutation: acceptCoManagerInvite**
```typescript
args: {
  eventId: v.id("events"),
  inviteToken: v.string()
}
returns: void
auth: Authenticated
description: Accept co-manager invitation via email link
```

#### Guests

**query: getGuestList**
```typescript
args: { eventId: v.id("events") }
returns: Guest[]
auth: Manager
```

**mutation: addGuest**
```typescript
args: {
  eventId: v.id("events"),
  name: v.string(),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  maxPax: v.optional(v.number())
}
returns: Id<"guests">
auth: Manager
```

**mutation: importGuests**
```typescript
args: {
  eventId: v.id("events"),
  guests: v.array(v.object({
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    maxPax: v.optional(v.number())
  }))
}
returns: { imported: number, errors: string[] }
auth: Manager
description: Bulk import from Excel
```

**action: exportGuestList**
```typescript
args: { eventId: v.id("events") }
returns: { fileUrl: string }
auth: Manager
description: Generate Excel file and return download URL
```

#### RSVPs

**query: getRSVPAnalytics**
```typescript
args: { eventId: v.id("events") }
returns: {
  totalAttending: number,
  totalPax: number,
  totalNotAttending: number,
  totalPending: number
}
auth: Manager
```

**mutation: submitRSVP**
```typescript
args: {
  eventId: v.id("events"),
  guestName: v.string(),
  attending: v.boolean(),
  paxCount: v.number() // 1-10
}
returns: void
auth: Public
errors: "DEADLINE_PASSED", "PAX_INVALID", "DUPLICATE_RSVP"
validation: paxCount between 1-10, check RSVP deadline
```

#### Wishlist

**query: getWishlist**
```typescript
args: {
  eventId: v.id("events"),
  includeHidden: v.optional(v.boolean()) // default false
}
returns: WishlistItem[]
auth: Public (guests see only visible), Manager (sees all)
```

**mutation: addWishlistItem**
```typescript
args: {
  eventId: v.id("events"),
  title: v.string(),
  description: v.optional(v.string()),
  price: v.optional(v.number()),
  originalUrl: v.string(),
  addedBy: "manager" | "guest"
}
returns: Id<"wishlist_items">
auth: Public (guests can add), Manager
description: Converts URL to affiliate link before saving
```

**mutation: claimWishlistItem**
```typescript
args: {
  itemId: v.id("wishlist_items"),
  guestName: v.string()
}
returns: void
auth: Public
errors: "ALREADY_CLAIMED"
description: Atomic check-and-set for claims
```

**mutation: unclaimWishlistItem**
```typescript
args: { itemId: v.id("wishlist_items") }
returns: void
auth: Public
description: Remove claim (allow anyone to unclaim for MVP)
```

**mutation: toggleWishlistItemVisibility**
```typescript
args: {
  itemId: v.id("wishlist_items"),
  isVisible: v.boolean()
}
returns: void
auth: Manager
```

#### Wishes

**query: getWishes**
```typescript
args: { eventId: v.id("events") }
returns: Wish[] // sorted DESC by createdAt
auth: Public
description: Real-time subscription for chat-like updates
```

**mutation: addWish**
```typescript
args: {
  eventId: v.id("events"),
  guestName: v.string(),
  message: v.string() // max 255 chars
}
returns: Id<"wishes">
auth: Public
validation: message length <= 255
```

**mutation: deleteWish**
```typescript
args: { wishId: v.id("wishes") }
returns: void
auth: Manager
description: Hard delete from database
```

#### File Uploads

**mutation: generateUploadUrl**
```typescript
args: {}
returns: string (upload URL)
auth: Authenticated
description: Convex storage upload URL for images
```

**mutation: saveUploadedFile**
```typescript
args: {
  storageId: v.id("_storage"),
  eventId: v.id("events"),
  fileType: "background" | "qr"
}
returns: void
auth: Manager
description: Associate uploaded file with event
```

### 7.2 Rate Limiting

- **Convex Default:** 100 requests/second per user (sufficient for MVP)
- **Custom Limits (future):**
  - RSVP submissions: 5/minute per IP (prevent spam)
  - Wish posts: 10/minute per IP
  - File uploads: 10/hour per user
- **Response when exceeded:** Convex returns 429 error, show toast "Please slow down and try again"

### 7.3 Pagination

**Strategy:** Cursor-based (Convex built-in)

**Example: Guest List Pagination**

**Request:**
```typescript
query: getGuestList(eventId: Id<"events">, paginationOpts: { numItems: 100, cursor: string | null })
```

**Response:**
```typescript
{
  page: Guest[],
  continueCursor: string | null,
  isDone: boolean
}
```

**Implementation:**
- Guest list: Paginate if >100 guests
- Wishes: Paginate if >200 wishes
- Wishlist: No pagination (expected <50 items)

---

## 8. Development Phases

### 8.1 MVP (Phase 1)

**Timeline:** 1 week (7 days)

**Features:**
- [x] Project setup (Next.js, Convex, BetterAuth, TailwindCSS, Shadcn)
- [x] Authentication (Google OAuth)
- [x] Event creation with custom slug
- [x] Landing page builder UI
- [x] Background image upload (≤5MB)
- [x] Color theming (4 colors: background, primary, secondary, accent)
- [x] YouTube music embed (auto-play, loop)
- [x] Event info form (date, time, location links)
- [x] Live preview (9:16 mobile-locked, real-time updates via Zustand)
- [x] Wishlist CRUD
- [x] Affiliate link conversion (Shopee/Lazada detection)
- [x] Guest can claim/unclaim items
- [x] Guest can add items
- [x] Manager can hide/show items
- [x] Guest list management (CRUD)
- [x] Excel import/export
- [x] RSVP form (attending/not, pax 1-10)
- [x] RSVP deadline enforcement
- [x] RSVP analytics (counts)
- [x] Real-time wishes feed (chat UI)
- [x] Manager can delete wishes
- [x] Donation section (QR code, bank info, clipboard copy)
- [x] Custom URL per event (/your-slug)
- [x] SEO optimization (meta tags, sitemap, structured data)
- [x] Language switcher (Malay/English)
- [x] PostHog integration (all key events)
- [x] Sentry integration (error monitoring)
- [x] Co-manager invitation and acceptance
- [x] Desktop view (9:16 locked, centered)
- [x] Vercel deployment
- [x] **Payment DISABLED** (free sharing for MVP)

**Technical Deliverables:**
- [x] Convex schema and functions deployed
- [x] BetterAuth configured with Google OAuth
- [x] Next.js routes and components
- [x] Shadcn UI components integrated
- [x] Excel import/export working
- [x] Real-time subscriptions for wishes and claims
- [x] SEO meta tags and sitemap
- [x] PostHog events firing
- [x] Sentry error tracking active

**Success Criteria:**
- User can create event, customize it, and share link in <5 minutes
- Guest can RSVP, post wish, claim wishlist item without friction
- Page loads in <3s
- No critical bugs in core flows
- Real-time updates work seamlessly for co-managers
- SEO meta tags correctly set on all invitation pages

### 8.2 Post-MVP (Phase 2)

**Timeline:** 2-4 weeks after MVP launch

**Features:**
- [ ] Stripe FPX payment integration (RM39 per event)
- [ ] Payment enforcement (block sharing until paid)
- [ ] Refund system (deactivate link on refund)
- [ ] Image optimization on upload (resize to 1200px width)
- [ ] Custom email templates for co-manager invites
- [ ] Guest list filtering and sorting UI
- [ ] Bulk actions (delete multiple guests)
- [ ] Event templates (pre-designed themes)
- [ ] Admin panel (superadmin role)
- [ ] Usage analytics (events per user, revenue tracking)
- [ ] Facebook, Apple & Email login

### 8.3 Future Phases

**Phase 3 (3-6 months):**
- [ ] Multi-event support UI (dashboard with event list)
- [ ] Event duplication feature
- [ ] Guest messaging (send updates to all guests)
- [ ] White-label option for wedding planners
- [ ] Advanced SEO (blog, wedding planning tips)

**Phase 4 (6-12 months):**
- [ ] Marketplace for wedding vendors (photographers, caterers)
- [ ] Integration with wedding planning tools (checklists, budgets)
- [ ] Photo gallery uploads (wedding photos shared with guests)
- [ ] RSVP meal preferences (vegetarian, halal, etc.)
- [ ] Seating chart management
- [ ] Thank you card generator

### 8.4 Technical Debt Considerations

**Known Trade-offs:**

**1. No Image Optimization:**
- Why: MVP timeline constraint (1 week)
- Impact: Larger file sizes, slower page loads
- Plan: Implement sharp or next-image optimization in Phase 2
- Timeline: Week 2

**2. Guest Identification by Name Only (No Unique IDs):**
- Why: Simpler for MVP, no guest accounts needed
- Impact: Duplicate names could cause RSVP confusion
- Plan: Add optional guest tokens or phone verification in Phase 2
- Timeline: Month 2

**3. No Soft Delete for Events:**
- Why: Simplicity, unlikely in MVP usage
- Impact: Accidental deletions are permanent
- Plan: Implement 30-day soft delete with trash bin in Phase 2
- Timeline: Week 3

**4. Payment Disabled:**
- Why: Focus on product-market fit first
- Impact: No revenue during MVP testing
- Plan: Enable Stripe in Phase 2 once usage validated
- Timeline: Week 2-3

**5. No Image CDN Optimization:**
- Why: Convex storage is sufficient for MVP
- Impact: Slower loads in high-traffic scenarios
- Plan: Integrate Cloudflare Images or Imgix in Phase 3
- Timeline: Month 3

**Refactoring Needs:**

**1. Affiliate Link Converter:**
- Current: Simple regex detection in mutation
- Future: Move to dedicated service, support more platforms (Amazon, etc.)
- Timeline: Phase 2

**2. Real-time Wishes Pagination:**
- Current: Fetch all wishes (could be 100s)
- Future: Paginate with infinite scroll
- Timeline: If wishes >200 per event

**3. State Management:**
- Current: Zustand for builder, Convex for server state
- Future: Consider unified approach if complexity grows
- Timeline: Re-evaluate in Phase 3

---

## 9. Open Questions & Risks

### 9.1 Unresolved Technical Decisions

| Question | Options | Decision Date | Owner |
|----------|---------|---------------|-------|
| Should we implement rate limiting for RSVP submissions beyond Convex default? | Yes (add custom limit) / No (rely on Convex) | End of Week 1 | Backend Dev |
| Should wishlist item images be uploaded or pulled from product URL? | Upload (more control) / Pull (easier UX) | Week 1 MVP | Product |
| Do we need staging environment or just production? | Staging + Prod / Prod only | Day 2 | DevOps |
| Should we track affiliate link clicks in PostHog or just conversions? | Both / Clicks only / Neither | Day 3 | Analytics |
| Character limit for event couple name? | 100 chars / 50 chars / 200 chars | Day 1 | Product |
| Should managers get email notification when guest RSVPs? | Yes / No / Optional setting | Week 2 (Post-MVP) | Product |

### 9.2 Risks & Mitigation

| Risk | Probability | Impact | Mitigation Strategy | Owner |
|------|-------------|--------|---------------------|-------|
| Affiliate link conversion fails for new Shopee/Lazada URL formats | Medium | Medium | Implement regex patterns, add fallback to original URL, log errors to Sentry | Backend Dev |
| Real-time updates cause performance issues with many concurrent users | Low | High | Convex scales automatically, monitor via Sentry, implement pagination if needed | Backend Dev |
| Google OAuth rate limits during high traffic | Low | High | Implement queue system, add email/password fallback, contact Google for limit increase | Auth Dev |
| Custom slugs contain inappropriate words | Medium | Medium | Implement profanity filter on slug creation, manual review for flagged cases | Backend Dev |
| Image uploads overload Convex storage quota | Low | Medium | Set 5MB hard limit, monitor usage, upgrade Convex plan if needed | DevOps |
| SEO optimization doesn't rank well due to strong competition | High | High | Continuous SEO improvement, backlink building, content marketing (blog), Google Ads | Marketing |
| Users abuse free sharing (no payment) | High | Medium | **Accept for MVP** (validate demand first), enable payment in Phase 2, limit features for free users | Product |
| Malicious users spam wishes or wishlist items | Medium | Low | Implement rate limiting (10 wishes/minute), manager can delete, add CAPTCHA if needed | Backend Dev |
| Concurrent co-manager edits cause UI confusion | Medium | Low | Show real-time update toast "Changes by [Name] applied", rely on Convex last-write-wins | Frontend Dev |
| RSVP deadline edge case: timezone differences | Low | Medium | Store deadline in UTC, convert to event timezone, show clear countdown timer | Backend Dev |

### 9.3 Assumptions

**Product Assumptions:**
- Users prefer mobile-first invitations over desktop (validated by competitor analysis)
- RM39 is acceptable price point for Malaysian couples (needs validation)
- Google OAuth is sufficient for MVP auth (Facebook/Apple can wait)
- Guests don't need accounts to interact (RSVP, wishes, wishlist)
- Affiliate revenue will offset free tier usage (needs validation)

**Technical Assumptions:**
- Convex can handle 2000 guests per event without performance issues
- 5MB image limit is sufficient for high-quality backgrounds
- YouTube embed API won't change drastically
- Vercel free tier is sufficient for MVP traffic
- Next.js App Router is stable (no major breaking changes)

**User Behavior Assumptions:**
- Couples will share invitation links via WhatsApp primarily
- Guests will access invitations on mobile devices (>80%)
- Most events will have <500 guests
- Wishes feature will be popular (needs validation)
- Co-manager feature is essential (bride + groom both want to edit)

### 9.4 Dependencies

**External:**
- **Convex:** Database, backend, file storage, real-time
  - Status: Active, no known issues
  - Risk: Service outage (low probability, 99.9% SLA)
- **Google OAuth:** Social login
  - Status: Active
  - Risk: API changes (low, stable API)
- **YouTube Embed API:** Music playback
  - Status: Active
  - Risk: Auto-play restrictions in browsers (mitigated with user interaction modal)
- **Stripe:** Payment processing (Phase 2)
  - Status: Pending setup
  - Risk: FPX integration complexity (medium)
- **Vercel:** Hosting, deployment
  - Status: Active
  - Risk: Pricing changes at scale (monitor usage)

**Internal:**
- **Design Assets:** Couple name + date for OG images
  - Status: To be created per event (auto-generated)
  - Blocker: None
- **Affiliate IDs:** Shopee and Lazada affiliate program accounts
  - Status: **CRITICAL** - Need to register before launch
  - Blocker: Cannot convert links without affiliate IDs
  - Action: Register this week
- **Translation Files:** Malay and English translations for all UI text
  - Status: To be created Day 2
  - Blocker: None (can launch with English only if needed)
- **Terms of Service & Privacy Policy:** Legal pages
  - Status: To be drafted Week 1
  - Blocker: Required before accepting payments (not blocking MVP)

---

## 10. Additional Sections

### 10.1 Testing Strategy

**Unit Testing:**
- Test Convex mutations (RSVP validation, affiliate link conversion, claim/unclaim logic)
- Test Zustand stores (editor state updates)
- Use Convex's built-in testing framework
- Coverage goal: 70% for business logic

**Integration Testing:**
- Test auth flow (Google OAuth)
- Test real-time subscriptions (wishes update live)
- Test file upload flow (background, QR code)
- Use Playwright for E2E tests

**E2E Testing (Manual for MVP):**
- User flow: Sign up → Create event → Customize → Share link
- Guest flow: Open link → RSVP → Post wish → Claim item
- Co-manager flow: Accept invite → Edit event → See real-time updates
- Excel import flow: Upload file → Verify guests added

**Manual Testing Checklist:**
- [ ] Google OAuth works on all browsers (Chrome, Safari, Edge, Firefox)
- [ ] Mobile view works on iOS and Android
- [ ] Real-time updates work with 2 managers editing simultaneously
- [ ] RSVP deadline enforcement works (test with past date)
- [ ] Wishlist claim/unclaim is atomic (no double claims)
- [ ] Excel import handles malformed data gracefully
- [ ] All PostHog events fire correctly
- [ ] Sentry captures errors (test with intentional error)
- [ ] SEO meta tags appear correctly (check with Facebook debugger, Twitter card validator)
- [ ] Language switcher works on all pages
- [ ] YouTube music auto-plays and loops

### 10.2 Deployment Strategy

**Build Process:**
1. Push to GitHub (main branch)
2. Vercel auto-detects push
3. Runs `npm run build` (Next.js build)
4. Deploys to Vercel edge network
5. Convex schema and functions deployed via `npx convex deploy`

**Environment Configuration:**
- **Development:** `.env.local` (not committed)
  - CONVEX_DEPLOYMENT=dev:xxx
  - NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
  - BETTERAUTH_SECRET=xxx
  - GOOGLE_CLIENT_ID=xxx
  - GOOGLE_CLIENT_SECRET=xxx
  - POSTHOG_KEY=xxx (test project)
  - SENTRY_DSN=xxx (test project)

- **Production:** Vercel environment variables
  - CONVEX_DEPLOYMENT=prod:xxx
  - NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
  - BETTERAUTH_SECRET=xxx (different from dev)
  - GOOGLE_CLIENT_ID=xxx (production OAuth app)
  - GOOGLE_CLIENT_SECRET=xxx
  - POSTHOG_KEY=xxx (production project)
  - SENTRY_DSN=xxx (production project)
  - STRIPE_SECRET_KEY=xxx (Phase 2)

**Deployment Pipeline:**
- Push to `main` → Auto-deploy to production (Vercel)
- Push to `dev` → Auto-deploy to preview (Vercel preview URL)
- No staging environment for MVP (deploy directly to prod)

**Rollback Procedure:**
1. Detect issue via Sentry alerts
2. Revert commit on GitHub
3. Vercel auto-deploys previous version
4. If Convex schema change caused issue, manually rollback via Convex dashboard
5. Post-mortem: Document issue and prevention steps

### 10.3 Documentation Needs

**API Documentation:**
- Auto-generated from Convex schema (Convex dashboard docs)
- Internal doc: `/docs/api.md` with common mutations and queries
- Postman collection for testing (future)

**User Documentation:**
- Help center: `/help` page with FAQs
  - How to create event?
  - How to invite co-manager?
  - How to import guest list?
  - How to share invitation link?
  - How does wishlist affiliate work?
- Video tutorials (future): YouTube channel with walkthroughs

**Developer Onboarding Docs:**
- `/README.md`: Setup instructions, run locally
- `/CONTRIBUTING.md`: Code style, PR process
- `/docs/architecture.md`: High-level system overview (link to this PRD)
- `/docs/database-schema.md`: Convex schema reference
- `/docs/deployment.md`: Deployment process and env setup

---

## Appendix

### Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Jan 31, 2026 | Initial PRD created based on discovery session | Product Team |

### References
- **Convex Documentation:** https://docs.convex.dev
- **BetterAuth Documentation:** https://www.better-auth.com/docs
- **Next.js App Router Docs:** https://nextjs.org/docs
- **Shadcn/ui Components:** https://ui.shadcn.com
- **PostHog Documentation:** https://posthog.com/docs
- **Sentry Next.js Integration:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Competitor Analysis:**
  - https://kadkahwinmy.com/
  - https://www.kahwinnow.com/
  - https://jemputan.me/
  - https://thekahwin.my/

### Wireframe Notes
- Manager Dashboard: Sidebar navigation (Events, Builder, Guests, Wishlist, Settings)
- Builder: Split view (editor left, preview right)
- Guest Invitation: Single-page scroll (Hero → Info → RSVP → Wishes → Wishlist → Donation → Footer)
- Mobile-first design, 9:16 aspect ratio locked

### SEO Keywords to Target
- "kad kahwin digital Malaysia"
- "digital wedding invitation Malaysia"
- "jemputan kahwin online"
- "kad jemputan perkahwinan"
- "wedding invitation Malaysia"
- "e-invitation Malaysia"
- "kad kahwin online percuma" (for free tier marketing)

---

**END OF PRD**

**Next Steps:**
1. Review and approve PRD with stakeholders
2. Register Shopee and Lazada affiliate programs (CRITICAL)
3. Set up development environment (Convex, BetterAuth, Vercel)
4. Create design mockups for key screens
5. Draft Malay and English translations
6. Begin Day 1 development: Project setup and auth implementation
7. Daily standups to track 1-week MVP timeline

**Questions for Product Owner:**
- Confirm RM39 pricing strategy (how did we arrive at this number?)
- Do we have legal resources for Terms of Service and Privacy Policy?
- Who will create initial content for help center/FAQs?
- What's our marketing strategy for launch week?
- Do we have designer support for event invitation templates (Phase 2)?
