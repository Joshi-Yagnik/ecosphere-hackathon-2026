import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,   // ← session is NOT saved; login required every time
    autoRefreshToken: false, // ← no token refresh since session isn't persisted
    detectSessionInUrl: true // ← still needed for OAuth / magic-link callbacks
  }
});
