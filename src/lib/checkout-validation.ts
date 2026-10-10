import { z } from 'zod'
import { indianStates, isPinCode, normalizeIndianMobile } from '@/lib/india'
import { cardBrand, isFutureExpiry, netBankingBanks, passesLuhn } from '@/lib/payment'

const upiPattern = /^[a-z0-9._-]{2,256}@[a-z]{2,64}$/i

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.'),
  email: z.email('Enter an email address like name@example.com.'),
  phone: z
    .string()
    .refine((value) => normalizeIndianMobile(value) !== null, 'Enter a 10 digit mobile number.'),
})

export const addressSchema = z.object({
  line: z.string().trim().min(5, 'Enter your house number and street.'),
  city: z.string().trim().min(2, 'Enter your city.'),
  state: z.enum(indianStates, 'Choose your state.'),
  pinCode: z.string().refine(isPinCode, 'Enter a 6 digit PIN code.'),
})

export function cardSchema(now: Date) {
  return z.object({
    number: z
      .string()
      .refine(
        (value) => passesLuhn(value) && cardBrand(value) !== null,
        'Enter a valid card number.',
      ),
    expiry: z
      .string()
      .refine((value) => isFutureExpiry(value, now), 'Enter a future expiry date as MM/YY.'),
    cvv: z.string().regex(/^\d{3,4}$/, 'Enter the 3 or 4 digit CVV.'),
    name: z.string().trim().min(2, 'Enter the name on the card.'),
  })
}

export const upiSchema = z.object({
  upiId: z.string().trim().regex(upiPattern, 'Enter a UPI ID like name@bank.'),
})

export const netBankingSchema = z.object({
  bank: z.enum(netBankingBanks, 'Choose your bank.'),
})

export type FieldErrors = Record<string, string>

export function collectErrors(result: z.ZodSafeParseResult<unknown>, prefix: string): FieldErrors {
  if (result.success) return {}
  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const key = `${prefix}.${issue.path.join('.')}`
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}
