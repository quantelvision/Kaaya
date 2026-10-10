'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useTransition } from 'react'
import {
  listingParamNames,
  parseListingState,
  serializeListingState,
  type ListingState,
} from '@/lib/listing'

export function useListingState() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const state = useMemo(() => parseListingState(searchParams), [searchParams])

  const setState = useCallback(
    (next: ListingState) => {
      // params the listing does not own, like the search query, stay in the url
      const params = new URLSearchParams()
      searchParams.forEach((value, key) => {
        if (!listingParamNames.has(key)) params.set(key, value)
      })
      new URLSearchParams(serializeListingState(next)).forEach((value, key) =>
        params.set(key, value),
      )
      const query = params.toString()
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
      })
    },
    [pathname, router, searchParams],
  )

  return [state, setState, isPending] as const
}
