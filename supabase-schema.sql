-- ============================================================
-- Sweet Circle Loyalty Program — Full Schema
-- Run in Supabase SQL Editor (Schema: public)
-- ============================================================

-- ---- PROFILES ----
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  phone         text unique not null,
  name          text not null default '',
  role          text not null default 'customer' check (role in ('customer', 'staff', 'admin')),
  birthday_month integer check (birthday_month between 1 and 12),
  pin_hash      text,
  pin_set       boolean not null default false,
  referral_code text unique,
  referred_by   uuid references profiles(id),
  created_at    timestamptz not null default now()
);

alter table profiles enable row level security;

-- Customers can read/update their own profile
create policy "profiles: self read"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: self update"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Staff/admin can read all profiles
create policy "profiles: staff read all"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('staff', 'admin')
    )
  );

-- ---- OTP REQUESTS ----
create table if not exists otp_requests (
  id          uuid primary key default gen_random_uuid(),
  phone       text not null,
  code_hash   text not null,
  expires_at  timestamptz not null,
  verified    boolean not null default false,
  attempts    integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table otp_requests enable row level security;
-- No client access — managed entirely by service role API routes

-- ---- POINTS LEDGER ----
create table if not exists points_ledger (
  id             uuid primary key default gen_random_uuid(),
  customer_id    uuid not null references profiles(id) on delete cascade,
  points         integer not null,
  reason         text not null default 'visit',   -- visit | signup | birthday | referral | adjustment | redemption
  bill_amount    numeric(10,2),
  bill_reference text,
  note           text,
  created_by     uuid references profiles(id),    -- staff/admin who created entry
  created_at     timestamptz not null default now()
);

alter table points_ledger enable row level security;

-- Customers can read their own ledger
create policy "ledger: self read"
  on points_ledger for select
  using (customer_id = auth.uid());

-- Staff/admin can insert
create policy "ledger: staff insert"
  on points_ledger for insert
  with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('staff', 'admin')
    )
  );

-- Staff/admin can read all
create policy "ledger: staff read all"
  on points_ledger for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('staff', 'admin')
    )
  );

-- ---- CUSTOMER BALANCE VIEW ----
create or replace view customer_balance as
  select
    customer_id,
    coalesce(sum(points), 0)::integer as total_points
  from points_ledger
  group by customer_id;

-- ---- REDEMPTION CODES ----
create table if not exists redemption_codes (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references profiles(id) on delete cascade,
  code         text not null,   -- 6-digit, stored plaintext (short-lived + single-use)
  reward_id    integer not null, -- maps to rewards config (200, 400, etc.)
  points_cost  integer not null,
  expires_at   timestamptz not null,
  used         boolean not null default false,
  used_at      timestamptz,
  confirmed_by uuid references profiles(id),
  created_at   timestamptz not null default now()
);

alter table redemption_codes enable row level security;

-- Customers can read their own codes
create policy "redemption: self read"
  on redemption_codes for select
  using (customer_id = auth.uid());

-- Customers can insert their own codes
create policy "redemption: self insert"
  on redemption_codes for insert
  with check (customer_id = auth.uid());

-- Staff/admin can read all and update
create policy "redemption: staff read"
  on redemption_codes for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('staff', 'admin')
    )
  );

create policy "redemption: staff update"
  on redemption_codes for update
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('staff', 'admin')
    )
  )
  with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('staff', 'admin')
    )
  );

-- ---- HELPFUL INDEXES ----
create index if not exists idx_profiles_phone on profiles(phone);
create index if not exists idx_ledger_customer on points_ledger(customer_id);
create index if not exists idx_ledger_created on points_ledger(created_at desc);
create index if not exists idx_otp_phone on otp_requests(phone, created_at desc);
create index if not exists idx_redemption_code on redemption_codes(code);
create index if not exists idx_redemption_customer on redemption_codes(customer_id);

-- ---- TRIGGER: auto-create profile on user signup ----
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  v_phone text;
  v_name  text;
  v_ref   text;
begin
  v_phone := coalesce(new.raw_user_meta_data->>'phone', new.phone, '');
  v_name  := coalesce(new.raw_user_meta_data->>'name', '');
  v_ref   := upper(substring(md5(new.id::text) from 1 for 8));

  insert into public.profiles (id, phone, name, role, referral_code)
  values (new.id, v_phone, v_name, 'customer', v_ref)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- SEED: Birthday month auto-cron via cron-job.org
-- POST /api/loyalty/birthday-cron with CRON_SECRET header
-- ============================================================
