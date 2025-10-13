"use client";

/**
 * Custom hook để sử dụng Supabase client trong Client Components
 */

import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function useSupabase() {
  const [supabase] = useState(() => createClient());
  return supabase;
}

type AuthContextValue = { user: User | null; loading: boolean };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!isMounted) return;
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(() => ({ user, loading }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fallback: if no provider, create a local supabase read once
    const supabase = createClient();
    const [state, setState] = useState<AuthContextValue>({ user: null, loading: true });
    useEffect(() => {
      let mounted = true;
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!mounted) return;
        setState({ user, loading: false });
      });
      return () => {
        mounted = false;
      };
    }, []);
    return state;
  }
  return ctx;
}


