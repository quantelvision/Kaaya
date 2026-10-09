const LOCALE = 'en-IN'

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
})

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'Asia/Kolkata',
})

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount)
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatDate(date: Date | string): string {
  return dateFormatter.format(typeof date === 'string' ? new Date(date) : date)
}

export function formatShortDate(date: Date | string): string {
  return shortDateFormatter.format(typeof date === 'string' ? new Date(date) : date)
}

export function percentOff(price: number, salePrice: number): number {
  if (price <= 0 || salePrice >= price) return 0
  return Math.round(((price - salePrice) / price) * 100)
}
