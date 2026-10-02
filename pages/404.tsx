import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { ButtonLink } from '@/components/site/ui';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <Compass className="h-14 w-14 animate-[spin_8s_linear_infinite] text-ember-500" />
      <div className="mt-6 font-display text-8xl font-bold text-pine-900">404</div>
      <h1 className="mt-2 text-3xl font-bold">Looks like you've wandered off-trail.</h1>
      <p className="mt-3 text-pine-800/60">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/trips" variant="outline">Browse treks <ArrowRight className="h-4 w-4" /></ButtonLink>
      </div>
    </section>
  );
}
