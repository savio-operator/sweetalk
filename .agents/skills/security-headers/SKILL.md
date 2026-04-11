---
name: sweetalks-security-headers
description: Security headers configuration for Sweetalks — CSP, X-Frame-Options, HSTS, and all next.config.js security settings.
---

# Security Headers — Sweetalks

## Non-Negotiable Security Headers

All headers configured in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: buildCSP(),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

function buildCSP() {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.sanity.io",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com",
    "connect-src 'self' https://*.supabase.co https://*.sanity.io https://*.upstash.io",
    "frame-src 'self' https://www.google.com/maps https://*.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  return directives.join('; ');
}

module.exports = nextConfig;
```

---

## Header Explanations

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevents clickjacking by blocking iframes |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Only sends origin to cross-origin, full URL to same-origin |
| `X-DNS-Prefetch-Control` | `on` | Enables DNS prefetching for performance |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |
| `Content-Security-Policy` | (see above) | Restricts resource loading to approved domains |

---

## CSP Domain Whitelist

| Directive | Domains | Why |
|-----------|---------|-----|
| `script-src` | `'self'`, cdn.sanity.io | Sanity Studio previews |
| `style-src` | `'self'`, fonts.googleapis.com | Google Fonts CSS |
| `font-src` | `'self'`, fonts.gstatic.com | Google Fonts files |
| `img-src` | `'self'`, cdn.sanity.io, images.unsplash.com | CMS images, stock photos |
| `connect-src` | `'self'`, *.supabase.co, *.sanity.io, *.upstash.io | API connections |
| `frame-src` | `'self'`, google.com/maps | Embedded map |

---

## API Route Security Pattern

Every API route must:

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit check
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    // 2. Zod validation (NEVER trust client input)
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }

    // 3. Database operation
    // ...

    // 4. Generic success response
    return NextResponse.json({ success: true });
  } catch (error) {
    // 5. NEVER expose stack traces
    console.error('API error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
```

---

## Verification Commands

```bash
# Check response headers
curl -I https://sweettalks.in

# Verify no service key leaks in bundle
grep -r "SUPABASE_SERVICE_ROLE" .next/ --include="*.js"

# Audit dependencies
npm audit --audit-level=high

# Check CSP with securityheaders.com
# Visit: https://securityheaders.com/?q=sweettalks.in
```
