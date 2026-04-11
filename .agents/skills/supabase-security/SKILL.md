---
name: sweetalks-supabase-security
description: Supabase setup patterns for Sweetalks — RLS policies, client configuration, auth flows, and security rules.
---

# Supabase Security Patterns — Sweetalks

## Non-Negotiable Rules

1. **RLS enabled on ALL tables** before any data is written
2. **WITH CHECK** on all INSERT and UPDATE policies
3. **Identity always from `auth.uid()`** — never from request body
4. **Service role key: server-side only** — never `NEXT_PUBLIC_`
5. **Every API route calls `supabase.auth.getUser()` first** (for authenticated routes)
6. **Return generic error messages** — never expose stack traces
7. **`npm audit` clean before every deploy**

---

## Environment Variables

```env
# Public (safe to expose in browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Private (server-side ONLY)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

> [!CAUTION]
> Never prefix the service role key with `NEXT_PUBLIC_`. This key bypasses RLS.

---

## Client Setup

### Browser Client (`src/lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Server Client (`src/lib/supabase/server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — can't set cookies
          }
        },
      },
    }
  );
}
```

### Admin Client (`src/lib/supabase/admin.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

// Service role — bypasses RLS. Server-side ONLY.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);
```

---

## Row Level Security (RLS) Patterns

### Public Insert (rate-limited at API layer)

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (API rate limiting handles abuse)
CREATE POLICY "public_insert" ON table_name
  FOR INSERT WITH CHECK (true);

-- Only authenticated staff can SELECT
CREATE POLICY "staff_read" ON table_name
  FOR SELECT USING (auth.role() = 'authenticated');
```

### Authenticated Operations

```sql
-- Users can only read their own data
CREATE POLICY "users_read_own" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own data
CREATE POLICY "users_update_own" ON table_name
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## API Route Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ratelimit } from '@/lib/rate-limit';
import { someSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Parse and validate
    const body = await request.json();
    const result = someSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input.' },
        { status: 400 }
      );
    }

    // 3. Database operation (service role for public endpoints)
    const { error } = await supabaseAdmin
      .from('table_name')
      .insert({ ...result.data, ip_address: ip });

    if (error) {
      console.error('DB error:', error.message);
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

    // 4. Success
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
```

---

## Security Checklist

- [ ] RLS enabled on every table
- [ ] WITH CHECK on every INSERT/UPDATE policy
- [ ] Service role key not in any `NEXT_PUBLIC_` variable
- [ ] Every authenticated route calls `getUser()` first
- [ ] Zod validation on all inputs
- [ ] Generic error messages only
- [ ] `npm audit` clean
- [ ] Lockfile committed
- [ ] No unused dependencies
