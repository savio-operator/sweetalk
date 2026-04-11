"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandMapProps {
  location: string;
  coordinates: string;
}

export function ExpandMap({ location, coordinates }: ExpandMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="relative w-full max-w-[500px] h-[300px] rounded-3xl overflow-hidden cursor-pointer group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Background container acting as small map placeholder */}
      <div className="absolute inset-0 bg-[#F8F2F2] flex items-center justify-center border border-brand-off-white transition-transform duration-500 group-hover:scale-[1.02]">
         {/* Map Placeholder Graphic */}
         <div className="absolute inset-0 opacity-20" style={{
             backgroundImage: 'radial-gradient(#2BA8B2 1px, transparent 1px)',
             backgroundSize: '20px 20px'
         }} />
         
         <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-4">
              <MapPin className="w-10 h-10 text-brand-crimson" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-teal rounded-full border-2 border-[#F8F2F2] animate-pulse" />
            </div>
            <p className="font-lora text-brand-deep-red font-medium mb-1">{location}</p>
            <p className="font-jost text-[0.6rem] text-brand-light-teal tracking-[2px]">{coordinates}</p>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-brand-crimson font-jost text-xs uppercase tracking-wider">
               <span>{isExpanded ? "Close Map" : "Expand Map"}</span>
               <div className="h-[2px] w-0 group-hover:w-16 transition-all duration-300 bg-gradient-to-r from-brand-crimson/50 via-brand-teal/30 to-transparent" />
            </div>
         </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 z-20 bg-brand-white"
          >
            <iframe
              title="Google Maps"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent("Sweetalks, Thrikkakara, Kochi")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
            />
            <button 
              className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-jost text-[0.6rem] text-brand-deep-red tracking-[2px] uppercase shadow-lg border border-brand-off-white"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
