"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloatingPaths } from "@/components/ui/background-paths";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const storyTextRef = useRef<SVGTextElement>(null);
  const storyHeadRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Body box — one-shot entrance
    gsap.from(".story-box", {
      y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });

    // Heading container — paused, explicit replay
    const containerTween = gsap.fromTo(
      storyHeadRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", paused: true }
    );

    // SVG heading: stroke draws → fill in → stroke out (0.15s)
    const headingTl = gsap.timeline({ paused: true })
      .fromTo(
        storyTextRef.current as unknown as Element,
        { strokeDashoffset: 3500, fill: "rgba(186,28,10,0)", strokeOpacity: 1 },
        { strokeDashoffset: 0, fill: "rgba(186,28,10,1)", duration: 2.4, ease: "power3.out" }
      )
      .fromTo(
        storyTextRef.current as unknown as Element,
        { strokeOpacity: 1 },
        { strokeOpacity: 0, duration: 0.15, ease: "power2.out" }
      );

    const replay = () => { headingTl.restart(); containerTween.restart(); };

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 78%",
      once: true,
      onEnter: replay,
    });
  }, { scope: sectionRef });

  return (
    <section
      id="story"
      ref={sectionRef}
      className="snap-section bg-brand-white min-h-screen pt-16 md:pt-32 pb-16 md:pb-32 px-7 md:px-16 lg:px-32 relative overflow-hidden"
    >
      {/* Floating paths — brand teal, darker on white */}
      <FloatingPaths position={1}  color="#2BA8B2" opacityScale={0.22} />
      <FloatingPaths position={-1} color="#2BA8B2" opacityScale={0.18} />

      <div className="max-w-[1070px] mx-auto relative z-10">
        <div className="story-text flex flex-col items-center gap-8 md:gap-12 w-full text-center">

          <div ref={storyHeadRef} className="flex flex-col w-full text-center items-center">
            <h2 className="sr-only">Our Story — Sweetalks</h2>
            <div style={{ width: "100%", maxWidth: "762px", height: "clamp(46px, 11vw, 102px)", position: "relative" }}
                 className="flex items-center justify-center overflow-visible">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 1100 130"
                   preserveAspectRatio="xMidYMid meet"
                   role="img" aria-label="Our Story — Sweetalks">
                <title>Our Story — Sweetalks</title>
                <text
                  ref={storyTextRef}
                  x="50%" y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="82"
                  fontFamily="Charlotte, cursive"
                  stroke="#2BA8B2"
                  strokeWidth="1.5"
                  strokeDasharray="3500"
                  strokeDashoffset="3500"
                  fill="rgba(186,28,10,0)"
                >
                  Our Story — Sweetalks
                </text>
              </svg>
            </div>
          </div>

          <div className="story-box flex flex-col gap-5 md:gap-6 font-lora text-[0.85rem] md:text-[0.945rem] leading-[1.8] md:leading-[2.1] text-justify rounded-[1.5rem] md:rounded-[2rem] shadow-sm"
            style={{
              padding: "clamp(22px, 5.5vw, 54px)",
              width: "100%",
              maxWidth: "984px",
              margin: "0 auto",
              border: "1px solid rgba(43,168,178,0.2)",
              background: "rgba(43,168,178,0.05)",
              color: "rgba(186,28,10,0.85)",
            }}
          >
            <p>
              Sweetalks did not begin as a brand; it began as a quiet conviction in the mind of a working chef. A belief that everyone deserves the best, rushed recipes, and shortcuts disguised as specials. The idea was simple and stubborn: everyone deserves the best, and Sweetalks would exist to give people the taste they truly deserve.
            </p>
            <p>
              The name &quot;Sweetalks&quot; reflects what the brand really wants to create. Not just transactions, but conversations. Between chef and guest, between craft and comfort, between a busy day and a quiet moment with something genuinely well-made. Clear ingredients, clear stories, and no gimmicks hiding behind the glaze.
            </p>
            <p>
              Today, Sweetalks is still evolving, but the heart of it has not changed. Whether you walk in after a long day or discover us for the first time on a screen, the promise stays the same: you deserve the best, and Sweetalks is here to prove it, one dessert at a time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
