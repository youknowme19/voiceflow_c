"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "./supabaseClient";
import { useRouter } from "next/navigation";

interface AuthContextValue {
  user: any;
}

const AuthContext = createContext<AuthContextValue>({ user: null });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Guard against missing environment variables
    if (!supabase.auth) {
      console.warn('Supabase auth not configured - check environment variables');
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        router.push('/login');
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [router]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
