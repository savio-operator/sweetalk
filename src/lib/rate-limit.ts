import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://placeholder.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "placeholder-token",
});

// Contact form: 5 submissions per IP per hour
export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:contact",
  analytics: true,
});

// Reservation form: 5 submissions per IP per hour
export const reservationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:reservation",
  analytics: true,
});

// Sanity on-demand revalidation webhook: 10 per hour
export const revalidateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  prefix: "ratelimit:revalidate",
  analytics: true,
});

// OTP requests: 3 per phone per hour
export const otpRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "ratelimit:otp",
  analytics: true,
});

// Points insert: 20 per staff account per hour
export const pointsInsertRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  prefix: "ratelimit:points",
  analytics: true,
});

// Redemption code generation: 10 per customer per hour
export const redeemRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  prefix: "ratelimit:redeem",
  analytics: true,
});
