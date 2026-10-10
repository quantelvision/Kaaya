export type RateLimiter = {
  check: (key: string, now: number) => boolean
}

export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const hits = new Map<string, number[]>()
  return {
    check(key, now) {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs)
      if (recent.length >= limit) {
        hits.set(key, recent)
        return false
      }
      recent.push(now)
      hits.set(key, recent)
      return true
    },
  }
}
