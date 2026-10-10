'use client'

import * as Slider from '@radix-ui/react-slider'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet } from '@/components/ui/sheet'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import {
  toggleValue,
  type FacetOption,
  type FilterKey,
  type ListingFacets,
  type ListingFilters,
} from '@/lib/listing'

const PRICE_STEP = 100

type FilterSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  facets: ListingFacets
  filters: ListingFilters
  resultCount: number
  showCategoryFacet: boolean
  onChange: (filters: ListingFilters) => void
  onClear: () => void
}

function FacetGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0 last:border-b-0">
      <legend className="mb-3 label-caps text-muted">{title}</legend>
      {children}
    </fieldset>
  )
}

function CheckboxFacet({
  options,
  selected,
  onToggle,
}: {
  options: FacetOption[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <Checkbox
          key={option.value}
          checked={selected.includes(option.value)}
          onCheckedChange={() => onToggle(option.value)}
          label={
            <span className="flex gap-2">
              {option.label}
              <span className="text-muted tabular-nums">{option.count}</span>
            </span>
          }
        />
      ))}
    </div>
  )
}

function PriceFacet({
  range,
  value,
  onCommit,
}: {
  range: [number, number]
  value: [number, number] | null
  onCommit: (value: [number, number] | null) => void
}) {
  const min = Math.floor(range[0] / PRICE_STEP) * PRICE_STEP
  const max = Math.ceil(range[1] / PRICE_STEP) * PRICE_STEP
  const [draft, setDraft] = useState<[number, number]>(value ?? [min, max])

  return (
    <div className="flex flex-col gap-4 px-1">
      <Slider.Root
        min={min}
        max={max}
        step={PRICE_STEP}
        minStepsBetweenThumbs={1}
        value={draft}
        onValueChange={(next) => setDraft([next[0] ?? min, next[1] ?? max])}
        onValueCommit={(next) => {
          const low = next[0] ?? min
          const high = next[1] ?? max
          onCommit(low <= min && high >= max ? null : [low, high])
        }}
        className="relative flex h-tap touch-none items-center select-none"
      >
        <Slider.Track className="relative h-px grow bg-line">
          <Slider.Range className="absolute h-full bg-ink" />
        </Slider.Track>
        {(['Minimum price', 'Maximum price'] as const).map((label) => (
          <Slider.Thumb
            key={label}
            aria-label={label}
            className="block size-5 rounded-full border border-ink bg-surface shadow-float"
          />
        ))}
      </Slider.Root>
      <div className="flex justify-between text-sm text-ink tabular-nums">
        <span>{formatPrice(draft[0])}</span>
        <span>{formatPrice(draft[1])}</span>
      </div>
    </div>
  )
}

export function FilterSheet({
  open,
  onOpenChange,
  facets,
  filters,
  resultCount,
  showCategoryFacet,
  onChange,
  onClear,
}: FilterSheetProps) {
  const toggle = (key: FilterKey, value: string) =>
    onChange({ ...filters, [key]: toggleValue(filters[key], value) })

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Filters"
      footer={
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onClear}>
            Clear all
          </Button>
          <Button isFullWidth onClick={() => onOpenChange(false)}>
            Show {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
          </Button>
        </div>
      }
    >
      <FacetGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((option) => {
            const isSelected = filters.sizes.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle('sizes', option.value)}
                className={cn(
                  'inline-flex h-tap min-w-tap items-center justify-center rounded-btn border px-3 text-sm tabular-nums transition-colors',
                  isSelected
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-line text-ink hover:border-ink',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </FacetGroup>

      <FacetGroup title="Color">
        <div className="grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-5">
          {facets.colors.map((option) => {
            const isSelected = filters.colors.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle('colors', option.value)}
                className="flex min-h-tap flex-col items-center gap-1.5 text-center"
              >
                <span
                  className={cn(
                    'size-8 rounded-full border transition-shadow',
                    isSelected
                      ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-surface'
                      : 'border-line',
                  )}
                  style={{ backgroundColor: option.hex }}
                />
                <span className="text-2xs leading-tight text-ink">{option.label}</span>
              </button>
            )
          })}
        </div>
      </FacetGroup>

      <FacetGroup title="Price">
        <PriceFacet
          key={filters.price ? filters.price.join('-') : 'all'}
          range={facets.priceRange}
          value={filters.price}
          onCommit={(price) => onChange({ ...filters, price })}
        />
      </FacetGroup>

      <FacetGroup title="Material">
        <CheckboxFacet
          options={facets.materials}
          selected={filters.materials}
          onToggle={(value) => toggle('materials', value)}
        />
      </FacetGroup>

      <FacetGroup title="Fit">
        <CheckboxFacet
          options={facets.fits}
          selected={filters.fits}
          onToggle={(value) => toggle('fits', value)}
        />
      </FacetGroup>

      <FacetGroup title="Gender">
        <CheckboxFacet
          options={facets.genders}
          selected={filters.genders}
          onToggle={(value) => toggle('genders', value)}
        />
      </FacetGroup>

      {showCategoryFacet && (
        <FacetGroup title="Category">
          <CheckboxFacet
            options={facets.categories}
            selected={filters.categories}
            onToggle={(value) => toggle('categories', value)}
          />
        </FacetGroup>
      )}
    </Sheet>
  )
}
