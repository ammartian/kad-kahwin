---
name: Jemputan Digital
description: Digital wedding invitation platform for Malaysian couples. RM39, one-time.
colors:
  celebration-magenta: "#C52F8E"
  celebration-magenta-dark: "#E040A8"
  soft-linen: "#F8F7F9"
  near-black: "#000000"
  card-white: "#FFFFFF"
  lavender-mist: "#8B79AB"
  lavender-mist-soft: "#8784A1"
  blush-pink: "#E0C6C8"
  dark-plum: "#311442"
  warm-midnight: "#3C2030"
  mint-accent: "#45C379"
  input-field: "#E8EDF2"
  muted-surface: "#F4F1F5"
  destructive: "#D95C5C"
typography:
  display:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Nunito Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "22px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.celebration-magenta}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "#b02880"
    textColor: "{colors.card-white}"
    rounded: "{rounded.pill}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.lavender-mist}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-ghost-hover:
    textColor: "{colors.celebration-magenta}"
  card-base:
    backgroundColor: "{colors.card-white}"
    rounded: "{rounded.2xl}"
    padding: "28px"
  card-feature-hero:
    backgroundColor: "#fdf5fb"
    rounded: "{rounded.2xl}"
    padding: "32px"
  input-base:
    backgroundColor: "transparent"
    textColor: "{colors.near-black}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: Jemputan Digital

## 1. Overview

**Creative North Star: "The Modern Kad Kahwin"**

The printed wedding card, reborn as software. Every decision in this system should be legible to a Mak Cik opening a WhatsApp link on a Samsung Galaxy A-series. The system does not reach for decoration. It is beautiful because it works — because a couple can get from zero to shareable link in five minutes, and because every guest, at every age, can RSVP without needing instructions.

This is a celebratory product, but the chrome is restrained. Celebration lives in the couple's content — their names, their date, their photos — not in the interface scaffolding around it. The system's job is to get out of the way and let the invitation breathe.

The color vocabulary is warm but not sweet. The typography is confident but not formal. The spacing breathes without being sparse. The system explicitly rejects: SaaS-template blue-and-cream, clipart wedding kitsch, and clinical Scandinavian whiteness. It is none of those things. It is the invitation itself.

**Key Characteristics:**
- Celebration Magenta as the single load-bearing accent — rare, purposeful, never decorative
- Soft Linen background that reads as "invitation paper" without literally being paper
- Rounded and unhurried shapes — all tap targets generous, no sharp edges
- Framer Motion stagger reveals on scroll, never idle looping decoration
- Two-font system: Poppins for identity, Nunito Sans for readability
- Light mode primary; dark mode is a deep plum that extends the brand hue into darkness

## 2. Colors: The Invitation Palette

A Committed strategy: Celebration Magenta carries 30–50% of the brand surface. Neutrals are tinted lavender so nothing reads as cold or neutral.

### Primary
- **Celebration Magenta** (`#C52F8E` / oklch(51% 0.26 340)): The single load-bearing brand color. Used for primary CTAs, focus rings, active states, section labels, and primary text emphasis. In dark mode, shifts to Vivid Magenta (`#E040A8`, oklch(58% 0.29 335)) to maintain contrast against the dark plum background.

### Secondary
- **Lavender Mist** (`#8B79AB` / oklch(55% 0.09 300)): Muted primary-adjacent purple. Used for borders, muted foreground text, secondary labels, and the icon layer in supporting feature cards. Provides visual kinship with Celebration Magenta without competing.
- **Lavender Mist Soft** (`#8784A1`): A slightly desaturated variant used for secondary text elements and subtle dividers.

### Tertiary
- **Blush Pink** (`#E0C6C8` / oklch(82% 0.04 15)): Warm rose accent. Used in chart-2, photo carousel overlays, and subtle gradient helpers in the mockup. Not used for interactive elements.
- **Mint Accent** (`#45C379`, dark mode only): Vivid green used as the dark-mode accent replacement for blush. Provides warmth-contrast against the deep plum background.

### Neutral
- **Soft Linen** (`#F8F7F9` / oklch(97% 0.006 300)): Page background. A warm off-white with a barely-perceptible lavender cast. Never pure white — the slight warmth keeps the page from reading as clinical.
- **Near Black** (`#000000`): Foreground text in light mode. In dark mode, all text uses `#F3F1F3` (a warm off-white foreground) rather than pure white.
- **Muted Surface** (`#F4F1F5`): Secondary backgrounds — section alternation, sidebar, muted containers.
- **Card White** (`#FFFFFF`): Card surfaces that sit above the Soft Linen background.
- **Dark Plum** (`#311442` / oklch(20% 0.12 305)): Dark mode background. Not black; maintains the brand hue family in deep darkness.
- **Warm Midnight** (`#3C2030`): Dark mode card surface.
- **Input Field** (`#E8EDF2`): Light cool-grey input background. Slightly cooler than the page background to visually separate data-entry fields.
- **Destructive** (`#D95C5C`): Error states only. Never used decoratively.

