import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Customer accounts: Supabase Auth for sessions, `profiles` for name and phone.

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  joinDate: string;
}

interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

type Result = { ok: true } | { ok: false; error: string };
type SignupResult = Result & { needsConfirmation?: boolean };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<Result>;
  /** Redirects to Google; on return the visitor lands on `next` signed in. */
  signInWithGoogle: (next?: string) => Promise<Result>;
  signup: (input: SignupInput) => Promise<SignupResult>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<Result>;
  updatePassword: (password: string) => Promise<Result>;
  updateProfile: (patch: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) => Promise<Result>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loadUser(authUser: AuthUser): Promise<User> {
  const { data } = await supabase.from('profiles').select('first_name, last_name, phone').eq('id', authUser.id).maybeSingle();
  const meta = authUser.user_metadata ?? {};
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    firstName: data?.first_name || meta.first_name || (authUser.email ?? '').split('@')[0],
    lastName: data?.last_name || meta.last_name || '',
    phone: data?.phone ?? meta.phone ?? undefined,
    joinDate: authUser.created_at.slice(0, 10),
  };
}

const fail = (error: { message: string } | null): Result => (error ? { ok: false, error: error.message } : { ok: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Deferred: Supabase must not be called from inside this callback.
      setTimeout(async () => {
        setUser(session?.user ? await loadUser(session.user) : null);
        setIsLoading(false);
      }, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return fail(error);
  }, []);

  const signInWithGoogle = useCallback(async (next = '/account') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${next.startsWith('/') ? next : '/account'}` },
    });
    return fail(error);
  }, []);

  const signup = useCallback(async (input: SignupInput): Promise<SignupResult> => {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: { first_name: input.firstName.trim(), last_name: input.lastName.trim(), phone: input.phone?.trim() || null },
      },
    });
    if (error) return { ok: false, error: error.message };
    // With email confirmation on, there's no session until the link is clicked.
    return { ok: true, needsConfirmation: !data.session };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return fail(error);
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return fail(error);
  }, []);

  const updateProfile = useCallback<AuthContextType['updateProfile']>(
    async (patch) => {
      if (!user) return { ok: false, error: 'You are signed out.' };
      const { error } = await supabase
        .from('profiles')
        .update({ first_name: patch.firstName, last_name: patch.lastName, phone: patch.phone || null })
        .eq('id', user.id);
      if (!error) setUser({ ...user, ...patch });
      return fail(error);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signInWithGoogle, signup, logout, resetPassword, updatePassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
