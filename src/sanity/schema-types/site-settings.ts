import { CogIcon } from '@sanity/icons/Cog'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'store', title: 'Store', default: true },
    { name: 'shipping', title: 'Shipping and returns' },
    { name: 'content', title: 'Content' },
  ],
  fields: [
    defineField({
      name: 'storeName',
      type: 'string',
      group: 'store',
      initialValue: 'Kaaya',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lowStockThreshold',
      title: 'Low stock threshold',
      type: 'number',
      group: 'store',
      description: 'Show "Only N left" when the stock of a size is at or below this number.',
      initialValue: 3,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'freeShippingThreshold',
      title: 'Free shipping from (INR)',
      type: 'number',
      group: 'shipping',
      initialValue: 1499,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'shippingFee',
      title: 'Shipping fee (INR)',
      type: 'number',
      group: 'shipping',
      initialValue: 99,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'codFee',
      title: 'Cash on delivery fee (INR)',
      type: 'number',
      group: 'shipping',
      initialValue: 49,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'returnWindowDays',
      title: 'Return window (days)',
      type: 'number',
      group: 'shipping',
      initialValue: 7,
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'popularSearches',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'manifestoLines',
      title: 'Manifesto lines',
      type: 'array',
      group: 'content',
      description: 'Short lines for the scrolling manifesto on the home page.',
      of: [defineArrayMember({ type: 'string', validation: (rule) => rule.max(80) })],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' }
    },
  },
})
