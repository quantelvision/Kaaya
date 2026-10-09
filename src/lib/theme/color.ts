const ON_DARK = '#FFFFFF'
const ON_LIGHT = '#111111'

const hexPattern = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export function isHexColor(value: string): boolean {
  return hexPattern.test(value)
}

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  if (!isHexColor(withHash)) return null
  if (withHash.length === 4) {
    const [, r, g, b] = withHash
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }
  return withHash.toUpperCase()
}

function channelToLinear(channel: number): number {
  const srgb = channel / 255
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(hex: string): number {
  const normalized = normalizeHex(hex)
  if (!normalized) throw new Error(`Invalid hex color: ${hex}`)
  const r = parseInt(normalized.slice(1, 3), 16)
  const g = parseInt(normalized.slice(3, 5), 16)
  const b = parseInt(normalized.slice(5, 7), 16)
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b)
}

function contrastRatio(a: number, b: number): number {
  const [lighter, darker] = a > b ? [a, b] : [b, a]
  return (lighter + 0.05) / (darker + 0.05)
}

export function pickOnColor(background: string): string {
  const bgLuminance = relativeLuminance(background)
  const onDark = contrastRatio(bgLuminance, relativeLuminance(ON_DARK))
  const onLight = contrastRatio(bgLuminance, relativeLuminance(ON_LIGHT))
  return onDark >= onLight ? ON_DARK : ON_LIGHT
}
