import type { Metadata } from 'next'
import { NotFoundContent } from '@/components/layout/not-found-content'
import { StoreShell } from '@/components/layout/store-shell'

export const metadata: Metadata = {
  title: 'Page not found',
}

// unmatched urls render outside the store layout, so this page brings the shell itself
export default function NotFound() {
  return (
    <StoreShell>
      <NotFoundContent />
    </StoreShell>
  )
}
