export type FontKey =
  | 'fraunces'
  | 'instrumentSans'
  | 'cormorantGaramond'
  | 'bricolageGrotesque'
  | 'spaceGrotesk'
  | 'syne'
  | 'plusJakartaSans'
  | 'ibmPlexMono'

export type ThemeTokens = {
  primary: string
  onPrimary: string
  accent: string
  onAccent: string
  bg: string
  surface: string
  text: string
  muted: string
  border: string
  wash: string
  brand: string
  radiusBtn: string
  radiusCard: string
  fontDisplay: FontKey
  fontBody: FontKey
}

export type PresetId = 'kaaya' | 'minimalLuxury' | 'streetwear' | 'cleanModern'

export type ThemePreset = {
  id: PresetId
  name: string
  tokens: ThemeTokens
}

export const fontVariables: Record<FontKey, string> = {
  fraunces: '--font-fraunces',
  instrumentSans: '--font-instrument-sans',
  cormorantGaramond: '--font-cormorant-garamond',
  bricolageGrotesque: '--font-bricolage-grotesque',
  spaceGrotesk: '--font-space-grotesk',
  syne: '--font-syne',
  plusJakartaSans: '--font-plus-jakarta-sans',
  ibmPlexMono: '--font-ibm-plex-mono',
}

export const kaayaPreset: ThemePreset = {
  id: 'kaaya',
  name: 'Kaaya',
  tokens: {
    primary: '#6B1D2F',
    onPrimary: '#F6F1E9',
    accent: '#C8861A',
    onAccent: '#1B1A17',
    bg: '#F6F1E9',
    surface: '#FFFDF9',
    text: '#1B1A17',
    muted: '#6E675E',
    border: '#E4DCD2',
    wash: '#F1E4E2',
    brand: '#6B1D2F',
    radiusBtn: '4px',
    radiusCard: '6px',
    fontDisplay: 'fraunces',
    fontBody: 'instrumentSans',
  },
}

export const themePresets: ThemePreset[] = [
  kaayaPreset,
  {
    id: 'minimalLuxury',
    name: 'Minimal Luxury',
    tokens: {
      primary: '#111111',
      onPrimary: '#FAFAF8',
      accent: '#5B6470',
      onAccent: '#FFFFFF',
      bg: '#FAFAF8',
      surface: '#FFFFFF',
      text: '#111111',
      muted: '#686A6D',
      border: '#E5E4E0',
      wash: '#F0EFEB',
      brand: '#111111',
      radiusBtn: '0px',
      radiusCard: '0px',
      fontDisplay: 'cormorantGaramond',
      fontBody: 'instrumentSans',
    },
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    tokens: {
      primary: '#0E0E0E',
      onPrimary: '#FFFFFF',
      accent: '#D4FF3A',
      onAccent: '#0E0E0E',
      bg: '#F2F2F0',
      surface: '#FFFFFF',
      text: '#0E0E0E',
      muted: '#5F5F5B',
      border: '#DADAD6',
      wash: '#ECF6C8',
      brand: '#0E0E0E',
      radiusBtn: '9999px',
      radiusCard: '12px',
      fontDisplay: 'bricolageGrotesque',
      fontBody: 'spaceGrotesk',
    },
  },
  {
    id: 'cleanModern',
    name: 'Clean Modern',
    tokens: {
      primary: '#2E3A8C',
      onPrimary: '#FFFFFF',
      accent: '#E3A33B',
      onAccent: '#14161F',
      bg: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#14161F',
      muted: '#5C6070',
      border: '#E3E5EC',
      wash: '#EEF0FA',
      brand: '#2E3A8C',
      radiusBtn: '8px',
      radiusCard: '12px',
      fontDisplay: 'syne',
      fontBody: 'plusJakartaSans',
    },
  },
]

export function findPreset(id: PresetId): ThemePreset {
  return themePresets.find((preset) => preset.id === id) ?? kaayaPreset
}
