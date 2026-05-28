-- 016_optimize_rls_policies.sql
-- Optimizes all multi-tenancy RLS policies to use the SECURITY DEFINER function directly.
-- This bypasses complex EXISTS subqueries, preventing any edge cases with BEFORE triggers
-- and drastically improving query performance.

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'contacts', 'tags', 'contact_tags', 'custom_fields', 'contact_custom_values', 
    'contact_notes', 'conversations', 'messages', 'whatsapp_config', 
    'message_templates', 'pipelines', 'pipeline_stages', 'deals', 
    'broadcasts', 'broadcast_recipients'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    -- Drop the EXISTS-based policy created in 014
    EXECUTE format('DROP POLICY IF EXISTS "Tenant users can manage %I" ON %I;', t, t);
    
    -- Create the new optimized policy using the get_user_tenants() function
    EXECUTE format('CREATE POLICY "Tenant users can manage %I" ON %I FOR ALL USING (tenant_id IN (SELECT get_user_tenants()));', t, t, t);
  END LOOP;
END $$;
