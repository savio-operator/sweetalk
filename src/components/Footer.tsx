"use client";

import React from "react";
import Link from "next/link";
import { FooterBackgroundGradient, WritingReveal } from "@/components/ui/hover-footer";
import { SocialIcons, SocialIconItem } from "@/components/ui/social-icons";
import { MapPin } from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const FOOTER_SOCIALS: SocialIconItem[] = [
  { icon: InstagramIcon, href: "https://www.instagram.com/sweetalks_cafe/", tooltip: "Instagram", hoverColor: "#ffffff" },
  { icon: FacebookIcon, href: "https://www.facebook.com/sweetalks", tooltip: "Facebook", hoverColor: "#ffffff" },
  { icon: MapPin, href: "https://maps.google.com/?q=Sweetalks+Thrikkakara", tooltip: "Find Us", hoverColor: "#ffffff" },
];

export default function Footer() {
  return (
    <footer id="footer" className="snap-section relative bg-brand-dark min-h-[90vh] w-full overflow-hidden">
       {/* Ensure continuous full bleed from Location section logic by bringing BackgroundGradient up to the edge */}
       <FooterBackgroundGradient>
         
         <div className="max-w-[1400px] mx-auto px-10 md:px-16 lg:px-32 pb-10 relative z-10 flex flex-col" style={{ paddingTop: "clamp(54px, 9vw, 144px)" }}>

            {/* Top Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-14 mb-10 md:mb-18 text-center">
               
               {/* Col 1: Brand */}
               <div className="flex flex-col items-center gap-3">
                  <Link href="/" className="font-charlotte text-[1.45rem] text-brand-crimson mb-1 hover:text-brand-deep-red transition-colors">Sweetalks</Link>
                  <p className="font-lora italic text-[0.8rem] text-[#F8F2F2]/60">Too Good to Resist.</p>
                  <p className="font-jost text-[0.5rem] tracking-[1px] text-white/20 mt-1 mb-5 md:mb-5">
                     FSSAI Licensed · Made Fresh Daily
                  </p>
                  
                  {/* Social Icons Footer specific style */}
                  <div className="bg-brand-crimson/15 border border-brand-crimson/20 rounded-[1.5rem] p-2 inline-flex mx-auto">
                     <SocialIcons 
                        items={FOOTER_SOCIALS} 
                        iconClassName="hover:bg-brand-crimson/30" 
                     />
                  </div>
               </div>

               {/* Col 2: Navigate */}
               <div className="flex flex-col items-center gap-4 md:gap-5 mt-4 md:mt-0">
                  <h4 className="font-jost text-[0.7rem] md:text-[0.75rem] text-brand-light-teal tracking-[3px] uppercase">NAVIGATE</h4>
                  <ul className="flex flex-col items-center gap-2.5 md:gap-3.5 font-jost text-[0.58rem] md:text-[0.6rem] tracking-[2px] text-white/35 uppercase">
                     <li><a href="#story" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300">Story</a></li>
                     <li><a href="#menu" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300">Menu</a></li>
                     <li><a href="#gallery" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300">Gallery</a></li>
                     <li><a href="#faq" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300">FAQ</a></li>
                     <li><a href="#location" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300">Find Us</a></li>
                  </ul>
               </div>

               {/* Col 3: Order */}
               <div className="flex flex-col items-center gap-4 md:gap-5 mt-4 md:mt-0">
                  <h4 className="font-jost text-[0.7rem] md:text-[0.75rem] text-brand-light-teal tracking-[3px] uppercase">ORDER</h4>
                  <ul className="flex flex-col items-center gap-2.5 md:gap-3.5 font-jost text-[0.58rem] md:text-[0.6rem] tracking-[2px] text-white/35 uppercase">
                     <li><a href="https://www.zomato.com/" target="_blank" rel="noreferrer" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300">Order on Zomato</a></li>
                     <li><a href="https://www.swiggy.com/city/kochi/sweetalks-edapally-rest1320373" target="_blank" rel="noreferrer" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300">Order on Swiggy</a></li>
                     <li><a href="#orders" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300">Book a Table</a></li>
                     <li><a href="/menu" target="_blank" rel="noopener noreferrer" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300">Full Menu</a></li>
                     <li><a href="/loyalty" className="hover:text-brand-light-teal hover:translate-y-[-1px] inline-block transition-transform duration-300 text-brand-teal/70">Sweet Circle ✦</a></li>
                  </ul>
               </div>

               {/* Col 4: Find Us details */}
               <div className="flex flex-col items-center gap-4 md:gap-5 mt-4 md:mt-0">
                  <h4 className="font-jost text-[0.7rem] md:text-[0.75rem] text-brand-light-teal tracking-[3px] uppercase">FIND US</h4>
                  <address className="not-italic font-lora text-[0.7rem] leading-[2] text-white/40 flex flex-col items-center gap-1">
                     <p>38/3416, Pipeline Road</p>
                     <p>Kalamassery, Thrikkakara</p>
                     <p>Kochi, Kerala 682033</p>
                     <p>Mon–Sun 12pm–12am</p>
                     <a href="tel:+916235745985" className="mt-1.5 hover:text-brand-light-teal transition-colors">+91 62357 45985</a>
                     <a href="https://sweettalks.in" className="hover:text-brand-light-teal transition-colors">sweettalks.in</a>
                     <a href="mailto:info@sweetalks.in" className="hover:text-brand-light-teal transition-colors">info@sweetalks.in</a>
                  </address>
               </div>
            </div>

            {/* Huge Text Hover Effect Layer */}
            <div className="w-full h-[90px] md:h-[180px] lg:h-[25rem] -mt-4 md:-mt-10 lg:-mt-18 mb-5 md:mb-9 overflow-hidden pointer-events-none">
                <WritingReveal text="Sweetalks" />
            </div>

            {/* Bottom Bar Divider */}
            <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-5 font-jost text-[0.52rem] tracking-[1px] text-white/20">
                <div className="scale-75 origin-left hidden md:block">
                  <SocialIcons items={FOOTER_SOCIALS} />
                </div>
                <p className="text-center md:text-left">© 2026 Sweetalks Thrikkakara. All rights reserved.</p>
                <p className="hidden md:block">FSSAI Licensed</p>
            </div>

         </div>
       </FooterBackgroundGradient>
    </footer>
  );
}
