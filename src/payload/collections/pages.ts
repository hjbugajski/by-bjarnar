import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import { revalidatePath, revalidateTag } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  FieldHook,
} from 'payload';

import { Role, hasRole, hasRoleOrPublished } from '@/payload/access';
import { ArticlesTable } from '@/payload/blocks/articles-table';
import { ButtonLink } from '@/payload/blocks/button-link';
import { Featured } from '@/payload/blocks/featured';
import { Form } from '@/payload/blocks/form';
import { Image } from '@/payload/blocks/image-block';
import type { PayloadPagesCollection } from '@/payload/payload-types';
import { generatePreviewPath } from '@/payload/utils/generate-preview-path';
import { slugify } from '@/utils/slugify';

const setSlug: FieldHook<
  PayloadPagesCollection,
  string | null | undefined,
  PayloadPagesCollection
> = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    return slugify(data?.title);
  }
};

const setPath: CollectionAfterChangeHook<PayloadPagesCollection> = ({ context, doc, req }) => {
  if (!doc?.title || !doc?.breadcrumbs?.length || context?.ignoreSetPath) {
    return doc;
  }

  const path = doc.breadcrumbs?.length
    ? doc.breadcrumbs[doc.breadcrumbs.length - 1].url
    : `/${slugify(doc.title)}`;

  if (doc.path === path) {
    return doc;
  }

  return req.payload.update({
    collection: 'pages',
    id: doc.id,
    data: {
      path,
    },
    context: {
      ignoreSetPath: true,
    },
    req,
  });
};

const revalidatePageAfterChange: CollectionAfterChangeHook<PayloadPagesCollection> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published' && doc.path) {
    payload.logger.info(`Revalidating path: ${doc.path}`);

    if (doc.path === '/home') {
      revalidatePath('/');
    }

    revalidatePath(doc.path);
    revalidateTag(`page_${doc.path}`, { expire: 0 });
    revalidateTag('pages-sitemap', { expire: 0 });
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.path) {
    payload.logger.info(`Revalidating previous path: ${previousDoc.path}`);

    if (doc.path === '/home') {
      revalidatePath('/');
    }

    revalidatePath(previousDoc.path);
    revalidateTag(`page_${previousDoc.path}`, { expire: 0 });
    revalidateTag('pages-sitemap', { expire: 0 });
  }

  return doc;
};

export const revalidatePageAfterDelete: CollectionAfterDeleteHook<PayloadPagesCollection> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate && doc.path) {
    payload.logger.info(`Revalidating path: ${doc.path}`);

    if (doc.path === '/home') {
      revalidatePath('/');
    }

    revalidatePath(doc.path);
    revalidateTag(`page_${doc.path}`, { expire: 0 });
    revalidateTag('pages-sitemap', { expire: 0 });
  }

  return doc;
};

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  typescript: {
    interface: 'PayloadPagesCollection',
  },
  access: {
    read: hasRoleOrPublished(Role.Admin, Role.Editor),
    create: hasRole(Role.Admin, Role.Editor),
    update: hasRole(Role.Admin, Role.Editor),
    delete: hasRole(Role.Admin),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          path: typeof data?.path === 'string' ? data.path : '',
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        path: typeof data?.path === 'string' ? data.path : '',
        collection: 'pages',
        req,
      }),
  },
  defaultPopulate: {
    slug: true,
    path: true,
    breadcrumbs: true,
  },
  defaultSort: '-updatedAt',
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [setPath, revalidatePageAfterChange],
    afterDelete: [revalidatePageAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({ blocks: [ArticlesTable, ButtonLink, Featured, Form, Image] }),
        ],
      }),
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ siblingData }) => ({
        path: {
          // @ts-expect-error – valid field
          not_equals: siblingData?.path,
        },
      }),
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => !!data?.slug,
      },
      hooks: {
        beforeValidate: [setSlug],
      },
    },
    {
      name: 'path',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => !!data?.path,
      },
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      admin: {
        hidden: true,
        position: 'sidebar',
        readOnly: true,
        components: {
          RowLabel: {
            path: '@/payload/components/row-label.tsx',
            exportName: 'RowLabel',
            clientProps: {
              path: 'label',
              fallback: 'Breadcrumb',
            },
          },
        },
      },
      fields: [
        {
          name: 'url',
          label: 'Path',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
  ],
};
