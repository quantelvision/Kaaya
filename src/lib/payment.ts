import type { PaymentMethod } from '@/lib/order'

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Net banking',
  cod: 'Cash on delivery',
}

export const netBankingBanks = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Indian Bank',
] as const

export const paymentDelaysMs: Record<PaymentMethod, number> = {
  upi: 2000,
  card: 1500,
  netbanking: 1500,
  cod: 0,
}

export type CardBrand = 'Visa' | 'Mastercard' | 'RuPay' | 'American Express'

export function cardBrand(number: string): CardBrand | null {
  const digits = number.replace(/\D/g, '')
  if (/^4/.test(digits)) return 'Visa'
  if (/^3[47]/.test(digits)) return 'American Express'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard'
  if (/^(60|65|81|82|508)/.test(digits)) return 'RuPay'
  return null
}

export function passesLuhn(number: string): boolean {
  const digits = number.replace(/\D/g, '')
  if (digits.length < 12) return false
  let sum = 0
  for (let index = 0; index < digits.length; index++) {
    let digit = Number(digits[digits.length - 1 - index])
    if (index % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function isFutureExpiry(value: string, now: Date): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value.trim())
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const endOfMonth = new Date(Date.UTC(year, month, 1))
  return endOfMonth.getTime() > now.getTime()
}

export function maskCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '')
  return `ending ${digits.slice(-4)}`
}
