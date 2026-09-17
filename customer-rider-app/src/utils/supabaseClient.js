import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    '[Supabase Error] Missing required environment variables: VITE_SUPABASE_URL and/or VITE_SUPABASE_PUBLISHABLE_KEY. Please check customer-rider-app/.env.local.'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
