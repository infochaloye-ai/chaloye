import React from 'react';

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-pine-950 pb-20 pt-40 text-white sm:pb-28 sm:pt-52">
      <img src={image} alt="" className="absolute inset-0 h-full w-full animate-ken-burns object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/50 to-pine-950/30" />
      <div className="container-x relative">
        {eyebrow && <div className="eyebrow mb-5 animate-fade-up text-ember-300">{eyebrow}</div>}
        <h1 className="max-w-4xl animate-fade-up font-display text-5xl font-bold leading-[0.98] [animation-delay:100ms] sm:text-7xl lg:text-8xl">{title}</h1>
        {subtitle && <p className="mt-7 max-w-2xl animate-fade-up text-lg text-white/75 [animation-delay:200ms] sm:text-xl">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
