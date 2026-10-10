'use client'

import { motion, useReducedMotion } from 'motion/react'

export function AnimatedCheck() {
  const prefersReducedMotion = useReducedMotion()
  const draw = (delay: number) =>
    prefersReducedMotion
      ? { initial: false as const }
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration: 0.6, delay, ease: 'easeOut' as const },
        }

  return (
    <svg viewBox="0 0 56 56" aria-hidden className="size-14 text-q-accent">
      <motion.circle
        cx="28"
        cy="28"
        r="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...draw(0)}
      />
      <motion.path
        d="M17 29l7.5 7.5L39.5 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(0.45)}
      />
    </svg>
  )
}
