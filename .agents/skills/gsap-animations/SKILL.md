---
name: sweetalks-gsap-animations
description: GSAP 3 + ScrollTrigger animation patterns for Sweetalks. Includes cleanup patterns, easing values, and section-specific animation specs.
---

# GSAP Animation Patterns — Sweetalks

## Setup

```bash
npm install gsap @gsap/react
```

Register ScrollTrigger once at app level:
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

---

## Core Pattern — useEffect + gsap.context()

**Every component MUST follow this pattern to prevent memory leaks:**

```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SectionComponent() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // All GSAP animations go here
      gsap.from('.element', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.element',
          start: 'top 80%',
        },
      });
    }, sectionRef); // Scope to section ref

    return () => ctx.revert(); // CLEANUP — mandatory
  }, []);

  return <section ref={sectionRef}>...</section>;
}
```

---

## Easing Values

| Purpose | Easing | Value |
|---------|--------|-------|
| Entrance animations | power3.out | `ease: 'power3.out'` |
| Morph / transform | power2.inOut | `ease: 'power2.inOut'` |
| Micro-interactions (CSS) | cubic-bezier | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |

---

## Stagger Values

| Element Type | Stagger Delay |
|-------------|---------------|
| Text words | `0.08s` |
| Cards / containers | `0.15s` |

---

## ScrollTrigger Defaults

```typescript
scrollTrigger: {
  trigger: element,
  start: 'top 80%',    // Standard for most elements
  toggleActions: 'play none none none', // Play once
}
```

---

## Section-Specific Animations

### Navbar (A)
```typescript
// Stagger fade-up after page load
gsap.from('.nav-element', {
  y: 20,
  opacity: 0,
  stagger: 0.08,
  delay: 0.3,
  duration: 0.7,
  ease: 'power3.out',
});
```

### Hero (B)
```typescript
const tl = gsap.timeline({ delay: 0.2 });

tl.from('.hero-eyebrow', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' })
  .from('.hero-headline', { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.55')
  .from('.hero-sub', { y: 20, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.55')
  .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.55');
```

### Story (C)
```typescript
// Left column: stagger fade-up
gsap.from('.story-text > *', {
  y: 40,
  opacity: 0,
  stagger: 0.15,
  duration: 0.9,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.story-section', start: 'top 80%' },
});

// Right column: clip-path reveal on images
gsap.from('.story-image', {
  clipPath: 'inset(100% 0 0 0)',
  duration: 1.2,
  stagger: 0.2,
  ease: 'power2.inOut',
  scrollTrigger: { trigger: '.story-images', start: 'top 80%' },
});
```

### Menu (D)
```typescript
// Cards stagger entrance
gsap.from('.menu-card', {
  y: 40,
  opacity: 0,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.menu-grid', start: 'top 80%' },
});
```

### General Scroll Reveal
```typescript
// Reusable pattern for any element
gsap.utils.toArray('.scroll-reveal').forEach((el) => {
  gsap.from(el as Element, {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el as Element,
      start: 'top 80%',
    },
  });
});
```

---

## Common Mistakes to Avoid

1. **Missing cleanup** — Always `return () => ctx.revert()` in useEffect
2. **Not scoping** — Always pass a ref as second arg to `gsap.context()`
3. **Linear easing** — Never use `ease: 'none'` or `ease: 'linear'`
4. **Missing ScrollTrigger registration** — `gsap.registerPlugin(ScrollTrigger)` at top of file
5. **Animating layout properties** — Prefer `transform` and `opacity` for performance
6. **Too fast** — Minimum duration 0.6s for entrance animations
