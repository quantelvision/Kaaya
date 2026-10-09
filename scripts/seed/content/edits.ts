import type { SeedEdit } from './types'

export const edits: SeedEdit[] = [
  {
    slug: 'festive-edit',
    title: 'The Festive Edit',
    order: 1,
    story:
      'Rich velvet and hand block prints for the season of lights. Cut for long days of visiting family and later nights of dancing.',
    productSlugs: [
      'anarkali-suit',
      'churidar-set',
      'printed-kurti',
      'palazzo-pants',
      'satin-slip-dress',
    ],
  },
  {
    slug: 'y2k-revival',
    title: 'Y2K Revival',
    order: 2,
    story:
      'Low rise waists, baby tees and platform soles, the way they were worn in 2003. The same silhouettes, cut for now in better fabric.',
    productSlugs: [
      'baby-tee',
      'low-rise-track-pants',
      'mesh-layered-top',
      'corset-top',
      'bodycon-mini-dress',
      'platform-boots',
    ],
  },
  {
    slug: 'street-uniform',
    title: 'Street Uniform',
    order: 3,
    story:
      'Heavy fabrics and loose shapes that work as everyday armor. Made for the daily commute and broken in by it.',
    productSlugs: [
      'oversized-hoodie',
      'oversized-graphic-tee',
      'cargo-pants',
      'baggy-jeans',
      'varsity-jacket',
      'chunky-sneakers',
    ],
  },
  {
    slug: 'summer-resort',
    title: 'Summer Resort',
    order: 4,
    story:
      'Breathable layers for Chennai heat and beach weekends. Linen that dries fast and prints that look right with sand on them.',
    productSlugs: ['linen-shirt', 'beach-shorts', 'slide-sandals', 'co-ord-set', 'palazzo-pants'],
  },
  {
    slug: 'smart-casual',
    title: 'Smart Casual',
    order: 5,
    story:
      'Sharp enough for work, easy enough for after. A camel blazer does most of the work here.',
    productSlugs: [
      'oversized-blazer',
      'polo-shirt',
      'jumpsuit',
      'mom-jeans',
      'retro-low-top-sneakers',
    ],
  },
]
