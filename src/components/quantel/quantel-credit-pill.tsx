'use client'

import { QuantelMark } from '@/components/quantel/quantel-mark'
import { useQuantelStore } from '@/stores/quantel-store'

export function QuantelCreditPill() {
  const openContact = useQuantelStore((state) => state.openContact)

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={openContact}
      className="fixed floating-bottom left-4 z-40 inline-flex h-11 items-center gap-2 rounded-full border border-q-border-dark bg-q-bg-dark py-1 pr-4 pl-3 font-q-body text-xs font-medium text-q-text-dark transition-colors duration-200 hover:border-q-accent focus-visible:outline-q-accent"
    >
      <QuantelMark tone="onBlack" />
      <span>Built by Quantel Vision</span>
    </button>
  )
}
