'use client'

import { GridFour, Rows, SlidersHorizontal, X } from '@phosphor-icons/react/ssr'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/cn'
import { sortOptions, type Density, type FilterPill, type SortKey } from '@/lib/listing'

type ListingToolbarProps = {
  resultCount: number
  pills: FilterPill[]
  sort: SortKey
  density: Density
  onOpenFilters: () => void
  onRemovePill: (pill: FilterPill) => void
  onClearAll: () => void
  onSortChange: (sort: SortKey) => void
  onDensityChange: (density: Density) => void
}

export function ListingToolbar({
  resultCount,
  pills,
  sort,
  density,
  onOpenFilters,
  onRemovePill,
  onClearAll,
  onSortChange,
  onDensityChange,
}: ListingToolbarProps) {
  const countLabel = `${resultCount} ${resultCount === 1 ? 'piece' : 'pieces'}`
  const isGrid = density === 'grid'

  return (
    <div className="sticky top-header z-20 border-b border-line bg-canvas">
      <p aria-live="polite" className="sr-only">
        {countLabel}
      </p>
      <div className="mx-auto flex max-w-page flex-col gap-2 gutter-x py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex h-tap shrink-0 items-center gap-2 rounded-btn border border-line px-4 text-sm text-ink transition-colors hover:border-ink"
          >
            <SlidersHorizontal weight="light" className="size-5" aria-hidden />
            Filters
            {pills.length > 0 && (
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-ink text-2xs text-canvas tabular-nums">
                {pills.length}
              </span>
            )}
          </button>
          <p
            aria-hidden
            className="ml-1 hidden text-xs whitespace-nowrap text-muted tabular-nums sm:block"
          >
            {countLabel}
          </p>

          <div className="ml-auto flex min-w-0 items-center gap-1">
            <label className="min-w-0">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(event) => onSortChange(event.target.value as SortKey)}
                className="h-tap w-full max-w-44 appearance-none truncate rounded-btn bg-transparent px-2 text-sm text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <IconButton
              label={isGrid ? 'Switch to editorial view' : 'Switch to grid view'}
              onClick={() => onDensityChange(isGrid ? 'editorial' : 'grid')}
            >
              {isGrid ? (
                <Rows weight="light" className="size-5" aria-hidden />
              ) : (
                <GridFour weight="light" className="size-5" aria-hidden />
              )}
            </IconButton>
          </div>
        </div>

        <div
          className={cn(
            '-mx-1 scrollbar-none flex items-center gap-2 overflow-x-auto px-1 pb-1',
            pills.length === 0 && 'sm:hidden',
          )}
        >
          <span aria-hidden className="shrink-0 pr-1 text-xs text-muted tabular-nums sm:hidden">
            {countLabel}
          </span>
          {pills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => onRemovePill(pill)}
              aria-label={`Remove filter ${pill.label}`}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-ink px-3 text-xs text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              {pill.label}
              <X weight="light" className="size-3.5" aria-hidden />
            </button>
          ))}
          {pills.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex h-9 shrink-0 items-center px-2 text-xs text-ink underline underline-offset-4"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
