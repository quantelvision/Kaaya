'use client'

import { useId } from 'react'
import { cn } from '@/lib/cn'

type SwatchVariant = {
  _key: string
  colorName: string
  hex: string
}

type ColorSwatchesProps = {
  variants: SwatchVariant[]
  selectedKey: string
  onSelect: (key: string) => void
}

export function ColorSwatches({ variants, selectedKey, onSelect }: ColorSwatchesProps) {
  const labelId = useId()
  const selected = variants.find((variant) => variant._key === selectedKey) ?? variants[0]

  if (variants.length < 2) {
    return (
      <p className="text-xs text-ink">
        <span className="font-medium">Color:</span> {selected?.colorName}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="text-xs text-ink">
        <span className="font-medium">Color:</span> {selected?.colorName}
      </span>
      <div role="radiogroup" aria-labelledby={labelId} className="flex flex-wrap gap-1">
        {variants.map((variant) => {
          const isSelected = variant._key === selectedKey
          return (
            <button
              key={variant._key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={variant.colorName}
              onClick={() => onSelect(variant._key)}
              className="inline-flex size-tap items-center justify-center rounded-full"
            >
              <span
                className={cn(
                  'size-8 rounded-full border transition-shadow',
                  isSelected
                    ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-canvas'
                    : 'border-line',
                )}
                style={{ backgroundColor: variant.hex }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
