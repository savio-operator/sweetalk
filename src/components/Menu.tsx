"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";

gsap.registerPlugin(ScrollTrigger);

type TCategory = "Signatures" | "Fresh Juices" | "Healthy & Granatina" | "Milkshakes" | "Smoothies & Fusions" | "Brunch" | "Starters & Salads" | "Burgers & Wraps" | "Pastas & Rice" | "Sweet Treats";

interface MenuItem {
  name: string;
  desc: string;
  image: string;
  type: "V" | "N";
}

const MENU_DATA: Record<TCategory, MenuItem[]> = {
  Signatures: [
    { name: "Coffee", desc: "Classic hot brew.", image: "/images/logo.png", type: "V" },
    { name: "Hot Chocolate", desc: "Rich and creamy cocoa.", image: "/images/logo.png", type: "V" },
    { name: "Belgium Brownie", desc: "Signature slow-baked fudge brownie.", image: "/images/logo.png", type: "V" },
    { name: "Pistachio Kunafa", desc: "Golden toasted pastry with pistachio cream.", image: "/images/logo.png", type: "V" },
  ],
  "Fresh Juices": [
    { name: "Watermelon Juice", desc: "Fresh seasonal watermelon.", image: "/images/logo.png", type: "V" },
    { name: "Grapes Juice", desc: "Fresh seasonal grapes.", image: "/images/logo.png", type: "V" },
    { name: "Muskmelon Juice", desc: "Fresh seasonal muskmelon.", image: "/images/logo.png", type: "V" },
    { name: "Pineapple Juice", desc: "Fresh seasonal pineapple.", image: "/images/logo.png", type: "V" },
    { name: "Guava Juice", desc: "Fresh seasonal guava.", image: "/images/logo.png", type: "V" },
    { name: "Orange (Indian) Juice", desc: "Sweet seasonal oranges.", image: "/images/logo.png", type: "V" },
    { name: "Mango Juice", desc: "Fresh seasonal mango.", image: "/images/logo.png", type: "V" },
    { name: "Orange (Citrus) Juice", desc: "Tangy seasonal oranges.", image: "/images/logo.png", type: "V" },
  ],
  "Healthy & Granatina": [
    { name: "ABC Juice", desc: "Apple, beetroot, carrot.", image: "/images/logo.png", type: "V" },
    { name: "CAP Juice", desc: "Carrot, apple, pineapple.", image: "/images/logo.png", type: "V" },
    { name: "Watermelon Mint Lemonade", desc: "Refreshing watermelon and mint.", image: "/images/logo.png", type: "V" },
    { name: "Spicy Pineapple Granatina", desc: "Tangy pineapple with a kick.", image: "/images/logo.png", type: "V" },
    { name: "Spicy Orange Granatina", desc: "Zesty orange with a kick.", image: "/images/logo.png", type: "V" },
  ],
  Milkshakes: [
    { name: "Tender Coconut Milkshake", desc: "Refreshing coconut blend.", image: "/images/logo.png", type: "V" },
    { name: "Mango Milkshake", desc: "Fresh mango blend.", image: "/images/logo.png", type: "V" },
    { name: "Dates Milkshake", desc: "Nutritious dates blend.", image: "/images/logo.png", type: "V" },
    { name: "Strawberry Milkshake", desc: "Fresh strawberry blend.", image: "/images/logo.png", type: "V" },
    { name: "Dry Fruits Milkshake", desc: "Mixed dry fruits blend.", image: "/images/logo.png", type: "V" },
    { name: "Oreo Milkshake", desc: "Classic oreo blend.", image: "/images/logo.png", type: "V" },
    { name: "Peanut Butter Chocolate Milkshake", desc: "Rich chocolate and PB.", image: "/images/logo.png", type: "V" },
    { name: "Bourbon Shake", desc: "Decadent bourbon-style shake.", image: "/images/logo.png", type: "V" },
    { name: "Sunset Shake", desc: "Mango, banana, icecream.", image: "/images/logo.png", type: "V" },
    { name: "Strawberry Shake", desc: "Strawberry, banana, icecream.", image: "/images/logo.png", type: "V" },
    { name: "Cold Coffee", desc: "Coffee, icecream, milk.", image: "/images/logo.png", type: "V" },
    { name: "Cashew Caramel Malt", desc: "Caramel, cashew, icecream.", image: "/images/logo.png", type: "V" },
    { name: "Lotus Shake", desc: "Lotus biscoff, icecream, milk.", image: "/images/logo.png", type: "V" },
  ],
  "Smoothies & Fusions": [
    { name: "Passion Orange Fusion", desc: "Passion fruit and orange.", image: "/images/logo.png", type: "V" },
    { name: "Mango Passion Fusion", desc: "Mango and passion fruit.", image: "/images/logo.png", type: "V" },
    { name: "Guava Passion Fusion", desc: "Guava and passion fruit.", image: "/images/logo.png", type: "V" },
  ],
  Brunch: [
    { name: "Mango Chia Pudding", desc: "Creamy chia base with mango.", image: "/images/logo.png", type: "V" },
    { name: "Strawberry & Kiwi Chia Pudding", desc: "Chia base with berries.", image: "/images/logo.png", type: "V" },
    { name: "Tira-mi-toast", desc: "Tiramisu inspired french toast.", image: "/images/logo.png", type: "V" },
    { name: "Pista-berry Toast", desc: "Pistachio and berry toast.", image: "/images/logo.png", type: "V" },
    { name: "Pancakes with Honey", desc: "Fluffy pancakes with honey.", image: "/images/logo.png", type: "V" },
    { name: "Pancakes with Chocolate", desc: "Fluffy pancakes with chocolate.", image: "/images/logo.png", type: "V" },
  ],
  "Starters & Salads": [
    { name: "Nuggets", desc: "Crispy chicken nuggets.", image: "/images/logo.png", type: "N" },
    { name: "Veg Fingers", desc: "Crispy veggie fingers.", image: "/images/logo.png", type: "V" },
    { name: "Chicken Cheese Balls", desc: "Cheesy chicken bites.", image: "/images/logo.png", type: "N" },
    { name: "Chicken Strips", desc: "Tender chicken strips.", image: "/images/logo.png", type: "N" },
    { name: "Grilled Veg Salad", desc: "Seasonal grilled veggies.", image: "/images/logo.png", type: "V" },
    { name: "Chicken Caesar Salad", desc: "Classic caesar.", image: "/images/logo.png", type: "N" },
    { name: "Chicken Breast Salad", desc: "With fruits and veggies.", image: "/images/logo.png", type: "N" },
    { name: "Grilled Prawns Salad", desc: "Grilled prawns over greens.", image: "/images/logo.png", type: "N" },
  ],
  "Burgers & Wraps": [
    { name: "Classic Chicken Burger", desc: "Prime chicken patty.", image: "/images/logo.png", type: "N" },
    { name: "Classic Beef Burger", desc: "Prime beef patty.", image: "/images/logo.png", type: "N" },
    { name: "Chicken Bolognese Wrap", desc: "Hearty chicken wrap.", image: "/images/logo.png", type: "N" },
    { name: "Beef Bolognese Wrap", desc: "Hearty beef wrap.", image: "/images/logo.png", type: "N" },
    { name: "Chicken Paratha Roll", desc: "Classic paratha roll.", image: "/images/logo.png", type: "N" },
    { name: "Beef Paratha Roll", desc: "Classic paratha roll.", image: "/images/logo.png", type: "N" },
    { name: "Fruitiful Sandwich", desc: "Fresh fruit sandwich.", image: "/images/logo.png", type: "V" },
    { name: "Veg Sandwich", desc: "Classic vegetable sandwich.", image: "/images/logo.png", type: "V" },
    { name: "Egg Sandwich", desc: "Classic egg sandwich.", image: "/images/logo.png", type: "N" },
    { name: "Pulled Chicken Sandwich", desc: "Tender pulled chicken.", image: "/images/logo.png", type: "N" },
  ],
  "Pastas & Rice": [
    { name: "Classic French Fries", desc: "Crispy salted fries.", image: "/images/logo.png", type: "V" },
    { name: "Peri Peri Fries", desc: "Spicy peri peri fries.", image: "/images/logo.png", type: "V" },
    { name: "Cheese Burst Chicken Loaded Fries", desc: "Loaded with cheese and chicken.", image: "/images/logo.png", type: "N" },
    { name: "Bolognese Chicken Loaded Fries", desc: "Loaded with bolognese chicken.", image: "/images/logo.png", type: "N" },
    { name: "Bolognese Beef Loaded Fries", desc: "Loaded with bolognese beef.", image: "/images/logo.png", type: "N" },
    { name: "Mac and Cheese", desc: "Creamy cheesy pasta.", image: "/images/logo.png", type: "V" },
    { name: "Mac and Cheese with Chicken", desc: "With tender chicken.", image: "/images/logo.png", type: "N" },
    { name: "Inferno Chicken Pasta", desc: "Spicy chicken pasta.", image: "/images/logo.png", type: "N" },
    { name: "Chicken Spaghetti", desc: "Classic chicken spaghetti.", image: "/images/logo.png", type: "N" },
    { name: "Beef Spaghetti", desc: "Classic beef spaghetti.", image: "/images/logo.png", type: "N" },
    { name: "Veg Rice Bowl", desc: "Wholesome veggie rice.", image: "/images/logo.png", type: "V" },
    { name: "Chicken Rice Bowl", desc: "Wholesome chicken rice.", image: "/images/logo.png", type: "N" },
    { name: "Creamy Prawns Rice Bowl", desc: "Prawns in creamy sauce.", image: "/images/logo.png", type: "N" },
  ],
  "Sweet Treats": [
    { name: "Sunshine Smoothie Bowl", desc: "Mango, banana, pineapple, topped with kiwi, strawberry, pomegranate.", image: "/images/logo.png", type: "V" },
    { name: "Tropical Treat Smoothie Bowl", desc: "Strawberry, banana, mango, pineapple, topped with muesli, chia seeds.", image: "/images/logo.png", type: "V" },
    { name: "Honey Bloom Smoothie Bowl", desc: "Guava, banana, honey, yogurt, topped with muesli, kiwi, chia seeds.", image: "/images/logo.png", type: "V" },
    { name: "Chocoberry Mess", desc: "Brownie pieces, chocolate sauce, strawberry ice cream.", image: "/images/logo.png", type: "V" },
    { name: "Oreo Crunch Sundae", desc: "Vanilla ice cream, oreo biscuit, hazelnut spread.", image: "/images/logo.png", type: "V" },
    { name: "Strawberry Velvet Sundae", desc: "Vanilla ice cream, strawberry puree.", image: "/images/logo.png", type: "V" },
    { name: "Hazelnut Chocolate Sundae", desc: "Hazelnut spread, vanilla and chocolate ice cream.", image: "/images/logo.png", type: "V" },
    { name: "Tender Crushers Guava", desc: "Tender refreshing guava.", image: "/images/logo.png", type: "V" },
    { name: "Tender Crushers Mango", desc: "Tender refreshing mango.", image: "/images/logo.png", type: "V" },
    { name: "Tender Crushers Strawberry", desc: "Tender refreshing strawberry.", image: "/images/logo.png", type: "V" },
    { name: "Tender Crushers Dry Fruit", desc: "Tender refreshing dry fruit.", image: "/images/logo.png", type: "V" },
    { name: "Fruit Carnival Falooda", desc: "Vanilla ice cream, fresh fruits.", image: "/images/logo.png", type: "V" },
    { name: "Chocolate Overload Falooda", desc: "Chocolate ice cream, hazelnut.", image: "/images/logo.png", type: "V" },
    { name: "Gulab Jamun Falooda", desc: "With kulfi and vanilla ice cream.", image: "/images/logo.png", type: "V" },
    { name: "Dry Fruit Falooda", desc: "Mixed nuts and khulfi cream.", image: "/images/logo.png", type: "V" },
    { name: "Pistachio Kunafa Falooda", desc: "Kunafa, pistachio, vanilla ice cream.", image: "/images/logo.png", type: "V" },
    { name: "Fruit Chill Bowl", desc: "Strawberry yogurt, muesli, fruits.", image: "/images/logo.png", type: "V" },
    { name: "Fruitopia Bowl", desc: "Assorted fruits bowl.", image: "/images/logo.png", type: "V" },
    { name: "Honey-drizzled Fruits Bowl", desc: "Fresh fruits with honey.", image: "/images/logo.png", type: "V" },
    { name: "Nut-infused Fruit Bowl", desc: "Fruits and mixed nuts.", image: "/images/logo.png", type: "V" },
  ],
};

