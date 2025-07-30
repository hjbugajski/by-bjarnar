import type { Block } from 'payload';

export const ArticlesTable: Block = {
  slug: 'articles-table',
  interfaceName: 'PayloadArticlesTableBlock',
  fields: [
    {
      name: 'titleColumn',
      type: 'group',
      admin: {
        description: 'Configure the title column (always shows as clickable link)',
      },
      fields: [
        {
          name: 'sortable',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow sorting by title',
          },
        },
        {
          name: 'searchable',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Include title in search functionality',
          },
        },
        {
          name: 'fullWidth',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make title column span available width',
          },
        },
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'left',
          admin: {
            description: 'Text alignment for the column',
          },
          options: [
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Center',
              value: 'center',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
        },
        {
          name: 'whitespace',
          type: 'select',
          defaultValue: 'normal',
          admin: {
            description: 'Text wrapping behavior',
          },
          options: [
            {
              label: 'Normal (wrap text)',
              value: 'normal',
            },
            {
              label: 'No wrap',
              value: 'nowrap',
            },
          ],
        },
      ],
    },
    {
      name: 'siteColumn',
      type: 'group',
      admin: {
        description: 'Configure the site column (shows urlMetadata.site)',
      },
      fields: [
        {
          name: 'sortable',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow sorting by site',
          },
        },
        {
          name: 'searchable',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Include site in search functionality',
          },
        },
        {
          name: 'fullWidth',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make site column span available width',
          },
        },
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'left',
          admin: {
            description: 'Text alignment for the column',
          },
          options: [
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Center',
              value: 'center',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
        },
        {
          name: 'whitespace',
          type: 'select',
          defaultValue: 'normal',
          admin: {
            description: 'Text wrapping behavior',
          },
          options: [
            {
              label: 'Normal (wrap text)',
              value: 'normal',
            },
            {
              label: 'No wrap',
              value: 'nowrap',
            },
          ],
        },
      ],
    },
    {
      name: 'publishedColumn',
      type: 'group',
      admin: {
        description: 'Configure the published date column',
      },
      fields: [
        {
          name: 'sortable',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow sorting by published date',
          },
        },
        {
          name: 'searchable',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Include published date in search functionality',
          },
        },
        {
          name: 'fullWidth',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make published column span available width',
          },
        },
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'left',
          admin: {
            description: 'Text alignment for the column',
          },
          options: [
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Center',
              value: 'center',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
        },
        {
          name: 'whitespace',
          type: 'select',
          defaultValue: 'normal',
          admin: {
            description: 'Text wrapping behavior',
          },
          options: [
            {
              label: 'Normal (wrap text)',
              value: 'normal',
            },
            {
              label: 'No wrap',
              value: 'nowrap',
            },
          ],
        },
      ],
    },
    {
      name: 'pageSize',
      type: 'select',
      defaultValue: '10',
      admin: {
        description: 'Number of items to display per page',
      },
      options: [
        {
          label: '10',
          value: '10',
        },
        {
          label: '20',
          value: '20',
        },
        {
          label: '50',
          value: '50',
        },
        {
          label: '100',
          value: '100',
        },
      ],
    },
    {
      name: 'defaultSort',
      type: 'group',
      admin: {
        description: 'Default sorting configuration',
      },
      fields: [
        {
          name: 'field',
          type: 'select',
          defaultValue: 'published',
          admin: {
            description: 'Field to sort by default',
          },
          options: [
            {
              label: 'Title',
              value: 'title',
            },
            {
              label: 'Site',
              value: 'urlMetadata.site',
            },
            {
              label: 'Published Date',
              value: 'published',
            },
            {
              label: 'Created Date',
              value: 'createdAt',
            },
            {
              label: 'Updated Date',
              value: 'updatedAt',
            },
          ],
        },
        {
          name: 'direction',
          type: 'select',
          defaultValue: 'desc',
          options: [
            {
              label: 'Ascending',
              value: 'asc',
            },
            {
              label: 'Descending',
              value: 'desc',
            },
          ],
        },
      ],
    },
    {
      name: 'enableSearch',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable search functionality',
      },
    },
    {
      name: 'searchPlaceholder',
      type: 'text',
      defaultValue: 'Search...',
      admin: {
        condition: (data) => data?.enableSearch,
        description: 'Placeholder text for the search input',
      },
    },
  ],
};
