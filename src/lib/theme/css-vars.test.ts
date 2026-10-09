import { describe, expect, it } from 'vitest'
import { toCssVars, toRootCss } from '@/lib/theme/css-vars'
import { kaayaPreset, themePresets } from '@/lib/theme/presets'

describe('toCssVars', () => {
  it('maps every preset to the same set of --k- properties', () => {
    const names = Object.keys(toCssVars(kaayaPreset.tokens)).sort()
    for (const preset of themePresets) {
      expect(Object.keys(toCssVars(preset.tokens)).sort()).toEqual(names)
    }
  })

  it('points font tokens at the next/font variables', () => {
    const vars = toCssVars(kaayaPreset.tokens)
    expect(vars['--k-font-display']).toBe('var(--font-fraunces)')
    expect(vars['--k-font-body']).toBe('var(--font-instrument-sans)')
  })
})

describe('toRootCss', () => {
  it('writes a single :root rule', () => {
    const css = toRootCss(kaayaPreset.tokens)
    expect(css.startsWith(':root{')).toBe(true)
    expect(css).toContain('--k-primary:#6B1D2F')
  })
})
