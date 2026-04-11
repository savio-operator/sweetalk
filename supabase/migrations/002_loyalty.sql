-- ── Loyalty: Customers ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  phone         TEXT        UNIQUE NOT NULL,
  name          TEXT        NOT NULL,
  total_points  INTEGER     DEFAULT 0 NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Staff (authenticated) can do everything; public cannot read customer data
CREATE POLICY "Staff manage customers" ON customers
  FOR ALL
  USING  (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ── Loyalty: Point Transactions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_points (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID        NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  staff_id    UUID        NOT NULL REFERENCES auth.users(id),
  points      INTEGER     NOT NULL CHECK (points > 0),
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

-- Only the issuing staff member may insert their own records
CREATE POLICY "Staff insert own points" ON loyalty_points
  FOR INSERT
  WITH CHECK (auth.uid() = staff_id);

-- Any authenticated staff may read all point records
CREATE POLICY "Staff view points" ON loyalty_points
  FOR SELECT
  USING (auth.role() = 'authenticated');


-- ── Loyalty: OTP Codes ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS otp_codes (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  phone      TEXT        NOT NULL,
  code       TEXT        NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN     DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- OTP table is managed exclusively by the service role; RLS blocks all direct access
CREATE POLICY "No direct access to OTPs" ON otp_codes
  USING (false)
  WITH CHECK (false);


-- ── Trigger: Keep customers.total_points in sync ────────────────────────────
CREATE OR REPLACE FUNCTION sync_customer_total_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE customers
  SET
    total_points = (
      SELECT COALESCE(SUM(points), 0)
      FROM loyalty_points
      WHERE customer_id = NEW.customer_id
    ),
    updated_at = now()
  WHERE id = NEW.customer_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_total_points
  AFTER INSERT ON loyalty_points
  FOR EACH ROW
  EXECUTE FUNCTION sync_customer_total_points();
