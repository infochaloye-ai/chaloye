import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AuthShell, { authInput } from '@/components/site/AuthShell';

// Landing page for the link in Supabase's password reset email. The link signs the
// visitor in for this one purpose, so updating the password only needs the new value.
export default function ResetPasswordPage() {
  const { user, isLoading, updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    setError('');
    setLoading(true);
    const res = await updatePassword(password);
    setLoading(false);
    if (res.ok) router.push('/account');
    else setError(res.error);
  };

  return (
    <AuthShell title="Choose a new password" subtitle="Pick something you haven't used here before.">
      {!isLoading && !user ? (
        <p className="text-pine-800/70">
          This reset link has expired or was already used. <Link href="/forgot-password" className="font-semibold text-ember-600 hover:underline">Request a new one</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input required type="password" autoComplete="new-password" placeholder="New password (8+ characters)" className={authInput} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
          <button disabled={loading || isLoading} className="w-full rounded-full bg-pine-900 py-4 font-semibold text-white transition-colors hover:bg-pine-800 disabled:opacity-60">
            {loading ? 'Saving…' : 'Save new password'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
