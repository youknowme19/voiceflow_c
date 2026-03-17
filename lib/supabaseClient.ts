import { createClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;

export function getSupabaseBrowserClient() {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a silent dummy during build
    return new Proxy({} as any, {
      get(_, prop) {
        return () => ({ data: null, error: { message: "Supabase config missing" } });
      }
    });
  }

  supabaseInstance = createClient(url, key);
  return supabaseInstance;
}

// Keep the export for backward compatibility but make it a getter
export const supabase = new Proxy({} as any, {
  get(_, prop) {
    const client = getSupabaseBrowserClient();
    return client[prop];
  }
});
