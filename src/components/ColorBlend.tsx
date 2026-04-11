"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION_COLORS defines the target background color for each section.
 * The IDs must match the 'id' attributes on the section elements.
 */
const SECTION_COLORS = [
  { id: "#hero", color: "#0D0D0D" },         // Hero: Dark
  { id: "#story", color: "#FFFFFF" },        // Story: White
  { id: "#menu", color: "#2BA8B2" },         // Menu: Teal
  { id: "#gallery", color: "#F8F2F2" },      // Gallery: Near-White
  { id: "#testimonials", color: "#BA1C0A" }, // Testimonials: Crimson/Deep Red
  { id: "#orders", color: "#2BA8B2" },       // Reservation: Teal
  { id: "#location", color: "#FFFFFF" },     // Location: White
  { id: "#faq", color: "#FFFFFF" },          // FAQ: White
  { id: "#footer", color: "#0D0D0D" },       // Footer: Dark
];

export default function ColorBlend() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a ScrollTrigger for each section to transition the background color
      SECTION_COLORS.forEach((config, i) => {
        const nextConfig = SECTION_COLORS[i + 1];
        
        // If there's a next section, blend between them as we scroll
        if (nextConfig) {
          ScrollTrigger.create({
            trigger: config.id,
            start: "bottom 85%", // Start blending when current section's bottom hits 85% of viewport
            end: "bottom 15%",   // Finish blending when current section's bottom hits 15% of viewport
            scrub: true,
            onUpdate: (self) => {
              if (bgRef.current) {
                const color = gsap.utils.interpolate(config.color, nextConfig.color, self.progress);
                gsap.set(bgRef.current, { backgroundColor: color });
              }
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={bgRef}
      className="fixed inset-0 z-[-1] pointer-events-none will-change-[background-color]"
      style={{ backgroundColor: SECTION_COLORS[0].color }}
    />
  );
}
