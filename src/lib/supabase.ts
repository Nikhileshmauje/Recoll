import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

export type User = {
  id: string;
  email: string;
};

// Initialize auth state from local storage
supabase.auth.getSession().catch(error => {
  if (error.message?.includes('Invalid Refresh Token') || 
      error.message?.includes('Refresh Token Not Found')) {
    // Clear invalid session
    localStorage.clear();
    supabase.auth.signOut();
  }
  console.error('Session initialization error:', error);
});

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // Clear local storage on sign out or user deletion
    localStorage.clear();
  }
});