import { cache } from 'react';

import type { Metadata } from 'next';
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

const fetchCachedPage = cache(async ({ slug }: { slug: string[] }) => {
  const segments = slug || ['home'];
  const draftModePromis = draftMode();
  const payloadPromise = getPayload({ config });
  const [{ isEnabled: draft }, payload] = await Promise.all([draftModePromis, payloadPromise]);
  const result = await payload.find({
    collection: 'pages',
    draft,
    pagination: false,
    limit: 1,
    overrideAccess: draft,
    depth: 2,
    where: {
      path: {
        equals: `/${segments.join('/')}`,
      },
    },
  });

  return result.docs?.[0] || null;
});

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
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

export default async function Page({ params }: Props) {
  const { isEnabled: draft } = await draftMode();
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });

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
