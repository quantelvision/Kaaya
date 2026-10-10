'use client'

import { cn } from '@/lib/cn'
import { fontVariables, type ThemeTokens } from '@/lib/theme/presets'

type PresetCardProps = {
  name: string
  tokens: ThemeTokens
  isSelected: boolean
  onSelect: () => void
}

export function PresetCard({ name, tokens, isSelected, onSelect }: PresetCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={cn(
        'flex flex-col gap-2 rounded-card border p-2 text-left transition-colors',
        isSelected ? 'border-ink' : 'border-line hover:border-muted',
      )}
    >
      <span
        aria-hidden
        className="flex h-20 flex-col justify-between overflow-hidden border border-line p-2.5"
        style={{
          backgroundColor: tokens.bg,
          color: tokens.text,
          borderRadius: tokens.radiusCard,
        }}
      >
        <span
          className="text-xl leading-none"
          style={{ fontFamily: `var(${fontVariables[tokens.fontDisplay]})` }}
        >
          Aa
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-flex h-5 items-center px-2 text-2xs leading-none"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.onPrimary,
              borderRadius: tokens.radiusBtn,
              fontFamily: `var(${fontVariables[tokens.fontBody]})`,
            }}
          >
            Shop
          </span>
          <span className="size-3 rounded-full" style={{ backgroundColor: tokens.accent }} />
        </span>
      </span>
      <span className="flex items-center justify-between gap-2 px-0.5 text-xs text-ink">
        {name}
        {isSelected && <span className="size-1.5 rounded-full bg-primary" />}
      </span>
    </button>
  )
}
