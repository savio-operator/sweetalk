"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FAQCardStack from "@/components/ui/animate-card-animation";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".faq-header > *", {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reset",
      },
    });

    gsap.from(".faq-stack-wrap", {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: ".faq-stack-wrap",
        start: "top 85%",
        toggleActions: "play none none reset",
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="snap-section bg-brand-white py-15 md:py-21 px-8 md:px-20 lg:px-0 items-center justify-center flex flex-col"
    >
      <div className="max-w-[780px] w-full mx-auto flex flex-col items-center">

        {/* Header */}
        <div className="faq-header flex flex-col items-center text-center mb-10 md:mb-12 px-2">
          <h2 className="font-charlotte text-brand-deep-red text-[clamp(2.11rem,6.6vw,4.0rem)] leading-[1.2] mb-[8px]">
            Everything you need to know.
          </h2>
          <p className="font-lora italic text-[1.05rem] md:text-[1.21rem] text-brand-crimson/65 leading-[1.8] md:leading-[1.9] max-w-[480px]">
            Hours, orders — the questions we hear most, answered clearly.
          </p>
        </div>

        {/* Animated card stack */}
        <div className="faq-stack-wrap w-full">
          <FAQCardStack />
        </div>

      </div>
    </section>
  );
}

