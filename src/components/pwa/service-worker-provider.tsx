'use client'

import { SerwistProvider } from '@serwist/next/react'
import { useEffect, type ReactNode } from 'react'

const isProduction = process.env.NODE_ENV === 'production'

export function ServiceWorkerProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (isProduction || !('serviceWorker' in navigator)) return
    // a worker left from a production build on this origin would keep serving old files in development
    void navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((item) => item.unregister())))
  }, [])

  return (
    <SerwistProvider
      swUrl="/sw.js"
      disable={!isProduction}
      reloadOnOnline={false}
      options={{ type: 'classic' }}
    >
      {children}
    </SerwistProvider>
  )
}
