---
name: sweetalks-brand-system
description: Sweetalks brand bible — colors, typography, prohibitions, and design tokens. Reference before writing ANY CSS or component.
---

# Sweetalks Brand System

## Brand Identity

- **Name:** Sweetalks — "Everyone Deserves Best"
- **Location:** Thrikkakara, Kakkanad, Kochi, Kerala
- **Category:** Bold retro-modern dessert cafe
- **Physical identity:** Crimson red sofas, teal ceiling, marble tables, live plants, neon sign "Moments made sweeter"

---

## Color Palette — IMMUTABLE

```css
:root {
  --crimson:      #BA1C0A;  /* primary CTA, accents, active states */
  --deep-red:     #991001;  /* dark section backgrounds, hover darken */
  --teal:         #2BA8B2;  /* secondary accent, labels, icons, borders */
  --light-teal:   #74C0C6;  /* muted text on dark, hover states */
  --off-white:    #EDE5E5;  /* section backgrounds, card surfaces */
  --near-white:   #F8F2F2;  /* page background, light sections */
  --pure-white:   #FFFFFF;  /* product card surfaces, input fields */
  --dark-bg:      #0D0D0D;  /* presentation wrapper background */
}
```

### Color Usage Map

| Context | Color | Hex |
|---------|-------|-----|
| Primary CTA buttons | Crimson | `#BA1C0A` |
| CTA hover | Deep Red | `#991001` |
| Section labels, icons | Teal | `#2BA8B2` |
| Muted text on dark bg | Light Teal | `#74C0C6` |
| Hero section bg | Near-white | `#F8F2F2` |
| Menu section bg | Off-white | `#EDE5E5` |
| Card surfaces | Pure White | `#FFFFFF` |
| Testimonials/Reservation bg | Deep Red | `#991001` |
| Footer bg | Dark | `#0D0D0D` |

---

## PROHIBITED Colors — NEVER USE

| Color | Hex | Reason |
|-------|-----|--------|
| Warm parchment | `#FAF6F0` or similar | Generic cafe template |
| Terracotta | `#C4793A` or similar | Off-brand |
| Espresso brown | `#1C1208` or similar | Off-brand |
| Sage green | `#8B9D77` or similar | Off-brand |
| Champagne gold | `#C9A84C` or similar | Off-brand |
| Purple | Any shade | Not in palette |
| "Elegant" gradients | — | Off-brand |

---

## Typography System — IMMUTABLE

### Font Stack

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display / Logo | `'Pacifico', cursive` | 400 | Brand name, section headings, stat numbers, footer wordmark |
| UI / Navigation | `'Jost', sans-serif` | 300–700 | Labels, nav links, prices, buttons, tracking 3–4px, uppercase |
| Body / Descriptions | `'Lora', serif` | 400, 500, 600, italic | Story copy, descriptions, line-height 1.9 |

### Google Fonts CDN

```html
<link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Jost:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
```

### Typography Rules (Nick Saraev methodology)

1. **Max 2 typefaces per section** — Pacifico + Jost, or Pacifico + Lora, or Jost + Lora
2. **Heading size contrast:** display heading 3–5× larger than body
3. **Body line-height:** 1.5 (never below 1.4, never above 1.9)
4. **Characters per line:** 40–70 for desktop body copy
5. **Heading tracking:** tight (-0.02em to -0.04em) for Jost headlines
6. **Never stretch fonts**
7. **No ALL CAPS for body text** — only for Jost labels under 0.7rem
8. **Fix widows/orphans** via letter-spacing or line breaks

### PROHIBITED Fonts

- Inter, Roboto, Arial, system fonts
- Playfair Display (not a French patisserie)

---

## Section Background Rhythm

Sections alternate hard — no soft transitions or fade-between:

| # | Section | Background |
|---|---------|-----------|
| 1 | Hero | `#F8F2F2` |
| 2 | Story | `#FFFFFF` |
| 3 | Menu Showcase | `#EDE5E5` |
| 4 | Gallery | `#F8F2F2` |
| 5 | Testimonials | `#991001` |
| 6 | Reservation | `#991001` |
| 7 | Location | `#FFFFFF` |
| 8 | Contact | `#0D0D0D` |
| 9 | Footer | `#0D0D0D` |

---

## Container Radius Rules

| Element | Radius |
|---------|--------|
| Section containers | `2rem–3rem` (`rounded-[2rem]`) |
| Cards | `1rem–1.5rem` (`rounded-2xl`) |
| Buttons | `50px` (pill — always) |
| Form fields | `8px` |
| **N/A** | **NO sharp corners anywhere** |

---

## Micro-Interactions

- **Buttons:** `scale(1.03)` on hover, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, sliding `<span>` bg layer for color transitions
- **Nav links:** `translateY(-1px)` + color shift to `#2BA8B2`
- **Cards:** `translateY(-4px)` + deepened box-shadow
- **All transitions:** 300–400ms, **never linear**

---

## Noise Overlay (Global)

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
}
```
