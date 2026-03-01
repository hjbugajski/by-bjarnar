import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import type { CollectionSlug, PayloadRequest } from 'payload';
import { getPayload } from 'payload';

import configPromise from '@payload-config';

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise });
  const { searchParams } = new URL(req.url);

  const path = searchParams.get('path');
  const collection = searchParams.get('collection') as CollectionSlug;

  if (!path || !collection) {
    return new Response('Insufficient search params', { status: 404 });
  }

  if (!path.startsWith('/')) {
    return new Response('This endpoint can only be used for relative previews', { status: 500 });
  }

  let user;

  try {
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    });
  } catch (error) {
    payload.logger.error({ err: error }, 'Error verifying token for live preview');
    return new Response('You are not allowed to preview this page', { status: 403 });
  }

  const draft = await draftMode();

  if (!user) {
    draft.disable();
    return new Response('You are not allowed to preview this page', { status: 403 });
  }

  try {
    const docs = await payload.find({
      collection,
      draft: true,
      limit: 1,
      pagination: false,
      depth: 0,
      where: {
        path: {
          equals: path,
        },
      },
    });

    if (!docs.docs.length) {
      return new Response('Document not found', { status: 404 });
    }
  } catch (error) {
    payload.logger.error({ err: error }, 'Error finding document for live preview');
  }

  draft.enable();

  redirect(path);
}
