"use client";

import React, { useState, useEffect, useRef } from "react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoCentered, setIsLogoCentered] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newIsScrolled = scrollY > 100;
      setIsScrolled(newIsScrolled);
      
      // Move logo to center when scrolling past 40% of hero height
      setIsLogoCentered(scrollY > window.innerHeight * 0.4);

      setIsNavVisible(true);
      if (newIsScrolled) {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => setIsNavVisible(false), 2000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-element", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        delay: 0.3,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  const navLinks = [
    { name: "Our Story", href: "#story" },
    { name: "Menu", href: "#menu" },
    { name: "Gallery", href: "#gallery" },
    { name: "Blog", href: "/blog", newTab: true },
    { name: "Sweet Circle", href: "/loyalty" },
    { name: "Contact Us", href: "#location" },
  ];

  return (
    <>
      <div ref={navRef}>
        <LiquidGlass isScrolled={isScrolled} isNavVisible={isNavVisible}>
          <div className="flex items-center w-full h-12 relative z-50">
            {/* Left: Brand */}
            <a
              href="#hero"
              className={`nav-element font-charlotte text-[1.25rem] md:text-[1.5rem] transition-all duration-700 ease-in-out whitespace-nowrap ${
                isScrolled ? "text-brand-crimson" : "text-brand-white"
              } absolute md:static top-1/2 md:top-0 -translate-y-1/2 md:translate-y-0 ${
                isLogoCentered 
                  ? "left-1/2 -translate-x-1/2" 
                  : "left-5 translate-x-0"
              } md:left-0 md:translate-x-0 md:ml-[calc(7rem+4px)]`}
            >
              Sweetalks
            </a>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`nav-element font-jost text-[0.72rem] tracking-[3px] uppercase font-medium transition-all duration-300 hover:-translate-y-[1px] ${
                    isScrolled
                      ? "text-brand-deep-red hover:text-brand-teal"
                      : "text-brand-crimson hover:text-brand-teal"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: CTA & Mobile Toggle */}
            <div className="flex items-center gap-4 ml-auto mr-2 md:mr-[calc(7rem+4px)]">
              <a
              href="https://www.zomato.com/"
              target="_blank"
              rel="noreferrer"
              className={`nav-element hidden md:inline-flex items-center whitespace-nowrap font-jost text-[0.65rem] tracking-[2px] uppercase font-medium rounded-full transition-all duration-300 hover:scale-[1.03] ${
               isScrolled
                ? "bg-brand-crimson text-white hover:bg-brand-deep-red shadow-md"
                : "border border-white/40 text-white bg-transparent hover:bg-white/10"
            }`}
            style={{padding: "10px 32px"}}
          >
            Order on Zomato
          </a>
              <button
                className="nav-element md:hidden p-3 text-brand-teal focus:outline-none"
                onClick={() => setIsMobileOpen(true)}
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </LiquidGlass>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[200] bg-brand-deep-red transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isMobileOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <button
          className="absolute top-8 right-8 text-brand-teal p-2 focus:outline-none hover:rotate-90 transition-transform duration-300"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="w-8 h-8" />
        </button>

        <nav className="flex flex-col items-center justify-center h-full gap-6 md:gap-8">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => setIsMobileOpen(false)}
              className="font-charlotte text-3xl md:text-4xl text-brand-white transition-colors duration-300 hover:text-brand-teal"
              style={{
                opacity: isMobileOpen ? 1 : 0,
                transform: isMobileOpen ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.4s ease ${0.2 + idx * 0.1}s`,
              }}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://www.zomato.com/"
            target="_blank"
            rel="noreferrer"
            className="btn-pill btn-pill-outline mt-6"
            style={{
                opacity: isMobileOpen ? 1 : 0,
                transform: isMobileOpen ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.4s ease ${0.2 + navLinks.length * 0.1}s`,
            }}
          >
            Order on Zomato
          </a>
        </nav>
      </div>
    </>
  );
}