### Named Rules
**The One Voice Rule.** Celebration Magenta appears on ≤40% of any given screen. Use it for the CTA, the focus ring, and one emphasis word per section header. Using it everywhere collapses the accent into wallpaper.

**The Warm Tint Rule.** No surface is pure neutral. Every background — Soft Linen, Muted Surface, Dark Plum, Warm Midnight — is tinted toward the brand hue. A stark-neutral surface signals the wrong product.

## 3. Typography

**Display Font:** Poppins (weights 400-800, Google Fonts)
**Body Font:** Nunito Sans (weights 400-700, Google Fonts)
**Available accent:** Montserrat (available, use sparingly for numeric data or callouts)
**Landing decorative:** Pavanam (weight 400, reserve for special invitation-register moments)

**Character:** Poppins is structured and confident — the voice of the brand. Nunito Sans is legible and warm — the voice of the product. Together they handle the full register from hero headlines to form labels without reaching for a third family.

### Hierarchy
- **Display** (extrabold 800, `clamp(2.4rem, 5.5vw, 3.8rem)`, lh 1.15, tracking −0.03em): Hero headline only. One instance per page.
- **Headline** (extrabold 800, `clamp(1.8rem, 3vw, 2.6rem)`, lh 1.2, tracking −0.025em): Section headings (H2). One per section. May contain a `text-primary` em span for the key word.
- **Title** (bold 700, `1.1rem`, lh 1.4): Card titles, feature headings, step titles. Poppins.
- **Body** (regular 400, `1rem`–`1.05rem`, lh 1.7, max 65ch): Prose content. Nunito Sans. Cap at 65-75ch. Never Poppins for body paragraphs.
- **Label** (semibold 600, `0.72rem`, tracking +0.1em, uppercase): Section eyebrow labels in Celebration Magenta. Poppins. All-caps only at this size.

### Named Rules
**The Section Label Rule.** Every section eyebrow label follows: Poppins semibold, 0.72rem, tracking +0.1em, uppercase, text-primary. This is a deliberate repetition — it orients the user across sections. Do not vary this pattern per section.

**The One Em Rule.** Each H2 headline gets at most one `<em className="not-italic text-primary">` span wrapping the single most important word. Never wrap multiple words; never nest a gradient inside it. Solid Celebration Magenta only.

## 4. Elevation

Flat by default; tinted shadows on state. No decorative shadows at rest. Depth is primarily expressed through background color contrast (Card White above Soft Linen, Muted Surface as tertiary layer) rather than shadow.

Shadows appear in two contexts: (1) interactive state — hover on cards and float panels triggers a brand-tinted glow, and (2) fixed chrome — the navbar uses `shadow-sm` to separate from page content while scrolling.

### Shadow Vocabulary
- **Ambient** (`1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)`): Default card shadow. Barely perceptible. Never a feature.
- **Brand hover glow** (`0 16px 40px rgba(197,47,142,0.10)`): Feature card on hover. Brand-tinted diffuse glow. Used on both hero and supporting feature cards.
- **CTA glow** (`0 8px 24px rgba(197,47,142,0.3)`): Primary button shadow. Makes the CTA lift off the page.
- **Float card** (`0 8px 24px rgba(0,0,0,0.1)`): The phone mockup's floating metric cards. Clean shadow, no tint — these float above everything.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, active, fixed chrome). A resting card with a heavy shadow signals the wrong register — this is not a material-depth system.

## 5. Components

*Rounded and unhurried: generous curves at every tap target, no sharp edges.*

### Buttons
- **Shape:** Pill (border-radius 9999px) for landing/brand CTAs; Gently curved (8px) for product UI (dashboard, builder forms).
- **Primary:** Celebration Magenta background (`#C52F8E`), white text, `h-[50px] px-8` for landing size / `h-10 px-6` for product size. CTA glow shadow (`0 8px 24px rgba(197,47,142,0.3)`) on brand surfaces.
- **Hover/Focus:** Background 90% opacity (`#C52F8E/90`). Focus ring: 3px solid `ring/50` at 50% opacity, offset-none.
- **Ghost:** Transparent background, Lavender Mist text. Hover: text shifts to Celebration Magenta. No border, no background fill. Used as secondary CTA alongside primary.
- **Destructive:** Destructive red (`#D95C5C`), white text.

