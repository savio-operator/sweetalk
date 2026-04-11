"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MapPin, Truck, Star, CalendarDays } from "lucide-react"
import { faqSchema } from "@/lib/faqSchema"

const FAQ_ITEMS = faqSchema.mainEntity.map((e) => ({
  question: e.name,
  answer: e.acceptedAnswer.text,
}))

const FAQ_META = [
  { icon: Clock,        accent: "#2BA8B2", label: "HOURS"     },
  { icon: MapPin,       accent: "#BA1C0A", label: "LOCATION"  },
  { icon: Truck,        accent: "#2BA8B2", label: "DELIVERY"  },
  { icon: Star,         accent: "#BA1C0A", label: "MENU"      },
  { icon: CalendarDays, accent: "#2BA8B2", label: "BOOKINGS"  },
  { icon: Star,         accent: "#2BA8B2", label: "DIETARY"   },
  { icon: MapPin,       accent: "#BA1C0A", label: "PARKING"   },
  { icon: CalendarDays, accent: "#BA1C0A", label: "EVENTS"    },
  { icon: Star,         accent: "#2BA8B2", label: "CUSTOMIZE" },
  { icon: Clock,        accent: "#BA1C0A", label: "WIFI"      },
]

interface FAQCard {
  id: number
  faqIndex: number
}

const positionStyles = [
  { scale: 1,    y: 12  },
  { scale: 0.95, y: -18 },
  { scale: 0.9,  y: -48 },
]

const exitAnimation  = { y: 460, scale: 1,   zIndex: 10 }
const enterAnimation = { y: -18, scale: 0.9 }

function CardContent({ faqIndex }: { faqIndex: number }) {
  const faq  = FAQ_ITEMS[faqIndex % FAQ_ITEMS.length]
  const meta = FAQ_META [faqIndex % FAQ_META.length]
  const Icon = meta.icon

  return (
    <div className="flex h-full w-full flex-col">
      {/* Icon header — 20% taller */}
      <div
        className="flex w-full shrink-0 items-center justify-center overflow-hidden rounded-xl"
        style={{
          height: "178px",
          background: `${meta.accent}16`,
          border: `1px solid ${meta.accent}30`,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: "62px",
              height: "62px",
              background: `${meta.accent}1c`,
              border: `1.5px solid ${meta.accent}55`,
            }}
          >
            <Icon size={26} strokeWidth={1.5} style={{ color: meta.accent }} />
          </div>
          <span
            className="font-jost font-medium uppercase"
            style={{ fontSize: "0.6rem", letterSpacing: "3.5px", color: meta.accent }}
          >
            {meta.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 pb-6 pt-5">
              <h3
                className="font-charlotte leading-[1.22]"
                style={{ fontSize: "1.16rem", color: "#991001" }}
              >
                {faq.question}
              </h3>
              <p
                className="font-lora italic leading-[1.72] line-clamp-3"
                style={{ fontSize: "0.84rem", color: "rgba(186,28,10,0.62)" }}
              >
                {faq.answer}
              </p>
            </div>

    </div>
  )
}

function AnimatedCard({
  card,
  index,
  isAnimating,
}: {
  card: FAQCard
  index: number
  isAnimating: boolean
}) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2]
  const zIndex = index === 0 && isAnimating ? 10 : 3 - index

  return (
    <motion.div
      key={card.id}
      initial={index === 2 ? enterAnimation : undefined}
      animate={{ y, scale }}
      exit={index === 0 ? exitAnimation : undefined}
      transition={{ type: "spring", duration: 1, bounce: 0 }}
      style={{
        zIndex,
        left: "50%",
        x: "-50%",
        bottom: 0,
        height: "365px",
        borderLeft: "1px solid rgba(43,168,178,0.18)",
        borderRight: "1px solid rgba(43,168,178,0.18)",
        borderTop: "1px solid rgba(43,168,178,0.18)",
      }}
      /* Card: 20% taller + wider on desktop */
      className="absolute flex w-[320px] flex-col overflow-hidden rounded-t-2xl bg-white p-1.5 shadow-lg will-change-transform sm:w-[660px]"
    >
      <CardContent faqIndex={card.faqIndex} />
    </motion.div>
  )
}

const initialCards: FAQCard[] = [
  { id: 1, faqIndex: 0 },
  { id: 2, faqIndex: 1 },
  { id: 3, faqIndex: 2 },
]

export default function FAQCardStack() {
  const [cards, setCards]             = useState<FAQCard[]>(initialCards)
  const [isAnimating, setIsAnimating] = useState(false)
  const [nextId, setNextId]           = useState(4)
  const [nextFaqIdx, setNextFaqIdx]   = useState(3)

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)

    setCards((prev) => [
      ...prev.slice(1),
      { id: nextId, faqIndex: nextFaqIdx % FAQ_ITEMS.length },
    ])
    setNextId((n)       => n + 1)
    setNextFaqIdx((n)   => (n + 1) % FAQ_ITEMS.length)

    setTimeout(() => setIsAnimating(false), 1050)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center pt-2">
      {/* Stack container — h = card height (365) + stacking room (~115) */}
      <div className="relative w-full overflow-hidden sm:w-[720px]" style={{ height: "480px" }}>
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, index) => (
            <AnimatedCard
              key={card.id}
              card={card}
              index={index}
              isAnimating={isAnimating}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Trigger button */}
      <div
        className="relative z-10 -mt-px flex w-full items-center justify-center py-5"
        style={{ borderTop: "1px solid rgba(43,168,178,0.18)" }}
      >
        <button
          onClick={handleNext}
          className="btn-pill btn-pill-primary"
          style={{ fontSize: "0.78rem", letterSpacing: "2px", padding: "14px 44px" }}
        >
          Next Question
        </button>
      </div>
    </div>
  )
}
