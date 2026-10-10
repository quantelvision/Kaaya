'use client'

import { MagnifyingGlass, X } from '@phosphor-icons/react/ssr'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { SearchResults } from '@/components/search/search-results'
import { IconButton } from '@/components/ui/icon-button'
import { Spinner } from '@/components/ui/spinner'
import { buildSearchTerm, normalizeQuery } from '@/lib/search'
import { fetchSearchSuggestions } from '@/lib/search-actions'
import type { SearchSuggestionsQueryResult } from '@sanity-types'
import { useHasHydrated } from '@/stores/hydration-store'
import { useSearchStore } from '@/stores/search-store'

const DEBOUNCE_MS = 200

function SearchChips({
  title,
  terms,
  onPick,
  onClear,
}: {
  title: string
  terms: string[]
  onPick: (term: string) => void
  onClear?: () => void
}) {
  if (terms.length === 0) return null
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <p className="label-caps text-muted">{title}</p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-tap items-center text-xs text-muted underline underline-offset-4 hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>
      <ul className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <li key={term}>
            <button
              type="button"
              onClick={() => onPick(term)}
              className="inline-flex h-tap items-center rounded-full border border-line px-4 text-sm text-ink transition-colors hover:border-ink"
            >
              {term}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SearchLauncher({ popularSearches }: { popularSearches: string[] }) {
  const router = useRouter()
  const hasHydrated = useHasHydrated()
  const recentSearches = useSearchStore((state) => state.recentSearches)
  const addSearch = useSearchStore((state) => state.addSearch)
  const clearRecent = useSearchStore((state) => state.clear)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchSuggestionsQueryResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const requestId = useRef(0)

  const hasTerm = buildSearchTerm(query) !== null

  useEffect(() => {
    if (!hasTerm) return
    const currentRequest = ++requestId.current
    const timer = window.setTimeout(() => {
      startTransition(async () => {
        const next = await fetchSearchSuggestions(query)
        if (currentRequest === requestId.current) setResults(next)
      })
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [query, hasTerm])

  const close = () => {
    setIsOpen(false)
    setQuery('')
    setResults(null)
  }

  const submit = (value: string) => {
    const normalized = normalizeQuery(value)
    if (!normalized) return
    addSearch(normalized)
    close()
    router.push(`/search?q=${encodeURIComponent(normalized)}`)
  }

  const visibleResults = hasTerm ? results : null
  const resultSummary = visibleResults
    ? `${visibleResults.products.length} pieces, ${visibleResults.categories.length + visibleResults.edits.length} categories and looks`
    : ''

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : close())}>
      <DialogPrimitive.Trigger asChild>
        <IconButton label="Search">
          <MagnifyingGlass weight="light" className="size-6" aria-hidden />
        </IconButton>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col bg-canvas outline-none md:inset-x-0 md:top-0 md:bottom-auto md:max-h-[85dvh] md:border-b md:border-line md:shadow-float">
          <DialogPrimitive.Title className="sr-only">Search the store</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Type to see matching pieces, categories and looks. Press enter for all results.
          </DialogPrimitive.Description>
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              submit(query)
            }}
            className="border-b border-line"
          >
            <div className="mx-auto flex h-header max-w-page items-center gap-3 gutter-x">
              <MagnifyingGlass weight="light" className="size-5 shrink-0 text-muted" aria-hidden />
              <label htmlFor="search-input" className="sr-only">
                Search
              </label>
              <input
                id="search-input"
                type="search"
                autoFocus
                autoComplete="off"
                enterKeyHint="search"
                placeholder="Search for linen, hoodie, sneakers"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-tap min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
              />
              {isPending && <Spinner className="text-muted" />}
              <DialogPrimitive.Close asChild>
                <IconButton label="Close search" className="-mr-3">
                  <X weight="light" className="size-5" aria-hidden />
                </IconButton>
              </DialogPrimitive.Close>
            </div>
          </form>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-page flex-col gap-8 gutter-x py-6">
              <p aria-live="polite" className="sr-only">
                {resultSummary}
              </p>
              {visibleResults ? (
                <>
                  <SearchResults results={visibleResults} query={query} onNavigate={close} />
                  <button
                    type="button"
                    onClick={() => submit(query)}
                    className="self-start text-sm text-ink underline underline-offset-4"
                  >
                    See all results for &quot;{normalizeQuery(query)}&quot;
                  </button>
                </>
              ) : (
                <>
                  <SearchChips title="Popular searches" terms={popularSearches} onPick={submit} />
                  {hasHydrated && (
                    <SearchChips
                      title="Recent searches"
                      terms={recentSearches}
                      onPick={submit}
                      onClear={clearRecent}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
