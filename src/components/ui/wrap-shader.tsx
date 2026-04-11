"use client"

import { useState, useEffect } from "react"
import { Warp } from "@paper-design/shaders-react"

interface WarpShaderBgProps {
  /** Overall opacity of the shader layer — keep low for a background accent */
  opacity?: number
  colors?: string[]
  proportion?: number
  softness?: number
  distortion?: number
  swirl?: number
  swirlIterations?: number
  shapeScale?: number
  speed?: number
}

/**
 * WarpShaderBg — WebGL Warp shader as an absolute, full-section background.
 * Client-only (uses canvas); renders null during SSR / before hydration.
 */
export function WarpShaderBg({
  opacity = 0.14,
  colors = ["#EDE5E5", "#2BA8B2", "#74C0C6", "#F8F2F2"],
  proportion = 0.45,
  softness = 1,
  distortion = 0.2,
  swirl = 0.6,
  swirlIterations = 8,
  shapeScale = 0.12,
  speed = 0.35,
}: WarpShaderBgProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <Warp
        style={{ height: "100%", width: "100%" }}
        proportion={proportion}
        softness={softness}
        distortion={distortion}
        swirl={swirl}
        swirlIterations={swirlIterations}
        shape="checks"
        shapeScale={shapeScale}
        scale={1}
        rotation={0}
        speed={speed}
        colors={colors}
      />
    </div>
  )
}
