# Top Notch Doors & Windows — Master Component Spec

Single-page Elementor (WordPress) site. Length ~7,984px desktop. 8 main sections + header + footer.

## Global tokens (extracted from `getComputedStyle` on the live site)

- **Brand blue:** `#004AAD` (buttons, top utility bar, all primary CTAs)
- **Ink:** `#1D1D1D` (primary headings)  /  `#4D4D4D` (secondary)  /  `#7A7A7A` (body text)
- **Muted heading color (kicker labels):** `#101010`
- **Background:** `#FFFFFF`
- **Fonts:**
  - Headings: **Bebas Neue** (`var(--font-bebas)`), weight 400/500, **uppercase**
  - Body: **Roboto** (`var(--font-roboto)`), weight 400/500
  - Accent / serif (sparingly): **Roboto Slab** (`var(--font-roboto-slab)`)
- **Buttons (primary):** bg `#004AAD`, color white, **no border-radius**, padding `15px 30px`, font Roboto 500 16/26, NOT uppercase. Hover: darken to `#003a87`.
- **Container max-width:** ~1240px, horizontal padding `50px` desktop / `20px` mobile.

## Typography measurements (computed)
- H1 (hero): Bebas Neue 500, **75px / 75px line-height**, white, uppercase
- H4 (card titles): Bebas Neue 500, **24px**, color `#1D1D1D`, NOT uppercase
- H2 small kickers ("our wide range of services" etc.): Bebas Neue 500, **20px**, uppercase, color `#101010`
- Body p: Roboto 400, 16px, color `#7A7A7A`

## Section topology (top → bottom; heights from live site at 1440w)

| # | Section | Height | Notes |
|---|---|---|---|
| 0 | **Header** (sticky) | 136px | Two stacked bars |
| 1 | Hero | 718px | Bebas headline + button, photo bg slideshow |
| 2 | Counters strip | 145px | 3 stat columns "0+ Projects Completed" etc. |
| 3 | About | 809px | Image left + copy right |
| 4 | Services grid | 2790px | ~16 cards across categories, no tabs — flat grid by category |
| 5 | CTA banner | 496px | "Schedule your free consultation today." + 2 buttons |
| 6 | Testimonials | 713px | 3 testimonial cards |
| 7 | FAQ accordion | 729px | 7 questions |
| 8 | Contact + form | 806px | Heading + form |
| 9 | **Footer** | 741px | Multi-column links + copyright |

---

## SECTION 0 — Header

Two stacked bars, sticky to top.

### Top utility bar
- bg `#004AAD`, color white, height ~36px, font Roboto 14
- Right-aligned content, container max 1240px, justify-end, gap ~32px
- Item 1: `<MapPinIcon>` + "Serving Florida & New York"
- Item 2: `<PhoneIcon>` + `(954) 932-0764` (tel link)

### Main nav
- bg white, height ~100px, container max 1240px, flex justify-between items-center
- Left: logo image (`/images/logo.png`, ~180px wide, h auto)
- Right: nav menu, gap ~36px, font Roboto 500 16, uppercase, color `#1D1D1D`
- Items: SERVICES ▾, LOCATIONS ▾, ABOUT US, CONTACT US, BLOG
- Caret on dropdown items (`<ChevronDownIcon>`)
- Hover: color → `#004AAD`
- Whole header sticky (`position: sticky; top: 0; z-index: 50;`), white bg, subtle shadow on scroll

---

## SECTION 1 — Hero

- Full-bleed background image: alternates between `/images/hero-banner-1.jpg` and `/images/hero-banner-2.jpg`. **Implement as a CSS cross-fade slideshow** every ~5s. Background-size: cover, position center.
- Dark overlay: `rgba(0,0,0,0.45)` (so white text is readable)
- Min-height: ~640px desktop / 540 mobile, container left-aligned content
- Inner container max ~1240, items left-aligned, vertical center
- Content stack:
  - Kicker: "FAST, RELIABLE, AFFORDABLE" — Bebas Neue 18px uppercase white, with a 60px white horizontal divider line to its right (use a flex row: `<span>label</span><span class="h-px w-16 bg-white" />`)
  - H1: "#1 IN DOOR REPAIR & WINDOW REPAIR SOLUTIONS" — Bebas Neue 75/75 white, uppercase, max-width ~900px
  - p: "We specialize in all types of door and window services including installation, repair, replacement, and custom solutions." — Roboto 18 white/90, max-w 700px
  - Buttons row: `(954) 932-0764` (white outline button — 2px white border, transparent bg, white text, hover fill white/text brand) + `FREE ESTIMATE` (solid brand `#004AAD` button, no radius)

