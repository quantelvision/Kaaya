import { describe, expect, it } from 'vitest'
import { isCustomizerShortcut, isTypingTarget } from '@/lib/keyboard'
import {
  buildCustomTokens,
  clampRadius,
  customSettingsFrom,
  typographyFor,
} from '@/lib/theme/custom'
import { kaayaPreset, themePresets } from '@/lib/theme/presets'

const streetwear = themePresets.find((preset) => preset.id === 'streetwear')!.tokens

describe('customSettingsFrom', () => {
  it('starts from the tokens on screen', () => {
    expect(customSettingsFrom(kaayaPreset.tokens)).toEqual({
      primary: '#6B1D2F',
      accent: '#C8861A',
      buttonRadius: 4,
      isPill: false,
      typography: 'serif',
    })
  })

  it('reads a pill radius', () => {
    expect(customSettingsFrom(streetwear)).toMatchObject({ isPill: true, buttonRadius: 24 })
  })
})

describe('buildCustomTokens', () => {
  it('keeps the base surfaces and picks readable on-colors', () => {
    const tokens = buildCustomTokens(kaayaPreset.tokens, {
      primary: '#d4ff3a',
      accent: '#2e3a8c',
      buttonRadius: 10,
      isPill: false,
      typography: 'modern',
    })
    expect(tokens).toMatchObject({
      primary: '#D4FF3A',
      onPrimary: '#111111',
      accent: '#2E3A8C',
      onAccent: '#FFFFFF',
      brand: '#D4FF3A',
      bg: kaayaPreset.tokens.bg,
      surface: kaayaPreset.tokens.surface,
      radiusBtn: '10px',
      radiusCard: '15px',
      fontDisplay: 'syne',
      fontBody: 'plusJakartaSans',
    })
  })

  it('uses a pill radius and caps the card radius', () => {
    const tokens = buildCustomTokens(kaayaPreset.tokens, {
      ...customSettingsFrom(kaayaPreset.tokens),
      buttonRadius: 24,
      isPill: true,
    })
    expect(tokens.radiusBtn).toBe('9999px')
    expect(tokens.radiusCard).toBe('16px')
  })

  it('ignores an invalid hex and keeps the base color', () => {
    const tokens = buildCustomTokens(kaayaPreset.tokens, {
      ...customSettingsFrom(kaayaPreset.tokens),
      primary: 'burgundy',
    })
    expect(tokens.primary).toBe(kaayaPreset.tokens.primary)
  })

  it('uses mono headings with the instrument body', () => {
    const tokens = buildCustomTokens(kaayaPreset.tokens, {
      ...customSettingsFrom(kaayaPreset.tokens),
      typography: 'mono',
    })
    expect([tokens.fontDisplay, tokens.fontBody]).toEqual(['ibmPlexMono', 'instrumentSans'])
  })
})

describe('clampRadius and typographyFor', () => {
  it('keeps the radius between 0 and 24', () => {
    expect(clampRadius(-3)).toBe(0)
    expect(clampRadius(30)).toBe(24)
    expect(clampRadius(7.6)).toBe(8)
  })

  it('falls back to serif for preset fonts outside the custom options', () => {
    expect(typographyFor(streetwear)).toBe('serif')
  })
})

describe('keyboard shortcut', () => {
  const event = { key: 'K', ctrlKey: true, metaKey: false, shiftKey: true, altKey: false }

  it('matches ctrl or cmd with shift and k', () => {
    expect(isCustomizerShortcut(event)).toBe(true)
    expect(isCustomizerShortcut({ ...event, ctrlKey: false, metaKey: true, key: 'k' })).toBe(true)
  })

  it('ignores other combinations', () => {
    expect(isCustomizerShortcut({ ...event, shiftKey: false })).toBe(false)
    expect(isCustomizerShortcut({ ...event, altKey: true })).toBe(false)
    expect(isCustomizerShortcut({ ...event, key: 'd' })).toBe(false)
  })

  it('treats form fields and editable text as typing targets', () => {
    expect(isTypingTarget({ tagName: 'INPUT' })).toBe(true)
    expect(isTypingTarget({ tagName: 'TEXTAREA' })).toBe(true)
    expect(isTypingTarget({ tagName: 'DIV', isContentEditable: true })).toBe(true)
    expect(isTypingTarget({ tagName: 'BUTTON' })).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
  })
})
