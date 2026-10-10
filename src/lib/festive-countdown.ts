const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

// the rolling countdown restarts on a fixed grid, so every visitor sees the same believable end time
export const ROLLING_EPOCH_MS = Date.UTC(2026, 0, 1)

export type CountdownSource = {
  mode: 'rolling' | 'fixed'
  rollingHours?: number | null
  endsAt?: string | null
}

export type TimeParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function saleEndsAt(sale: CountdownSource, now: number): number | null {
  if (sale.mode === 'fixed') {
    if (!sale.endsAt) return null
    const end = Date.parse(sale.endsAt)
    return Number.isNaN(end) || end <= now ? null : end
  }

  if (!sale.rollingHours || sale.rollingHours <= 0) return null
  const period = sale.rollingHours * HOUR_MS
  const elapsedCycles = Math.floor((now - ROLLING_EPOCH_MS) / period)
  return ROLLING_EPOCH_MS + (elapsedCycles + 1) * period
}

export function timeParts(milliseconds: number): TimeParts {
  const remaining = Math.max(0, milliseconds)
  return {
    days: Math.floor(remaining / DAY_MS),
    hours: Math.floor((remaining % DAY_MS) / HOUR_MS),
    minutes: Math.floor((remaining % HOUR_MS) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1000),
  }
}
