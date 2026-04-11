"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reservationSchema } from "@/lib/validations";
import { WarpShaderBg } from "@/components/ui/wrap-shader";

gsap.registerPlugin(ScrollTrigger);

const HEADING_CHARS = "Book a Table.".split("");

export default function Reservation() {
  const sectionRef = useRef<HTMLElement>(null);
  const borderRef = useRef<SVGRectElement>(null);
  const [formData, setFormData] = useState({ name: "", guests: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useGSAP(() => {
    // Label + sub fade up — replays on re-entry
    gsap.from(".res-label, .res-sub", {
      y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current, start: "top 80%", end: "bottom top",
        toggleActions: "play none play reset",
      },
    });

    // Heading: letter by letter — replays on re-entry
    gsap.from(".res-char", {
      y: 20, opacity: 0, stagger: 0.045, duration: 0.5, ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current, start: "top 80%", end: "bottom top",
        toggleActions: "play none play reset",
      },
    });

    // Card entrance
    gsap.from(".res-card", {
      y: 50, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".res-card", start: "top 85%" },
    });

    // SVG border draw
    if (borderRef.current) {
      gsap.fromTo(
        borderRef.current,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".res-card", start: "top 85%" },
        }
      );
    }
  }, { scope: sectionRef });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const payload = {
      name: formData.name,
      occasion: "Table Booking",
      serving_size: formData.guests,
      phone: formData.phone,
    };

    const result = reservationSchema.safeParse(payload);
    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    try {
      const waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916235745985").trim();
      const text = `Hi Sweetalks! I would like to book a table.%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Guests:* ${encodeURIComponent(formData.guests || "Not specified")}%0A*Phone:* ${encodeURIComponent(formData.phone)}`;
      window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank");

      setStatus("success");
      setFormData({ name: "", guests: "", phone: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="orders"
      ref={sectionRef}
      className="snap-section bg-brand-teal-bg min-h-screen flex flex-col items-center justify-center py-16 md:py-32 px-7 md:px-16 lg:px-32 relative overflow-hidden"
    >
      {/* Warp shader — dark crimson swirls behind teal bg */}
      <WarpShaderBg
        opacity={0.14}
        colors={["#991001", "#0D0D0D", "#BA1C0A", "#EDE5E5"]}
        distortion={0.28}
        swirl={0.65}
        swirlIterations={9}
        shapeScale={0.14}
        speed={0.6}
      />

      <div className="max-w-[567px] mx-auto w-full relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 md:mb-16">
          <h2 className="font-charlotte text-[clamp(1.5rem,5vw,3.0rem)] text-brand-deep-red leading-[1.2] mb-3 md:mb-4 px-2">
            {HEADING_CHARS.map((char, i) => (
              <span
                key={i}
                className="res-char"
                style={{ display: char === " " ? "inline" : "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          <p className="res-sub font-lora italic text-[0.8rem] md:text-[0.88rem] text-brand-crimson/60 leading-[1.8] max-w-[280px] md:max-w-none">
            Reserve a Table at Sweetalks Thrikkakara...
          </p>
        </div>

        {/* Form Card */}
        <div
          className="res-card bg-white rounded-[1.25rem] md:rounded-[1.5rem] border border-brand-teal-bg shadow-[0_8px_48px_rgba(186,28,10,0.08)] overflow-hidden w-full mt-6 md:mt-8"
          style={{ padding: "clamp(22px, 7.5vw, 67px) clamp(15px, 7.5vw, 74px) clamp(18px, 6.5vw, 59px)" }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10 w-full">
            {[
              { label: "Your Name", name: "name", type: "text", required: true },
              { label: "No. of Guests", name: "guests", type: "text", required: false },
              { label: "Phone / WhatsApp", name: "phone", type: "tel", required: true },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label
                  className="font-jost text-[0.6rem] md:text-[0.62rem] text-brand-teal tracking-[2px] uppercase mb-1 md:mb-2"
                  style={{ paddingLeft: "4px" }}
                >
                  {field.label} {field.required && <span className="text-brand-crimson">*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  required={field.required}
                  className="bg-transparent border-b border-brand-teal-bg font-lora italic text-[0.95rem] md:text-[1rem] text-brand-dark focus:outline-none focus:border-brand-teal transition-colors duration-300"
                  style={{ padding: "10px 4px" }}
                />
              </div>
            ))}

            <div className="mt-2 md:mt-4">
              {status === "error" && (
                <p className="text-[#E1306C] text-[0.75rem] md:text-sm mb-3 font-jost uppercase tracking-wider">{errorMessage}</p>
              )}
              {status === "success" && (
                <p className="text-brand-teal text-[0.75rem] md:text-sm mb-3 font-jost uppercase tracking-wider">Opening WhatsApp — we&apos;ll confirm shortly!</p>
              )}

              {/* Animated SVG border button */}
              <div className="relative w-full md:w-auto" style={{ maxWidth: "357px", margin: "0 auto" }}>
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="relative w-full bg-[#0D0D0D] text-white rounded-full font-jost text-[0.7rem] md:text-[0.75rem] tracking-[2px] md:tracking-[3px] uppercase font-medium transition-all duration-300 hover:bg-[#1a1a1a] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed z-10"
                  style={{ padding: "22px 14px" }}
                >
                  {status === "loading" ? "Opening WhatsApp..." : "Book Table via WhatsApp"}
                </button>
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 400 56"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect
                    ref={borderRef}
                    x="1.5"
                    y="1.5"
                    width="397"
                    height="53"
                    rx="27"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                </svg>
              </div>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}


