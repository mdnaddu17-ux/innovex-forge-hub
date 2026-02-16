import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('Supabase admin client: missing service role key. Admin operations will fail.');
}

export const supabaseAdmin = createClient(supabaseUrl || '', serviceRoleKey || '');
