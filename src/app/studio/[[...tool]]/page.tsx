import type { Metadata } from 'next'
import { NextStudio, metadata as studioMetadata } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export { viewport } from 'next-sanity/studio'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Studio',
  robots: { index: false, follow: false },
}

export default function StudioPage() {
  return <NextStudio config={config} />
}
