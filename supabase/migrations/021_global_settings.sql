-- 021_global_settings.sql
-- Stores global platform settings such as the admin-controlled exchange rates 
-- for the Paystack Smart Workaround (NGN conversion).

CREATE TABLE IF NOT EXISTS global_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one row exists
  usd_to_ngn_rate NUMERIC NOT NULL DEFAULT 1500,
  gbp_to_ngn_rate NUMERIC NOT NULL DEFAULT 1900,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (so the frontend Paywall can show the rates)
CREATE POLICY "Allow public read access to global_settings" 
ON global_settings FOR SELECT 
USING (true);

-- Restrict write access to service_role or specific admin rules (locked down for now)
-- The admin can update this directly in the Supabase Dashboard.

-- Insert the single configuration row
INSERT INTO global_settings (id, usd_to_ngn_rate, gbp_to_ngn_rate) 
VALUES (1, 1500, 1900)
ON CONFLICT (id) DO NOTHING;
