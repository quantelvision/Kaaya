import { PresentationIcon } from '@sanity/icons/Presentation'
import { defineField, defineType } from 'sanity'

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero slide',
  type: 'document',
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'badge',
      type: 'string',
      description: 'Short label above the headline, for example "Festive 2026".',
      validation: (rule) => rule.max(32),
    }),
    defineField({
      name: 'headline',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'subtext',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      validation: (rule) => rule.required().max(32),
    }),
    defineField({
      name: 'ctaHref',
      title: 'Button link',
      type: 'string',
      description: 'A path inside the store, for example /looks/festive-edit.',
      validation: (rule) =>
        rule
          .required()
          .custom((href) =>
            typeof href === 'string' && href.startsWith('/')
              ? true
              : 'Use a path that starts with /.',
          ),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'headline', subtitle: 'badge', media: 'image' },
  },
})
