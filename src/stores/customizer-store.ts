import { create } from 'zustand'

type CustomizerState = {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  toggle: () => void
}

export const useCustomizerStore = create<CustomizerState>()((set, get) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  toggle: () => set({ isOpen: !get().isOpen }),
}))
