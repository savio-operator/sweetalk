"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div
      className="bg-white/6 border border-white/10 rounded-[1.25rem] md:rounded-[1.5rem] mb-6 md:mb-10 shrink-0"
      style={{ padding: 'clamp(1.2rem, 4vw, 2.5rem) clamp(1rem, 4vw, 3rem)' }}
    >
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <span
          className="inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full font-jost font-bold text-[0.6rem] md:text-[0.65rem]"
          style={{ background: "rgba(255,255,255,0.12)", color: "#4285F4" }}
        >
          G
        </span>
        <div className="text-brand-light-teal text-[0.8rem] md:text-[0.9rem] tracking-widest">★★★★★</div>
      </div>
      <p
        className="font-lora italic text-[#F8F2F2]/85 leading-[1.7] md:leading-[1.9] mb-5 md:mb-6"
        style={{ fontSize: '0.65rem', md: '0.79rem', overflowWrap: 'break-word', wordBreak: 'break-word' } as any}
      >
        &ldquo;{item.quote}&rdquo;
      </p>
      <div>
        <p
          className="font-jost text-[#F8F2F2] uppercase"
          style={{ fontSize: '0.54rem', md: '0.63rem', letterSpacing: '1px', overflowWrap: 'break-word' } as any}
        >
          {item.author}
        </p>
        <p
          className="font-jost text-brand-light-teal uppercase"
          style={{ fontSize: '0.45rem', md: '0.54rem', overflowWrap: 'break-word' } as any}
        >
          {item.role}
        </p>
      </div>
    </div>
  );
}

export function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  const col1 = testimonials.slice(0, 3);
  const col2 = testimonials.slice(3, 6).length === 3 ? testimonials.slice(3, 6) : col1;
  const col3 = testimonials.slice(6, 9).length === 3 ? testimonials.slice(6, 9) : col1;

  useGSAP(() => {
    // Only animate columns if they are visible
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const isTablet = window.matchMedia("(max-width: 1023px)").matches;

    const configs = [
      { ref: col1Ref, duration: 15 },
      { ref: col2Ref, duration: 19, active: !isMobile },
      { ref: col3Ref, duration: 17, active: !isTablet },
    ];

    configs.forEach(({ ref, duration, active = true }) => {
      if (!ref.current || !active) return;
      gsap.to(ref.current, {
        y: "-50%",
        duration,
        ease: "none",
        repeat: -1,
      });
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative h-[480px] md:h-[580px] overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, #BA1C0A 10%, #BA1C0A 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, #BA1C0A 10%, #BA1C0A 90%, transparent)",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 h-full">
        {/* Column 1 */}
        <div ref={col1Ref} className="flex flex-col">
          {[...col1, ...col1].map((item, idx) => (
            <TestimonialCard key={idx} item={item} />
          ))}
        </div>

        {/* Column 2 — visible on sm+ */}
        <div ref={col2Ref} className="hidden sm:flex flex-col">
          {[...col2, ...col2].map((item, idx) => (
            <TestimonialCard key={idx} item={item} />
          ))}
        </div>

        {/* Column 3 — visible on lg+ */}
        <div ref={col3Ref} className="hidden lg:flex flex-col">
          {[...col3, ...col3].map((item, idx) => (
            <TestimonialCard key={idx} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
