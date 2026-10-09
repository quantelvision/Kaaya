import { StarIcon } from '@sanity/icons/Star'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const loyaltySettings = defineType({
  name: 'loyaltySettings',
  title: 'Loyalty',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'earnRupeesPerPoint',
      title: 'Rupees spent per point earned',
      type: 'number',
      initialValue: 20,
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'pointValueRupees',
      title: 'Value of one point (INR)',
      type: 'number',
      initialValue: 1,
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'maxRedeemPercent',
      title: 'Maximum redeemable share of the subtotal (%)',
      type: 'number',
      initialValue: 20,
      validation: (rule) => rule.required().integer().min(1).max(100),
    }),
    defineField({
      name: 'minRedeemPoints',
      title: 'Minimum points to redeem',
      type: 'number',
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'startingPoints',
      title: 'Starting balance of the demo guest',
      type: 'number',
      initialValue: 640,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'tiers',
      type: 'array',
      of: [defineArrayMember({ type: 'loyaltyTier' })],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((tiers) => {
            if (!Array.isArray(tiers)) return true
            const hasBaseTier = (tiers as { minPoints?: number }[]).some(
              (tier) => tier.minPoints === 0,
            )
            return hasBaseTier ? true : 'One tier must start at 0 points.'
          }),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Loyalty' }
    },
  },
})

export const loyaltyTier = defineType({
  name: 'loyaltyTier',
  title: 'Tier',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required().max(24),
    }),
    defineField({
      name: 'minPoints',
      title: 'Starts at (points)',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'perk',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
  ],
  preview: {
    select: { title: 'name', minPoints: 'minPoints', perk: 'perk' },
    prepare({ title, minPoints, perk }) {
      return { title: `${title} from ${minPoints} points`, subtitle: perk }
    },
  },
})
