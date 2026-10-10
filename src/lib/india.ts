export const indianStates = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const

const INDIA_TIME_ZONE = 'Asia/Kolkata'

// indian mobile numbers are 10 digits starting with 6 to 9, with an optional +91 or 0 in front
export function normalizeIndianMobile(value: string): string | null {
  const digits = value.replace(/\D/g, '')
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits
  const trimmed = local.length === 11 && local.startsWith('0') ? local.slice(1) : local
  return /^[6-9]\d{9}$/.test(trimmed) ? trimmed : null
}

export function formatIndianMobile(digits: string): string {
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
}

export function isPinCode(value: string): boolean {
  return /^[1-9]\d{5}$/.test(value.trim())
}

export function indiaDateStamp(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: INDIA_TIME_ZONE,
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type: string) => parts.find((entry) => entry.type === type)?.value ?? '00'
  return `${part('year')}${part('month')}${part('day')}`
}
