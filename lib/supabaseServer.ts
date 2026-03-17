import { createClient } from '@supabase/supabase-js';

// Standard lazy helper for admin operations
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Return a proxy that errors only when used during development/production runtime,
    // but stays silent during build-time static analysis.
    return new Proxy({} as any, {
      get(_, prop) {
        if (typeof prop === "string" && ["then", "catch", "finally"].includes(prop)) return undefined;
        return () => {
          console.error(`Supabase Admin Error: Attempted to use admin client but SUPABASE_SERVICE_ROLE_KEY is missing.`);
          return { data: null, error: { message: "Supabase configuration missing" } };
        };
      }
    });
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Creates a server-side Supabase client that uses the Authorization header from the request.
 */
export function getRouteClient(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return {} as any;
  }

  // Options for the client
  const options: any = {
    global: {
      headers: {
        'apikey': supabaseAnonKey,
      }
    }
  };

  // If we have an auth header, add it to the global headers
  if (authHeader && authHeader !== 'Bearer undefined' && authHeader !== 'undefined' && authHeader.trim() !== '') {
    options.global.headers['Authorization'] = authHeader;
  }

  return createClient(supabaseUrl, supabaseAnonKey, options);
}
