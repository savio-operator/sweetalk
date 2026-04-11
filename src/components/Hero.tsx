"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(".hero-eyebrow", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" })
        .from(".hero-headline", { y: 50, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.55")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.55")
        .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.55");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="hero"
      ref={sectionRef} 
      className="snap-section relative h-screen min-h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center bg-brand-dark px-7 md:px-16"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(186,28,10,0.4) 0%, transparent 80%)"
        }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
           background: "linear-gradient(to top, #BA1C0A 0%, transparent 60%)"
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
         <p className="hero-eyebrow font-jost font-bold text-[0.7rem] md:text-[1.15rem] tracking-[3px] md:tracking-[4px] uppercase text-brand-light-teal mb-2 md:mb-3 relative -top-0.5">
           EVERYONE
         </p>

         <h1 className="hero-headline font-charlotte text-brand-near-white text-[clamp(2.2rem,10vw,7rem)] leading-[1.1] md:leading-[1.05]">
           deserves the best.
         </h1>
         
         <p className="hero-sub font-lora italic text-[0.8rem] md:text-[1rem] text-[#F8F2F2]/75 max-w-[280px] md:max-w-[380px] leading-[1.6] md:leading-[1.7] mt-4 md:mt-4">
           Made with love. Remembered always.
         </p>

         <div className="hero-buttons flex flex-wrap justify-center gap-3 mt-8 md:mt-8">
            <a href="#menu" className="btn-pill btn-pill-primary !px-6 md:!px-8">
              Explore Menu
            </a>
            <a href="https://www.zomato.com/" target="_blank" rel="noreferrer" className="btn-pill btn-pill-outline !px-6 md:!px-8">
              Order on Zomato
            </a>
         </div>
      </div>
    </section>
  );
}
