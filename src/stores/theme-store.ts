import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyTheme } from '@/lib/theme/apply'
import { toCssVars, type ThemeCssVars } from '@/lib/theme/css-vars'
import { buildCustomTokens, customSettingsFrom, type CustomThemeSettings } from '@/lib/theme/custom'
import { THEME_STORAGE_KEY } from '@/lib/theme/no-flash-script'
import { kaayaPreset, type PresetId, type ThemePreset, type ThemeTokens } from '@/lib/theme/presets'
import { sessionJSONStorage } from '@/stores/session-storage'

export type ThemeSelection = PresetId | 'custom'

type PersistedTheme = {
  selection: ThemeSelection
  tokens: ThemeTokens
  cssVars: ThemeCssVars | null
  customBase: ThemeTokens | null
  custom: CustomThemeSettings | null
}

type ThemeState = PersistedTheme & {
  selectPreset: (preset: ThemePreset) => void
  startCustom: () => void
  updateCustom: (update: Partial<CustomThemeSettings>) => void
  reset: () => void
}

const defaults: PersistedTheme = {
  selection: 'kaaya',
  tokens: kaayaPreset.tokens,
  cssVars: null,
  customBase: null,
  custom: null,
}

// the no-flash script reads state.cssVars from this storage key before first paint
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      ...defaults,
      selectPreset: (preset) => {
        applyTheme(preset.tokens)
        set({ selection: preset.id, tokens: preset.tokens, cssVars: toCssVars(preset.tokens) })
      },
      startCustom: () => {
        const { tokens, custom, customBase } = get()
        const base = customBase ?? tokens
        const settings = custom ?? customSettingsFrom(tokens)
        const next = buildCustomTokens(base, settings)
        applyTheme(next)
        set({
          selection: 'custom',
          tokens: next,
          cssVars: toCssVars(next),
          customBase: base,
          custom: settings,
        })
      },
      updateCustom: (update) => {
        const { tokens, custom, customBase } = get()
        const base = customBase ?? tokens
        const settings = { ...(custom ?? customSettingsFrom(tokens)), ...update }
        const next = buildCustomTokens(base, settings)
        applyTheme(next)
        set({
          selection: 'custom',
          tokens: next,
          cssVars: toCssVars(next),
          customBase: base,
          custom: settings,
        })
      },
      reset: () => {
        applyTheme(kaayaPreset.tokens)
        set(defaults)
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      version: 2,
      storage: sessionJSONStorage<PersistedTheme>(),
      partialize: (state) => ({
        selection: state.selection,
        tokens: state.tokens,
        cssVars: state.cssVars,
        customBase: state.customBase,
        custom: state.custom,
      }),
      migrate: (persisted) => ({ ...defaults, ...(persisted as Partial<PersistedTheme>) }),
      skipHydration: true,
    },
  ),
)
