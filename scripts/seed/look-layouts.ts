export const LOOK_WIDTH = 1600
export const LOOK_HEIGHT = 2000
export const LOOK_BACKGROUND = '#EEE7DE'

export type LookPiece = {
  productSlug: string
  colorSlug: string
  box: { x: number; y: number; width: number; height: number }
}

export const lookLayouts: Record<string, LookPiece[]> = {
  'festive-edit': [
    {
      productSlug: 'printed-kurti',
      colorSlug: 'madder-red',
      box: { x: 90, y: 150, width: 820, height: 1000 },
    },
    {
      productSlug: 'palazzo-pants',
      colorSlug: 'turmeric',
      box: { x: 900, y: 760, width: 620, height: 1140 },
    },
  ],
  'y2k-revival': [
    {
      productSlug: 'baby-tee',
      colorSlug: 'obsidian-black',
      box: { x: 110, y: 160, width: 760, height: 640 },
    },
    {
      productSlug: 'low-rise-track-pants',
      colorSlug: 'jet-black',
      box: { x: 880, y: 200, width: 600, height: 1220 },
    },
    {
      productSlug: 'platform-boots',
      colorSlug: 'oxblood',
      box: { x: 150, y: 1060, width: 700, height: 760 },
    },
  ],
  'street-uniform': [
    {
      productSlug: 'oversized-hoodie',
      colorSlug: 'washed-grey',
      box: { x: 80, y: 120, width: 880, height: 900 },
    },
    {
      productSlug: 'cargo-pants',
      colorSlug: 'sand-khaki',
      box: { x: 980, y: 260, width: 540, height: 1260 },
    },
    {
      productSlug: 'chunky-sneakers',
      colorSlug: 'cloud-white',
      box: { x: 150, y: 1220, width: 760, height: 620 },
    },
  ],
  'summer-resort': [
    {
      productSlug: 'linen-shirt',
      colorSlug: 'oat',
      box: { x: 80, y: 120, width: 880, height: 900 },
    },
    {
      productSlug: 'beach-shorts',
      colorSlug: 'ivory-palm',
      box: { x: 900, y: 600, width: 620, height: 760 },
    },
    {
      productSlug: 'slide-sandals',
      colorSlug: 'jet-black',
      box: { x: 160, y: 1260, width: 680, height: 580 },
    },
  ],
  'smart-casual': [
    {
      productSlug: 'oversized-blazer',
      colorSlug: 'camel',
      box: { x: 80, y: 110, width: 880, height: 1020 },
    },
    {
      productSlug: 'mom-jeans',
      colorSlug: 'bleach-wash',
      box: { x: 980, y: 300, width: 540, height: 1300 },
    },
    {
      productSlug: 'retro-low-top-sneakers',
      colorSlug: 'ink-navy',
      box: { x: 170, y: 1280, width: 700, height: 580 },
    },
  ],
}

export function lookImageFileName(editSlug: string): string {
  return `look_${editSlug}.webp`
}

export function hotspotForPiece(piece: LookPiece): { x: number; y: number } {
  const centerX = piece.box.x + piece.box.width / 2
  const centerY = piece.box.y + piece.box.height / 2
  return {
    x: Math.round((centerX / LOOK_WIDTH) * 1000) / 10,
    y: Math.round((centerY / LOOK_HEIGHT) * 1000) / 10,
  }
}
