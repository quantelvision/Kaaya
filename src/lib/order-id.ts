import { indiaDateStamp } from '@/lib/india'

type RandomSource = () => number

function fourDigits(random: RandomSource): string {
  return String(Math.floor(random() * 10_000)).padStart(4, '0')
}

export function createOrderId(date: Date, random: RandomSource = Math.random): string {
  return `KY-${indiaDateStamp(date)}-${fourDigits(random)}`
}

export function createReturnId(date: Date, random: RandomSource = Math.random): string {
  return `RT-${indiaDateStamp(date)}-${fourDigits(random)}`
}

export function uniqueId(
  create: (date: Date, random: RandomSource) => string,
  date: Date,
  existing: Set<string>,
  random: RandomSource = Math.random,
): string {
  let id = create(date, random)
  while (existing.has(id)) id = create(date, random)
  return id
}
