import { z } from 'zod'
import { normalizeIndianMobile } from '@/lib/india'

export const leadSources = ['gate', 'credit-pill'] as const

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(80),
  businessName: z.string().trim().min(2, 'Enter your business name.').max(120),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((value) => normalizeIndianMobile(value) !== null, 'Enter a 10 digit mobile number.'),
  email: z.email('Enter an email address like name@example.com.').max(160),
  sells: z.string().trim().max(160).optional().default(''),
  message: z.string().trim().max(1500).optional().default(''),
  consent: z.literal(true, 'Please agree so we can contact you.'),
  source: z.enum(leadSources).default('credit-pill'),
  orderId: z
    .string()
    .regex(/^KY-\d{6}-\d{4}$/)
    .optional(),
  website: z.string().max(0).optional().default(''),
})

export type LeadInput = z.input<typeof leadSchema>
export type Lead = z.output<typeof leadSchema>

export const LEAD_ERROR_MESSAGE = 'Something went wrong. Please call +91 63850 56784.'
export const LEAD_SUCCESS_MESSAGE = 'Thank you. We will reach out within one working day.'
