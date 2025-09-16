import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

// Check for valid Supabase URL format
if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your_supabase')) {
  console.warn('⚠️  Supabase not configured properly. Some features will not work.');
  console.warn('📝 Please update your .env file with real Supabase credentials');
  
  // Create a mock client for development
  supabase = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null })
    },
    from: (table) => ({
      select: (columns) => ({
        range: (from, to) => ({
          order: (column, options) => ({
            or: (condition) => Promise.resolve({ data: [], error: null }),
            eq: (column, value) => Promise.resolve({ data: [], error: null }),
            ilike: (column, value) => Promise.resolve({ data: [], error: null }),
            single: () => Promise.resolve({ data: null, error: { message: `No ${table} found` } }),
            then: (resolve) => resolve({ data: [], error: null })
          }),
          eq: (column, value) => Promise.resolve({ data: [], error: null }),
          ilike: (column, value) => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: { message: `No ${table} found` } }),
          then: (resolve) => resolve({ data: [], error: null })
        }),
        order: (column, options) => ({
          or: (condition) => Promise.resolve({ data: [], error: null }),
          eq: (column, value) => Promise.resolve({ data: [], error: null }),
          ilike: (column, value) => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: { message: `No ${table} found` } }),
          then: (resolve) => resolve({ data: [], error: null })
        }),
        eq: (column, value) => ({
          single: () => Promise.resolve({ data: null, error: { message: `No ${table} found` } }),
          then: (resolve) => resolve({ data: [], error: null })
        }),
        ilike: (column, value) => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: { message: `No ${table} found` } }),
        then: (resolve) => resolve({ data: [], error: null })
      }),
      insert: (data) => ({
        select: (columns) => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } })
        })
      }),
      update: (data) => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export { supabase };
export default supabase;