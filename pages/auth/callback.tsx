import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AuthShell from '@/components/site/AuthShell';

// Where Supabase sends visitors back after Google sign-in or an email confirmation link.
// On success the session is already in the URL and AuthProvider picks it up; on failure
// Supabase appends error_description, which we show instead of silently bouncing to /login.
function readError() {
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return params.get('error_description') || hash.get('error_description') || '';
}

export default function AuthCallbackPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    setError(readError());
  }, []);

  useEffect(() => {
    if (!router.isReady || isLoading || !user) return;
    const next = typeof router.query.next === 'string' && router.query.next.startsWith('/') ? router.query.next : '/account';
    router.replace(next);
  }, [router, isLoading, user]);

  const failed = !isLoading && !user;

  return (
    <AuthShell title={failed ? 'Sign-in didn’t finish' : 'Signing you in…'} subtitle={failed ? 'Something went wrong on the way back.' : 'One moment.'}>
      {failed && (
        <div className="space-y-4">
          <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-800 ring-1 ring-rose-200">{error || 'No session was returned. Please try again.'}</p>
          <Link href="/login" className="inline-flex font-semibold text-ember-600 hover:underline">Back to sign in</Link>
        </div>
      )}
    </AuthShell>
  );
}
