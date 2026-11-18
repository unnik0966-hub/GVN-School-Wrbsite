'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AdminContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshAdmin = useCallback(async (userId?: string): Promise<boolean> => {
    if (!userId) {
      setIsAdmin(false);
      return false;
    }
    const { data } = await supabase
      .from('admin_profiles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    const ok = Boolean(data);
    setIsAdmin(ok);
    return ok;
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }: any) => {
      if (!mounted) return;
      setSession(data?.session ?? null);
      if (data?.session?.user?.id) {
        refreshAdmin(data.session.user.id).finally(() => mounted && setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event: any, newSession: any) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        refreshAdmin(newSession.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [refreshAdmin]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message || 'Invalid email or password.' };
    }
    const userId = data?.user?.id;
    if (userId) {
      const ok = await refreshAdmin(userId);
      if (!ok) {
        return { error: 'Signed in, but this account is not authorized in admin_profiles.' };
      }
    }
    return { error: null };
  }, [refreshAdmin]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AdminContext.Provider
      value={{ session, user: session?.user ?? null, loading, isAdmin, signIn, signOut }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
