-- 017_backfill_missing_tenants.sql
-- In case some users were created before the handle_new_user trigger was correctly set up,
-- or if the initial 014 migration missed them because they didn't have a profile,
-- we must ensure every auth.user has both a profile and a tenant_users association.
-- This ensures RLS policies using get_user_tenants() will never fail for ghost users.

DO $$
DECLARE
  r RECORD;
  new_tenant_id UUID;
BEGIN
  -- 1. Ensure all auth.users have a profile
  FOR r IN SELECT * FROM auth.users LOOP
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = r.id) THEN
      INSERT INTO public.profiles (user_id, full_name, email)
      VALUES (
        r.id, 
        COALESCE(r.raw_user_meta_data->>'full_name', 'User'), 
        r.email
      );
    END IF;
  END LOOP;

  -- 2. Ensure all auth.users have a tenant
  FOR r IN SELECT * FROM auth.users LOOP
    IF NOT EXISTS (SELECT 1 FROM public.tenant_users WHERE user_id = r.id) THEN
      -- Create a new tenant for the user
      INSERT INTO public.tenants (name) 
      VALUES (COALESCE(r.raw_user_meta_data->>'full_name', 'User') || '''s Business') 
      RETURNING id INTO new_tenant_id;
      
      -- Link user to the tenant as an owner
      INSERT INTO public.tenant_users (tenant_id, user_id, role) 
      VALUES (new_tenant_id, r.id, 'owner');
    END IF;
  END LOOP;
END $$;
