import {
  Bricolage_Grotesque,
  Cormorant_Garamond,
  Fraunces,
  IBM_Plex_Mono,
  Instrument_Sans,
  Inter,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Syne,
} from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
  variable: '--font-fraunces',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

// preset fonts load only when a preset uses them
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant-garamond',
  display: 'swap',
  preload: false,
})

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
  display: 'swap',
  preload: false,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: false,
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  preload: false,
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
  preload: false,
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  preload: false,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

export const fontVariableClassNames = [
  fraunces,
  instrumentSans,
  cormorantGaramond,
  bricolageGrotesque,
  spaceGrotesk,
  syne,
  plusJakartaSans,
  ibmPlexMono,
  inter,
]
  .map((font) => font.variable)
  .join(' ')
