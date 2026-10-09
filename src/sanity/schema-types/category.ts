import { FolderIcon } from '@sanity/icons/Folder'
import { defineField, defineType } from 'sanity'
import { categoryIconKeys } from '../../components/icons/category-icon-paths'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      options: { list: categoryIconKeys.map((key) => ({ title: key, value: key })) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(240),
    }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', order: 'order' },
    prepare({ title, order }) {
      return { title, subtitle: typeof order === 'number' ? `Position ${order}` : undefined }
    },
  },
})
