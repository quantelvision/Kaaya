import { z } from 'zod'
import { indianStates, isPinCode, normalizeIndianMobile } from '@/lib/india'
import type { PaymentMethod } from '@/lib/order'
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

export type CheckoutForm = {
  contact: { name: string; email: string; phone: string }
  address: { line: string; city: string; state: string; pinCode: string }
  paymentMethod: PaymentMethod
  upiId: string
  isUpiQr: boolean
  card: { number: string; expiry: string; cvv: string; name: string }
  bank: string
}

export const emptyCheckoutForm: CheckoutForm = {
  contact: { name: '', email: '', phone: '' },
  address: { line: '', city: '', state: '', pinCode: '' },
  paymentMethod: 'upi',
  upiId: '',
  isUpiQr: false,
  card: { number: '', expiry: '', cvv: '', name: '' },
  bank: '',
}

export function validateCheckoutForm(form: CheckoutForm, now: Date): FieldErrors {
  const errors: FieldErrors = {
    ...collectErrors(contactSchema.safeParse(form.contact), 'contact'),
    ...collectErrors(addressSchema.safeParse(form.address), 'address'),
  }
  if (form.paymentMethod === 'upi' && !form.isUpiQr) {
    Object.assign(errors, collectErrors(upiSchema.safeParse({ upiId: form.upiId }), 'payment'))
  }
  if (form.paymentMethod === 'card') {
    Object.assign(errors, collectErrors(cardSchema(now).safeParse(form.card), 'card'))
  }
  if (form.paymentMethod === 'netbanking') {
    Object.assign(errors, collectErrors(netBankingSchema.safeParse({ bank: form.bank }), 'payment'))
  }
  return errors
}
