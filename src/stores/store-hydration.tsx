'use client'

import { useEffect } from 'react'
import { useHydrationStore } from '@/stores/hydration-store'
import { persistedStores } from '@/stores/persisted-stores'

// stores skip automatic hydration so the server html and the first client render match
export function StoreHydration() {
  const markHydrated = useHydrationStore((state) => state.markHydrated)

  useEffect(() => {
    void Promise.all(persistedStores.map((store) => store.persist.rehydrate())).then(markHydrated)
  }, [markHydrated])

  return null
}
