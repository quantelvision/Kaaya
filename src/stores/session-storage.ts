import { createJSONStorage } from 'zustand/middleware'

// zustand returns undefined when sessionStorage throws (private mode, blocked storage), so state stays in memory
export function sessionJSONStorage<State>() {
  return createJSONStorage<State>(() => window.sessionStorage)
}
