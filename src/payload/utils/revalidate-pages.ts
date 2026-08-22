import { revalidateTag } from 'next/cache';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

/*
 * Pages are fetched at depth 2, so a cached page entry inlines the docs it
 * relates to (forms, images, articles). Those collections have no path of
 * their own, so they expire the coarse `pages` tag instead, which drops every
 * cached page entry. Over-invalidation is cheap here; stale pages are not.
 */

export const revalidatePagesAfterChange: CollectionAfterChangeHook = ({
  doc,
  req: { payload },
}) => {
  payload.logger.info('Revalidating pages');

  revalidateTag('pages', { expire: 0 });

  return doc;
};

export const revalidatePagesAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating pages');

    revalidateTag('pages', { expire: 0 });
  }

  return doc;
};
