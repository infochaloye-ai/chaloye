import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Lock } from 'lucide-react';
import Logo from '@/components/site/Logo';
import { Btn, Field, Input } from '@/components/admin/ui';
import { adminSignIn, DEMO_ADMIN, isAdminSignedIn } from '@/lib/adminAuth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const next = (router.query.next as string) || '/admin';

  useEffect(() => {
    if (router.isReady && isAdminSignedIn()) router.replace(next);
  }, [router, next]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSignIn(email, password)) router.push(next.startsWith('/admin') ? next : '/admin');
    else setError('Incorrect email or password.');
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
            <Btn className="w-full py-3">Sign in</Btn>
            <div className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200">
              <strong>Demo login</strong>: {DEMO_ADMIN.email} / {DEMO_ADMIN.password}
              <button type="button" onClick={() => { setEmail(DEMO_ADMIN.email); setPassword(DEMO_ADMIN.password); }} className="ml-1 font-semibold underline">
                Fill in
              </button>
            </div>
          </form>
          <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>
        </div>
      </div>
    </>
  );
}
