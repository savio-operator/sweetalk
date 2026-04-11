"use client";

import React, { useRef } from "react";
import FAQCardStack from "@/components/ui/animate-card-animation";

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="bg-brand-white py-15 md:py-21 px-8 md:px-20 lg:px-0 items-center justify-center"
    >
      <div className="max-w-[780px] w-full mx-auto flex flex-col items-center">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12 px-2">
          <p className="section-label mb-3 md:mb-4 text-[0.60rem] md:text-[0.66rem]">
            QUICK ANSWERS
          </p>
          <h2 className="font-charlotte text-brand-deep-red text-[clamp(2.11rem,6.6vw,4.0rem)] leading-[1.2] mb-[8px]">
            Everything you need to know.
          </h2>
          <p className="font-lora italic text-[1.05rem] md:text-[1.21rem] text-brand-crimson/65 leading-[1.8] md:leading-[1.9] max-w-[480px]">
            Hours, orders — the questions we hear most, answered clearly.
          </p>
        </div>

        {/* Card stack */}
        <div className="w-full">
          <FAQCardStack />
        </div>

      </div>
    </section>
  );
}
