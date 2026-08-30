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

  const refreshAdmin = useCallback(async (userId?: string) => {
    const id = userId ?? session?.user?.id;
    if (!id) {
      setIsAdmin(false);
      return;
    }
    const { data } = await supabase
      .from('admin_profiles')
      .select('user_id')
      .eq('user_id', id)
      .maybeSingle();
    setIsAdmin(Boolean(data));
  }, [session?.user?.id]);

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: 'Invalid email or password.' };
    return { error: null };
  }, []);

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
