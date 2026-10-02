import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight, MailCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthShell, { authInput, GoogleSignIn } from '@/components/site/AuthShell';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmSent, setConfirmSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    setError('');
    setLoading(true);
    const res = await signup(form);
    setLoading(false);
    if (!res.ok) return setError(res.error);
    if (res.needsConfirmation) setConfirmSent(true);
    else router.push('/account');
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <AuthShell title="Join the trail" subtitle={<>Already have an account? <Link href="/login" className="font-semibold text-ember-600 hover:underline">Sign in</Link></>}>
      {confirmSent ? (
        <div className="rounded-3xl bg-pine-50 p-8 text-center ring-1 ring-pine-100">
          <MailCheck className="mx-auto h-12 w-12 text-pine-600" />
          <p className="mt-4 text-pine-900">We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.</p>
        </div>
      ) : (
        <>
          <GoogleSignIn />
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="First name" autoComplete="given-name" className={authInput} value={form.firstName} onChange={set('firstName')} />
              <input required placeholder="Last name" autoComplete="family-name" className={authInput} value={form.lastName} onChange={set('lastName')} />
            </div>
            <input required type="email" placeholder="Email address" autoComplete="email" className={authInput} value={form.email} onChange={set('email')} />
            <input type="tel" placeholder="Phone (optional)" autoComplete="tel" className={authInput} value={form.phone} onChange={set('phone')} />
            <input required type="password" placeholder="Password (8+ characters)" autoComplete="new-password" className={authInput} value={form.password} onChange={set('password')} />
            {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-pine-900 py-4 font-semibold text-white transition-colors hover:bg-pine-800 disabled:opacity-60">
              {loading ? 'Creating account…' : <>Create account <ArrowRight className="h-4 w-4" /></>}
            </button>
            <p className="text-center text-xs text-pine-800/50">By signing up you agree to our terms and cancellation policy.</p>
          </form>
        </>
      )}
    </AuthShell>
  );
}
