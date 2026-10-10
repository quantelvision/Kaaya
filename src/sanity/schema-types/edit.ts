import { ImagesIcon } from '@sanity/icons/Images'
import { PinIcon } from '@sanity/icons/Pin'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const edit = defineType({
  name: 'edit',
  title: 'Look',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().max(60),
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
      name: 'story',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'looks',
      title: 'Shop the look',
      type: 'array',
      of: [defineArrayMember({ type: 'look' })],
    }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', media: 'coverImage', products: 'products' },
    prepare({ title, media, products }) {
      const count = Array.isArray(products) ? products.length : 0
      return { title, media, subtitle: `${count} ${count === 1 ? 'product' : 'products'}` }
    },
  },
})

export const look = defineType({
  name: 'look',
  title: 'Look photo',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hotspots',
      type: 'array',
      of: [defineArrayMember({ type: 'lookHotspot' })],
      validation: (rule) => rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: { media: 'image', hotspots: 'hotspots' },
    prepare({ media, hotspots }) {
      const count = Array.isArray(hotspots) ? hotspots.length : 0
      return { title: `Photo with ${count} ${count === 1 ? 'hotspot' : 'hotspots'}`, media }
    },
  },
})

export const lookHotspot = defineType({
  name: 'lookHotspot',
  title: 'Hotspot',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'x',
      title: 'X position (% from left)',
      type: 'number',
      validation: (rule) => rule.required().min(0).max(100),
    }),
    defineField({
      name: 'y',
      title: 'Y position (% from top)',
      type: 'number',
      validation: (rule) => rule.required().min(0).max(100),
    }),
    defineField({
      name: 'product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'product.title', x: 'x', y: 'y', media: 'product.variants.0.images.0' },
    prepare({ title, x, y, media }) {
      return { title, subtitle: `${x}% from left, ${y}% from top`, media }
    },
  },
})
