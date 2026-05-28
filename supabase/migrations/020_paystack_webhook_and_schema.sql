-- 018_paystack_billing_schema.sql
-- Native Paystack billing fields for Automated Subscription Management.

ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS paystack_subscription_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS paystack_plan_code TEXT,
ADD COLUMN IF NOT EXISTS paystack_current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled'));

CREATE INDEX IF NOT EXISTS idx_tenants_paystack_customer_code ON tenants(paystack_customer_code);
CREATE INDEX IF NOT EXISTS idx_tenants_paystack_subscription_code ON tenants(paystack_subscription_code);

-- ============================================================
-- WEBHOOK IDEMPOTENCY TABLE
-- ============================================================
-- Stores Paystack webhook event references to strictly prevent 
-- duplicate payment processing and race conditions.

CREATE TABLE IF NOT EXISTS paystack_webhook_events (
  reference TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (locked down since only the backend server interacts with this)
ALTER TABLE paystack_webhook_events ENABLE ROW LEVEL SECURITY;
