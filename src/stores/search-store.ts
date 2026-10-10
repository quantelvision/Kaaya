import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizeQuery } from '@/lib/search'
import { sessionJSONStorage } from '@/stores/session-storage'

const RECENT_SEARCH_LIMIT = 6

type PersistedSearch = { recentSearches: string[] }

type SearchState = PersistedSearch & {
  addSearch: (query: string) => void
  clear: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addSearch: (query) => {
        const normalized = normalizeQuery(query)
        if (!normalized) return
        set({
          recentSearches: [
            normalized,
            ...get().recentSearches.filter(
              (item) => item.toLowerCase() !== normalized.toLowerCase(),
            ),
          ].slice(0, RECENT_SEARCH_LIMIT),
        })
      },
      clear: () => set({ recentSearches: [] }),
    }),
    {
      name: 'kaaya-search',
      version: 1,
      storage: sessionJSONStorage<PersistedSearch>(),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
      skipHydration: true,
    },
  ),
)
