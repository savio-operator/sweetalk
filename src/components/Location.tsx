"use client";

import React, { useRef } from "react";
import { ExpandMap } from "@/components/ui/expand-map";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Location() {
  const sectionRef = useRef<HTMLElement>(null);
  const locTextRef = useRef<SVGTextElement>(null);

  useGSAP(() => {
    gsap.from(".loc-left > *", {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.9,
      ease: "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reset",
      },
    });

    gsap.from(".loc-right", {
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none reset",
      },
    });

    // SVG heading: crimson stroke draws in → fill fades in → stroke fades out
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reset",
      },
    })
      .fromTo(
        locTextRef.current as unknown as Element,
        { strokeDashoffset: 4000, fill: "rgba(186,28,10,0)", strokeOpacity: 1 },
        { strokeDashoffset: 0, fill: "rgba(186,28,10,1)", duration: 2.5, ease: "power2.inOut" }
      )
      .to(
        locTextRef.current as unknown as Element,
        { strokeOpacity: 0, duration: 0.4, ease: "power2.out" }
      );
  }, { scope: sectionRef });

  return (
    <section
      id="location"
      ref={sectionRef}
      className="snap-section bg-brand-white min-h-screen py-16 md:py-24 px-7 md:px-16 lg:px-32 flex flex-col items-center"
    >
      <h2 className="sr-only">Our Location — Sweetalks Kochi</h2>
      <div className="max-w-[520px] mx-auto flex flex-col items-center gap-10 md:gap-14">

        {/* Text Content — centered */}
        <div className="loc-left flex flex-col items-center text-center w-full">

          <div className="relative w-full max-w-[744px] h-[46px] md:h-[120px] mb-6 mt-2 flex items-center justify-center overflow-visible pointer-events-none">
             <svg className="w-full h-full overflow-visible" viewBox="0 0 1100 160" preserveAspectRatio="xMidYMid meet"
                  role="img" aria-label="Come in. We've been waiting.">
                <title>Come in. We&apos;ve been waiting.</title>
                <text
                  ref={locTextRef}
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="89"
                  className="location-heading-text"
                  fontFamily="Charlotte, cursive"
                  stroke="#BA1C0A"
                  strokeWidth="2"
                  strokeDasharray="4000"
                  strokeDashoffset="4000"
                  fill="rgba(186,28,10,0)"
                >
                  Come in. We&apos;ve been waiting.
                </text>
             </svg>
          </div>

          <div className="font-lora text-[0.82rem] md:text-[0.85rem] text-brand-crimson/70 leading-[2] md:leading-[2.2] mb-8 md:mb-10 text-center">
            <address className="not-italic">
              <p>38/3416, Pipeline Road, Kalamassery</p>
              <p>Thrikkakara, Kochi, Kerala 682033</p>
              <br className="md:hidden" />
              <p>Mon &ndash; Sun: 12:00 PM &ndash; 12:00 AM</p>
              <br />
              <p>
                <a href="tel:+916235745985" className="hover:text-brand-crimson transition-colors">+91 62357 45985</a>
              </p>
              <p className="flex flex-col md:block gap-1">
                <a href="https://sweettalks.in" className="hover:text-brand-crimson transition-colors">sweettalks.in</a>
                <span className="hidden md:inline">{' · '}</span>
                <a href="mailto:info@sweetalks.in" className="hover:text-brand-crimson transition-colors">info@sweetalks.in</a>
              </p>
            </address>
          </div>

          <div className="flex flex-wrap gap-2.5 md:gap-3 justify-center">
            <a
              href="https://maps.google.com/?q=Sweetalks+Thrikkakara"
              target="_blank"
              rel="noreferrer"
              className="btn-pill !px-5 md:!px-8 !py-3 md:!py-3.5 !border-brand-off-white !text-brand-deep-red hover:bg-[#F8F2F2] !bg-transparent text-[0.65rem] md:text-[0.7rem]"
            >
              Open in Maps
            </a>
            <a
              href="https://www.zomato.com/"
              target="_blank"
              rel="noreferrer"
              className="btn-pill !px-5 md:!px-8 !py-3 md:!py-3.5 !border-brand-teal !text-brand-teal hover:!text-white hover:!bg-brand-teal !bg-transparent text-[0.65rem] md:text-[0.7rem]"
            >
              Order on Zomato
            </a>
            <a
              href="https://www.swiggy.com/city/kochi/sweetalks-edapally-rest1320373"
              target="_blank"
              rel="noreferrer"
              className="btn-pill !px-5 md:!px-8 !py-3 md:!py-3.5 !border-brand-crimson !text-brand-crimson hover:!text-white hover:!bg-brand-crimson !bg-transparent text-[0.65rem] md:text-[0.7rem]"
            >
              Order on Swiggy
            </a>
          </div>
        </div>

        {/* Map — centered below */}
        <div className="loc-right w-full flex justify-center px-4 md:px-0">
          <ExpandMap location="Sweetalks, Thrikkakara" coordinates="10.0159° N, 76.3419° E" />
        </div>

      </div>
    </section>
  );
}
