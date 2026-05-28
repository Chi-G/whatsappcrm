import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users.users[0]?.id;
  console.log("User ID:", userId);

  const { data: tenantUsers } = await supabase.from('tenant_users').select('*').eq('user_id', userId);
  console.log("Tenant Users:", tenantUsers);

  const { data: pipelines } = await supabase.from('pipelines').select('*');
  console.log("Pipelines count:", pipelines?.length);
}

run();
