'use client'

import { useId, useState } from 'react'
import { controlClasses } from '@/components/ui/field'
import { cn } from '@/lib/cn'
import { normalizeHex } from '@/lib/theme/color'

type ColorControlProps = {
  label: string
  value: string
  onChange: (hex: string) => void
}

export function ColorControl({ label, value, onChange }: ColorControlProps) {
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  const shown = draft ?? value
  const isInvalid = draft !== null && normalizeHex(draft) === null

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`${id}-hex`} className="text-xs font-medium text-ink">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} color picker`}
          value={value.toLowerCase()}
          onChange={(event) => {
            setDraft(null)
            onChange(event.target.value.toUpperCase())
          }}
          className="size-tap shrink-0 cursor-pointer rounded-control border border-line bg-surface p-1"
        />
        <input
          id={`${id}-hex`}
          value={shown}
          spellCheck={false}
          autoComplete="off"
          maxLength={7}
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? `${id}-error` : undefined}
          onChange={(event) => {
            const next = event.target.value
            setDraft(next)
            const normalized = normalizeHex(next)
            if (normalized && normalized.length === 7 && next.replace('#', '').length === 6) {
              onChange(normalized)
            }
          }}
          onBlur={() => setDraft(null)}
          className={cn(controlClasses, 'h-tap text-sm uppercase tabular-nums')}
        />
      </div>
      {isInvalid && (
        <p id={`${id}-error`} className="text-xs text-danger">
          Enter six hex digits after the #, using 0 to 9 and A to F.
        </p>
      )}
    </div>
  )
}
