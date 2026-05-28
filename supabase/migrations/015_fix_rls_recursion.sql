-- Fix infinite recursion in RLS policies by using a SECURITY DEFINER function
-- This allows us to query a user's tenants without triggering the tenant_users 
-- RLS policy again, completely eliminating the infinite recursion loop.

CREATE OR REPLACE FUNCTION get_user_tenants()
RETURNS SETOF uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid();
$$;

-- Update tenant_users policy
DROP POLICY IF EXISTS "Users can view their tenant_users" ON tenant_users;
CREATE POLICY "Users can view their tenant_users" ON tenant_users FOR SELECT
  USING (tenant_id IN (SELECT get_user_tenants()));

-- We can optionally update `tenants` as well for performance, 
-- though it's technically fixed by fixing tenant_users.
DROP POLICY IF EXISTS "Users can view their tenants" ON tenants;
CREATE POLICY "Users can view their tenants" ON tenants FOR SELECT
  USING (id IN (SELECT get_user_tenants()));
