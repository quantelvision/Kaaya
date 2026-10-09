import { CreditCardIcon } from '@sanity/icons/CreditCard'
import { defineField, defineType } from 'sanity'
import { apiVersion } from '../env'

export const couponTypes = [
  { title: 'Percent off', value: 'percent' },
  { title: 'Flat amount off', value: 'flat' },
  { title: 'Free shipping', value: 'freeShipping' },
] as const

type CouponDraft = {
  type?: (typeof couponTypes)[number]['value']
}

export const coupon = defineType({
  name: 'coupon',
  title: 'Coupon',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'code',
      type: 'string',
      description: 'Uppercase letters and digits, for example KAAYA10.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[A-Z0-9]{3,20}$/, { name: 'uppercase letters and digits' })
          .custom(async (code, context) => {
            if (!code || !context.document) return true
            const id = context.document._id.replace(/^drafts\./, '')
            const duplicates = await context
              .getClient({ apiVersion })
              .fetch<number>(
                'count(*[_type == "coupon" && code == $code && !(_id in [$id, "drafts." + $id])])',
                { code, id },
              )
            return duplicates === 0 ? true : 'Another coupon already uses this code.'
          }),
    }),
    defineField({
      name: 'description',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'type',
      type: 'string',
      options: { list: [...couponTypes], layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      type: 'number',
      description: 'Percent for percent coupons, rupees for flat coupons, 0 for free shipping.',
      initialValue: 0,
      validation: (rule) =>
        rule
          .required()
          .integer()
          .min(0)
          .custom((value, context) => {
            const { type } = context.document as CouponDraft
            if (typeof value !== 'number') return true
            if (type === 'percent' && (value < 1 || value > 90)) {
              return 'Percent coupons need a value from 1 to 90.'
            }
            if (type === 'flat' && value < 1) return 'Flat coupons need a value above 0.'
            return true
          }),
    }),
    defineField({
      name: 'minCartValue',
      title: 'Minimum cart value (INR)',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'firstOrderOnly',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'expiresAt',
      type: 'datetime',
    }),
  ],
  preview: {
    select: { title: 'code', subtitle: 'description', isActive: 'isActive' },
    prepare({ title, subtitle, isActive }) {
      return { title: isActive ? title : `${title} (inactive)`, subtitle }
    },
  },
})
