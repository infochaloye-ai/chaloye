import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn, initials } from '@/lib/format';
import type { Difficulty } from '@/lib/cms/types';

type Variant = 'primary' | 'dark' | 'light' | 'outline' | 'ghost-light';

const variants: Record<Variant, string> = {
  primary: 'bg-ember-500 text-pine-950 hover:bg-ember-400 shadow-[0_8px_24px_-8px_rgba(232,137,47,0.6)]',
  dark: 'bg-pine-900 text-white hover:bg-pine-800',
  light: 'bg-white text-pine-950 hover:bg-sand-100',
  outline: 'border border-pine-900/15 text-pine-900 hover:border-pine-900/40 hover:bg-white',
  'ghost-light': 'border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm',
};

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 ease-out-expo active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none';

export function ButtonLink({
  href,
  variant = 'primary',
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cn(base, variants[variant], className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  tone = 'dark',
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', 'max-w-2xl', className)}>
      {eyebrow && <div className={cn('eyebrow mb-4', tone === 'light' && 'text-ember-300')}>{eyebrow}</div>}
      <h2 className={cn('text-4xl font-bold leading-[1.05] sm:text-5xl', tone === 'dark' ? 'text-pine-950' : 'text-white')}>{title}</h2>
      {subtitle && (
        <p className={cn('mt-5 text-base leading-relaxed sm:text-lg', tone === 'dark' ? 'text-pine-800/70' : 'text-white/70')}>{subtitle}</p>
      )}
    </div>
  );
}

const difficultyStyles: Record<Difficulty, string> = {
  Easy: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  Moderate: 'bg-amber-50 text-amber-800 ring-amber-200',
  Challenging: 'bg-orange-50 text-orange-800 ring-orange-200',
  Expert: 'bg-rose-50 text-rose-800 ring-rose-200',
};

export function DifficultyBadge({ level, className }: { level: Difficulty; className?: string }) {
  const bars = { Easy: 1, Moderate: 2, Challenging: 3, Expert: 4 }[level];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', difficultyStyles[level], className)}>
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn('w-[3px] rounded-full bg-current', i <= bars ? 'opacity-100' : 'opacity-25')} style={{ height: 4 + i * 2 }} />
        ))}
      </span>
      {level}
    </span>
  );
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn('h-4 w-4', i <= Math.round(rating) ? 'fill-ember-500 text-ember-500' : 'fill-pine-900/10 text-transparent')} />
      ))}
    </span>
  );
}

export function Avatar({ src, name, className }: { src?: string; name: string; className?: string }) {
  if (src) return <img src={src} alt={name} className={cn('rounded-full object-cover', className)} loading="lazy" />;
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full bg-pine-800 font-semibold text-white', className)}>
      {initials(name)}
    </span>
  );
}
