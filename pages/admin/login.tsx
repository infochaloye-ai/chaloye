import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Lock } from 'lucide-react';
import Logo from '@/components/site/Logo';
import { Btn, Field, Input } from '@/components/admin/ui';
import { adminSignIn, getAdmin } from '@/lib/adminAuth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const queryNext = (router.query.next as string) || '/admin';
  const next = queryNext.startsWith('/admin') ? queryNext : '/admin';

  useEffect(() => {
    if (!router.isReady) return;
    getAdmin().then((a) => a && router.replace(next));
  }, [router, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await adminSignIn(email, password);
    setLoading(false);
    if (err) setError(err);
    else router.push(next);
  };

  return (
    <>
      <Head>
        <title>Admin sign in</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="topo flex min-h-screen items-center justify-center bg-pine-950 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center">
            <Logo tone="light" />
          </div>
          <form onSubmit={submit} className="animate-pop-in space-y-4 rounded-2xl bg-white p-7 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700"><Lock className="h-5 w-5" /></span>
              <div>
                <h1 className="font-display text-xl font-bold">Content studio</h1>
                <p className="text-xs text-pine-800/55">Sign in to manage your website</p>
              </div>
            </div>
            <Field label="Email">
              <Input type="email" required autoFocus autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password">
              <Input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
            <Btn className="w-full py-3" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Btn>
          </form>
          <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>
        </div>
      </div>
    </>
  );
}
