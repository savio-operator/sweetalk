"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CarouselProps {
  images: string[];
  onIndexChange?: (index: number) => void;
  currentIndex?: number;
}

export function CarouselCircularImageGallery({ images, onIndexChange, currentIndex: externalIndex }: CarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);

  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % images.length;
    if (externalIndex === undefined) setInternalIndex(newIndex);
    if (onIndexChange) onIndexChange(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    if (externalIndex === undefined) setInternalIndex(newIndex);
    if (onIndexChange) onIndexChange(newIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
        nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]); // Re-bind interval on change

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden bg-brand-deep-red flex flex-col justify-between p-6">
      
      {/* Tab indicator circles (top) */}
      <div className="flex gap-2 justify-center z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
                if (externalIndex === undefined) setInternalIndex(idx);
                if (onIndexChange) onIndexChange(idx);
            }}
            className="w-8 h-8 rounded-full border-2 transition-all duration-300 relative group"
            style={{ 
                borderColor: idx === currentIndex ? '#F8F2F2' : '#2BA8B2'
             }}
          >
             {/* Thumbnail preview on hover (hidden on mobile) */}
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block w-24 h-24 rounded-lg overflow-hidden border-2 border-brand-white shadow-xl origin-bottom scale-50 group-hover:scale-100 pointer-events-none z-30">
                <Image src={images[idx]} alt={`Preview ${idx + 1}`} fill className="object-cover" />
             </div>
          </button>
        ))}
      </div>

      {/* Main Image Viewport */}
      <div className="absolute inset-0 z-10">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            initial={{ opacity: 0, scale: 1.1, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: -2 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            {/* Dark gradient overlay at bottom for controls visibility */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Internal Controls (Bottom) - Only really used if no external controls passed */}
      {externalIndex === undefined && (
         <div className="flex justify-between items-center z-20 mt-auto">
             <button
               onClick={prevSlide}
               className="w-12 h-12 rounded-full bg-brand-near-white/95 text-brand-deep-red flex items-center justify-center transition-transform hover:bg-brand-white hover:scale-110 shadow-lg font-jost"
             >
               &larr;
             </button>
             <div className="font-jost text-[0.65rem] text-brand-light-teal tracking-[2px]">
                 {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
             </div>
             <button
               onClick={nextSlide}
               className="w-12 h-12 rounded-full bg-brand-near-white/95 text-brand-deep-red flex items-center justify-center transition-transform hover:bg-brand-white hover:scale-110 shadow-lg font-jost"
               >
               &rarr;
             </button>
         </div>
      )}
    </div>
  );
}
