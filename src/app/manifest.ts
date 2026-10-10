import type { MetadataRoute } from 'next'
import { kaayaPreset } from '@/lib/theme/presets'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Kaaya',
    short_name: 'Kaaya',
    description: 'Kaaya is a demo fashion store by Quantel Vision. No real orders are placed.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    lang: 'en-IN',
    background_color: kaayaPreset.tokens.bg,
    theme_color: kaayaPreset.tokens.primary,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
