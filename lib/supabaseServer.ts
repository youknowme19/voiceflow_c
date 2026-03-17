import { createClient } from '@supabase/supabase-js';

// Helper to get admin client safely
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations. Please check your .env.local file.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Global instance for convenience, but initialized lazily if possible or just export helper
export const supabaseAdmin = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

/**
 * Creates a server-side Supabase client that uses the Authorization header from the request.
 */
export function getRouteClient(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Options for the client
  const options: any = {
    global: {
      headers: {
        'apikey': supabaseAnonKey,
      }
    }
  };

  // If we have an auth header, add it to the global headers
  // Check for 'undefined' as a string which sometimes happens on client-side fetch calls
  if (authHeader && authHeader !== 'Bearer undefined' && authHeader !== 'undefined' && authHeader.trim() !== '') {
    options.global.headers['Authorization'] = authHeader;
  }

  return createClient(supabaseUrl, supabaseAnonKey, options);
}
