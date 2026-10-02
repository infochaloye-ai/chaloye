import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthShell, { authInput } from '@/components/site/AuthShell';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthShell title="Reset password" subtitle="Enter your email and we'll send you a link to reset your password.">
      {sent ? (
        <div className="rounded-3xl bg-pine-50 p-8 text-center ring-1 ring-pine-100">
          <MailCheck className="mx-auto h-12 w-12 text-pine-600" />
          <p className="mt-4 text-pine-900">If an account exists for <strong>{email}</strong>, a reset link is on its way.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input required type="email" autoComplete="email" placeholder="Email address" className={authInput} value={email} onChange={(e) => setEmail(e.target.value)} />
          <button disabled={loading} className="w-full rounded-full bg-pine-900 py-4 font-semibold text-white transition-colors hover:bg-pine-800 disabled:opacity-60">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
      <Link href="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pine-800/70 hover:text-ember-600">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </AuthShell>
  );
}
