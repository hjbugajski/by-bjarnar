import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload';

import { Role, hasRole } from '@/payload/access';
import { Email } from '@/payload/blocks/form-fields/email';
import { PhoneNumber } from '@/payload/blocks/form-fields/phone-number';
import { Text } from '@/payload/blocks/form-fields/text';
import { Textarea } from '@/payload/blocks/form-fields/textarea';
import {
  revalidatePagesAfterChange,
  revalidatePagesAfterDelete,
} from '@/payload/utils/revalidate-pages';

export const Forms: CollectionConfig<'forms'> = {
  slug: 'forms',
  typescript: {
    interface: 'PayloadFormsCollection',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'fields', 'createdAt', 'updatedAt'],
    group: 'CRM',
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePagesAfterChange],
    afterDelete: [revalidatePagesAfterDelete],
  },
  access: {
    read: () => true,
    create: hasRole(Role.Admin, Role.Editor),
    update: hasRole(Role.Admin, Role.Editor),
    delete: hasRole(Role.Admin),
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
      type: 'richText',
      editor: lexicalEditor({ features: ({ rootFeatures }) => rootFeatures }),
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
      required: true,
      defaultValue: 'Submit',
    },
    {
      name: 'confirmationMessage',
      type: 'textarea',
      required: true,
    },
    {
      name: 'fields',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [Text, Textarea, Email, PhoneNumber],
    },
    {
      name: 'formOnly',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        description: 'If checked, hides title and description.',
        position: 'sidebar',
      },
    },
  ],
};
