import type { SeedHeroSlide } from './types'

export const heroSlides: SeedHeroSlide[] = [
  {
    id: 'heroSlide-festive-edit',
    badge: 'Festive 2026',
    headline: 'Dressed for the season of lights',
    subtext:
      'Velvet anarkalis and hand block printed kurtis, now up to 30% off in The Festive Edit Sale.',
    ctaLabel: 'Shop the Festive Edit',
    ctaHref: '/edits/festive-edit',
    lookEditSlug: 'festive-edit',
    order: 1,
  },
  {
    id: 'heroSlide-street-uniform',
    badge: 'New in',
    headline: 'Heavy fleece, worn loose',
    subtext:
      'A 450 GSM hoodie with six pocket cargos and cushioned soles. The Street Uniform edit.',
    ctaLabel: 'Shop Street Uniform',
    ctaHref: '/edits/street-uniform',
    lookEditSlug: 'street-uniform',
    order: 2,
  },
  {
    id: 'heroSlide-y2k-revival',
    badge: 'Y2K Revival',
    headline: 'Low rise is back',
    subtext: 'Track pants with a side stripe and boots on a 5 cm platform, cut for now.',
    ctaLabel: 'Shop Y2K Revival',
    ctaHref: '/edits/y2k-revival',
    lookEditSlug: 'y2k-revival',
    order: 3,
  },
]
