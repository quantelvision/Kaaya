'use client'

import { useEffect } from 'react'
import { useHasHydrated } from '@/stores/hydration-store'
import { useSearchStore } from '@/stores/search-store'

export function RecordSearch({ query }: { query: string }) {
  const hasHydrated = useHasHydrated()
  const addSearch = useSearchStore((state) => state.addSearch)

  useEffect(() => {
    if (hasHydrated && query) addSearch(query)
  }, [hasHydrated, query, addSearch])

  return null
}
