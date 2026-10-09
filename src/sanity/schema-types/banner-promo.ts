import { BellIcon } from '@sanity/icons/Bell'
import { defineField, defineType } from 'sanity'

export const bannerPromo = defineType({
  name: 'bannerPromo',
  title: 'Promo',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'text',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'discountPercent',
      type: 'number',
      validation: (rule) => rule.integer().min(1).max(90),
    }),
    defineField({
      name: 'isActive',
      title: 'Show in the announcement bar',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'text', isActive: 'isActive' },
    prepare({ title, isActive }) {
      return { title, subtitle: isActive ? 'Active' : 'Hidden' }
    },
  },
})
