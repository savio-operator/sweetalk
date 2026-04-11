export interface Tier {
  name: string;
  min: number;
  max: number | null;
  emoji: string;
  color: string;
}

export const TIERS: Tier[] = [
  { name: "Biscuit",      min: 0,     max: 499,  emoji: "🍪", color: "#C9A84C" },
  { name: "Brownie",      min: 500,   max: 1499, emoji: "🍫", color: "#BA1C0A" },
  { name: "Kunafa",       min: 1500,  max: 3499, emoji: "🥐", color: "#2BA8B2" },
  { name: "Sweet Circle", min: 3500,  max: null, emoji: "⭐", color: "#991001" },
];

export function getTier(points: number): Tier {
  return (
    [...TIERS].reverse().find((t) => points >= t.min) ?? TIERS[0]
  );
}

export function getNextTier(points: number): Tier | null {
  const current = getTier(points);
  const idx = TIERS.findIndex((t) => t.name === current.name);
  return TIERS[idx + 1] ?? null;
}

export function pointsToNextTier(points: number): number | null {
  const next = getNextTier(points);
  if (!next) return null;
  return next.min - points;
}

/** ₹100 = 10 Sweets */
export const POINTS_PER_RUPEE = 0.1;

export function billToPoints(amount: number): number {
  return Math.floor(amount * POINTS_PER_RUPEE);
}
