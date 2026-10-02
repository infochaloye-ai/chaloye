// Demo-only admin gate. This is NOT security: anyone can read these credentials in the bundle.
// Replace with Supabase Auth + a row-level-security "admins" check before going live.

export const DEMO_ADMIN = {
  email: 'admin@chaloye.in',
  password: 'chaloye123',
  name: 'Chal Oye Admin',
};

const KEY = 'chaloye-admin-session';

export function adminSignIn(email: string, password: string) {
  const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
  if (ok) localStorage.setItem(KEY, JSON.stringify({ email: DEMO_ADMIN.email, at: Date.now() }));
  return ok;
}

export function adminSignOut() {
  localStorage.removeItem(KEY);
}

export function isAdminSignedIn() {
  try {
    return !!localStorage.getItem(KEY);
  } catch {
    return false;
  }
}
