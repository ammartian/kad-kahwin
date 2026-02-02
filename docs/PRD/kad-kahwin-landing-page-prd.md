# Technical PRD: Kad Kahwin Landing Page

## Document Information
- **Product Name:** Kad Kahwin Landing Page
- **Version:** 1.0
- **Author:** ammartian.dev
- **Date:** February 1, 2026
- **Status:** Draft
- **Parent PRD:** Kad Kahwin - Digital Wedding Invitation Platform v1.0
- **Target Launch:** Week 1 (with MVP)

---

## 1. Executive Summary

### 1.1 Purpose
The Kad Kahwin landing page serves as the primary conversion funnel for the digital wedding invitation platform. It must clearly communicate the product's value proposition, demonstrate the user flow, and convert engaged couples into users through either waitlist signup (pre-launch) or direct login (post-launch).

### 1.2 Key Objectives
1. **Educate visitors** on what Kad Kahwin is, how it works, and why it's better than alternatives
2. **Drive conversions** via waitlist signup or login CTA
3. **Establish trust** through social proof and credibility indicators
4. **Reduce friction** by clearly demonstrating the complete user journey
5. **Differentiate** from competitors through modern, non-generic design

### 1.3 Success Metrics
- **Conversion Rate:** 15% of visitors sign up for waitlist or login
- **Time on Page:** Average 45+ seconds (indicates engagement)
- **Scroll Depth:** 70% of visitors scroll to "How It Works" section
- **Video/Demo Engagement:** 50% of visitors watch demo (if autoplay disabled)
- **Mobile Performance:** <2s load time on 4G connection
- **Bounce Rate:** <40%

### 1.4 Target Audience
- **Primary:** Engaged couples in Malaysia (25-35 years old)
- **Secondary:** Wedding planners looking for digital solutions
- **Tertiary:** Tech-savvy individuals planning events

### 1.5 Scope

**Included:**
- Full landing page with 10 distinct sections
- Responsive design (mobile-first, 9:16 aspect ratio priority)
- Advanced animations and micro-interactions
- Demo video/GIF showcasing platform flow
- Waitlist form with email validation
- FAQ accordion
- SEO optimization
- PostHog tracking for all sections
- Light mode only (no dark mode toggle)
- Multilingual landing page (Malay First, English option available)

**Excluded (Post-MVP):**
- Blog integration
- A/B testing variants
- Chat widget
- Testimonial submission form
- Wedding planning resource center

---

## 2. Page Structure & Content Strategy

### 2.1 Section Breakdown

| Section | Purpose | Key Elements | Priority |
|---------|---------|--------------|----------|
| 1. Hero | Capture attention, convey core value prop | Headline, subheadline, primary CTA, visual | Critical |
| 2. Social Proof | Build credibility immediately | Logo carousel, stats, trust badges | High |
| 3. Problem → Solution → Emotional Hook | Resonate with pain points, show solution | Three-column layout, transformation narrative | Critical |
| 4. Features | Detail capabilities | Grid, benefit-focused copy | High |
| 5. How It Works | Demonstrate flow | 3-step process, demo video/GIF | Critical |
| 6. Why You (Value Reinforcement) | Address objections, reinforce benefits | Comparison table, unique selling points | Medium |
| 7. Pricing/Offer | Transparency on cost | Pricing card, limited-time offer (if applicable) | High |
| 8. Secondary CTA | Catch users who scrolled past hero | Repeated signup form, different framing | Medium |
| 9. FAQ | Address common questions | Accordion, 8-10 questions | Medium |
| 10. Footer CTA | Final conversion opportunity | Minimalist CTA, footer links | Low |

---

## 3. Detailed Section Specifications

### Section 1: Hero

**Visual Layout:**
- **Desktop:** Split-screen layout (60% visual, 40% copy)
- **Mobile:** Stacked (copy above, visual below)
- **Height:** 100vh (full viewport)

**Copy Elements:**

**Headline (H1):**
```
"Jemputan Kahwin Yang Akan Diingati"
(Wedding Invitations Your Guests Will Remember)
```
*Alternative:* "Cipta Kad Kahwin Digital Dalam 5 Minit"

**Subheadline (H2):**
```
Platform digital untuk pasangan. Cipta, kongsi, dan urus jemputan 
kahwin dengan mudah.

(The digital platform for couples. Create, share, and manage 
wedding invitations with ease.)
```

**Primary CTA:**
- Pre-launch: "Sertai Senarai Tunggu" (Join Waitlist) → Opens modal
- Post-launch: "Cuba Percuma Sekarang" (Try Free Now) → Google OAuth

**Secondary CTA (Ghost Button):**
- "Tonton Demo 1 Minit" → Scrolls to How It Works OR opens demo modal

