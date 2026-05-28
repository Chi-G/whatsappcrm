-- ============================================================
-- MULTI-TENANCY FOUNDATION
-- Idempotent migration to introduce `tenants` and `tenant_users`
-- and update all resource tables to use `tenant_id` for RLS.
-- ============================================================

-- 1. Create `tenants` table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- 2. Create `tenant_users` mapping table
CREATE TABLE IF NOT EXISTS tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_users(tenant_id);

-- Enable RLS on tenant_users
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their tenant_users" ON tenant_users;
CREATE POLICY "Users can view their tenant_users" ON tenant_users FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid()));

-- Add RLS policy for tenants (now that tenant_users exists)
DROP POLICY IF EXISTS "Users can view their tenants" ON tenants;
CREATE POLICY "Users can view their tenants" ON tenants FOR SELECT
  USING (EXISTS (SELECT 1 FROM tenant_users WHERE tenant_users.tenant_id = tenants.id AND tenant_users.user_id = auth.uid()));

-- 3. Add `tenant_id` to all resource tables (nullable at first)
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
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;', t);
  END LOOP;
END $$;

-- 4. Data Migration: Create tenants for existing users and map data
DO $$
DECLARE
  u RECORD;
  new_tenant_id UUID;
  t TEXT;
  tables TEXT[] := ARRAY[
    'contacts', 'tags', 'contact_tags', 'custom_fields', 'contact_custom_values', 
    'contact_notes', 'conversations', 'messages', 'whatsapp_config', 
    'message_templates', 'pipelines', 'pipeline_stages', 'deals', 
    'broadcasts', 'broadcast_recipients'
  ];
BEGIN
  -- Iterate over all existing users that have a profile
  FOR u IN SELECT p.user_id, p.full_name FROM profiles p LOOP
    -- Only migrate if they don't already have a tenant
    IF NOT EXISTS (SELECT 1 FROM tenant_users WHERE user_id = u.user_id) THEN
      -- Create a new tenant
      INSERT INTO tenants (name) VALUES (COALESCE(u.full_name, 'Business') || '''s Business') RETURNING id INTO new_tenant_id;
      
      -- Link user to tenant as owner
      INSERT INTO tenant_users (tenant_id, user_id, role) VALUES (new_tenant_id, u.user_id, 'owner');
      
      -- Update all their data in resource tables
      FOREACH t IN ARRAY tables LOOP
        -- For tables that have user_id natively (most of them)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'user_id') THEN
          EXECUTE format('UPDATE %I SET tenant_id = %L WHERE user_id = %L AND tenant_id IS NULL;', t, new_tenant_id, u.user_id);
        END IF;
      END LOOP;

      -- Special cases for tables that derived user_id indirectly
      UPDATE contact_tags ct SET tenant_id = new_tenant_id 
      FROM contacts c WHERE ct.contact_id = c.id AND c.user_id = u.user_id AND ct.tenant_id IS NULL;

      UPDATE contact_custom_values ccv SET tenant_id = new_tenant_id 
      FROM contacts c WHERE ccv.contact_id = c.id AND c.user_id = u.user_id AND ccv.tenant_id IS NULL;
      
      UPDATE messages m SET tenant_id = new_tenant_id 
      FROM conversations c WHERE m.conversation_id = c.id AND c.user_id = u.user_id AND m.tenant_id IS NULL;
      
      UPDATE pipeline_stages ps SET tenant_id = new_tenant_id 
      FROM pipelines p WHERE ps.pipeline_id = p.id AND p.user_id = u.user_id AND ps.tenant_id IS NULL;
      
      UPDATE broadcast_recipients br SET tenant_id = new_tenant_id 
      FROM broadcasts b WHERE br.broadcast_id = b.id AND b.user_id = u.user_id AND br.tenant_id IS NULL;
    END IF;
  END LOOP;
END $$;

-- 5. Enforce NOT NULL on tenant_id for resource tables and Create Indexes
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
    EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET NOT NULL;', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_tenant_id ON %I(tenant_id);', replace(t, '_', ''), t);
  END LOOP;
END $$;

-- Drop unique user_id constraint on whatsapp_config and add unique tenant_id
ALTER TABLE whatsapp_config DROP CONSTRAINT IF EXISTS whatsapp_config_user_id_key;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'whatsapp_config_tenant_id_key') THEN
    ALTER TABLE whatsapp_config ADD CONSTRAINT whatsapp_config_tenant_id_key UNIQUE (tenant_id);
  END IF;
END $$;


-- 6. Update Row Level Security Policies
-- Helper function to get the current user's tenant_id for RLS
-- This relies on `tenant_users`. For a user with multiple tenants, the UI should ideally pass the tenant_id.
-- But for our 1:1 migration and basic RLS, we check if the user belongs to the row's tenant.

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
    -- Drop old policies
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage own %I" ON %I;', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can view own %I" ON %I;', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Service role can insert %I" ON %I;', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage contact tags" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage custom values" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage own notes" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage own config" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage own templates" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage own broadcasts" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage broadcast recipients" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage pipeline stages" ON %I;', t);
    
    -- Create new Tenant-based policy
    EXECUTE format('CREATE POLICY "Tenant users can manage %I" ON %I FOR ALL USING (EXISTS (SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = %I.tenant_id AND tu.user_id = auth.uid()));', t, t, t);
  END LOOP;
END $$;

-- Preserve service role bypass for messages (webhook inserts)
CREATE POLICY "Service role can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can insert conversations" ON conversations FOR INSERT WITH CHECK (true);


-- 7. Update the `handle_new_user` trigger to auto-create tenant
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_tenant_id UUID;
  user_full_name TEXT;
BEGIN
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, user_full_name, NEW.email);
  
  -- Create tenant
  INSERT INTO public.tenants (name)
  VALUES (CASE WHEN user_full_name = '' THEN 'My Business' ELSE user_full_name || '''s Business' END)
  RETURNING id INTO new_tenant_id;
  
  -- Link user to tenant
  INSERT INTO public.tenant_users (tenant_id, user_id, role)
  VALUES (new_tenant_id, NEW.id, 'owner');

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to create profile/tenant for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 8. Create a Before-Insert Trigger to auto-inject tenant_id for existing frontend code
CREATE OR REPLACE FUNCTION set_tenant_id_on_insert()
RETURNS TRIGGER AS $$
DECLARE
  user_tenant_id UUID;
BEGIN
  -- If tenant_id is already provided (e.g. by webhook), skip
  IF NEW.tenant_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Otherwise, find the user's primary tenant
  SELECT tenant_id INTO user_tenant_id FROM tenant_users WHERE user_id = auth.uid() LIMIT 1;
  
  IF user_tenant_id IS NOT NULL THEN
    NEW.tenant_id := user_tenant_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to all resource tables
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
    EXECUTE format('DROP TRIGGER IF EXISTS inject_tenant_id ON %I;', t);
    EXECUTE format('CREATE TRIGGER inject_tenant_id BEFORE INSERT ON %I FOR EACH ROW EXECUTE FUNCTION set_tenant_id_on_insert();', t);
  END LOOP;
END $$;
