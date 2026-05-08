# topnotchdoorsandwindows.com

An **Astro 5** clone of [topnotchdoorsandwindows.com](https://topnotchdoorsandwindows.com/) — a single-page WordPress + Elementor site for a Florida door & window service company.

Built with the global `/clone-website` Claude Code skill.

## Stack

- **Astro 5** (static output, TypeScript strict)
- **Tailwind CSS v4** via `@tailwindcss/vite`, with the original site's design tokens (`#004AAD` brand blue, Bebas Neue + Roboto + Roboto Slab loaded from Google Fonts)
- Zero JS frameworks — vanilla `<details>` for the FAQ accordion and a 6-line inline `<script>` for the contact form

## Sections

`src/pages/index.astro` composes 10 sections in order:

1. `SiteHeader` — sticky two-bar header (utility bar + main nav)
2. `HeroSection` — full-bleed crossfading photo background + headline
3. `CountersSection` — 3 stat columns
4. `AboutSection` — image + copy
5. `ServicesSection` — 16-card service grid
6. `CtaBannerSection` — brand-tinted full-width CTA
7. `TestimonialsSection` — 3 testimonial cards
8. `FaqSection` — `<details>`-based accordion (no JS framework)
9. `ContactSection` — form with inline submit handler
10. `SiteFooter` — multi-column footer

Site data lives in `src/data/site.ts`. Reusable inline-SVG icons in `src/components/Icon.astro`.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # serve dist/
npm run check    # astro check + build
```

## Re-downloading assets

All images live in `public/images/` and were downloaded from the original site. To re-fetch:

```bash
node scripts/download-assets.mjs
```

## Research artifacts

- `docs/research/components/PAGE_SPEC.md` — full design tokens + per-section spec used to build this clone

## Notes

- The contact form is client-side only — wire it to your own backend before going live.
- Service card "Read More" links currently go to `#`.
- Mobile menu icon is rendered but not yet wired.
