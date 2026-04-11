"use client";

import React, { useRef } from "react";
import { TestimonialsGrid } from "@/components/ui/testimonials-columns-1";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloatingPaths } from "@/components/ui/background-paths";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote: "The Belgium brownie is unlike anything else in Kochi. The texture, the depth — it's made by someone who actually cares about the craft.",
    author: "Arjun M.",
    role: "Thrikkakara · Google Review",
  },
  {
    quote: "The pistachio falooda here is something else entirely. Layered, rich, and perfectly balanced — we drove from Ernakulam just for this. Worth every minute.",
    author: "Meera T.",
    role: "Kakkanad · Google Review",
  },
  {
    quote: "The pistachio falooda is a must. Came once, became a weekly regular. Hidden gem in Thrikkakara.",
    author: "Rohit S.",
    role: "Kochi · Google Review",
  },
  {
    quote: "Genuinely French-quality pastries. The Pista-Berry Toast is something I haven't found anywhere else in Kerala.",
    author: "Divya K.",
    role: "Ernakulam · Google Review",
  },
  {
    quote: "The space itself is beautiful — that neon sign, the teal ceiling. But the desserts are what keep bringing us back.",
    author: "Sanjay R.",
    role: "Kakkanad · Google Review",
  },
  {
    quote: "Ordered the Lotus Shake and the Loaded Fries together. The combination shouldn't work. It absolutely does. Come hungry.",
    author: "Priya N.",
    role: "Thrikkakara · Google Review",
  },
  {
    quote: "Sweetalks has become our family's weekly ritual. The Belgium brownie is consistently perfect — dense, fudgy, and made with obvious care. Nowhere else in Kochi comes close.",
    author: "Anil V.",
    role: "Kochi · Google Review",
  },
  {
    quote: "The Chocoberry Mess is worth every rupee. Brownie base, strawberry ice cream, housemade sauce — it's chaos in the best way.",
    author: "Fatima S.",
    role: "Kakkanad · Google Review",
  },
  {
    quote: "I've been to a lot of cafes in Kochi. Sweetalks has the most distinctive identity — the brand, the food, the space all feel intentional. That's rare.",
    author: "Kiran J.",
    role: "Ernakulam · Google Review",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const testTextRef = useRef<SVGTextElement>(null);
  const testHeadContRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Sub-content fade up
    gsap.from(".test-sub", {
      y: 40, opacity: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%", end: "bottom top",
        toggleActions: "play none play reset",
      },
    });

    // Heading container scale in — paused, explicit replay
    const containerTween = gsap.fromTo(
      testHeadContRef.current,
      { scale: 0.93, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out", paused: true }
    );

    // SVG heading: light-teal stroke draws in → near-white fill → stroke fades out
    const headingTl = gsap.timeline({ paused: true })
      .fromTo(
        testTextRef.current as unknown as Element,
        { strokeDashoffset: 3500, fill: "rgba(248,242,242,0)", strokeOpacity: 1 },
        { strokeDashoffset: 0, fill: "rgba(248,242,242,1)", duration: 2.6, ease: "power2.inOut" }
      )
      .fromTo(
        testTextRef.current as unknown as Element,
        { strokeOpacity: 1 },
        { strokeOpacity: 0, duration: 0.15, ease: "power2.out" }
      );

    const reset  = () => { headingTl.progress(0).pause(); containerTween.progress(0).pause(); };
    const replay = () => { headingTl.restart(); containerTween.restart(); };

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      end: "bottom top",
      onEnter:     replay,
      onEnterBack: replay,
      onLeave:     reset,
      onLeaveBack: reset,
    });
  }, { scope: sectionRef });

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: TESTIMONIALS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Review",
        author: { "@type": "Person", name: t.author },
        reviewBody: t.quote,
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        publisher: {
          "@type": "Organization",
          name: "Google Review",
        },
      },
    })),
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="snap-section bg-brand-deep-red min-h-screen py-16 md:py-24 px-7 md:px-16 lg:px-32 relative overflow-hidden"
    >
      {/* Floating paths — brighter white/teal on deep crimson */}
      <FloatingPaths position={1}  color="#F8F2F2" opacityScale={0.28} />
      <FloatingPaths position={-1} color="#74C0C6" opacityScale={0.22} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }} />
      <h2 className="sr-only">Customer Testimonials — Sweetalks Kochi</h2>
      <div className="max-w-[1302px] mx-auto relative z-10">
        <div className="test-header flex flex-col items-center text-center mb-10 md:mb-28">
          {/* SVG heading: scales in + light-teal stroke draws → near-white fill → stroke out */}
          <div ref={testHeadContRef}
               style={{ width: "100%", maxWidth: "762px", height: "clamp(46px, 10vw, 107px)" }}
               className="flex items-center justify-center overflow-visible mx-auto mb-4 md:mb-6">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 1100 140"
                 preserveAspectRatio="xMidYMid meet"
                 role="img" aria-label="Made with love. Remembered always.">
              <title>Made with love. Remembered always.</title>
              <text
                ref={testTextRef}
                x="50%" y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="69"
                className="testimonials-heading-text"
                fontFamily="Charlotte, cursive"
                stroke="#2BA8B2"
                strokeWidth="1.5"
                strokeDasharray="3500"
                strokeDashoffset="3500"
                fill="rgba(248,242,242,0)"
              >
                Made with love. Remembered always.
              </text>
            </svg>
          </div>
          <div className="test-sub flex flex-col items-center gap-2">
            <div className="text-brand-light-teal text-[1rem] md:text-[1.2rem] tracking-widest">★★★★★</div>
            <p className="font-lora italic text-[0.75rem] md:text-[0.85rem] text-[#F8F2F2]/60 max-w-[280px] md:max-w-none">
              Rated 4.7 — Thrikkakara&apos;s favourite dessert cafe
            </p>
          </div>
        </div>

        <TestimonialsGrid testimonials={TESTIMONIALS} />
      </div>
    </section>
  );
}
