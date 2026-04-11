"use client";

import { useState } from "react";

const LINKS_BASE = [
  { href: "/admin/earn",      label: "Earn"      },
  { href: "/admin/redeem",    label: "Redeem"    },
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/customers", label: "Customers" },
];
const LINKS_ADMIN = [
  { href: "/admin/staff",     label: "Staff"     },
  { href: "/admin/reports",   label: "Reports"   },
  { href: "/admin/broadcast", label: "Broadcast" },
];

export default function AdminNav({ role, name }: { role: string; name: string }) {
  const [open, setOpen] = useState(false);
  const links = role === "admin" ? [...LINKS_BASE, ...LINKS_ADMIN] : LINKS_BASE;

  return (
    <>
      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="font-['Pacifico',cursive] text-[#BA1C0A] text-lg">Sweetalks</span>
            <span className="hidden sm:inline text-[#74C0C6] font-['Jost',sans-serif] text-[0.58rem] tracking-[3px] uppercase">
              Admin
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-full font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#EDE5E5]/50 hover:text-[#2BA8B2] hover:bg-white/5 transition-all duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right: name + logout + hamburger */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[#EDE5E5]/40 font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase">
              {name}
            </span>
            <form action="/api/admin/logout" method="POST" className="hidden md:block">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-full font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#BA1C0A] border border-[#BA1C0A]/30 hover:bg-[#BA1C0A]/10 transition-all duration-200"
              >
                Sign Out
              </button>
            </form>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="md:hidden flex flex-col gap-[5px] p-2 -mr-1"
            >
              <span className="block w-5 h-[1.5px] bg-[#74C0C6]" />
              <span className="block w-5 h-[1.5px] bg-[#74C0C6]" />
              <span className="block w-5 h-[1.5px] bg-[#74C0C6]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#0D0D0D] border-l border-white/[0.08] flex flex-col transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-white/[0.08]">
          <span className="font-['Pacifico',cursive] text-[#BA1C0A] text-base">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-[#EDE5E5]/40 hover:text-[#EDE5E5] transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl font-['Jost',sans-serif] text-[0.68rem] tracking-[2px] uppercase text-[#EDE5E5]/60 hover:text-[#2BA8B2] hover:bg-white/5 transition-all duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Footer: name + logout */}
        <div className="px-4 pb-8 flex flex-col gap-3 border-t border-white/[0.08] pt-4">
          <p className="font-['Jost',sans-serif] text-[0.55rem] tracking-[2px] uppercase text-[#EDE5E5]/25">
            Signed in as {name}
          </p>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-full font-['Jost',sans-serif] text-[0.6rem] tracking-[2px] uppercase text-[#BA1C0A] border border-[#BA1C0A]/30 hover:bg-[#BA1C0A]/10 transition-all duration-200"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