---

## SECTION 2 — Counters strip

White bg, ~145px tall, container max 1240px, padding y 32, 3 columns equal-width separated by `1px solid #E5E5E5` vertical dividers.

Each column = 2 stacked elements, centered:
- Number: Bebas Neue 60px, color `#004AAD`
- Label: Roboto 500 14, uppercase, letter-spacing 0.06em, color `#1D1D1D`

Items (per WebFetch — "0+", "0%", "0+"):
1. `0+`  PROJECTS COMPLETED
2. `0%`  REFERRAL RATE
3. `0+`  YEARS DELIVERING QUALITY

---

## SECTION 3 — About

- White bg, container max 1240, py 80, grid 2-cols (5/7 split desktop), gap 64
- **Left column:** image `/images/about.png`, full width of column, no border, no rounded corners (it's a transparent PNG with a stylized door)
- **Right column:**
  - Kicker H2: "ABOUT US" — Bebas Neue 20 uppercase `#101010`, with a 40px brand-blue divider underneath
  - H3: "Discover Unmatched Door Solutions at Top Notch Doors & Windows" — Bebas Neue 48/48 uppercase `#1D1D1D`
  - p: about copy (use full text from spec below) — Roboto 16/28 `#7A7A7A`
  - Button: "KNOW MORE ABOUT US" — primary brand button (no radius)

About text (verbatim):
> At Top Notch Doors & Windows, we are dedicated to providing affordable, high-quality service for all your door and window needs. Whether it's installation, repair, or maintenance, our team ensures every project is completed with the highest standards of craftsmanship and customer care. We offer warranties and free estimates for every service we provide, so you can have peace of mind knowing you're getting the best value. Simply give us a call at (954) 932-0764 to get started and experience the Top Notch difference!

Mobile: stack to single column, image above text.

---

## SECTION 4 — Services grid

- Bg: very light gray `#F5F5F5`, py 96
- Container max 1240
- Header block (centered):
  - Kicker: "OUR WIDE RANGE OF SERVICES" — Bebas 20 uppercase `#101010`
  - Title: "Our Services" — Bebas 56/56 uppercase `#1D1D1D`
  - Intro paragraph: full Roboto 16/28 `#7A7A7A`, max-w 900, mx-auto, mb 64
- **Grid:** flat 4-column grid on desktop, 2-col tablet, 1-col mobile, gap 24
- **Order**: render `ALL_SERVICES` from `site-data.ts` in flat order (16 cards total)
- **Service card:**
  - bg white, no border, subtle shadow `0 4px 16px rgba(0,0,0,0.05)`
  - Image: aspect ratio 3/2, object-cover, full width
  - Padding: 24
  - Title H4: Bebas Neue 24 `#1D1D1D`
  - Beneath title: small "READ MORE →" link, Roboto 500 13 uppercase `#004AAD`, with `<ArrowRightIcon className="h-3 w-3" />`
  - Hover: image scales to 1.05 (overflow hidden on wrapper), shadow lifts

---

## SECTION 5 — CTA banner

- Full-bleed background using `/images/hero-banner-2.jpg` with overlay `rgba(0, 74, 173, 0.85)` (brand blue tint)
- py 96, container max 1100, text center, white text
- Kicker: "GET STARTED TODAY" — Bebas 18 uppercase white, with 60px white divider centered (flex justify-center items-center gap-4)
- H2: "Schedule your free consultation today." — Bebas 56/60 uppercase white
- p: full body copy in white/90, max-w 800 mx-auto
- 2 buttons centered: phone (white outline) + "FREE ESTIMATE" (solid white bg, brand text)

---

## SECTION 6 — Testimonials

- White bg, py 96
- Centered header block:
  - Kicker: "TESTIMONIALS" Bebas 20 uppercase `#101010`
  - Title: "What Our Clients Says About Us" Bebas 48/52 uppercase `#1D1D1D`
  - Intro p (Roboto 16/28 `#7A7A7A`, max-w 900 mx-auto, mb 64)
- 3-column grid on desktop, gap 32, stack on mobile
- **Testimonial card:**
  - bg `#F5F5F5`, padding 32, no border-radius (or very subtle 4px)
  - 5 yellow stars row at top (use inline SVG `★★★★★` color `#FFC107`)
  - Quote: Roboto italic 16/28 `#4D4D4D`, mb 24
  - Divider: 1px `#E5E5E5`, mb 16
  - Name: Bebas Neue 20 uppercase `#1D1D1D`
  - Location: Roboto 14 `#7A7A7A`

---

## SECTION 7 — FAQ accordion

- Bg `#F5F5F5`, py 96
- Container max 900, centered
- Kicker: "FREQUENTLY ASKED QUESTIONS" Bebas 20 uppercase `#101010`, centered, mb 8
- Title: "Got Questions? We've Got Answers" Bebas 48/52 uppercase `#1D1D1D`, centered, mb 48
- Accordion items: white bg, mb 12, padding 24 32, no radius
- Question: Bebas 22 uppercase `#1D1D1D`, flex justify-between items-center, with `<PlusIcon>` (open: `<MinusIcon>`)
- Answer: Roboto 16/28 `#7A7A7A`, expanded body, mt 16
- One item open by default (first), others collapsed
- Use `useState` for client-side toggling — must be `"use client"`
- Use `<FAQS>` array from `site-data.ts`

---

## SECTION 8 — Contact + form

- White bg, py 96, container max 1240
- 2-column grid (5/7), gap 64
- **Left column:**
  - Kicker: "CONTACT US" Bebas 20 uppercase `#101010`
  - H2: "Get a free estimate" Bebas 56/60 uppercase `#1D1D1D`
  - p: contact body copy, Roboto 16/28 `#7A7A7A`
  - Two info rows below:
    - `<PhoneIcon>` + "(954) 932-0764" — Roboto 500 18 `#1D1D1D`
    - `<MapPinIcon>` + "Servicing All of Florida" — Roboto 500 18 `#1D1D1D`
- **Right column (form):**
  - bg `#F5F5F5`, padding 40, no radius
  - Two-col grid: Name | Email (mobile: stack)
  - Phone (full width)
  - Message textarea (rows 6, full width)
  - Submit button: full-width primary brand button, label "SEND" — Bebas Neue 18 tracking-wider
  - Inputs: white bg, no border-radius, border `1px solid #E5E5E5`, padding 14 18, font Roboto 16, focus `#004AAD`
  - Form is a `<form>` with `noValidate` and an `onSubmit` that does `e.preventDefault()` and shows a success message — must be `"use client"`

---

## SECTION 9 — Footer

- bg `#1D1D1D`, color white, pt 80 pb 32
- Container max 1240
- 5-column grid on desktop (logo+about | sliding | pocket | screen+barn | glass+commercial), gap 32
- Column 1 (wider, ~2x):
  - Logo (white version — use the same `/images/logo.png` with `brightness-0 invert` to whiten)
  - p tagline: "Proudly serving Florida & New York with expert door and window solutions you can rely on. Quality craftsmanship, honest pricing, and service that's truly Top Notch."
  - Phone row: `<PhoneIcon>` + "(954) 932-0764" (Roboto 500)
  - Address row: `<MapPinIcon>` + "Servicing Florida & New York"
- Other columns:
  - Heading: Bebas Neue 20 uppercase white, mb 16
  - List of links: Roboto 14 white/70, leading-loose, hover white
  - Headings: "Sliding Doors", "Pocket Doors", "Screen Doors / Barn Doors", "Glass & Window Services / Commercial / Other"
- Bottom bar: top border `1px solid rgba(255,255,255,0.1)`, mt 64 pt 24, centered text "© 2025 Top Notch Doors & Windows. All Rights Reserved." Roboto 14 white/60

---

## Behaviors / interaction notes

- Page is mostly static. The only true behaviors are:
  1. **Header sticky** (CSS only — `sticky top-0 z-50`)
  2. **Hero bg slideshow** — alternate two images via CSS keyframes (cross-fade every 5s) — implement with two absolutely positioned divs, one with `animation: heroFade 10s infinite`. Define keyframes in `globals.css`.
  3. **FAQ accordion** — `useState` open index
  4. **Contact form submit** — preventDefault + alert/success
- No Lenis, no scroll-driven animations, no parallax. Plain page.

---

## File layout to produce
- `src/components/SiteHeader.tsx` (client — for mobile menu later, but server-only OK)
- `src/components/HeroSection.tsx`
- `src/components/CountersSection.tsx`
- `src/components/AboutSection.tsx`
- `src/components/ServicesSection.tsx`
- `src/components/CtaBannerSection.tsx`
- `src/components/TestimonialsSection.tsx`
- `src/components/FaqSection.tsx` (client)
- `src/components/ContactSection.tsx` (client — form state)
- `src/components/SiteFooter.tsx`
- `src/components/PrimaryButton.tsx` (small reusable wrapper)
- Update `src/app/page.tsx` to compose them all in order
