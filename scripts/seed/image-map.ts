export type ImageMapEntry = {
  sourceFile: string
  productSlug: string
  colorSlug: string
}

export const originalImages: ImageMapEntry[] = [
  { sourceFile: 'Anarkali Suit.png', productSlug: 'anarkali-suit', colorSlug: 'mulberry' },
  { sourceFile: 'Churidar Set.png', productSlug: 'churidar-set', colorSlug: 'lilac-haze' },
  { sourceFile: 'Printed Kurthi.png', productSlug: 'printed-kurti', colorSlug: 'madder-red' },
  { sourceFile: 'Palazzo Pants.png', productSlug: 'palazzo-pants', colorSlug: 'turmeric' },
  {
    sourceFile: 'Bodycon Mini Dress.png',
    productSlug: 'bodycon-mini-dress',
    colorSlug: 'jet-black',
  },
  { sourceFile: 'Satin Slip Dress.png', productSlug: 'satin-slip-dress', colorSlug: 'garnet' },
  { sourceFile: 'Jumpsuit.png', productSlug: 'jumpsuit', colorSlug: 'rust-clay' },
  { sourceFile: 'Co-ord Set.png', productSlug: 'co-ord-set', colorSlug: 'blush' },
  { sourceFile: 'Baby Tee.png', productSlug: 'baby-tee', colorSlug: 'obsidian-black' },
  { sourceFile: 'Corset Top.png', productSlug: 'corset-top', colorSlug: 'cherry-red' },
  { sourceFile: 'Crop Top.png', productSlug: 'crop-top', colorSlug: 'powder-blue' },
  { sourceFile: 'Mesh Layered Top.png', productSlug: 'mesh-layered-top', colorSlug: 'smoke' },
  {
    sourceFile: 'Oversized Graphic Tee.png',
    productSlug: 'oversized-graphic-tee',
    colorSlug: 'optic-white',
  },
  { sourceFile: 'Polo Shirt.png', productSlug: 'polo-shirt', colorSlug: 'sage' },
  { sourceFile: 'Linen Shirt.png', productSlug: 'linen-shirt', colorSlug: 'oat' },
  { sourceFile: 'Bomber Jacket.png', productSlug: 'bomber-jacket', colorSlug: 'olive-drab' },
  {
    sourceFile: 'Cropped Puffer Jacket.png',
    productSlug: 'cropped-puffer-jacket',
    colorSlug: 'gloss-black',
  },
  { sourceFile: 'Denim Jacket.png', productSlug: 'denim-jacket', colorSlug: 'indigo-rinse' },
  { sourceFile: 'Oversized Blazer.png', productSlug: 'oversized-blazer', colorSlug: 'camel' },
  { sourceFile: 'Varsity Jacket.png', productSlug: 'varsity-jacket', colorSlug: 'black-and-ecru' },
  { sourceFile: 'Oversized Hoodie.png', productSlug: 'oversized-hoodie', colorSlug: 'washed-grey' },
  { sourceFile: 'Baggy Jeans.png', productSlug: 'baggy-jeans', colorSlug: 'sky-wash' },
  { sourceFile: 'Mom Jeans.png', productSlug: 'mom-jeans', colorSlug: 'bleach-wash' },
  { sourceFile: 'Cargo Pants.png', productSlug: 'cargo-pants', colorSlug: 'sand-khaki' },
  { sourceFile: 'Joggers.png', productSlug: 'joggers', colorSlug: 'moss' },
  {
    sourceFile: 'Low-Rise Track Pants.png',
    productSlug: 'low-rise-track-pants',
    colorSlug: 'jet-black',
  },
  {
    sourceFile: 'Pleated Mini Skirt.png',
    productSlug: 'pleated-mini-skirt',
    colorSlug: 'red-tartan',
  },
  { sourceFile: 'Beach Shorts.png', productSlug: 'beach-shorts', colorSlug: 'ivory-palm' },
  { sourceFile: 'Bike Shorts.png', productSlug: 'bike-shorts', colorSlug: 'cocoa' },
  { sourceFile: 'Chunky Sneakers.png', productSlug: 'chunky-sneakers', colorSlug: 'cloud-white' },
  {
    sourceFile: 'Retro Low-Top Sneakers.png',
    productSlug: 'retro-low-top-sneakers',
    colorSlug: 'ink-navy',
  },
  { sourceFile: 'Platform Boots.png', productSlug: 'platform-boots', colorSlug: 'oxblood' },
  { sourceFile: 'Slide Sandals.png', productSlug: 'slide-sandals', colorSlug: 'jet-black' },
]

export const heroVariantProducts = [
  'oversized-hoodie',
  'printed-kurti',
  'chunky-sneakers',
  'satin-slip-dress',
  'cargo-pants',
]

// the sampled hex of the sage hoodie reads as grey next to the washed grey swatch
export const variantHexOverrides: Record<string, string> = {
  'oversized-hoodie_sage-glaze': '#858E7A',
}

// extra colors arrive as product-slug_color-slug_01.png, for example oversized-hoodie_sage-glaze_01.png
export const variantFilePattern = /^([a-z0-9-]+)_([a-z0-9-]+)_(\d{2})\.(png|webp|jpe?g)$/

export function seedImageFileName(productSlug: string, colorSlug: string, index = 1): string {
  return `${productSlug}_${colorSlug}_${String(index).padStart(2, '0')}.webp`
}

export function colorNameFromSlug(colorSlug: string): string {
  return colorSlug
    .split('-')
    .map((word) => (word === 'and' ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
}
