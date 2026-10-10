import { normalizeHex, pickOnColor } from '@/lib/theme/color'
import type { FontKey, ThemeTokens } from '@/lib/theme/presets'

export const MAX_BUTTON_RADIUS = 24
const PILL_RADIUS = '9999px'
const MAX_CARD_RADIUS = 16

export const typographyOptions = {
  serif: { label: 'Serif', display: 'cormorantGaramond', body: 'instrumentSans' },
  modern: { label: 'Modern Sans', display: 'syne', body: 'plusJakartaSans' },
  mono: { label: 'Mono', display: 'ibmPlexMono', body: 'instrumentSans' },
} as const satisfies Record<string, { label: string; display: FontKey; body: FontKey }>

export type Typography = keyof typeof typographyOptions

export type CustomThemeSettings = {
  primary: string
  accent: string
  buttonRadius: number
  isPill: boolean
  typography: Typography
}

function radiusInPixels(radius: string): number {
  const value = Number.parseFloat(radius)
  return Number.isFinite(value) ? value : 0
}

export function isPillRadius(radius: string): boolean {
  return radiusInPixels(radius) >= 999
}

export function clampRadius(value: number): number {
  return Math.round(Math.min(MAX_BUTTON_RADIUS, Math.max(0, value)))
}

export function typographyFor(tokens: ThemeTokens): Typography {
  const match = (Object.keys(typographyOptions) as Typography[]).find(
    (key) => typographyOptions[key].display === tokens.fontDisplay,
  )
  return match ?? 'serif'
}

// custom starts from whatever is on screen, so switching to it changes nothing until a control moves
export function customSettingsFrom(tokens: ThemeTokens): CustomThemeSettings {
  return {
    primary: tokens.primary,
    accent: tokens.accent,
    buttonRadius: isPillRadius(tokens.radiusBtn)
      ? MAX_BUTTON_RADIUS
      : clampRadius(radiusInPixels(tokens.radiusBtn)),
    isPill: isPillRadius(tokens.radiusBtn),
    typography: typographyFor(tokens),
  }
}

export function buildCustomTokens(base: ThemeTokens, settings: CustomThemeSettings): ThemeTokens {
  const primary = normalizeHex(settings.primary) ?? base.primary
  const accent = normalizeHex(settings.accent) ?? base.accent
  const buttonRadius = clampRadius(settings.buttonRadius)
  const typography = typographyOptions[settings.typography]

  return {
    ...base,
    primary,
    onPrimary: pickOnColor(primary),
    accent,
    onAccent: pickOnColor(accent),
    brand: primary,
    radiusBtn: settings.isPill ? PILL_RADIUS : `${buttonRadius}px`,
    radiusCard: `${settings.isPill ? MAX_CARD_RADIUS : Math.min(MAX_CARD_RADIUS, Math.round(buttonRadius * 1.5))}px`,
    fontDisplay: typography.display,
    fontBody: typography.body,
  }
}
