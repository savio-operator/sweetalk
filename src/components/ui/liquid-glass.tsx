"use client";

import React from "react";

interface LiquidGlassProps {
  children: React.ReactNode;
  isScrolled: boolean;
  isNavVisible: boolean;
}

export function LiquidGlass({ children, isScrolled, isNavVisible }: LiquidGlassProps) {
  return (
    <div
      style={{
        transform: `translateX(-50%) translateY(${isNavVisible ? "0" : "-150%"})`,
        transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.4s, border-color 0.4s",
      }}
      className={`fixed top-6 left-1/2 z-[100] w-[calc(100%-32px)] md:w-[calc(100%-48px)] max-w-[900px] rounded-full overflow-hidden ${
        isScrolled
          ? "bg-[#F8F2F2]/88 backdrop-blur-[20px] border border-[#F8F2F2] shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          : "bg-transparent border-transparent"
      }`}
    >
      {children}
    </div>
  );
}