### Cards / Containers
- **Base card:** Card White background, `rounded-2xl` (18px), `border border-primary/[0.12]` (very subtle brand-tinted border), `shadow-sm` (ambient). Internal padding 28px.
- **Hero feature card:** `bg-primary/[0.04]` (barely-tinted background), `border-primary/[0.2]` (slightly stronger border), `rounded-2xl`, padding 32px. Larger emoji (2rem), larger title (1.1rem).
- **Supporting feature card:** `bg-background` (Soft Linen), `border-primary/[0.1]`, `rounded-2xl`, padding 24px. Compact emoji (1.3rem), title 0.9rem.
- **Hover state (all cards):** y-translate −4px, brand hover glow shadow. Never border-left stripe accents.

### Inputs / Fields
- **Style:** Transparent background above Input Field background (`#E8EDF2`), `border-input`, `rounded-md` (8px), `h-9 px-3 py-1`.
- **Focus:** 3px ring in Celebration Magenta at 50% opacity (`ring-ring/50`). Border shifts to ring color.
- **Error:** Border and ring shift to Destructive (`#D95C5C`). Ring at 20% opacity.
- **Disabled:** 50% opacity, pointer-events none.

### Navigation
- **Desktop navbar:** Fixed, `bg-background/80 backdrop-blur-lg border-b shadow-sm`. Logo left. Section links center-right (Lavender Mist text, hover to Near Black). CTA pill-button right. Language toggle right of CTA.
- **Mobile:** Hamburger menu icon. Dropdown panel `bg-background/95 backdrop-blur-lg`. CTA full-width pill. Language toggle centered.
- **Active/hover link state:** Text shifts from Lavender Mist to Near Black on hover. No underlines. No active indicator beyond color.

### Section Label Chips
- **Style:** `inline-flex items-center gap-1.5`, Poppins semibold 0.72rem, uppercase, tracking +0.1em, `text-primary`. Optional leading `✦` character at 0.6rem. No background, no border. This is a text element, not a chip.

### Phone Mockup (Signature Component)
- `w-[200px] h-[360px]`, `rounded-[32px]`, border `8px solid #e8e0f0`, large brand-tinted drop shadow (`0 32px 80px rgba(197,47,142,0.15)`).
- Interior: light pink gradient (`linear-gradient(160deg, #fff5fa 0%, #fce8f3 40%, #f0e0f8 100%)`).
- Float cards: white `rounded-2xl`, `px-3.5 py-2.5`, subtle drop shadow. Animated with a gentle y-float (0 to −10 to 0, 4-5s, easeInOut).

## 6. Do's and Don'ts

### Do:
- **Do** use Celebration Magenta for CTAs, focus rings, active section labels, and one em-span per section headline. That's its full domain.
- **Do** keep cards flat at rest. Let the brand hover glow appear only on hover.
- **Do** use Poppins for all headings, CTAs, and labels. Use Nunito Sans for all body paragraphs and descriptions.
- **Do** apply `rounded-full` (pill) to all brand-surface CTAs. Apply `rounded-md` (8px) to product-UI buttons in the dashboard and builder.
- **Do** tint every surface toward the brand hue: Soft Linen, not pure white; Dark Plum, not `#000`.
- **Do** cap body copy at 65-75ch. Long line lengths collapse on mobile and hurt legibility for users reading in Malay.
- **Do** use the section label pattern consistently: Poppins semibold 0.72rem uppercase tracking+0.1em in Celebration Magenta, followed by the H2 headline.
- **Do** animate with Framer Motion `easeOut` on scroll-reveal. Stagger children at 0.1s intervals. Keep entrance durations at 0.4-0.6s.

### Don't:
- **Don't** use `background-clip: text` with a gradient on any text. Ever. This is an absolute ban — it is the single fastest way to make the page read as AI-generated. Replace with solid `text-primary`.
- **Don't** add animated background blobs (`motion.div` with `blur-[60px] rounded-full animate-float`). The static radial gradient is sufficient atmospheric warmth without the performance cost or the AI-generated tell.
- **Don't** make this look like a generic SaaS product. No cream (`#fafaf5`) backgrounds with Inter font and a blue CTA. That is the product being replaced.
- **Don't** make this look like a tacky Malaysian wedding portal. No glitter, no garish layered gradients, no clipart roses, no Comic Sans. The old-generation aesthetic is the anti-reference, not the reference.
- **Don't** go cold/clinical minimalist. Scandinavian whitespace with zero warmth is wrong for a celebratory product. Every surface must feel alive.
- **Don't** use identical card grids. All same-sized icon+heading+text cards is a banned pattern. Use the 2-tier (hero/supporting) layout where hierarchy matters.
- **Don't** stack urgency signals in pricing: not crossed-out price + percentage badge + corner badge + promo note simultaneously. One signal is persuasion; four is anxiety.
- **Don't** use `border-left` as a colored stripe accent on cards or callouts. Use full borders, background tints, or nothing.
- **Don't** use `font-landing` (Pavanam) or `font-accent` (Montserrat) on general UI — they are reserved for special moments in the invitation-builder and decorative sections, not product chrome.
- **Don't** animate layout properties (height, width, padding). Use transform and opacity only.
