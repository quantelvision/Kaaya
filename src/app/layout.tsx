import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kaaya | A demo fashion store by Quantel Vision',
    template: '%s | Kaaya',
  },
  description: 'Kaaya is a demo fashion store by Quantel Vision. No real orders are placed.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
