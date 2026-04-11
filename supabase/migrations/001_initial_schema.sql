-- Reservations / Custom Orders
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  preferred_date TEXT,
  serving_size TEXT,
  flavour_preference TEXT,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public can insert (API rate limits abuse, Service Role bypasses this, but good to have)
CREATE POLICY "Anyone can submit reservation" ON reservations
  FOR INSERT WITH CHECK (true);

-- Only authenticated staff can read/update
CREATE POLICY "Staff can read reservations" ON reservations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can update reservations" ON reservations
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can read contacts" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can update contacts" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
