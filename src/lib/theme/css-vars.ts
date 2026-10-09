import { fontVariables, type ThemeTokens } from '@/lib/theme/presets'

export type ThemeCssVars = Record<`--k-${string}`, string>

export function toCssVars(tokens: ThemeTokens): ThemeCssVars {
  return {
    '--k-primary': tokens.primary,
    '--k-on-primary': tokens.onPrimary,
    '--k-accent': tokens.accent,
    '--k-on-accent': tokens.onAccent,
    '--k-bg': tokens.bg,
    '--k-surface': tokens.surface,
    '--k-text': tokens.text,
    '--k-muted': tokens.muted,
    '--k-border': tokens.border,
    '--k-wash': tokens.wash,
    '--k-brand': tokens.brand,
    '--k-radius-btn': tokens.radiusBtn,
    '--k-radius-card': tokens.radiusCard,
    '--k-font-display': `var(${fontVariables[tokens.fontDisplay]})`,
    '--k-font-body': `var(${fontVariables[tokens.fontBody]})`,
  }
}

export function toRootCss(tokens: ThemeTokens): string {
  const declarations = Object.entries(toCssVars(tokens))
    .map(([name, value]) => `${name}:${value}`)
    .join(';')
  return `:root{${declarations}}`
}
