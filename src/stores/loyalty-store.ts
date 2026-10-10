import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sessionJSONStorage } from '@/stores/session-storage'

type PersistedLoyalty = { pointsDelta: number }

type LoyaltyState = PersistedLoyalty & {
  earn: (points: number) => void
  redeem: (points: number) => void
  clear: () => void
}

// only the change is stored, so the balance follows the starting points set in sanity
export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      pointsDelta: 0,
      earn: (points) => set({ pointsDelta: get().pointsDelta + Math.max(0, Math.floor(points)) }),
      redeem: (points) => set({ pointsDelta: get().pointsDelta - Math.max(0, Math.floor(points)) }),
      clear: () => set({ pointsDelta: 0 }),
    }),
    {
      name: 'kaaya-loyalty',
      version: 2,
      storage: sessionJSONStorage<PersistedLoyalty>(),
      partialize: (state) => ({ pointsDelta: state.pointsDelta }),
      migrate: () => ({ pointsDelta: 0 }),
      skipHydration: true,
    },
  ),
)

export function useLoyaltyBalance(startingPoints: number): number {
  const pointsDelta = useLoyaltyStore((state) => state.pointsDelta)
  return Math.max(0, startingPoints + pointsDelta)
}
