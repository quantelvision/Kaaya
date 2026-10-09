import { toCssVars } from '@/lib/theme/css-vars'
import type { ThemeTokens } from '@/lib/theme/presets'

export function applyTheme(tokens: ThemeTokens): void {
  const root = document.documentElement
  for (const [name, value] of Object.entries(toCssVars(tokens))) {
    root.style.setProperty(name, value)
  }
  updateThemeColor(tokens.primary)
}

export function updateThemeColor(color: string): void {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.append(meta)
  }
  meta.content = color
}
