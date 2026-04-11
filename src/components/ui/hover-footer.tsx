"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function WritingReveal({ text }: { text: string }) {
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const el = textRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { strokeDashoffset: 3000 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "bottom -20%",
            scrub: 6,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 800 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          ref={textRef}
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="140"
          fontFamily="Charlotte, cursive"
          fill="transparent"
          stroke="#BA1C0A"
          strokeWidth="1.5"
          strokeDasharray="3000"
          strokeDashoffset="3000"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

export function FooterBackgroundGradient({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full bg-brand-dark overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, rgba(186,28,10,0.15) 50%, rgba(43,168,178,0.1) 100%)",
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