**Visual Elements:**
- Animated mockup of invitation on iPhone (9:16 aspect ratio)
- Parallax scrolling effect on background elements
- Floating UI components (RSVP card, wishlist item, wish bubble)
- Gradient mesh background (#FFEFC2 → #FFFFFF with subtle animation)

**Animation Sequence (entrance):**
1. Fade in headline (0.3s delay)
2. Slide up subheadline (0.5s delay)
3. Scale in CTAs (0.7s delay)
4. Float in phone mockup from right (0.9s delay)
5. Stagger floating UI components (1.2s, 1.4s, 1.6s)

**Technical Notes:**
- Use Framer Motion for orchestrated animations
- Implement scroll-triggered parallax with `transform: translateY()`
- Lazy load video/GIF to optimize LCP
- Ensure CTA buttons have `:hover` and `:active` states with micro-animations

---

### Section 2: Social Proof

**Layout:**
- Horizontal marquee/carousel (infinite loop)
- Logo lockup + 3 stat cards

**Content:**

**Stats (animated counters on scroll into view):**
```
"100+ Pasangan Berdaftar"
"5000+ Tetamu Telah RSVP"
```
*(These are projections for MVP launch; update with real data)*

**Trust Indicators:**
- "Dipercayai oleh pasangan di seluruh Malaysia"
- Placeholder for testimonial avatars (circular, overlapping)

**Animation:**
- Marquee scroll (CSS `@keyframes` infinite loop)
- Counter animation using Intersection Observer + easing function
- Subtle scale effect on stat cards on hover

**Design Notes:**
- Light gray background (#F9F9F9) to differentiate from hero
- Minimal padding (40px top/bottom) for speed
- Use `will-change: transform` for performance

---

### Section 3: Problem → Solution → Emotional Hook

**Layout:**
- Three-column grid (desktop), stacked (mobile)
- Each column: Icon → Headline → Body copy

**Column 1: Problem**

**Headline:** "Kad Kahwin Tradisional? Leceh."

**Body:**
```
Cetak ratusan kad, hantar satu-satu, kemas kini last-minute? 
Buang masa, buang duit, buang tenaga. Tetamu lupa bawa, 
terbuang dalam sampah.
```

**Custom illustration of stressed couple with stacks of cards

**Column 2: Solution**

**Headline:** "Kad Digital? Senang Gila."

**Body:**
```
Cipta dalam 5 minit, kongsi dengan satu link. Tetamu RSVP 
terus dari phone. Semua data dalam satu dashboard.
```

**Custom illustration of phone with invitation glowing

**Column 3: Emotional Hook**

**Headline:** "Majlis Yang Diingati, Tanpa Stress."

**Body:**
```
Fokus pada apa yang penting—celebrate your love. 
Biar Kad Kahwin handle logistics. More time for memories, 
less time for admin.
```

**Custom illustration of happy couple

**Animation:**
- Stagger reveal on scroll: Column 1 → Column 2 → Column 3 (0.2s intervals)
- Icon bounces slightly on reveal
- Subtle gradient shift on hover

**Design Notes:**
- Use accent color (#B43B8A) for headlines
- Body text in #333333, 18px, line-height 1.6
- 80px padding between columns

---

### Section 4: Features

**Layout:**
- 2x3 grid (desktop), stacked (mobile)
- Each card: Icon + Title + Description

**Feature Cards:**

**1. Builder Live Preview**
- **Icon:** 🎨
- **Title:** "Edit & Lihat Terus"
- **Description:** "Ubah warna, font, background—semua update real-time. No waiting, no guessing."

**2. Wishlist**
- **Icon:** 🎁
- **Title:** "Wishlist"
- **Description:** "Tetamu boleh pilih & beli hadiah dari Shopee/Lazada/Tiktok Shop. Tak dapat hadiah yang sama. Win-win."

**3. RSVP Management**
- **Icon:** ✅
- **Title:** "RSVP Tracking Auto"
- **Description:** "Tahu siapa datang, berapa orang, dietary preference. Export to Excel sekali click."

**4. Real-Time Wishes**
- **Icon:** 💬
- **Title:** "Wishes Chat Live"
- **Description:** "Tetamu ucap tahniah, you baca terus. Macam WhatsApp group, tapi prettier."

**5. Multi-Manager**
- **Icon:** 👰‍♀️🤵
- **Title:** "Bride & Groom Edit Together"
- **Description:** "Both can edit at same time. No more 'Sayang, you handle la' drama."

**6. Mobile-First**
- **Icon:** 📱
- **Title:** "Perfect Kat Phone"
- **Description:** "9:16 aspect ratio, optimized for Instagram story feel. Looks stunning on mobile."

**Animation:**
- Cards fade + slide up on scroll into view (stagger by 0.1s each)
- Hover: Lift shadow, subtle scale (1.02x)
- Icon rotates 360° on card hover

**Design Notes:**
- Card background: White with subtle shadow
- Border: 1px solid #E0E0E0
- Hover shadow: `0 8px 24px rgba(180, 59, 138, 0.15)`
- Icon size: 48px, primary color (#4EA712 or #B43B8A)

---

### Section 5: How It Works

**Layout:**
- Three-step process (horizontal timeline desktop, vertical mobile)
- Large demo video/GIF centered below timeline

**Step 1: Daftar & Customize**
- **Icon:** 1️⃣ or custom numbered badge
- **Title:** "Sign Up & Set Up"
- **Description:** "Login with Google, create event, pick your theme. 2 minutes max."
- **Visual cue:** Arrow pointing to next step

**Step 2: Isi Details & Wishlist**
- **Icon:** 2️⃣
- **Title:** "Add Details & Wishlist"
- **Description:** "Upload couple photo, add event info, create wishlist from Shopee/Lazada/Tiktok Shop."
- **Visual cue:** Arrow pointing to next step

**Step 3: Share & Manage**
- **Icon:** 3️⃣
- **Title:** "Share Link & Track RSVPs"
- **Description:** "Copy your custom link ([domain.com]/your-name), share via WhatsApp, watch RSVPs roll in."

**Demo Video/GIF Specifications:**
- **Duration:** 45-60 seconds
- **Content:** Screen recording showing:
  1. Login (5s)
  2. Builder UI with live preview (15s)
  3. Adding wishlist item with Shopee link (10s)
  4. Guest view: RSVP + Wish + Claim item (15s)
  5. Manager dashboard showing analytics (10s)
- **Format:** MP4 (H.264) or optimized GIF (<5MB)
- **Dimensions:** 1920x1080 (16:9) or 1080x1920 (9:16 for mobile)
- **Autoplay:** Muted autoplay on desktop, play button on mobile
- **Loop:** Infinite loop with subtle fade transition

**Animation:**
- Steps slide in from left on scroll
- Demo video fades in with slight zoom effect
- Timeline connectors draw in with SVG animation

**Design Notes:**
- Timeline background: Gradient line (#B43B8A → #4EA712)
- Active step: Glowing effect with pulsing animation
- Demo container: Subtle border with shadow, rounded corners

---

### Section 6: Why You (Value Reinforcement)

**Layout:**
- Split: Left (comparison table), Right (USP bullet points)

**Comparison Table:**

| Feature | Traditional Cards | Kad Kahwin |
|---------|-------------------|------------|
| Cost | RM500-2000 for printing | RM39 one-time |
| Time to create | 2-4 weeks | 5 minutes |
| Updates | Impossible after print | Edit anytime |
| RSVP tracking | Manual via calls/texts | Automatic dashboard |
| Eco-friendly | ❌ Paper waste | ✅ 100% digital |
| Wishlist tracking | ❌ | ✅ No duplicate gifts  |

**USP Bullet Points:**

**"Kenapa Kad Kahwin?"**
- ✅ **Save Time:** Focus on wedding prep, not admin
- ✅ **Save Money:** RM39 vs. RM2000 on cards
- ✅ **Eco-Friendly:** Zero paper, zero waste
- ✅ **Jana Income:** Affiliate commissions from wishlist
- ✅ **Real-Time Updates:** Change details anytime, guests see instantly
- ✅ **Data-Driven:** Know exactly who's coming, who's not

**Animation:**
- Table rows slide in from bottom on scroll
- Checkmarks pop in with bounce effect
- Hover on table rows: Highlight with accent color

**Design Notes:**
- Table header: #B43B8A background, white text
- Alternate row colors: #FFFFFF, #F9F9F9
- Checkmark color: #4EA712

---

### Section 7: Pricing/Offer

**Layout:**
- Centered pricing card (max-width 500px)
- Badge for limited-time offer (if applicable)

**Pricing Card Content:**

**Headline:** "Satu Harga, Semua Feature"

**Price Display:**
```
RM39
─────
One-time payment
Unlimited guests • Unlimited wishlist items • Unlimited wishes
```

**Features Included:**
- ✅ Custom URL ([domain]/your-name)
- ✅ Live preview builder
- ✅ RSVP management + analytics
- ✅ Real-time wishes feed
- ✅ Wishlist (Shopee/Lazada/Tiktok Shop)
- ✅ Multi-manager (bride + groom)
- ✅ Excel import/export
- ✅ Donation QR code
- ✅ Malay + English support
- ✅ Lifetime access (no monthly fees)

**CTA:** "Mula Sekarang" (Start Now)

**Limited-Time Badge (conditional):**
```
🎉 Early Bird: FREE for first 50 couples!
(Normally RM39)
```

**Animation:**
- Card entrance: Slide up + fade in
- Price number: Count-up animation
- CTA button: Pulsing glow effect
- Hover: Card lifts with shadow

**Design Notes:**
- Card background: White with gradient border (#B43B8A → #4EA712)
- Price font: Large (72px), bold, accent color
- Badge: Absolute positioned top-right, yellow background (#FFED18)

---

### Section 8: Secondary CTA

**Layout:**
- Full-width section, centered content, minimal design

**Content:**

**Headline:** "Ready untuk majlis yang unforgettable?"

**Subheadline:** "Join 100+ couples yang dah switch to digital."

**CTA Button:** "Daftar Sekarang—It's Free to Start"

**Visual:**
- Background: Gradient mesh (#FFEFC2 with animated subtle movement)
- Decorative elements: Floating abstract shapes (hearts, rings, flowers—subtle)

**Animation:**
- Headline types in letter-by-letter (typewriter effect)
- CTA button slides in from bottom with elastic easing
- Background gradient slowly shifts hues

**Design Notes:**
- Minimal padding (60px top/bottom)
- CTA button: Large (60px height), primary color, white text, shadow on hover
- Typewriter speed: 50ms per character

---

### Section 9: FAQ

**Layout:**
- Accordion (one question open at a time)
- Two-column layout desktop (4 questions each), single column mobile

**Questions & Answers:**

**Q1: Berapa lama ambil masa untuk setup?**
A: 5 minit je! Sign up dengan Google, pilih template, isi details, done. Kalau you nak customize lagi detail (warna, music, wishlist), boleh ambil 10-15 minit.

**Q2: Boleh tetamu RSVP tanpa account?**
A: Yes! Tetamu hanya perlu click link, isi form RSVP, done. No sign up required untuk guests.

**Q3: Macam mana wishlist work?**
A: You add wishlist items dari Shopee/Lazada/Tiktok Shop, our system track guest's options. Bila tetamu pilih, kita disable the item. No duplicated gifts!

**Q4: Boleh share link kat mana?**
A: Anywhere! WhatsApp, Instagram story, Facebook, email—wherever you want. Link is yours to share.

**Q5: Kalau tetamu takde smartphone?**
A: Link boleh bukak kat desktop juga. Design responsive, so it looks good everywhere. But realistically, 95% of Malaysians have smartphones now.

**Q6: Data tetamu secure tak?**
A: 100%. We use Convex (enterprise-grade database), HTTPS encryption, and follow Malaysian data protection standards. Your data is safe.

**Q7: Boleh refund?**
A: Since it's digital product and you get instant access, no refunds. But we have free preview/trial mode so you can test before paying.

**Q8: Bahasa apa available?**
A: Malay dan English. You boleh set default language, tetamu boleh switch kalau nak.

**Animation:**
- Accordion expand/collapse with smooth height transition (300ms)
- Icon rotates 180° when expanded (chevron down → up)
- Stagger reveal on scroll: Questions fade in one by one

**Design Notes:**
- Question text: Bold, 18px, #333333
- Answer text: Regular, 16px, #666666, line-height 1.6
- Border: 1px solid #E0E0E0 between questions
- Open state: Light background (#F9F9F9), accent color left border (4px)

---

### Section 10: Footer CTA

**Layout:**
- Minimal footer, centered content

**Content:**

**Headline:** "Jom, mula cipta kad kahwin impian you."

**CTA Button:** "Daftar Percuma"

**Footer Links:**
- Privacy Policy
- Terms of Service
- Contact Us
- Help Center

**Social Icons:**
- Instagram
- Facebook
- TikTok (if applicable)

**Copyright:**
```
© 2026 Kad Kahwin. Made with love in Malaysia.
```

**Animation:**
- CTA button: Gentle float animation (up and down 5px)
- Social icons: Scale up on hover
- Links: Underline slide-in effect on hover

**Design Notes:**
- Background: White
- Text: #666666
- Links: Refer global.css for styling.
- Footer height: 200px
- Social icons: 32px, accent color

---

## 4. Design System

### 4.1 Color Palette

**Primary Colors:**
Refer global.css for styling

**Semantic Colors:**
Refer global.css for styling

**Gradient Definitions:**
Refer global.css for styling and generate gradient from the colors.

### 4.2 Typography

**Recommended Font Pairings (5 options):**

**Option 1: Modern Editorial**
- **Display:** Fraunces (900 weight for headlines, 600 for subheadlines)
- **Body:** Inter (400 regular, 500 medium)
- **Accent:** DM Mono (for code-like elements, stats)
- **Vibe:** Sophisticated, magazine-quality, trustworthy

**Option 2: Playful Elegance**
- **Display:** Outfit (700 bold for headlines)
- **Body:** Plus Jakarta Sans (400 regular, 600 semibold)
- **Accent:** Space Grotesk (for stats, labels)
- **Vibe:** Modern, friendly, approachable

**Option 3: Bold & Confident**
- **Display:** Sora (800 extrabold for headlines)
- **Body:** Manrope (400 regular, 600 semibold)
- **Accent:** Lexend Deca (for UI elements)
- **Vibe:** Strong, contemporary, energetic

**Option 4: Warm & Inviting**
- **Display:** Bricolage Grotesque (700 bold)
- **Body:** Karla (400 regular, 500 medium)
- **Accent:** Rubik (for buttons, labels)
- **Vibe:** Friendly, approachable, human

**Option 5: Geometric Precision** (RECOMMENDED)
- **Display:** Poppins (700 bold for headlines, 600 semibold for subheadlines)
- **Body:** Nunito Sans (400 regular, 600 semibold)
- **Accent:** Montserrat (for stats, CTAs)
- **Vibe:** Clean, modern, Malaysian-friendly (works well with Malay and English)

**Type Scale:**
Refer global.css for styling

### 4.3 Spacing System
Refer global.css for styling

### 4.4 Animation Tokens

```css
--transition-fast: 200ms ease-out;
--transition-normal: 300ms ease-in-out;
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);

--animation-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--animation-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
```

**Common Animation Patterns:**
- **Fade In:** `opacity: 0 → 1` (300ms)
- **Slide Up:** `transform: translateY(40px) → translateY(0)` + fade in (500ms)
- **Scale In:** `transform: scale(0.9) → scale(1)` + fade in (400ms)
- **Stagger Delay:** 100-150ms between elements




## 5. Technical Implementation

### 5.1 Tech Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | Next.js 16 | SSR for SEO, React 19 for modern features |
| Styling | TailwindCSS 4 | Rapid development, consistency |
| Animations | Framer Motion | Declarative animations, scroll triggers |
| Video | React Player | Lazy loading, autoplay controls |
| Forms | React Hook Form + Zod | Validation, UX |
| Analytics | PostHog | Track section engagement |
| Hosting | Vercel | Edge network, optimized Next.js |

### 5.2 File Structure

```
/src
  /app
    /page.tsx                    # Landing page
    /layout.tsx                  # Root layout with fonts
    /api
      /waitlist
        /route.ts                # Waitlist form handler
  /components
    /landing
      /Hero.tsx
      /SocialProof.tsx
      /ProblemSolution.tsx
      /Features.tsx
      /HowItWorks.tsx
      /WhyYou.tsx
      /Pricing.tsx
      /SecondaryCTA.tsx
      /FAQ.tsx
      /FooterCTA.tsx
      /WaitlistModal.tsx
      /DemoVideo.tsx
    /ui
      /Button.tsx
      /Card.tsx
      /Input.tsx
      /Accordion.tsx
  /lib
    /animations.ts               # Framer Motion variants
    /fonts.ts                    # Google Fonts config
  /public
    /videos
      /demo.mp4
    /images
      /hero-mockup.png
      /feature-icons
```

### 5.3 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | <2.5s | Lazy load video, optimize images, preload fonts |
| FID (First Input Delay) | <100ms | Minimize JavaScript, defer non-critical scripts |
| CLS (Cumulative Layout Shift) | <0.1 | Define image/video dimensions, avoid layout shifts |
| Total Bundle Size | <300KB (gzipped) | Code splitting, tree shaking, dynamic imports |
| Time to Interactive | <3s | Critical CSS inline, defer analytics |

**Optimization Techniques:**
- Next.js Image component for all images
- MP4 video with poster image (lazy load)
- Font subsetting (only characters needed)
- Critical CSS extraction
- Preconnect to Google Fonts
- Debounced scroll listeners
- IntersectionObserver for lazy animations

### 5.4 SEO Configuration

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'Kad Kahwin - Digital Wedding Invitations Malaysia | Create in 5 Minutes',
  description: 'Modern digital wedding invitation platform for Malaysian couples. Create, share, and manage beautiful invitations with RSVP, wishlist, and real-time wishes. RM39 one-time.',
  keywords: 'kad kahwin digital, jemputan kahwin online, digital wedding invitation Malaysia, kad jemputan perkahwinan, e-invitation',
  openGraph: {
    title: 'Kad Kahwin - Wedding Invitations Your Guests Will Remember',
    description: 'Create stunning digital wedding invitations in 5 minutes. RSVP management, wishlist, real-time wishes. RM39 one-time.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kad Kahwin - Digital Wedding Invitations',
    description: 'Modern wedding invitations for modern couples. Create in 5 minutes.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://kadkahwin.my',
  },
}
```

**Structured Data (JSON-LD):**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Kad Kahwin",
  "applicationCategory": "WebApplication",
  "offers": {
    "@type": "Offer",
    "price": "39",
    "priceCurrency": "MYR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "100"
  }
}
```

### 5.5 Analytics Events

**PostHog Events to Track:**

| Event | Trigger | Properties |
|-------|---------|------------|
| `landing_page_viewed` | Page load | `referrer`, `device_type` |
| `hero_cta_clicked` | Primary CTA click | `button_text`, `section: "hero"` |
| `demo_video_played` | Video play | `section: "how_it_works"` |
| `demo_video_completed` | Video watched 90% | `duration_watched` |
| `section_viewed` | Section scroll into view | `section_name`, `scroll_depth` |
| `waitlist_form_opened` | Modal opened | `trigger: "hero" | "secondary_cta" | "footer"` |
| `waitlist_submitted` | Form submitted | `email_domain` |
| `faq_opened` | Accordion expanded | `question_number`, `question_text` |
| `pricing_cta_clicked` | CTA in pricing section | `plan: "one_time"` |
| `social_icon_clicked` | Social icon clicked | `platform` |
| `scroll_depth` | Scroll milestones | `25% | 50% | 75% | 100%` |

---

## 6. Responsive Design

### 6.1 Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Ultra-wide */
```

### 6.2 Mobile-Specific Adjustments

**Hero:**
- Stack layout (copy above, visual below)
- Reduce headline font size: 64px → 40px
- Reduce CTA padding: 16px 32px → 12px 24px
- Phone mockup: 80% viewport width, centered

**Features:**
- Grid: 2x3 → 1 column (stacked)
- Card padding: 32px → 20px
- Icon size: 48px → 40px

**How It Works:**
- Timeline: Horizontal → Vertical
- Demo video: Full width, 16:9 aspect ratio
- Remove arrows, use vertical connector lines

**Pricing:**
- Card max-width: 500px → 100% (with 20px padding)
- Font size: 72px → 56px

### 6.3 Touch Targets

- Minimum touch target: 48x48px
- CTA buttons: 60px height (mobile), 56px (desktop)
- Accordion headers: 64px min-height
- Social icons: 48x48px

---

## 7. Content Guidelines

### 7.1 Tone of Voice

**Brand Personality:**
- **Modern:** Use contemporary language, avoid overly formal Malay
- **Friendly:** Casual but respectful, use "you" instead of third person
- **Confident:** Direct statements, no hedging ("the best" not "one of the best")
- **Bilingual:** Mix Malay and English naturally (code-switching is common in Malaysia)
- **Playful:** Inject personality with emojis, colloquialisms ("gila", "kan")

**Examples:**

✅ Good: "Setup dalam 5 minit je. No kidding."
❌ Bad: "Our platform allows you to set up your invitation in approximately 5 minutes."

✅ Good: "Tetamu beli hadiah, you dapat duit. Win-win kan?"
❌ Bad: "When guests purchase gifts through affiliate links, you receive commission."

### 7.2 Copywriting Principles

**Headlines:**
- Start with emotional hook or pain point
- Use numbers when possible ("5 minit", "RM39")
- Keep under 10 words for scannability
- Make it about the user ("Your wedding", not "Our platform")

**Body Copy:**
- Short paragraphs (2-3 sentences max)
- Use active voice
- Benefit-focused (what user gets, not what product does)
- Conversational, not corporate

**CTAs:**
- Action-oriented verbs ("Mula", "Cuba", "Daftar")
- Create urgency without being pushy ("Sekarang", "Free to Start")
- Avoid generic "Learn More" or "Click Here"

### 7.3 Accessibility

**WCAG 2.1 AA Compliance:**
- Color contrast: 4.5:1 for body text, 3:1 for large text
- Alt text for all images
- Semantic HTML (proper heading hierarchy)
- Keyboard navigation support
- Focus indicators visible
- ARIA labels for interactive elements

**Screen Reader Considerations:**
- Skip to main content link
- Descriptive link text (no "click here")
- Image alt text describes function, not just appearance
- Form labels explicitly associated

---

## 8. Pre-Launch vs Post-Launch States

### 8.1 Pre-Launch (Waitlist Mode)

**Hero CTA:** "Sertai Senarai Tunggu"
**Modal Content:**
```
Waitlist Modal:
─────────────────
Headline: "Be the First to Create Your Kad Kahwin"

Body:
Kad Kahwin launching soon! Join the waitlist to get:
✅ Early access (before public launch)
✅ FREE for first 50 couples (worth RM39)
✅ Exclusive wedding planning tips

[Email Input]
[Button: "Daftar Sekarang"]

Fine print: "We'll email you when we launch. No spam, promise."
```

**Pricing Section:**
- Show "RM39" but add badge: "FREE for Early Birds"
- CTA: "Join Waitlist to Get Free Access"

**Social Proof:**
- Use waitlist numbers: "500+ couples on waitlist"

### 8.2 Post-Launch (Live Mode)

**Hero CTA:** "Cuba Percuma Sekarang"
**Action:** Direct to Google OAuth login

**Pricing Section:**
- Standard RM39 pricing
- CTA: "Start Creating Now"

**Social Proof:**
- Real stats: "100+ events created", "2,000+ guests RSVP'd"

### 8.3 Transition Plan

**Code Implementation:**
```typescript
// /lib/config.ts
export const APP_STATUS = process.env.NEXT_PUBLIC_APP_STATUS || 'waitlist'; // 'waitlist' | 'live'

// /components/Hero.tsx
const ctaConfig = {
  waitlist: {
    text: 'Sertai Senarai Tunggu',
    action: openWaitlistModal,
  },
  live: {
    text: 'Cuba Percuma Sekarang',
    action: redirectToLogin,
  },
};
```

**Environment Variable:**
```env
# .env.local (development - waitlist)
NEXT_PUBLIC_APP_STATUS=waitlist

# .env.production (will switch to 'live' on launch day)
NEXT_PUBLIC_APP_STATUS=live
```

---

## 9. Edge Cases & Error States

### 9.1 Waitlist Form

**Validation Errors:**
- Empty email: "Email diperlukan"
- Invalid format: "Sila masukkan email yang sah"
- Already submitted: "Email ini sudah berdaftar. Check your inbox!"

**Success State:**
```
Berjaya!
Your email (user@email.com) is on the list.

Watch your inbox—we'll email you when we launch.

[Button: "Close"]
```

**Error State (API failure):**
```
Oops, something went wrong.

Try again? If problem persists, email us at hello@kadkahwin.my

[Button: "Try Again"]
```

### 9.2 Video Player

**Fallback for browsers without autoplay:**
- Show play button overlay
- Click to play (unmuted on user interaction)

**Slow connection:**
- Show poster image with loading spinner
- "Loading video..." text

**Video load failure:**
- Display static mockup images instead
- Hide video player entirely, show carousel of screenshots

### 9.3 Browser Compatibility

**Minimum Supported:**
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

**Graceful Degradation:**
- No Framer Motion: Fall back to CSS transitions
- No IntersectionObserver: Show all content (no scroll animations)
- No native lazy loading: Use polyfill

---

## 10. Success Metrics & Iteration

### 10.1 A/B Testing Opportunities (Post-Launch)

**Variants to Test:**
1. **Hero Headline:**
   - A: "Jemputan Kahwin Yang Akan Diingati"
   - B: "Cipta Kad Kahwin Digital Dalam 5 Minit"

2. **CTA Text:**
   - A: "Daftar Percuma"
   - B: "Cuba Sekarang—It's Free"
   - C: "Mula Cipta Kad Anda"

3. **Pricing Position:**
   - A: Section 7 (current)
   - B: Section 4 (earlier in funnel)

4. **Demo Video:**
   - A: Autoplay muted
   - B: Play button (user-initiated)

### 10.2 Monitoring & Iteration Plan

**Week 1-2:**
- Monitor scroll depth (target: 70% reach "How It Works")
- Track CTA click-through rate (target: 15%)
- Analyze video completion rate (target: 50%)
- Check mobile load time (<2s)

**Week 3-4:**
- A/B test hero headline if conversion <10%
- Optimize slow sections (based on heatmaps)
- Add testimonials if social proof is weak

**Month 2:**
- Add blog section for SEO
- Implement chatbot if FAQ engagement is low
- Consider video testimonials

### 10.3 Heatmap Analysis

**Tools:** Microsoft Clarity or Hotjar

**What to Track:**
- Click patterns on CTAs
- Scroll depth per section
- Mouse movement (attention areas)
- Rage clicks (frustration indicators)

**Action Items Based on Data:**
- If users don't scroll to "How It Works": Move demo video higher
- If FAQ has low engagement: Highlight top 3 questions
- If pricing section has high drop-off: Adjust pricing or add guarantees

---

## 11. Development Checklist

### 11.1 Phase 1: Setup (Day 1)

- [ ] Initialize Next.js 16 project
- [ ] Configure TailwindCSS 4
- [ ] Install Framer Motion
- [ ] Set up Google Fonts (Poppins, Nunito Sans, Montserrat)
- [ ] Create color/spacing/typography tokens
- [ ] Set up PostHog
- [ ] Configure SEO metadata
- [ ] Set up environment variables (APP_STATUS)

### 11.2 Phase 2: Core Sections (Day 2-3)

- [ ] Build Hero section with animations
- [ ] Implement Social Proof marquee
- [ ] Create Problem-Solution-Emotional Hook layout
- [ ] Build Features grid with cards
- [ ] Implement How It Works timeline
- [ ] Create demo video player component
- [ ] Build Why You section (table + USPs)

### 11.3 Phase 3: Conversion Points (Day 4)

- [ ] Build Pricing card
- [ ] Implement waitlist modal
- [ ] Create Secondary CTA section
- [ ] Build FAQ accordion
- [ ] Implement Footer CTA
- [ ] Add form validation (React Hook Form + Zod)
- [ ] Set up waitlist API route (Convex mutation)

### 11.4 Phase 4: Polish (Day 5)

- [ ] Add scroll-triggered animations (Framer Motion)
- [ ] Implement parallax effects
- [ ] Add micro-interactions (hover states, focus states)
- [ ] Optimize images (Next.js Image)
- [ ] Test video lazy loading
- [ ] Add loading states
- [ ] Implement error boundaries

### 11.5 Phase 5: Testing & Launch (Day 6-7)

- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile responsiveness testing (iOS, Android)
- [ ] Lighthouse audit (target: 90+ performance)
- [ ] Accessibility audit (WAVE, axe DevTools)
- [ ] Test all CTAs and forms
- [ ] Verify PostHog events firing
- [ ] Test waitlist flow end-to-end
- [ ] Deploy to Vercel
- [ ] Set up custom domain
- [ ] Submit sitemap to Google Search Console

---

## 12. Open Questions & Decisions

| Question | Options | Decision Deadline | Owner |
|----------|---------|-------------------|-------|
| Should demo video be autoplay or click-to-play? | Autoplay (muted) / Click-to-play | Day 2 | Product |
| Use real demo video or GIF? | MP4 (better quality) / GIF (simpler) | Day 3 | Product |
| Include testimonials in MVP? | Yes / No (wait for real users) | Day 2 | Product |
| Limited-time free offer for first 50? | Yes / No | Day 1 | Business |
| Which font pairing to use? | Option 5 (Poppins + Nunito) / Other | Day 1 | Design |
| Should FAQ be on landing page or separate? | Same page / Separate /help page | Day 2 | Product |
| Include blog section in MVP footer? | Yes / No (post-launch) | Day 3 | Marketing |

---

## 13. Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Video file too large (slow load) | Medium | High | Compress to <5MB, use poster image, lazy load |
| Animations cause jank on low-end devices | Medium | Medium | Use `will-change`, test on throttled CPU |
| Waitlist form spam submissions | High | Low | Add honeypot field, rate limiting |
| Users don't scroll past hero | Medium | High | Strong scroll indicator, compelling value prop |
| Mobile load time >3s | Low | High | Optimize fonts, defer analytics, critical CSS |
| Browser compatibility issues (Safari) | Low | Medium | Test early, polyfills for unsupported features |

---

## 14. Post-Launch Roadmap

### 14.1 Month 1
- [ ] Add real user testimonials (collect via form)
- [ ] Create 3 blog posts for SEO ("Best Wedding Invitation Malaysia", "Digital vs Traditional Kad Kahwin", "Wedding Planning Tips")
- [ ] Implement A/B testing for hero CTA
- [ ] Add Instagram feed integration (if social presence established)

### 14.2 Month 2
- [ ] Build "Gallery" section (showcase beautiful user-created invitations)
- [ ] Add video testimonials
- [ ] Implement live chat widget (Intercom/Tawk.to)
- [ ] Create comparison page vs competitors

### 14.3 Month 3
- [ ] Launch referral program ("Invite friends, get RM10 credit")
- [ ] Add "Wedding Vendor Directory" section (monetization)
- [ ] Build resource center (downloadable checklists, guides)

---

## Appendix

### A. Wireframe Descriptions

**Hero Section:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  [LOGO]                    [Login] [Daftar]│
│                                             │
│  Jemputan Kahwin Yang     ┌──────────────┐ │
│  Akan Diingati            │              │ │
│                           │  Phone       │ │
│  Platform digital untuk   │  Mockup      │ │
│  pasangan moden...        │  (animated)  │ │
│                           │              │ │
│  [Daftar Sekarang]        └──────────────┘ │
│  [Tonton Demo]                             │
│                                             │
│  ↓ (scroll indicator)                      │
└─────────────────────────────────────────────┘
```

**Features Section:**
```
┌─────────────────────────────────────────────┐
│           Apa Yang You Dapat?               │
│                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐             │
│  │ 🎨   │  │ 🎁   │  │ ✅   │             │
│  │Edit &│  │Wish  │  │RSVP  │             │
│  │Lihat │  │list  │  │Track │             │
│  └──────┘  └──────┘  └──────┘             │
│                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐             │
│  │ 💬   │  │👰🤵 │  │ 📱   │             │
│  │Live  │  │Multi │  │Mobile│             │
│  │Wishes│  │Mgr   │  │First │             │
│  └──────┘  └──────┘  └──────┘             │
└─────────────────────────────────────────────┘
```

### B. Demo Video Script

**Duration:** 60 seconds

**Scene 1 (0-5s):** "Meet Sarah & Ahmad. Getting married in 3 months."
- Show couple photo, calendar circled date

**Scene 2 (5-15s):** "They used Kad Kahwin to create their invitation."
- Screen recording: Login with Google → Event creation form → Submit

**Scene 3 (15-30s):** "Customize everything in real-time."
- Builder UI: Change background color → Upload couple photo → Add music → Live preview updates

**Scene 4 (30-40s):** "Guests RSVP, leave wishes, and claim gifts."
- Guest view on phone: RSVP form → Submit → Wishes feed → Wishlist (claim item)

**Scene 5 (40-55s):** "Sarah & Ahmad see everything in one dashboard."
- Dashboard: RSVP analytics (150 attending), wishes feed scrolling, wishlist with claimed items

**Scene 6 (55-60s):** "Your turn. Create your kad kahwin in 5 minutes."
- Logo + CTA button "Mula Sekarang"

### C. Reference Links

**Design Inspiration:**
- Stripe.com (clean, modern)
- Linear.app (bold typography, smooth animations)
- Framer.com (advanced animations, gradient meshes)
- Webflow.com (scroll-triggered interactions)

**Animation Libraries:**
- Framer Motion: https://www.framer.com/motion/
- GSAP (if Framer Motion is insufficient): https://greensock.com/gsap/

**Performance Tools:**
- Lighthouse: https://web.dev/lighthouse/
- WebPageTest: https://www.webpagetest.org/

---

**END OF LANDING PAGE PRD**

**Next Steps:**
1. Review and approve design direction (font choice, color usage)
2. Confirm APP_STATUS strategy (waitlist vs live)
3. Create demo video (outsource or DIY with screen recording)
4. Write final copy for all sections (get stakeholder approval)
5. Begin development (target: 7 days to launch)
6. Set up PostHog events
7. Prepare marketing assets (OG images, social posts)

**Questions for Stakeholders:**
- Do we have budget for demo video production or DIY?
- Who will write Malay translations? (Important for authenticity)
- What's our launch date target? (Affects urgency messaging)
- Do we want to collect phone numbers in waitlist or just email?
- Any legal review needed for "Free for first 50 couples" claim?
  
