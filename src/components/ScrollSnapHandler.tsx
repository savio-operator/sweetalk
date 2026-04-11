"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, ScrollToPlugin, Observer } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

export default function ScrollSnapHandler() {
  const isAnimating = useRef(false);

  useEffect(() => {
    // Only run on desktop/larger screens
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    const sections = gsap.utils.toArray(".snap-section") as HTMLElement[];
    if (sections.length === 0) return;

    let currentIndex = -1;

    // Find initial index
    const scrollPos = window.scrollY;
    sections.forEach((section, i) => {
      if (Math.abs(section.offsetTop - scrollPos) < 50) {
        currentIndex = i;
      }
    });
    if (currentIndex === -1) currentIndex = 0;

    const gotoSection = (index: number, direction: number) => {
      if (index < 0 || index >= sections.length || isAnimating.current) return;
      
      isAnimating.current = true;
      currentIndex = index;

      gsap.to(window, {
        scrollTo: { y: sections[index].offsetTop, autoKill: false },
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          isAnimating.current = false;
        }
      });
    };

    const obs = Observer.create({
      type: "wheel,touch,pointer",
      onDown: () => !isAnimating.current && gotoSection(currentIndex + 1, 1),
      onUp: () => !isAnimating.current && gotoSection(currentIndex - 1, -1),
      tolerance: 10,
      preventDefault: true
    });

    // Handle resize
    const handleResize = () => {
      gsap.set(window, { scrollTo: sections[currentIndex].offsetTop });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      obs.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
}
