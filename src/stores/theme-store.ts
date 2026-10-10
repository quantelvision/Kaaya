import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyTheme } from '@/lib/theme/apply'
import { toCssVars, type ThemeCssVars } from '@/lib/theme/css-vars'
import { THEME_STORAGE_KEY } from '@/lib/theme/no-flash-script'
import { kaayaPreset, type PresetId, type ThemeTokens } from '@/lib/theme/presets'
import { sessionJSONStorage } from '@/stores/session-storage'

export type ThemeSelection = PresetId | 'custom'

type PersistedTheme = {
  selection: ThemeSelection
  tokens: ThemeTokens
  cssVars: ThemeCssVars | null
}

type ThemeState = PersistedTheme & {
  setTheme: (selection: ThemeSelection, tokens: ThemeTokens) => void
  reset: () => void
}

// the no-flash script reads state.cssVars from this storage key before first paint
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      selection: 'kaaya',
      tokens: kaayaPreset.tokens,
      cssVars: null,
      setTheme: (selection, tokens) => {
        applyTheme(tokens)
        set({ selection, tokens, cssVars: toCssVars(tokens) })
      },
      reset: () => {
        applyTheme(kaayaPreset.tokens)
        set({ selection: 'kaaya', tokens: kaayaPreset.tokens, cssVars: null })
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      version: 1,
      storage: sessionJSONStorage<PersistedTheme>(),
      partialize: (state) => ({
        selection: state.selection,
        tokens: state.tokens,
        cssVars: state.cssVars,
      }),
      skipHydration: true,
    },
  ),
)
