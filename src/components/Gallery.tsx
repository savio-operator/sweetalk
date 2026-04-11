"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  { src: "/images/IMG-20260320-WA0024.jpg", alt: "Signature Chocoberry Mess dessert at Sweetalks Kochi" },
  { src: "/images/IMG-20260320-WA0029.jpg", alt: "Authentic Pistachio Kunafa with vanilla ice cream" },
  { src: "/images/IMG-20260310-WA0021.jpg", alt: "Retro-modern cafe interior of Sweetalks Thrikkakara" },
  { src: "/images/IMG-20260320-WA0057.jpg", alt: "Selection of artisan pastries and sweet treats" },
  { src: "/images/IMG_20260309_115935_642.jpg", alt: "Royal Fruit Carnival Falooda special" },
  { src: "/images/IMG_20260309_115807_606.jpg", alt: "Gourmet Pista-Berry Toast breakfast" },
  { src: "/images/IMG-20260320-WA0030.jpg", alt: "Classic Belgium Brownie - Sweetalks bestseller" },
  { src: "/images/IMG-20260320-WA0052.jpg", alt: "Layered Pistachio Kunafa Falooda in Kochi" },
  { src: "/images/IMG-20260320-WA0031.jpg", alt: "Creamy Cold Coffee brew at Sweetalks cafe" },
  { src: "/images/IMG-20260320-WA0032.jpg", alt: "Inferno Chicken Pasta - savoury delights" },
];

const DOUBLED = [...GALLERY_IMAGES, ...GALLERY_IMAGES];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const galleryTextRef = useRef<SVGTextElement>(null);
  const galleryHeadContRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Carousel rows — infinite, unaffected by replay logic
    gsap.to(row1Ref.current, { x: "-50%", duration: 35, ease: "none", repeat: -1 });
    gsap.set(row2Ref.current, { x: "-50%" });
    gsap.to(row2Ref.current, { x: "0%", duration: 35, ease: "none", repeat: -1 });

    // Sub-text with replay
    gsap.from(".gallery-sub", {
      y: 30, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current, start: "top 80%", end: "bottom top",
        toggleActions: "play none play reset",
      },
    });

    // Heading container — paused, explicit replay
    const containerTween = gsap.fromTo(
      galleryHeadContRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.0, ease: "power2.out", paused: true }
    );

    // SVG heading: stroke draws → fill in → stroke out (0.15s)
    const headingTl = gsap.timeline({ paused: true })
      .fromTo(
        galleryTextRef.current as unknown as Element,
        { strokeDashoffset: 3500, fill: "rgba(186,28,10,0)", strokeOpacity: 1 },
        { strokeDashoffset: 0, fill: "rgba(186,28,10,1)", duration: 3.4, ease: "power1.in" }
      )
      .fromTo(
        galleryTextRef.current as unknown as Element,
        { strokeOpacity: 1 },
        { strokeOpacity: 0, duration: 0.15, ease: "power2.out" }
      );

    const replay = () => { headingTl.restart(); containerTween.restart(); };

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      once: true,
      onEnter: replay,
    });
  }, { scope: sectionRef });

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="snap-section bg-brand-near-white pt-12 md:pt-32 pb-10 md:pb-[90px] overflow-hidden mt-[25px] md:mt-0"
      style={{ minHeight: '80vh' }}
    >
      <h2 className="sr-only">Our Gallery — Sweetalks Kochi</h2>
      <div className="gallery-header flex flex-col items-center text-center mb-12 md:mb-16 px-8 md:px-16 lg:px-32">
        <div ref={galleryHeadContRef}
             style={{ width: "100%", maxWidth: "800px", height: "clamp(46px, 9vw, 98px)" }}
             className="flex items-center justify-center overflow-visible mx-auto mb-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1100 130"
               preserveAspectRatio="xMidYMid meet"
               role="img" aria-label="Every bite, a moment worth sharing.">
            <title>Every bite, a moment worth sharing.</title>
            <text
              ref={galleryTextRef}
              x="50%" y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="69"
              className="gallery-heading-text"
              fontFamily="Charlotte, cursive"
              stroke="#BA1C0A"
              strokeWidth="1.5"
              strokeDasharray="3500"
              strokeDashoffset="3500"
              fill="rgba(186,28,10,0)"
            >
              Every bite, a moment worth sharing.
            </text>
          </svg>
        </div>
        <p className="gallery-sub font-lora italic text-[0.8rem] md:text-[0.85rem] text-brand-crimson/65 max-w-[298px] md:max-w-[446px] leading-[1.7] md:leading-[1.9] mt-[28px] md:mt-4">
          From our display counter to your table. Each dessert at Sweetalks is made to be seen, shared, and remembered.
        </p>
        </div>

        <div className="w-full overflow-hidden mt-[100px] md:mt-0">

      <div className="w-full overflow-hidden mt-0">
        <div ref={row1Ref} className="flex gap-2 md:gap-4 w-max will-change-transform">
          {DOUBLED.map((img, i) => (
            <div key={`r1-${i}`} className="relative w-[143px] md:w-[260px] h-[112px] md:h-[186px] rounded-[0.8rem] md:rounded-[1.2rem] overflow-hidden flex-shrink-0">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 143px, 260px" />
            </div>
          ))}
        </div>
      </div>

      <div className="h-8 md:h-16" />

      <div className="w-full overflow-hidden">
        <div ref={row2Ref} className="flex gap-2 md:gap-4 w-max will-change-transform">
          {DOUBLED.map((img, i) => (
            <div key={`r2-${i}`} className="relative w-[143px] md:w-[260px] h-[112px] md:h-[186px] rounded-[0.8rem] md:rounded-[1.2rem] overflow-hidden flex-shrink-0">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 143px, 260px" />
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
