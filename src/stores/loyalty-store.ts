import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sessionJSONStorage } from '@/stores/session-storage'

type PersistedLoyalty = { balance: number | null }

type LoyaltyState = PersistedLoyalty & {
  initialize: (startingPoints: number) => void
  earn: (points: number) => void
  redeem: (points: number) => void
  clear: () => void
}

// the balance stays null until the starting points from sanity are known
export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      balance: null,
      initialize: (startingPoints) => {
        if (get().balance === null) set({ balance: startingPoints })
      },
      earn: (points) => set({ balance: (get().balance ?? 0) + Math.max(0, Math.floor(points)) }),
      redeem: (points) =>
        set({ balance: Math.max(0, (get().balance ?? 0) - Math.max(0, Math.floor(points))) }),
      clear: () => set({ balance: null }),
    }),
    {
      name: 'kaaya-loyalty',
      version: 1,
      storage: sessionJSONStorage<PersistedLoyalty>(),
      partialize: (state) => ({ balance: state.balance }),
      skipHydration: true,
    },
  ),
)
