---
name: sweetalks-component-architecture
description: Section component specs for Sweetalks — props, structure, and file organization for all 10 page sections.
---

# Component Architecture — Sweetalks

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, meta
│   ├── page.tsx            # Page assembly only — no logic
│   ├── globals.css         # Tailwind + noise overlay + utilities
│   ├── blog/
│   │   ├── page.tsx        # Blog listing (ISR)
│   │   └── [slug]/
│   │       └── page.tsx    # Individual post
│   └── api/
│       ├── reservation/
│       │   └── route.ts
│       ├── contact/
│       │   └── route.ts
│       └── revalidate/
│           └── route.ts
├── components/
│   ├── ui/                 # 21st.dev components (verbatim)
│   │   ├── liquid-glass.tsx
│   │   ├── carousel-circular-image-gallery.tsx
│   │   ├── testimonials-columns-1.tsx
│   │   ├── hover-footer.tsx
│   │   ├── expand-map.tsx
│   │   └── social-icons.tsx
│   ├── Navbar.tsx          # A
│   ├── Hero.tsx            # B
│   ├── Story.tsx           # C
│   ├── Menu.tsx            # D
│   ├── Gallery.tsx         # E
│   ├── Testimonials.tsx    # F
│   ├── Reservation.tsx     # G
│   ├── Location.tsx        # H
│   └── Footer.tsx          # J (I embedded in Footer)
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   └── admin.ts        # Service role client
│   ├── rate-limit.ts       # Upstash config
│   └── validations.ts      # Zod schemas
└── sanity/
    ├── schemas/
    │   └── post.ts
    └── lib/
        ├── client.ts
        ├── queries.ts
        └── image.ts
```

---

## App.tsx Assembly (page.tsx)

```tsx
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Reservation from '@/components/Reservation';
import Location from '@/components/Location';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Story />
      <Menu />
      <Gallery />
      <Testimonials />
      <Reservation />
      <Location />
      <Footer />
    </>
  );
}
```

---

## Component Specs Quick Reference

### A. Navbar
- **Base:** liquid-glass.tsx adapted
- **Morph:** IntersectionObserver — transparent → frosted glass
- **State 1 (hero):** transparent bg, all white text
- **State 2 (scrolled):** `rgba(248,242,242,0.88)`, blur(20px), crimson logo
- **CTA:** "Order Now" pill button
- **Mobile:** hamburger → full-screen crimson overlay

### B. Hero
- **Height:** 100dvh
- **Background:** full-bleed photo + gradient `linear-gradient(to top, #991001 0%, transparent 60%)`
- **Content:** bottom-left aligned
- **Lines:** eyebrow (Jost, teal) → headline (Pacifico, near-white) → sub (Lora italic) → CTA buttons

### C. Story
- **Background:** #FFFFFF
- **Layout:** 2-column grid, gap 80px
- **Left:** label, heading, body, stats row (600+, 80+, 2021)
- **Right:** asymmetric 2-col photo grid (1 tall portrait + 2 squares)

### D. Menu
- **Background:** #EDE5E5
- **Tabs:** Signatures · Pastries · Brownies · Falooda · Juices · Savoury
- **Grid:** 4 col desktop, 2 tablet, 1 mobile
- **Card:** white bg, image (1:1) + name (Pacifico) + desc (Lora italic)

### E. Gallery
- **Background:** #F8F2F2
- **Layout:** 2-column (copy + carousel)
- **Uses:** carousel-circular-image-gallery.tsx

### F. Testimonials
- **Background:** #991001 (inverted)
- **Uses:** testimonials-columns-1.tsx
- **Card:** frosted glass on dark, Lora italic quotes

### G. Reservation
- **Background:** #991001 (continuous from testimonials)
- **Layout:** 2-column (copy + action cluster | form)
- **Form fields:** name, occasion, date, serving size, flavour, phone
- **Actions:** WhatsApp, Call, Book Date, Instagram DM

### H. Location
- **Background:** #FFFFFF
- **Uses:** expand-map.tsx
- **Layout:** 2-column (details | map)

### J. Footer
- **Background:** #0D0D0D
- **Uses:** hover-footer.tsx + social-icons.tsx
- **Grid:** 4 columns (Brand | Navigate | Order | Find Us)
- **Feature:** TextHoverEffect with Pacifico "Sweetalks"

---

## Component Naming Conventions

- Section IDs for smooth scroll: `id="story"`, `id="menu"`, `id="gallery"`, etc.
- CSS class prefix: none needed with Tailwind scoping
- TypeScript: all components use function declarations, typed props with interfaces
- Refs: `useRef<HTMLElement>(null)` for GSAP scoping

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|-----------|-------|-------------|
| Mobile | < 640px | 1 column, hamburger nav, smaller fonts |
| Tablet | 640–1024px | 2 columns mostly, 2-col product grid |
| Desktop | > 1024px | Full spec layout |
