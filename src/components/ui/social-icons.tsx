"use client";

import React from "react";
export interface SocialIconItem {
  icon: React.ElementType;
  href: string;
  tooltip: string;
  hoverColor: string;
}

interface SocialIconsProps {
  items: SocialIconItem[];
  className?: string;
  iconClassName?: string;
}

export function SocialIcons({ items, className = "", iconClassName = "" }: SocialIconsProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${iconClassName}`}
            style={{ '--hover-color': item.hoverColor } as React.CSSProperties}
          >
            <Icon className="w-4 h-4 text-brand-off-white/70 transition-colors duration-300 group-hover:text-[var(--hover-color)]" />
            
            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black font-jost text-[0.65rem] uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {item.tooltip}
            </span>

            {/* Indicator Dot/Line */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--hover-color)] transition-all duration-300 group-hover:w-4" />
          </a>
        );
      })}
    </div>
  );
}
