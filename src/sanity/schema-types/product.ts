import { TagIcon } from '@sanity/icons/Tag'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { fits, genderOptions, isSizeInScale, materials, sizeScaleOptions } from '../../lib/catalog'
import type { SizeScale } from '../../lib/catalog'
import { formatPrice } from '../../lib/format'

const hexPattern = /^#[0-9A-F]{6}$/

type ProductDraft = {
  price?: number
  sizeScale?: SizeScale
}

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'variants', title: 'Colors and sizes' },
    { name: 'details', title: 'Details' },
    { name: 'merchandising', title: 'Merchandising' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'basics',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'basics',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gender',
      type: 'string',
      group: 'basics',
      options: { list: [...genderOptions], layout: 'radio', direction: 'horizontal' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (INR, inclusive of GST)',
      type: 'number',
      group: 'basics',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'salePrice',
      title: 'Sale price (INR)',
      type: 'number',
      group: 'basics',
      validation: (rule) =>
        rule
          .integer()
          .positive()
          .custom((salePrice, context) => {
            const { price } = context.document as ProductDraft
            if (typeof salePrice !== 'number' || typeof price !== 'number') return true
            return salePrice < price ? true : 'The sale price must be lower than the price.'
          }),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      group: 'basics',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'sizeScale',
      type: 'string',
      group: 'variants',
      options: { list: sizeScaleOptions, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variants',
      title: 'Colors',
      type: 'array',
      group: 'variants',
      of: [defineArrayMember({ type: 'productVariant' })],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((variants, context) => {
            const { sizeScale } = context.document as ProductDraft
            if (!sizeScale || !Array.isArray(variants)) return true
            for (const variant of variants as { sizes?: { size?: string }[] }[]) {
              const wrongSize = variant.sizes?.find(
                (entry) => entry.size && !isSizeInScale(entry.size, sizeScale),
              )
              if (wrongSize)
                return `Size "${wrongSize.size}" is not part of the ${sizeScale} scale.`
            }
            return true
          }),
    }),
    defineField({
      name: 'badges',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'limitedRun',
      title: 'Limited run (units)',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'material',
      type: 'string',
      group: 'details',
      options: { list: [...materials] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fit',
      type: 'string',
      group: 'details',
      options: { list: [...fits] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fitNote',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'composition',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'care',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'origin',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'flags',
      type: 'object',
      group: 'merchandising',
      options: { columns: 3 },
      fields: [
        defineField({ name: 'isNewIn', title: 'New in', type: 'boolean', initialValue: false }),
        defineField({
          name: 'isBestSeller',
          title: 'Best seller',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({ name: 'isArchive', title: 'Archive', type: 'boolean', initialValue: false }),
      ],
    }),
    defineField({
      name: 'featuredOrder',
      type: 'number',
      group: 'merchandising',
      description: 'Lower numbers come first in the Featured sort.',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Featured',
      name: 'featuredOrderAsc',
      by: [{ field: 'featuredOrder', direction: 'asc' }],
    },
    { title: 'Title', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      price: 'price',
      salePrice: 'salePrice',
      media: 'variants.0.images.0',
    },
    prepare({ title, category, price, salePrice, media }) {
      const priceLabel =
        typeof salePrice === 'number'
          ? `${formatPrice(salePrice)} (was ${formatPrice(price)})`
          : typeof price === 'number'
            ? formatPrice(price)
            : null
      return {
        title,
        subtitle: [category, priceLabel].filter(Boolean).join(' / '),
        media,
      }
    },
  },
})

export const productVariant = defineType({
  name: 'productVariant',
  title: 'Color',
  type: 'object',
  fields: [
    defineField({
      name: 'colorName',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'colorSlug',
      type: 'slug',
      options: {
        source: (_document, context) => (context.parent as { colorName?: string }).colorName ?? '',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hex',
      title: 'Hex color',
      type: 'string',
      description: 'Uppercase, for example #6B1D2F.',
      validation: (rule) => rule.required().regex(hexPattern, { name: 'hex color like #6B1D2F' }),
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'sizes',
      type: 'array',
      of: [defineArrayMember({ type: 'sizeStock' })],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((sizes) => {
            if (!Array.isArray(sizes)) return true
            const names = (sizes as { size?: string }[]).map((entry) => entry.size)
            return new Set(names).size === names.length ? true : 'Each size can appear only once.'
          }),
    }),
  ],
  preview: {
    select: { title: 'colorName', subtitle: 'hex', media: 'images.0' },
  },
})

export const sizeStock = defineType({
  name: 'sizeStock',
  title: 'Size',
  type: 'object',
  fields: [
    defineField({
      name: 'size',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stock',
      type: 'number',
      initialValue: 10,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: { size: 'size', stock: 'stock' },
    prepare({ size, stock }) {
      return { title: size, subtitle: stock === 0 ? 'Sold out' : `${stock} in stock` }
    },
  },
})
