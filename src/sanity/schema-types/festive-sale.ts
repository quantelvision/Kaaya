import { ClockIcon } from '@sanity/icons/Clock'
import { defineField, defineType } from 'sanity'

type FestiveSaleDraft = {
  mode?: 'rolling' | 'fixed'
}

export const festiveSale = defineType({
  name: 'festiveSale',
  title: 'Festive sale',
  type: 'document',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'isActive',
      title: 'Sale is live',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'edit',
      title: 'Sale edit',
      type: 'reference',
      to: [{ type: 'edit' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mode',
      title: 'Countdown mode',
      type: 'string',
      description:
        'Rolling restarts the countdown on a fixed cycle, so it never reaches zero in a demo. Fixed counts down to the end date.',
      options: {
        list: [
          { title: 'Rolling', value: 'rolling' },
          { title: 'Fixed end date', value: 'fixed' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'rolling',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rollingHours',
      title: 'Rolling cycle (hours)',
      type: 'number',
      initialValue: 62,
      hidden: ({ document }) => (document as FestiveSaleDraft | undefined)?.mode !== 'rolling',
      validation: (rule) =>
        rule
          .integer()
          .min(1)
          .custom((hours, context) =>
            (context.document as FestiveSaleDraft).mode === 'rolling' && typeof hours !== 'number'
              ? 'Set the cycle length for rolling mode.'
              : true,
          ),
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends at',
      type: 'datetime',
      hidden: ({ document }) => (document as FestiveSaleDraft | undefined)?.mode !== 'fixed',
      validation: (rule) =>
        rule.custom((endsAt, context) =>
          (context.document as FestiveSaleDraft).mode === 'fixed' && !endsAt
            ? 'Set the end date for fixed mode.'
            : true,
        ),
    }),
  ],
  preview: {
    select: { title: 'title', isActive: 'isActive' },
    prepare({ title, isActive }) {
      return { title: title ?? 'Festive sale', subtitle: isActive ? 'Live' : 'Off' }
    },
  },
})
