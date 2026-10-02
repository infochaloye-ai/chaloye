import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSettings } from '@/context/CMSContext';

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37a9.8 9.8 0 0 1-1.5-5.22c0-5.42 4.41-9.83 9.84-9.83a9.77 9.77 0 0 1 6.95 2.88 9.77 9.77 0 0 1 2.88 6.96c0 5.42-4.42 9.82-9.84 9.82zm8.37-18.2A11.75 11.75 0 0 0 12.04 0C5.5 0 .2 5.32.2 11.85c0 2.09.55 4.13 1.59 5.93L.1 24l6.35-1.67a11.8 11.8 0 0 0 5.59 1.42h.01c6.53 0 11.84-5.32 11.85-11.85a11.78 11.78 0 0 0-3.47-8.38z" />
    </svg>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const s = useSettings();
  // Trek pages have a fixed mobile booking bar, so lift the chat button above it.
  const lifted = useRouter().pathname === '/trips/[slug]';
  return (
    <>
      <Head>
        <title>{`${s.siteName} · Guided Himalayan Treks`}</title>
        <meta name="description" content={s.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content={s.siteName} />
      </Head>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      {s.whatsapp && (
        <a
          href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent("Hi Chal Oye! I'd like help choosing a trek.")}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className={`group fixed ${lifted ? 'bottom-24 lg:bottom-5' : 'bottom-5'} right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-4 text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition-all duration-500 ease-out-expo hover:pr-5`}
        >
          <WhatsAppIcon className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500 ease-out-expo group-hover:max-w-[10rem]">
            Chat with us
          </span>
        </a>
      )}
    </>
  );
}
