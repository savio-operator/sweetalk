---
name: sweetalks-deployment
description: Build, test, and deployment checklist for Sweetalks — pre-deploy verification, environment setup, and production hardening.
---

# Deployment Checklist — Sweetalks

## Pre-Deploy Verification

### 1. Code Quality

```bash
# TypeScript type checking — zero errors
npx tsc --noEmit

# Lint — zero warnings
npm run lint

# Build — must succeed
npm run build
```

### 2. Security Audit

```bash
# Dependency audit — no high/critical vulnerabilities
npm audit --audit-level=high

# Verify lockfile is committed
git status package-lock.json  # Should not be in .gitignore

# Check for leaked secrets in bundle
grep -r "SUPABASE_SERVICE_ROLE" .next/ --include="*.js"
grep -r "REVALIDATION_SECRET" .next/ --include="*.js"
grep -r "SANITY_API_TOKEN" .next/ --include="*.js"
grep -r "UPSTASH_REDIS_REST_TOKEN" .next/ --include="*.js"
# All above should return ZERO results

# Verify no unused packages
npx depcheck
```

### 3. Database

```bash
# Verify RLS is enabled on ALL tables
# Run in Supabase SQL Editor:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
# All rows should show rowsecurity = true
```

### 4. Visual Testing (Browser)

- [ ] All 9 sections render at 375px (mobile)
- [ ] All 9 sections render at 768px (tablet)
- [ ] All 9 sections render at 1440px (desktop)
- [ ] Navbar morphs on scroll
- [ ] Hero GSAP animations fire
- [ ] Menu tab switching works
- [ ] Gallery carousel works
- [ ] Testimonials columns auto-scroll
- [ ] Reservation form submits successfully
- [ ] Location map expands
- [ ] Footer hover effect works
- [ ] Blog listing loads posts
- [ ] Blog post page renders body content

### 5. Performance

```bash
# Lighthouse CLI
npx lighthouse https://sweettalks.in --output=json --output-path=./lighthouse.json

# Targets:
# Performance: > 90
# SEO: > 95
# Accessibility: > 90
# Best Practices: > 90
```

---

## Environment Variables (Production)

Set these in your deployment platform (Vercel, etc.):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...
REVALIDATION_SECRET=<random-32-char-string>

# Upstash
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...

# App
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://sweettalks.in
```

---

## Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Set environment variables
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# ... repeat for all env vars

# Deploy preview
vercel

# Deploy production
vercel --prod
```

---

## Post-Deploy Verification

```bash
# 1. Check security headers
curl -I https://sweettalks.in

# Expected headers:
# x-frame-options: DENY
# x-content-type-options: nosniff
# referrer-policy: strict-origin-when-cross-origin
# strict-transport-security: max-age=63072000; includeSubDomains; preload
# content-security-policy: (full policy)

# 2. Test rate limiting
for i in {1..7}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://sweettalks.in/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","message":"Rate limit test"}'
done
# Should see 200s then 429

# 3. Test Sanity webhook
curl -X POST https://sweettalks.in/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_REVALIDATION_SECRET"}'

# 4. SecurityHeaders.com scan
# Visit: https://securityheaders.com/?q=sweettalks.in
# Target: A+ rating

# 5. Google PageSpeed Insights
# Visit: https://pagespeed.web.dev/analysis?url=sweettalks.in
```

---

## Rollback Procedure

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

---

## DNS / Domain Setup

1. Add domain in Vercel dashboard
2. Set DNS records:
   - `A` record: `76.76.21.21` (Vercel)
   - `CNAME` record: `cname.vercel-dns.com` (for www)
3. Enable Vercel SSL (automatic)
4. Verify HSTS preload at https://hstspreload.org/
