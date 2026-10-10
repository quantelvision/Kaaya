'use client'

import { motion, useReducedMotion } from 'motion/react'

type CountBadgeProps = {
  count: number
  bounceKey?: number | null
}

export function CountBadge({ count, bounceKey }: CountBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  if (count <= 0) return null

  return (
    <motion.span
      key={bounceKey ?? 'static'}
      aria-hidden
      initial={prefersReducedMotion || !bounceKey ? false : { scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 520, damping: 14 }}
      className="absolute top-1.5 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-2xs leading-none text-on-primary tabular-nums"
    >
      {count > 99 ? '99' : count}
    </motion.span>
  )
}
