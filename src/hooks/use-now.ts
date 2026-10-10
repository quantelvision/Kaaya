'use client'

import { useEffect, useState } from 'react'

// starts as null so the server render and the first client render match
export function useNow(intervalMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const timer = window.setInterval(tick, intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])

  return now
}
