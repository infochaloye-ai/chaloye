import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthShell, { authInput } from '@/components/site/AuthShell';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) router.push((router.query.next as string) || '/account');
    else setError('Invalid email or password.');
  };

  return (
    <AuthShell title="Welcome back" subtitle={<>New here? <Link href="/signup" className="font-semibold text-ember-600 hover:underline">Create an account</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <input required type="email" autoComplete="email" placeholder="Email address" className={authInput} value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <input required type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Password" className={`${authInput} pr-14`} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-pine-800/50 hover:text-pine-900">
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-medium text-pine-800/70 hover:text-ember-600">Forgot password?</Link>
        </div>
        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-pine-900 py-4 font-semibold text-white transition-colors hover:bg-pine-800 disabled:opacity-60">
          {loading ? 'Signing in…' : <>Sign in <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
    </AuthShell>
  );
}
