import { create } from 'zustand'

export type QuantelStep = 'gate' | 'form' | 'success'

type QuantelState = {
  isOpen: boolean
  step: QuantelStep
  orderId: string | null
  openGate: (orderId: string) => void
  openContact: () => void
  setStep: (step: QuantelStep) => void
  close: () => void
}

export const useQuantelStore = create<QuantelState>()((set) => ({
  isOpen: false,
  step: 'gate',
  orderId: null,
  openGate: (orderId) => set({ isOpen: true, step: 'gate', orderId }),
  openContact: () => set({ isOpen: true, step: 'form' }),
  setStep: (step) => set({ step }),
  close: () => set({ isOpen: false }),
}))
