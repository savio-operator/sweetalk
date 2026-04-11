# Sweet Talks — Cinematic Dessert Cafe Website

## ROLE

Act as an Awwwards-winning Senior Creative Technologist and Lead 
Frontend Engineer specialising in F&B brand experiences. You build 
high-fidelity, cinematic landing pages that feel like digital 
instruments — every scroll intentional, every animation weighted, 
every interaction purposeful. Eradicate all generic AI patterns. 
Eradicate all beige cafe templates. Build as if this is going on 
Awwwards tomorrow.

---

## BRAND LOCK — NEVER DEVIATE FROM THESE

**Brand:** Sweetalks — "Everyone Deserves Best"
**Location:** Thrikkakara, Kakkanad, Kochi, Kerala
**Category:** Bold retro-modern dessert cafe. Crimson + Teal + White.
**Physical identity:** Crimson red sofas, teal ceiling, marble tables, 
live plants, neon sign reading "Moments made sweeter", display counter, 
script wordmark signage.

**Color System (NEVER change, NEVER approximate):**
- Crimson Red:    #BA1C0A  — primary CTA, accents, active states
- Deep Red:       #991001  — dark section backgrounds, hover darken
- Teal:           #2BA8B2  — secondary accent, labels, icons, borders
- Light Teal:     #74C0C6  — muted text on dark, hover states
- Off-white:      #EDE5E5  — section backgrounds, card surfaces
- Near-white:     #F8F2F2  — page background, light sections
- Pure White:     #FFFFFF  — product card surfaces, input fields
- Dark BG:        #0D0D0D  — presentation wrapper background

