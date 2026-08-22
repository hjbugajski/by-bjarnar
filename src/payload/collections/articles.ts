import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { type CollectionConfig, type FieldHook } from 'payload';

import { Role, hasRole, hasRoleOrPublished } from '@/payload/access';
import type { PayloadArticlesCollection } from '@/payload/payload-types';
import {
  revalidatePagesAfterChange,
  revalidatePagesAfterDelete,
} from '@/payload/utils/revalidate-pages';
import { slugify } from '@/utils/slugify';

const setSlug: FieldHook<
  PayloadArticlesCollection,
  string | null | undefined,
  PayloadArticlesCollection
> = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    return slugify(data?.title);
  }
};

export const Articles: CollectionConfig<'articles'> = {
  slug: 'articles',
  typescript: {
    interface: 'PayloadArticlesCollection',
  },
  access: {
    read: hasRoleOrPublished(Role.Admin, Role.Editor),
    create: hasRole(Role.Admin, Role.Editor),
    update: hasRole(Role.Admin, Role.Editor),
    delete: hasRole(Role.Admin),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'published', 'updatedAt'],
  },
  defaultSort: '-published',
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePagesAfterChange],
    afterDelete: [revalidatePagesAfterDelete],
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
      name: 'image',
      type: 'relationship',
      relationTo: 'images',
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        condition: (data) => data?.type === 'internal',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => rootFeatures,
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
      name: 'published',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'external',
      options: [
        {
          label: 'Internal',
          value: 'internal',
        },
        {
          label: 'External',
          value: 'external',
        },
      ],
    },
    {
      name: 'url',
      label: 'Fetch from URL',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'external',
        components: {
          Field: {
            path: '@/payload/components/url-metadata.tsx',
            exportName: 'UrlMetadata',
          },
        },
      },
    },
    {
      name: 'urlMetadata',
      label: 'URL Metadata',
      type: 'group',
      admin: {
        condition: (data) => data?.type === 'external',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'image',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'published',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'site',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
};
