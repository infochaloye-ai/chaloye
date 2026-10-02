import React, { useState } from 'react';
import Head from 'next/head';
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useCMS, usePublishedTreks } from '@/context/CMSContext';
import PageHero from '@/components/site/PageHero';
import Reveal from '@/components/site/Reveal';
import FaqList from '@/components/site/Faq';
import { Highlighted } from '@/components/site/ui';

const field =
  'w-full rounded-2xl bg-sand-50 px-5 py-4 text-pine-950 ring-1 ring-pine-900/10 outline-none transition placeholder:text-pine-800/40 focus:bg-white focus:ring-2 focus:ring-ember-500';

export default function ContactPage() {
  const { data, create } = useCMS();
  const treks = usePublishedTreks();
  const s = data.settings;
  const page = data.pages.contact;
  const faqs = data.faqs.filter((f) => f.published).sort((a, b) => a.order - b.order).slice(0, 4);

  const [form, setForm] = useState({ name: '', email: '', phone: '', trekInterest: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await create('inquiries', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        trekInterest: form.trekInterest || undefined,
        subject: form.subject.trim() || 'General enquiry',
        message: form.message.trim(),
        status: 'new',
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const channels = [
    { icon: MessageCircle, label: 'WhatsApp', value: 'Fastest reply', href: `https://wa.me/${s.whatsapp}` },
    { icon: Phone, label: 'Call us', value: s.phone, href: `tel:${s.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
  ];

  return (
    <>
      <Head>
        <title>{`Contact · ${s.siteName}`}</title>
      </Head>

      <PageHero eyebrow={page.eyebrow} title={<Highlighted title={page.title} highlight={page.highlight} className="text-ember-400" />} subtitle={page.subtitle} image={page.image} />

      <section className="container-x relative z-10 -mt-12 grid gap-4 sm:grid-cols-3">
        {channels.map((c) => (
          <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-pine-900/[0.04] shadow-soft transition-transform duration-500 ease-out-expo hover:-translate-y-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pine-900 text-white transition-colors group-hover:bg-ember-500 group-hover:text-pine-950">
              <c.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-pine-800/55">{c.label}</div>
              <div className="truncate font-semibold text-pine-950">{c.value}</div>
            </div>
          </a>
        ))}
      </section>

      <section className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <Reveal className="lg:col-span-7">
          <div className="rounded-[2rem] bg-white p-7 ring-1 ring-pine-900/[0.04] shadow-soft sm:p-10">
            {status === 'sent' ? (
              <div className="py-16 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-pine-600" />
                <h2 className="mt-6 text-3xl font-bold">Message sent!</h2>
                <p className="mx-auto mt-3 max-w-sm text-pine-800/65">Thanks, {form.name.split(' ')[0]}. A trek expert will get back to you at {form.email} shortly.</p>
                <button onClick={() => { setForm({ name: '', email: '', phone: '', trekInterest: '', subject: '', message: '' }); setStatus('idle'); }} className="mt-8 font-semibold text-ember-600 hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="text-3xl font-bold">{page.formTitle}</h2>
                <p className="pb-2 text-pine-800/60">{page.formSubtitle}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required className={field} placeholder="Your name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input required type="email" className={field} placeholder="Email address" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <input type="tel" className={field} placeholder="Phone (optional)" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <select className={field} value={form.trekInterest} onChange={(e) => setForm({ ...form, trekInterest: e.target.value })} aria-label="Trek of interest">
                    <option value="">Interested in… (optional)</option>
                    {treks.map((t) => <option key={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <input className={field} placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                <textarea required rows={5} className={field} placeholder="Tell us about your plans, group size, dates…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                {status === 'error' && <p className="text-sm font-medium text-rose-600">Couldn't send your message. Please try again or reach us on WhatsApp.</p>}
                <button disabled={status === 'sending'} className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-4 font-semibold text-pine-950 transition-colors hover:bg-ember-400 disabled:opacity-60">
                  {status === 'sending' ? 'Sending…' : <>Send message <Send className="h-4 w-4" /></>}
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={100} className="space-y-8 lg:col-span-5">
          <div className="topo relative overflow-hidden rounded-[2rem] bg-pine-900 p-8 text-white">
            <h3 className="text-2xl font-bold">Visit base camp</h3>
            <ul className="mt-6 space-y-5 text-sm text-white/75">
              <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-ember-400" />{s.address}</li>
              <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-ember-400" />{s.officeHours}</li>
            </ul>
          </div>
          {faqs.length > 0 && (
            <div>
              <h3 className="mb-2 text-2xl font-bold">Quick answers</h3>
              <FaqList faqs={faqs} />
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
