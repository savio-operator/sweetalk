---
name: sweetalks-rate-limiting
description: Upstash rate limiting configuration for Sweetalks — per-endpoint limits, sliding window setup, and integration patterns.
---

# Rate Limiting — Sweetalks (Upstash)

## Setup

```bash
npm install @upstash/ratelimit @upstash/redis
```

## Environment Variables

```env
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxx...
```

---

## Configuration (`src/lib/rate-limit.ts`)

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Contact form: 5 per IP per hour
export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'ratelimit:contact',
  analytics: true,
});

// Reservation form: 5 per IP per hour
export const reservationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'ratelimit:reservation',
  analytics: true,
});

// Revalidation webhook: 10 per secret per hour
export const revalidateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  prefix: 'ratelimit:revalidate',
  analytics: true,
});

// OTP endpoint (if implemented): 3 per phone per hour
export const otpRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'ratelimit:otp',
  analytics: true,
});

// Staff points insert: 20 per account per hour
export const pointsRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  prefix: 'ratelimit:points',
  analytics: true,
});
```

---

## Endpoint Rate Limits

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| `POST /api/contact` | 5 requests | 1 hour | IP address |
| `POST /api/reservation` | 5 requests | 1 hour | IP address |
| `POST /api/revalidate` | 10 requests | 1 hour | Secret token |
| OTP (if added) | 3 requests | 1 hour | Phone number |
| Points insert (staff) | 20 requests | 1 hour | Staff account ID |

---

## Usage in API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { contactRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Extract identifier
  const ip = request.headers.get('x-forwarded-for') ?? 
             request.headers.get('x-real-ip') ?? 
             'unknown';

  // Check rate limit
  const { success, limit, remaining, reset } = await contactRateLimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // ... proceed with request handling
}
```

---

## Rate Limit Response Headers

Always return these headers on 429 responses:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-RateLimit-Limit` | Max requests | Client knows the limit |
| `X-RateLimit-Remaining` | Requests left | Client can self-throttle |
| `X-RateLimit-Reset` | Reset timestamp (ms) | Client knows when to retry |
| `Retry-After` | Seconds until reset | Standard HTTP header |

---

## Testing Rate Limits

```bash
# Rapid-fire test (should get 429 after 5th request)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","message":"Testing rate limit"}'
  echo ""
done
```

---

## Sliding Window vs Fixed Window

We use **sliding window** because:
- Fixed window allows burst at window boundary (e.g., 5 requests at 59:59, then 5 more at 00:01)
- Sliding window distributes requests evenly across time
- More predictable protection against abuse
