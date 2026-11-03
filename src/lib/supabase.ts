import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://slkpvgceafqopjdregow.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsa3B2Z2NlYWZxb3BqZHJlZ293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MDQ0ODcsImV4cCI6MjEwOTI4MDQ4N30.qpAPYOCCUcQCNSdvia4iU5qQ3mbHYpt8bUMYfpeT7R0';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
