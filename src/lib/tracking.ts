import { orderStatuses } from '@/lib/order'

const DAY_MS = 24 * 60 * 60 * 1000

const expectedDayOffsets: Record<(typeof orderStatuses)[number]['key'], number> = {
  placed: 0,
  confirmed: 0,
  packed: 1,
  shipped: 2,
  outForDelivery: 4,
  delivered: 4,
}

export const DELIVERED_INDEX = orderStatuses.length - 1
export const CONFIRMED_INDEX = 1

export type TrackingStep = {
  key: (typeof orderStatuses)[number]['key']
  label: string
  expectedAt: string
  state: 'complete' | 'current' | 'upcoming'
}

export function trackingSteps(createdAt: string, statusIndex: number): TrackingStep[] {
  const start = Date.parse(createdAt)
  return orderStatuses.map((status, index) => ({
    key: status.key,
    label: status.label,
    expectedAt: new Date(start + expectedDayOffsets[status.key] * DAY_MS).toISOString(),
    state: index < statusIndex ? 'complete' : index === statusIndex ? 'current' : 'upcoming',
  }))
}

export function nextStatusIndex(statusIndex: number): number {
  return Math.min(DELIVERED_INDEX, statusIndex + 1)
}

export type PickupSlot = {
  id: string
  date: string
  window: 'morning' | 'evening'
  label: string
}

export const pickupWindows = {
  morning: '9 am to 1 pm',
  evening: '2 pm to 6 pm',
} as const

export function pickupSlots(from: Date, days = 3): PickupSlot[] {
  const slots: PickupSlot[] = []
  for (let offset = 1; offset <= days; offset++) {
    const date = new Date(from.getTime() + offset * DAY_MS).toISOString()
    for (const window of ['morning', 'evening'] as const) {
      slots.push({
        id: `${date.slice(0, 10)}-${window}`,
        date,
        window,
        label: pickupWindows[window],
      })
    }
  }
  return slots
}
