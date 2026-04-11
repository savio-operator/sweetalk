"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollBlend() {
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section"));

    sections.forEach((section) => {
      // Each section rises 18px into its final position as it enters the viewport.
      // Animates the section element itself — doesn't touch children or their transforms.
      const t = ScrollTrigger.create({
        trigger: section,
        start: "top 100%",
        end: "top 55%",
        scrub: 1.8,
        onUpdate: (self) => {
          gsap.set(section, {
            y: (1 - self.progress) * 18,
          });
        },
        onLeaveBack: () => {
          gsap.set(section, { y: 18 });
        },
      });
      triggers.push(t);

      // As section exits at the top, it very subtly recedes (scale + opacity)
      // giving the next section a "coming forward" feel.
      const tExit = ScrollTrigger.create({
        trigger: section,
        start: "bottom 55%",
        end: "bottom -5%",
        scrub: 1.2,
        onUpdate: (self) => {
          gsap.set(section, {
            scale: 1 - self.progress * 0.025,
            opacity: 1 - self.progress * 0.18,
            transformOrigin: "center top",
          });
        },
        onLeaveBack: () => {
          gsap.set(section, { scale: 1, opacity: 1 });
        },
      });
      triggers.push(tExit);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
