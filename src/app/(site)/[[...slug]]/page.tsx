import { Suspense } from 'react';

import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

import config from '@payload-config';

import { metadata } from '@/app/(site)/layout';
import { LivePreviewListener } from '@/components/live-preview-listener';
import { RichText } from '@/components/rich-text';

interface Props {
  params: Promise<{ slug: string[] }>;
}

function pageTitle(title: string | undefined, metadata: Metadata) {
  return !title || title?.toLowerCase() === 'home'
    ? metadata.title
    : `${title} | ${metadata.title as string}`;
}

function pagePath(slug: string[] | undefined) {
  return `/${(slug || ['home']).join('/')}`;
}

async function findPage(path: string, draft: boolean) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'pages',
    draft,
    pagination: false,
    limit: 1,
    overrideAccess: draft,
    depth: 2,
    where: {
      path: {
        equals: path,
      },
    },
  });

  return result.docs?.[0] || null;
}

async function fetchCachedPage(path: string) {
  'use cache';
  cacheLife('max');
  // `pages` is expired by any change to a collection inlined at depth 2.
  cacheTag('pages', `page_${path}`);

  return findPage(path, false);
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config });
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      pagination: false,
      overrideAccess: false,
      select: {
        path: true,
      },
    });

    return pages.docs.map(({ path }) => ({ slug: path?.split('/')?.slice(1) || undefined }));
  } catch {
    return [{ slug: undefined }];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  'use cache';
  cacheLife('max');

  const { slug } = await params;
  const path = pagePath(slug);

  cacheTag('pages', `page_${path}`);

  const page = await fetchCachedPage(path);

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

function PageFallback() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-4">
      <div className="h-10 w-2/3 rounded-sm bg-gold-4 xs:h-12" />
      <div className="h-4 w-full rounded-sm bg-gold-3" />
      <div className="h-4 w-11/12 rounded-sm bg-gold-3" />
      <div className="h-4 w-3/4 rounded-sm bg-gold-3" />
    </div>
  );
}

async function PageContent({ params }: Props) {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()]);
  const path = pagePath(slug);
  const page = draft ? await findPage(path, true) : await fetchCachedPage(path);

  if (!page) {
    notFound();
  }

  return (
    <>
      {draft ? <LivePreviewListener /> : null}
      <RichText data={page.content} />
    </>
  );
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<PageFallback />}>
      <PageContent params={params} />
    </Suspense>
  );
}
