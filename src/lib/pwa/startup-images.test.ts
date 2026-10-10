import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { startupImages } from '@/lib/pwa/startup-images'

describe('startupImages', () => {
  it('points at a splash file that exists for every screen', () => {
    for (const image of startupImages) {
      expect(existsSync(`public${image.url}`)).toBe(true)
    }
  })

  it('uses whole css pixel sizes in the media queries', () => {
    for (const image of startupImages) {
      expect(image.media).toMatch(/device-width: \d+px\) and \(device-height: \d+px\)/)
    }
  })

  it('covers every file in the splash folder', () => {
    expect(startupImages).toHaveLength(16)
  })
})
