import { supabase } from './supabase';

// Admins are ordinary Supabase Auth users listed in the `admins` table.
// The real protection is RLS (public.is_admin()); these helpers only drive the UI.

export interface AdminUser {
  email: string;
}

async function isAdmin() {
  const { data, error } = await supabase.rpc('is_admin');
  return !error && data === true;
}

/** Returns an error message, or null on success. */
export async function adminSignIn(email: string, password: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return error.message;
  if (await isAdmin()) return null;
  await supabase.auth.signOut();
  return 'This account does not have admin access.';
}

export async function adminSignOut() {
  await supabase.auth.signOut();
}

export async function getAdmin(): Promise<AdminUser | null> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user || !(await isAdmin())) return null;
  return { email: user.email ?? '' };
}