const CATEGORIES: TCategory[] = ["Signatures", "Fresh Juices", "Healthy & Granatina", "Milkshakes", "Smoothies & Fusions", "Brunch", "Starters & Salads", "Burgers & Wraps", "Pastas & Rice", "Sweet Treats"];

export default function Menu() {
  const [activeTab, setActiveTab] = useState<TCategory>("Signatures");
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const menuTextRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".menu-sub").forEach((el, i) => {
        gsap.from(el as Element, {
          y: 30, opacity: 0, duration: 0.8, delay: i * 0.12, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current, start: "top 80%",
            toggleActions: "play none none reset",
          },
        });
      });

      if (menuTextRef.current) {
        const menuTl = gsap.timeline({ paused: true })
          .fromTo(
            menuTextRef.current,
            { strokeDashoffset: 1400, fill: "rgba(186,28,10,0)", strokeOpacity: 1 },
            { strokeDashoffset: 0, fill: "rgba(186,28,10,0)", duration: 1.3, ease: "power2.out" }
          )
          .to(menuTextRef.current, {
            fill: "rgba(186,28,10,1)", duration: 0.45, ease: "back.out(3)",
          })
          .fromTo(menuTextRef.current,
            { strokeOpacity: 1 },
            { strokeOpacity: 0, duration: 0.15, ease: "power2.out" }
          );

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom top",
          onEnter:     () => menuTl.restart(),
          onEnterBack: () => menuTl.restart(),
          onLeave:     () => menuTl.progress(0).pause(),
          onLeaveBack: () => menuTl.progress(0).pause(),
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0 },
        { opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [activeTab]);

  const currentItems = MENU_DATA[activeTab] || [];

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="snap-section bg-brand-teal-bg min-h-screen py-12 md:py-24 px-5 md:px-12 lg:px-24 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      >
        <SmokeBackground smokeColor="#BA1C0A" opacity={0.5} speed={2} className="w-full h-full" />
      </div>

      <div className="max-w-[1302px] mx-auto relative z-10">
        <div className="menu-header flex flex-col items-center text-center mb-6 md:mb-14 mt-2 md:mt-8">
          <h2 className="sr-only">Our Menu — Sweetalks Artisan Desserts</h2>

          <div style={{ width: "100%", maxWidth: "483px", height: "clamp(50px, 11vw, 110px)", marginTop: "0.5rem" }}
               className="flex items-center justify-center overflow-visible mx-auto mb-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 170"
                 preserveAspectRatio="xMidYMid meet"
                 role="img" aria-label="Our Menu">
              <title>Our Menu</title>
              <text
                ref={menuTextRef}
                x="50%" y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="147"
                fontFamily="Charlotte, cursive"
                stroke="#BA1C0A"
                strokeWidth="2"
                strokeDasharray="1400"
                strokeDashoffset="1400"
                fill="rgba(186,28,10,0)"
              >
                Our Menu
              </text>
            </svg>
          </div>
          <p className="menu-sub font-lora italic text-[0.82rem] md:text-[0.88rem] text-brand-crimson/60 mb-2" style={{ marginTop: "0.75rem" }}>
            A curated selection of our finest creations.
          </p>
        </div>

        <div className="flex justify-center mb-8 md:mb-12 lg:mb-24" style={{ marginTop: "1rem" }}>
          <div className="w-[calc(100%-32px)] md:w-[calc(100%-48px)] max-w-[893px] bg-white/95 backdrop-blur-[20px] border border-white rounded-full py-1.5 md:py-2 px-2 md:px-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="flex items-center h-10 md:h-12 gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`whitespace-nowrap font-jost text-[0.45rem] md:text-[0.55rem] tracking-[1px] uppercase h-8 px-3 md:px-4 rounded-full flex items-center justify-center transition-all duration-300 font-medium ${
                    activeTab === cat
                      ? "bg-brand-deep-red text-white shadow-sm"
                      : "text-brand-deep-red hover:text-brand-teal"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto" style={{ maxWidth: '1041px', marginTop: 'clamp(1rem, 4vw, 4rem)' }}>
          <div ref={gridRef} className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:justify-center gap-6 md:gap-8">
            {currentItems.map((item, idx) => (
              <div key={`${activeTab}-${idx}`} className="card-base group cursor-pointer flex flex-col w-3/4 mx-auto sm:w-[calc(50%-12px)] lg:w-[210px]">
                <div className="relative w-full aspect-square bg-[#E6DDDD] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-[0.6rem] font-bold">
                    {item.type}
                  </div>
                </div>

                <div className="p-3 md:p-4 flex-1 flex flex-col gap-1 md:gap-1.5">
                  <h3 className="font-charlotte text-[0.7rem] md:text-[0.75rem] text-black leading-tight">
                    {item.name}
                  </h3>
                  <p className="font-lora italic text-[0.6rem] md:text-[0.62rem] text-black/70 leading-[1.6]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
