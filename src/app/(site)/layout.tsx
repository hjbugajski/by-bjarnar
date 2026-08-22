import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import type { GlobalSlug } from 'payload';
import { getPayload } from 'payload';

import { Footer } from '@/components/footer';
import { MobileNavigation } from '@/components/mobile-navigation';
import { QueryProvider } from '@/components/providers/query-client-provider';
import { env } from '@/env/client';
import type { PayloadFooterGlobal, PayloadNavigationGlobal } from '@/payload/payload-types';
import payloadConfig from '@/payload/payload.config';
import { cn } from '@/utils/cn';
import { linkProps } from '@/utils/link';

import './globals.css';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

export const metadata: Metadata = {
  title: 'By Bjarnar',
  description:
    'Will Bjarnar is a freelance writer, film critic, and Emmy Award-winning video editor whose work has been featured in various outlets including Next Best Picture, InSession Film, Geek Vibes Nation, and Screensphere.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-mask.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
  },
};

const fetchCachedGlobal = async <T,>(slug: GlobalSlug): Promise<T> => {
  'use cache';
  cacheLife('max');
  cacheTag(`global_${slug}`);

  const payload = await getPayload({ config: payloadConfig });

  return payload.findGlobal({ slug }) as Promise<T>;
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { links } = await fetchCachedGlobal<PayloadNavigationGlobal>('navigation');
  const footer = await fetchCachedGlobal<PayloadFooterGlobal>('footer');

  return (
    <html
      lang="en"
      className={cn(
        instrumentSans.variable,
        instrumentSerif.variable,
        'h-full scroll-p-4 scroll-smooth! bg-gold-2 text-gold-11 antialiased md:scroll-p-6',
      )}
    >
      <body className="flex h-full flex-1 flex-col">
        <QueryProvider>
          <div className="relative isolate mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:flex-row md:p-6">
            <aside className="w-full shrink-0 border-b border-gold-6 pb-2 md:max-w-56 md:border-r md:border-b-0 md:pr-6 md:pb-0">
              <div className="sticky top-6 flex w-full items-center justify-between after:hidden md:flex-col md:items-start md:justify-normal after:md:absolute after:md:-top-6 after:md:-right-6.25 after:md:block after:md:h-6 after:md:border-r-2 after:md:border-gold-2 after:md:content-['']">
                <div className="flex flex-col gap-6">
                  <Link
                    href="/"
                    prefetch
                    className="block text-lg italic underline-offset-12 md:text-5xl"
                  >
                    <h1 className="text-inherit">By Bjarnar</h1>
                  </Link>
                  <p className="balanced hidden text-gold-11 md:block">
                    A collection of writings by <br /> Will Bjarnar.
                  </p>
                </div>
                <MobileNavigation links={links} />
                <hr className="my-6 hidden w-full border-t-2 border-dotted border-t-gold-6 md:block" />
                <ul className="hidden gap-2 md:flex md:flex-col md:text-base">
                  {links?.map((link) => (
                    <li key={link.id}>
                      <Link
                        {...linkProps(link)}
                        prefetch
                        className="text-gold-11 hover:text-green-12"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            <main className="w-full">{children}</main>
          </div>
          <Footer {...footer} />
        </QueryProvider>
        <Script
          src={env.NEXT_PUBLIC_UMAMI_SRC}
          data-website-id={env.NEXT_PUBLIC_UMAMI_ID}
          data-domains={env.NEXT_PUBLIC_DOMAIN}
          data-performance="true"
        />
      </body>
    </html>
  );
}
