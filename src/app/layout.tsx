import type { Metadata, Viewport } from 'next'
import { fontVariableClassNames } from '@/lib/fonts'
import { toRootCss } from '@/lib/theme/css-vars'
import { noFlashThemeScript } from '@/lib/theme/no-flash-script'
import { siteUrl } from '@/lib/site'
import { kaayaPreset } from '@/lib/theme/presets'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: 'Kaaya',
  title: {
    default: 'Kaaya | A demo fashion store by Quantel Vision',
    template: '%s | Kaaya',
  },
  description: 'Kaaya is a demo fashion store by Quantel Vision. No real orders are placed.',
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    siteName: 'Kaaya',
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kaaya, a demo store by Quantel Vision',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: kaayaPreset.tokens.primary,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en-IN"
      className={`${fontVariableClassNames} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <style>{toRootCss(kaayaPreset.tokens)}</style>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
