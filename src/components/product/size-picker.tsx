'use client'

import type { Ref } from 'react'
import { cn } from '@/lib/cn'

type SizePickerProps = {
  sizes: { size: string; stock: number }[]
  selectedSize: string | null
  error: string | null
  onSelect: (size: string) => void
  ref?: Ref<HTMLDivElement>
}

export function SizePicker({ sizes, selectedSize, error, onSelect, ref }: SizePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span id="size-label" className="text-xs font-medium text-ink">
          Size{selectedSize ? `: ${selectedSize}` : ''}
        </span>
      </div>
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby="size-label"
        aria-describedby={error ? 'size-error' : undefined}
        tabIndex={-1}
        className="flex flex-wrap gap-2 outline-none"
      >
        {sizes.map((entry) => {
          const isSoldOut = entry.stock === 0
          const isSelected = entry.size === selectedSize
          return (
            <button
              key={entry.size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={isSoldOut ? `${entry.size}, sold out` : entry.size}
              disabled={isSoldOut}
              onClick={() => onSelect(entry.size)}
              className={cn(
                'inline-flex h-tap min-w-tap items-center justify-center rounded-btn border px-3 text-sm whitespace-nowrap tabular-nums transition-colors',
                isSelected && 'border-ink bg-ink text-canvas',
                !isSelected && !isSoldOut && 'border-line text-ink hover:border-ink',
                isSoldOut && 'cursor-not-allowed border-line text-muted line-through opacity-60',
              )}
            >
              {entry.size}
            </button>
          )
        })}
      </div>
      {error && (
        <p id="size-error" role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
