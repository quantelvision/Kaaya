import { create } from 'zustand'

type HydrationState = {
  hasHydrated: boolean
  markHydrated: () => void
}

export const useHydrationStore = create<HydrationState>()((set) => ({
  hasHydrated: false,
  markHydrated: () => set({ hasHydrated: true }),
}))

export function useHasHydrated(): boolean {
  return useHydrationStore((state) => state.hasHydrated)
}
