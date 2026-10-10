'use client'

import { Minus, Plus } from '@phosphor-icons/react/ssr'

type QuantityStepperProps = {
  quantity: number
  max: number
  label: string
  onChange: (quantity: number) => void
}

export function QuantityStepper({ quantity, max, label, onChange }: QuantityStepperProps) {
  return (
    <div
      role="group"
      aria-label={`Quantity for ${label}`}
      className="inline-flex items-center rounded-btn border border-line"
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        className="inline-flex size-tap items-center justify-center text-ink disabled:text-line"
      >
        <Minus weight="light" className="size-4" aria-hidden />
      </button>
      <span aria-live="polite" className="min-w-6 text-center text-sm text-ink tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
        className="inline-flex size-tap items-center justify-center text-ink disabled:text-line"
      >
        <Plus weight="light" className="size-4" aria-hidden />
      </button>
    </div>
  )
}