**PROHIBITIONS — STRICTLY ENFORCE:**
- NO warm parchment (#FAF6F0 or similar)
- NO terracotta (#C4793A or similar)
- NO espresso brown (#1C1208 or similar)
- NO sage green (#8B9D77 or similar)
- NO champagne gold (#C9A84C or similar)
- NO purple, no gradients trying to be elegant
- NO generic Kerala cafe template aesthetics
- NO Inter, NO Roboto, NO Arial, NO system fonts
- NO Playfair Display (this is not a French patisserie)
- NO sharp corners on containers — minimum border-radius: 12px

**Typography System (NEVER change):**
- Logo / Display: 'Pacifico' — script, matching the brand wordmark.
  Use for: brand name in navbar, section hero headings, footer wordmark
- UI / Navigation / Labels / Prices: 'Jost' — geometric sans.
  letter-spacing: 3–4px, text-transform: uppercase, weight 400–600
- Body / Descriptions / Story copy: 'Lora' — humanist serif, italic 
  for emphasis, 0.88–1rem, line-height 1.9
- Load all via Google Fonts CDN in index.html

**Typography Rules (from Nick Saraev methodology):**
- Maximum 2 typefaces in any single section
- Heading size contrast: display heading 3–5x larger than body
- Line height for body: 150% (1.5) — never below 1.4, never above 1.9
- Characters per line: 40–70 for desktop body copy
- Heading tracking: tight (-0.02em to -0.04em) for Jost headlines
- Never stretch or deform font proportions
- Widows and orphans: adjust letter-spacing or line breaks to prevent
- No ALL CAPS for body text — only for Jost labels under 0.7rem

---

## TECH STACK — NEVER CHANGE

- React 19 + TypeScript
- Tailwind CSS v3.4 (shadcn project structure)
- GSAP 3 with ScrollTrigger plugin
- Framer Motion (for components that require it)
- Motion library (motion/react — for testimonials column animation)
- Lucide React for icons (except where Phosphor specified)
- Google Fonts via <link> in index.html

**File structure:**
- /components/ui/ — all 21st.dev components dropped here verbatim
- /components/ — section-level components (Navbar, Hero, Menu, etc.)
- App.tsx — page assembly only, no logic
- index.css — Tailwind directives + noise overlay + custom utilities

**No placeholders. No lorem ipsum. No grey boxes.**
Every card, label, animation, form field, and image slot must be 
fully implemented. Real copy. Real interactions. Real food items 
from the actual Sweet Talks menu.

---

## GLOBAL DESIGN SYSTEM — NEVER CHANGE

### Noise Overlay (apply globally)
Add a fixed SVG feTurbulence noise overlay at 0.04 opacity across 
the entire page to eliminate flat digital gradients and add tactile 
warmth. pointer-events: none. z-index: 9999.
```css
/* In index.css */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.65'...");
}
```

### Section Rhythm
Sections alternate hard between these backgrounds — no soft 
transitions, no fade-between:
1. Hero              → #F8F2F2 (near-white)
2. Story             → #FFFFFF (white)
3. Menu Showcase     → #EDE5E5 (off-white)
4. Gallery           → #F8F2F2 (near-white)
5. Testimonials      → #991001 (deep crimson)
6. Reservation       → #991001 (deep crimson)
7. Location          → #FFFFFF (white)
8. Contact           → #0D0D0D (dark)
9. Footer            → #0D0D0D (dark)

### Container Radius
- Section containers: border-radius: 2rem–3rem (rounded-[2rem])
- Cards: border-radius: 1rem–1.5rem (rounded-2xl)
- Buttons: border-radius: 50px (pill — always)
- Form fields: border-radius: 8px
- NO sharp corners anywhere

### Micro-Interactions (apply to ALL interactive elements)
- Buttons: scale(1.03) on hover, cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Buttons: overflow-hidden with sliding <span> background layer for 
  color transitions — base #BA1C0A slides to reveal #991001 on hover
- Nav links: translateY(-1px) lift + color shift to #2BA8B2 on hover
- Cards: translateY(-4px) + box-shadow deepen on hover
- All transitions: duration 300–400ms, never linear

### Animation Lifecycle (GSAP — apply consistently)
- Use gsap.context() inside useEffect for ALL GSAP animations
- Return ctx.revert() in cleanup function — no memory leaks
- Entrance easing: power3.out
- Morph easing: power2.inOut
- Text stagger: 0.08s between words
- Card/container stagger: 0.15s
- Scroll reveal: y: 40 → 0, opacity: 0 → 1, triggered by ScrollTrigger
- ScrollTrigger start: "top 80%" for most elements

---

## COMPONENT ARCHITECTURE

### A. NAVBAR — "The Sweetalks Pill"
**Component:** liquid-glass.tsx adapted + custom morphing logic
**File:** /components/Navbar.tsx

Structure (left → center → right):
- LEFT: Brand wordmark — "Sweetalks" in Pacifico, 1.2rem
- CENTER: Nav links in Jost — Story · Menu · Gallery · Orders · Find Us
  gap: 32px, font-size: 0.65rem, letter-spacing: 3px, uppercase
- RIGHT: "Order Now" — pill button

Morphing Logic (MUST implement with IntersectionObserver):
- State 1 (hero top): 
  background: transparent
  all text: #FFFFFF
  border: none
  logo Pacifico: white
- State 2 (scrolled past hero):
  background: rgba(248,242,242,0.88)
  backdrop-filter: blur(20px)
  border: 1px solid #EDE5E5
  logo Pacifico: #BA1C0A
  nav links: #991001
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)

CTA Button states:
- State 1: border: 1px solid #FFFFFF, color: #FFFFFF, bg: transparent
- State 2: background: #BA1C0A, color: #FFFFFF, border: none
- Hover (both states): scale(1.03), bg shifts to #991001

Pill container:
- position: fixed, top: 24px, left: 50%, transform: translateX(-50%)
- border-radius: 100px, padding: 12px 28px
- max-width: 900px, width: calc(100% - 48px)
- z-index: 100

Mobile (< 768px):
- Hide center nav links
- Hamburger icon right side, color: #2BA8B2
- Full-screen overlay on open: background #991001
- Links: Pacifico, 2rem, white, vertically stacked, centered
- Close: X icon or tap-outside

GSAP entrance: stagger fade-up from y:20, delay after page load 0.3s

---

### B. HERO SECTION — "The Opening Shot"
**File:** /components/Hero.tsx

- height: 100dvh, position: relative, overflow: hidden
- Background: full-bleed food photography (Unsplash — search: 
  "dessert cafe red teal interior", "chocolate brownie marble surface",
  "cafe counter colorful") with heavy gradient overlay:
  background: linear-gradient(to top, #991001 0%, transparent 60%)
- Content: pushed to bottom-left third using flex-end + padding-left: 
  clamp(2rem, 8vw, 8rem), padding-bottom: clamp(3rem, 8vh, 6rem)

Typography layout (hero line pattern):
Line 1: "Too good" — Jost, bold, 0.8rem, letter-spacing 4px, 
         uppercase, color: #74C0C6, margin-bottom: 12px
         (eyebrow label)
Line 2: "to resist." — Pacifico, clamp(3.5rem, 8vw, 7rem), 
         color: #F8F2F2, line-height: 1.05
Line 3 (sub): Lora italic, 1rem, color: rgba(248,242,242,0.75),
         "Artisan desserts. Thrikkakara, Kochi."
         max-width: 380px, line-height: 1.7, margin-top: 16px

CTA buttons row (margin-top: 32px):
- Button 1 "Explore Menu": background #BA1C0A, color white, 
  border-radius 50px, padding 14px 32px, Jost 0.7rem tracking 2px
  Hover: sliding span reveals #991001
- Button 2 "Custom Orders": border 1px solid rgba(255,255,255,0.3), 
  color white, background transparent, same sizing
  Hover: background rgba(255,255,255,0.1)

GSAP entrance (staggered fade-up):
- eyebrow: y:30→0, opacity:0→1, delay:0.2
- headline: y:50→0, opacity:0→1, delay:0.35
- sub: y:20→0, opacity:0→1, delay:0.5
- buttons: y:20→0, opacity:0→1, delay:0.65
- All: ease: power3.out, duration: 0.9

---

### C. STORY SECTION — "Started for Friends"
**File:** /components/Story.tsx
Background: #FFFFFF
Layout: 2-column CSS grid, gap: 80px, align-items: center

LEFT COLUMN:
- Label (Jost): "THE ORIGIN" — 0.6rem, #2BA8B2, tracking 4px
- Heading (Pacifico): "Started for friends. Built for a city."
  clamp(2rem, 3.5vw, 3rem), color: #991001, line-height: 1.2
- Body (Lora): 0.88rem, color: #BA1C0A at 70% opacity, line-height: 1.9
  "Sweetalks began with a simple conviction — Thrikkakara deserved 
  better desserts. Not bigger. Not louder. Just better. Our founder 
  spent years in professional kitchens before bringing the craft home 
  to Kochi. The first guests were friends and family. The rest followed 
  naturally."
- Stats row (padding-top: 24px, border-top: 1px solid #EDE5E5):
  "600+" / Monthly Guests
  "80+"  / Menu Items  
  "2021" / Est. Thrikkakara
  Stat numbers: Pacifico 2.2rem, #BA1C0A
  Stat labels: Jost 0.6rem, #74C0C6, tracking 2px

RIGHT COLUMN:
- Asymmetric photo grid: 2-column, gap 12px
  - Left: tall portrait image (aspect-ratio 3/4, grid-row span 2)
    border-radius: 1.5rem, overflow hidden
    image: Unsplash "cafe counter red" or "dessert display case"
  - Right top: square image (aspect-ratio 1/1)
    border-radius: 1.5rem
    image: Unsplash "pistachio dessert" or "chocolate brownie closeup"
  - Right bottom: square image (aspect-ratio 1/1)
    border-radius: 1.5rem
    image: Unsplash "cafe interior teal" or "neon sign cafe"
  All images: object-fit cover
  Hover: scale(1.03) on individual images, transition 400ms

GSAP ScrollTrigger: stagger fade-up on left column elements, 
clip-path inset(100% 0 0 0) reveal on images

---

### D. MENU SHOWCASE — "Crafted to Delight"
**File:** /components/Menu.tsx
Background: #EDE5E5

Header:
- Label (Jost): "WHAT WE MAKE" — 0.6rem, #2BA8B2, tracking 4px
- Heading (Pacifico): "Crafted to delight." 
  clamp(2rem, 4vw, 3.5rem), color: #991001
- Sub (Lora italic): "Every item made fresh. Every day." 
  0.88rem, #BA1C0A at 60%
- Right side: "View Full Menu →" — Jost, 0.65rem, #2BA8B2, 
  underline-offset 4px, tracking 2px

Tab filter row (border-bottom: 1px solid #EDE5E5):
Tabs: Signatures · Pastries · Brownies · Falooda · Juices · Savoury
- Default: Jost 0.65rem, #74C0C6, padding 12px 24px
- Active: color #991001, border-bottom: 2px solid #BA1C0A
- Hover: color #BA1C0A, translateY(-1px)
- Tab switching: React useState, content fades in (opacity 0→1, 200ms)

Product grid: 4 columns desktop, 2 tablet, 1 mobile, gap: 24px

Product Card anatomy (background: #FFFFFF, border-radius: 1rem, 
border: 1px solid #EDE5E5, overflow: hidden):
- Image area (aspect-ratio 1/1): background #EDE5E5
  Unsplash food photography, object-fit cover
  On card hover: image scale(1.08), transition 500ms
  Signature badge: background #BA1C0A, color white, Jost 0.5rem, 
  border-radius 50px, position absolute top-right, padding 4px 10px
- Info area (padding: 20px):
  Name: Pacifico 1rem, color #991001, margin-bottom 6px
  Desc: Lora italic 0.72rem, color #BA1C0A at 60%, line-height 1.7

**Actual menu items to populate (from Sweet Talks menu):**

SIGNATURES tab:
1. Belgium Brownie — "Rich, fudgy, handcrafted. Our most loved creation."
2. Pistachio Kunafa — "Roasted kunafa, pistachio spread, vanilla ice cream."
3. Chocoberry Mess — "Brownie, housemade chocolate sauce, strawberry ice cream."
4. Pista-Berry Toast — "French toast with pistachio and berry."

FALOODA tab:
1. Fruit Carnival ₹179 — "Vanilla ice cream, fresh cut fruits."
2. Pistachio Kunafa Falooda ₹239 — "The house favourite."
3. Gulab Jamun ₹189 — "Kulfi ice cream, vanilla, soan papdi."
4. Chocolate Overload ₹179 — "Chocolate ice cream, hazelnut spread."

JUICES tab:
1. Lotus Shake ₹239 — "Lotus Biscoff, ice cream, milk."
2. Cashew Caramel Malt ₹229 — "Caramel, cashew, ice cream."
3. Cold Coffee ₹189 — "Coffee ice cream, milk."
4. Passion Orange ₹179 — "Passion fusion."

SAVOURY tab:
1. Cheese Burst Loaded Fries ₹209
2. Bolognese Beef Fries ₹239
3. Inferno Chicken Pasta ₹279
4. Classic Beef Burger ₹299

Card hover: translateY(-4px), 
box-shadow: 0 16px 40px rgba(153,16,1,0.12)

---

### E. GALLERY — "Every Bite, a Moment"
**Component:** carousel-circular-image-gallery.tsx (verbatim from 
/components/ui/) + custom section wrapper
**File:** /components/Gallery.tsx
Background: #F8F2F2

Layout: 2-column desktop (50/50), single column mobile

LEFT COLUMN (section copy + controls):
- Label (Jost): "OUR SWEET GALLERY" — 0.6rem, #2BA8B2, tracking 4px
- Heading (Pacifico): "Every bite, a moment worth sharing."
  clamp(1.8rem, 3vw, 2.8rem), color: #991001, line-height 1.2
- Body (Lora italic): 0.85rem, color: #BA1C0A at 65%, line-height 1.9
  "From our display counter to your table. Each dessert at Sweetalks is 
  made to be seen, shared, and remembered."
- Prev/Next controls: custom pill buttons using brand colors
  background: #BA1C0A, color white, border-radius 50px
  Hover: #991001, scale(1.03)
- Image counter: "03 / 06" — Jost monospace, 0.65rem, #74C0C6

RIGHT COLUMN:
- carousel-circular-image-gallery component
- Override component colors:
  Background: #991001 (container bg)
  Tab indicator circles: stroke #74C0C6, stroke-width 2
  Active tab: stroke #F8F2F2
  Prev/Next arrows: 
    background: rgba(248,242,242,0.95)
    color: #991001
    border: none
    hover: background #F8F2F2, scale(1.1)
- Gallery images (Unsplash — actual food photography):
  1. "chocolate brownie dark background" 
  2. "pistachio dessert cream"
  3. "cafe interior teal red"
  4. "ice cream sundae close up"
  5. "french fries loaded cheese"
  6. "milkshake cafe colorful"

---

### F. TESTIMONIALS — "What Kochi Is Saying"
**Component:** testimonials-columns-1.tsx (verbatim from /components/ui/)
**File:** /components/Testimonials.tsx
Background: #991001 (deep crimson — inverted section)

Override component styles for dark background:
- Card background: rgba(255,255,255,0.06)
- Card border: 1px solid rgba(255,255,255,0.1)
- Card border-radius: 1.5rem (rounded-3xl)
- Card shadow: 0 4px 24px rgba(0,0,0,0.2)
- Quote text: Lora italic, 0.88rem, color: rgba(248,242,242,0.85)
- Reviewer name: Jost, 0.7rem, color: #F8F2F2, tracking 1px
- Reviewer role: Jost, 0.6rem, color: #74C0C6

Section header (centered, above columns):
- Label (Jost): "WHAT CUSTOMERS SAY" — 0.6rem, #74C0C6, tracking 4px
- Heading (Pacifico): "Made with love. Remembered always."
  clamp(2rem, 4vw, 3rem), color: #F8F2F2
- Stars row: ★★★★★ — color: #74C0C6, font-size: 1.2rem
- Sub (Lora italic): "Rated 4.7 — Thrikkakara's favourite dessert cafe"
  0.85rem, color: rgba(248,242,242,0.6)

Column scroll speeds: duration 15, 19, 17 (keep component defaults)
Mask: linear-gradient(to_bottom,transparent,#991001_20%,#991001_80%,transparent)

**Actual testimonials to populate (9 total, 3 per column):**

Column 1:
1. "The Belgium brownie is unlike anything else in Kochi. The texture, 
   the depth — it's made by someone who actually cares about the craft."
   — Arjun M., Thrikkakara · Google Review ★★★★★

2. "We ordered a custom birthday cake and couldn't believe the quality. 
   It looked exactly like the reference and tasted even better. Our 
   go-to for every celebration now."
   — Meera T., Kakkanad · Google Review ★★★★★

3. "The pistachio falooda is a must. Came once, became a weekly regular. 
   Hidden gem in Thrikkakara."
   — Rohit S., Kochi · Google Review ★★★★★

Column 2:
4. "Genuinely French-quality pastries. The Pista-Berry Toast is 
   something I haven't found anywhere else in Kerala."
   — Divya K., Ernakulam · Google Review ★★★★★

5. "The space itself is beautiful — that neon sign, the teal ceiling. 
   But the desserts are what keep bringing us back."
   — Sanjay R., Kakkanad · Google Review ★★★★★

6. "Ordered the Lotus Shake and the Loaded Fries together. The 
   combination shouldn't work. It absolutely does. Come hungry."
   — Priya N., Thrikkakara · Google Review ★★★★★

Column 3:
7. "Custom cake for my daughter's birthday — the team understood 
   exactly what we wanted. Zero compromises on quality."
   — Anil V., Kochi · Google Review ★★★★★

8. "The Chocoberry Mess is worth every rupee. Brownie base, 
   strawberry ice cream, housemade sauce — it's chaos in the best way."
   — Fatima S., Kakkanad · Google Review ★★★★★

9. "I've been to a lot of cafes in Kochi. Sweetalks has the most 
   distinctive identity — the brand, the food, the space all feel 
   intentional. That's rare."
   — Kiran J., Ernakulam · Google Review ★★★★★

---

### BLOG SECTION — SANITY CMS:

CMS: Sanity Studio (sweetalks.sanity.studio)
Package: next-sanity, @sanity/image-url
Schema: /sanity/schemas/post.ts (as specified separately)
Client: /sanity/lib/client.ts
Queries: /sanity/lib/queries.ts (postsQuery, postQuery, postsByTagQuery)

Revalidation: 
- ISR revalidate: 60 as fallback
- On-demand webhook at /api/revalidate for instant updates
- Webhook secret stored in REVALIDATION_SECRET env variable

Blog listing page (/blog):
- Grid: 3 columns desktop, 2 tablet, 1 mobile, gap 32px
- Post card:
  Cover image: aspect-ratio 16/9, border-radius 1rem, 
               object-fit cover, hotspot-aware via @sanity/image-url
  Tag chips: Jost 0.55rem, uppercase, tracking 2px,
             background #EDE5E5, color #2BA8B2,
             border-radius 50px, padding 4px 12px
  Title: Pacifico 1.2rem, color #991001, margin-top 12px
  Excerpt: Lora italic 0.82rem, color #BA1C0A at 65%, 
           line-height 1.7, margin-top 8px
  Date: Jost 0.6rem, #74C0C6, tracking 2px
  Card bg: #FFFFFF, border-radius 1rem, 
           border 1px solid #EDE5E5
  Card hover: translateY(-4px), 
              shadow 0 16px 40px rgba(153,16,1,0.1)
- Tag filter bar above grid: all tags as pill buttons
  Active: background #BA1C0A, color white
  Inactive: background #EDE5E5, color #74C0C6
  Filter: client-side, no page reload, smooth opacity transition
- Section background: #F8F2F2
- Empty state: "No posts yet — check back soon." 
  Lora italic, centered, color #74C0C6

Individual post page (/blog/[slug]):
- generateStaticParams: pre-render all published posts at build
- generateMetadata: title, description, og:image from Sanity data
- Hero: full-bleed cover image, height 60vh,
        gradient overlay linear-gradient(to top, #991001 0%, 
        transparent 50%)
        Title in Pacifico clamp(2.5rem, 5vw, 4rem), 
        color #F8F2F2, positioned bottom-left
- Meta row below hero: date + reading time (Jost 0.65rem, #74C0C6) 
  + tags
- Body: rendered via @portabletext/react
  Paragraph: Lora 1rem, color #1a1a1a, line-height 1.9,
             max-width 680px, margin 0 auto
  h2: Pacifico 1.8rem, color #991001, margin-top 48px
  h3: Jost 1rem, color #BA1C0A, tracking 2px, uppercase,
      margin-top 32px
  blockquote: border-left 3px solid #BA1C0A, 
              padding-left 24px, Lora italic, color #74C0C6
  Inline images: border-radius 1rem, max-width 100%,
                 caption below in Jost 0.65rem, #74C0C6, centered
- Related posts section at bottom:
  Label (Jost): "MORE FROM SWEETALKS"
  3 cards same style as listing, filtered by matching tag
- Background: #FFFFFF

Environment variables needed:
NEXT_PUBLIC_SANITY_PROJECT_ID=   (safe to expose)
NEXT_PUBLIC_SANITY_DATASET=production  (safe to expose)
REVALIDATION_SECRET=             (server-side only)

### G. RESERVATION — "Make It Yours"
**Component:** SocialIcons adapted as action button cluster (see below)
**File:** /components/Reservation.tsx
Background: #991001 (continuous from Testimonials — no break)

Layout: 2-column, gap 80px

LEFT COLUMN:
- Label (Jost): "MAKE IT YOURS" — 0.6rem, #74C0C6, tracking 4px
- Heading (Pacifico): "Every celebration deserves something handmade."
  clamp(2rem, 3.5vw, 3rem), color: #F8F2F2, line-height 1.2
- Body (Lora): 0.85rem, color: rgba(248,242,242,0.7), line-height 1.9
  "Custom cakes, celebration desserts, and special orders — crafted 
  personally for your occasion. Birthday. Anniversary. Wedding. 
  Corporate. Tell us your vision."
- Occasion tags (flex-wrap, gap 10px):
  Tags: Birthday · Anniversary · Wedding · Corporate · Baby Shower · 
        Graduation
  Style: border: 1px solid rgba(255,255,255,0.15), color: rgba(255,255,255,0.5)
         border-radius: 50px, Jost 0.62rem, padding 8px 16px
  Active tag: border-color: #74C0C6, color: #74C0C6
  Hover: border-color: rgba(255,255,255,0.3), color: rgba(255,255,255,0.8)

**ACTION BUTTON CLUSTER (adapted from social-icons.tsx):**
Replace social platform icons with Sweet Talks booking actions.
Container: background: rgba(0,0,0,0.3), border: 1px solid 
rgba(255,255,255,0.08), border-radius: 1.5rem, padding: 6px

4 action icons (using Lucide React):
1. MessageCircle — "WhatsApp Order"
   href: "https://wa.me/[number]"
   Icon color on hover: #25D366 (WhatsApp green — exception allowed)
2. Phone — "Call Us"
   href: "tel:[number]"  
   Icon color on hover: #74C0C6
3. Calendar — "Book Date"
   href: "#custom-form"
   Icon color on hover: #BA1C0A
4. Instagram — "DM Us"
   href: "https://instagram.com/sweettalks.thrikkakara"
   Icon color on hover: #E1306C (exception allowed)

Hover tooltip: white pill above icon, black text, Jost 0.65rem
Active underline indicator: 2px line, color #74C0C6

RIGHT COLUMN (Custom Order Form):
Container: background rgba(0,0,0,0.25), border: 1px solid 
rgba(255,255,255,0.08), border-radius: 1.5rem, padding: 40px

Fields (all borderless, border-bottom only: 1px solid rgba(255,255,255,0.15)):
- Your Name
- Occasion
- Preferred Date
- Serving Size / Guests
- Flavour Preference
- Phone / WhatsApp

Field styles:
- Label: Jost 0.58rem, rgba(255,255,255,0.35), tracking 2px, uppercase
- Input: Lora italic 0.85rem, rgba(255,255,255,0.7), background transparent
- Focus: border-bottom-color: #74C0C6, transition 300ms
- Field gap: 24px

Submit button:
- Full width, background: #BA1C0A, color: white, border-radius: 8px
- Padding: 16px, Jost 0.7rem, tracking 2px, uppercase
- Hover: background #991001 with sliding span layer, scale(1.02)
- Text: "Send Enquiry"

---

### H. LOCATION — "Come In. We've Been Waiting."
**Component:** expand-map.tsx (verbatim from /components/ui/)
**File:** /components/Location.tsx
Background: #FFFFFF

Override component CSS variables for Sweet Talks:
- --background: #F8F2F2
- --foreground: #991001
- --muted: #EDE5E5
- --muted-foreground: #BA1C0A
- Status dot: background #2BA8B2 (teal — instead of emerald)
- Map pin fill: #BA1C0A (brand red)
- Expand underline gradient: from #BA1C0A/50 via #2BA8B2/30 to transparent
- "Live" label: Jost 0.6rem, #2BA8B2, tracking 2px

LocationMap props:
location="Sweetalks, Thrikkakara"
coordinates="10.0159° N, 76.3419° E"

Layout: 2-column, gap 80px

LEFT COLUMN:
- Label (Jost): "FIND US" — 0.6rem, #2BA8B2, tracking 4px
- Heading (Pacifico): "Come in. We've been waiting."
  clamp(2rem, 3vw, 2.8rem), color: #991001, line-height 1.2
- Details (Lora, 0.85rem, color: #BA1C0A at 70%, line-height 2.2):
  Thrikkakara, Kakkanad
  Kochi, Kerala 682021
  
  Mon – Sat: 10:00 AM – 10:00 PM
  Sunday: Closed
  
  Peak hours: 4:00 PM – 10:00 PM
  
  sweettalks.in · info@sweetalks.in

- Buttons row (gap 12px):
  "Open in Maps" — border: 1px solid #EDE5E5, color: #991001, 
                    border-radius 50px, Jost 0.65rem, padding 12px 24px
  "WhatsApp Order" — border: 1px solid #2BA8B2, color: #2BA8B2,
                      same sizing, hover: bg #2BA8B2, color white

RIGHT COLUMN:
- expand-map component, centered
- Click hint text: Jost 0.6rem, #74C0C6

---

### I. CONTACT / SOCIAL — "Connect With Us"
**Component:** social-icons.tsx (verbatim from /components/ui/)
**File:** Embedded in Footer component
Background: #0D0D0D (continuous into footer)

Override social-icons component:
Container: background: rgba(186,28,10,0.15), border: 1px solid 
rgba(186,28,10,0.2), border-radius: 1.5rem

Replace default socials array with Sweet Talks platforms:
1. Instagram — href: "https://instagram.com/sweettalks.thrikkakara"
   Tooltip: "Instagram"
   Hover icon color: white
   Hover bg pill: rgba(186,28,10,0.3)
2. Facebook — href: "https://facebook.com/sweetalks"
   Tooltip: "Facebook"
3. WhatsApp — custom WhatsApp SVG icon
   href: "https://wa.me/[number]"
   Tooltip: "WhatsApp"
4. Google Maps — MapPin icon (Lucide)
   href: "https://maps.google.com/?q=Sweetalks+Thrikkakara"
   Tooltip: "Find Us"

Active underline indicator: background: #BA1C0A
Tooltip: background white, text #0D0D0D

---

### J. FOOTER — "Too Good to Resist"
**Component:** hover-footer.tsx (verbatim from /components/ui/)
**File:** /components/Footer.tsx
Background: #0D0D0D (dark)

Override component styles:
- footer container: background rgba(153,16,1,0.08) — very subtle crimson tint
- border: 1px solid rgba(186,28,10,0.15)
- border-radius: rounded-t-[3rem] (top corners only)
- margin: 0 (no margin — full bleed from contact section)

TextHoverEffect:
- text="Sweetalks"
- Font override: use Pacifico via CSS — the SVG text element gets
  fontFamily: 'Pacifico, cursive'
- Stroke color (animated draw): #BA1C0A instead of #3ca2fa
- Gradient stops on hover: 
  0%: #74C0C6, 25%: #BA1C0A, 50%: #F8F2F2, 75%: #2BA8B2, 100%: #991001

FooterBackgroundGradient:
Override the radial gradient:
background: radial-gradient(125% 125% at 50% 10%, 
  rgba(153,16,1,0.15) 50%, rgba(43,168,178,0.1) 100%)

Footer grid (4 columns):
Column 1 — Brand:
- "Sweetalks" in Pacifico, 1.6rem, color: #BA1C0A
- Tagline (Lora italic): "Too Good to Resist."
  0.85rem, rgba(248,242,242,0.6)
- FSSAI badge: Jost 0.55rem, rgba(255,255,255,0.2), tracking 1px
  "FSSAI Licensed · Made Fresh Daily"
- Social icons cluster (social-icons.tsx adapted — see section I)

Column 2 — Navigate:
Label: Jost 0.6rem, #74C0C6, tracking 3px, uppercase — "NAVIGATE"
Links (Jost 0.65rem, rgba(255,255,255,0.35), tracking 2px):
Story · Menu · Gallery · Custom Orders · Find Us
Hover: color #74C0C6, translateY(-1px)

Column 3 — Order:
Label: Jost 0.6rem, #74C0C6, tracking 3px, uppercase — "ORDER"
Links: WhatsApp Order · Custom Cake · Book a Table · Full Menu PDF
+ "Order Now" button: background #BA1C0A, color white, 
  border-radius 50px, padding 10px 20px, Jost 0.65rem
  Hover: sliding span to #991001

Column 4 — Find Us:
Label: Jost 0.6rem, #74C0C6, tracking 3px, uppercase — "FIND US"
Content (Lora, 0.75rem, rgba(255,255,255,0.4), line-height 2):
Thrikkakara, Kakkanad
Kochi, Kerala
Mon–Sat 10am–10pm
sweettalks.in
info@sweetalks.in

Divider: border-top 1px solid rgba(255,255,255,0.06)

Footer bottom bar:
- LEFT: Social icons cluster
- CENTER: "© 2026 Sweetalks Thrikkakara. All rights reserved."
  Jost 0.58rem, rgba(255,255,255,0.2), tracking 1px
- RIGHT: "FSSAI Licensed · Designed by Adchemy, Kochi"
  Same styling

TextHoverEffect: rendered below grid, h-[28rem] on lg screens,
-mt-40 -mb-28 pull to overlap bottom bar slightly

---

## RESPONSIVE BREAKPOINTS

Mobile (< 640px):
- All 2-column sections → 1 column, carousel/gallery stacks below copy
- Navbar: hide center links, show hamburger
- Hero: font sizes use clamp minimums, content left-padded 24px
- Product grid: 1 column
- Testimonials: 1 column (hide col 2 and 3)
- Footer grid: 1 column, stacked

Tablet (640px – 1024px):
- Most 2-column grids maintain
- Product grid: 2 columns
- Testimonials: 2 columns (hide col 3)
- Footer: 2×2 grid

Desktop (> 1024px):
- Full layout as specified above

---

## BUILD SEQUENCE

1. Set up shadcn project: npx shadcn@latest init
   Install: tailwindcss, framer-motion, motion, gsap, lucide-react
   Google Fonts: add Pacifico, Jost, Lora links to index.html

2. Drop all 21st.dev components verbatim into /components/ui/:
   - liquid-glass.tsx
   - carousel-circular-image-gallery.tsx
   - testimonials-columns-1.tsx
   - hover-footer.tsx
   - expand-map.tsx
   - social-icons.tsx

3. Add noise overlay to index.css

4. Build section components A → J in order

5. Wire GSAP ScrollTrigger on all scroll-reveal animations

6. Assemble in App.tsx — sections in order:
   Navbar → Hero → Story → Menu → Gallery → Testimonials → 
   Reservation → Location → Footer

7. Test: all animations fire, all tabs switch, form submits, 
   map expands, carousel autoplays, testimonials scroll

**Execution Directive:**
Do not build a website. Build a digital instrument for a dessert cafe 
that has a neon sign reading "Moments made sweeter" and crimson velvet 
sofas and a teal ceiling. The website must feel like walking through 
that door. Every scroll intentional. Every animation weighted. Every 
color chosen. No generic AI cafe output. Eradicate all beige.

# SECURITY — NON-NEGOTIABLE:

Frontend:
- Security headers in next.config.js:
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: restrict to actual domains used

Database:
- RLS enabled on all tables before any data is written
- WITH CHECK on all INSERT and UPDATE policies
- Identity always from auth.uid() — never from request body
- Service role key: server-side only, never NEXT_PUBLIC_

API Routes:
- Every route calls supabase.auth.getUser() first
- Zod validation on all inputs before touching database
- Return generic error messages — never expose stack traces

Rate Limiting (Upstash):
- OTP endpoint: max 3 requests per phone per hour
- Contact form: max 5 submissions per IP per hour
- Points insert: max 20 per staff account per hour

Dependencies:
- npm audit clean before every deploy
- Lockfile committed to repo
- No unused packages