import type { PrecacheEntry, RouteMatchCallbackOptions, SerwistGlobalConfig } from 'serwist'
import {
  CacheableResponsePlugin,
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  Serwist,
} from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const DAY_IN_SECONDS = 24 * 60 * 60
const NETWORK_TIMEOUT_SECONDS = 3

const isStudioPath = (pathname: string) => pathname.startsWith('/studio')

const isExcluded = ({ request, url, sameOrigin }: RouteMatchCallbackOptions) =>
  sameOrigin &&
  (isStudioPath(url.pathname) ||
    url.pathname.startsWith('/api') ||
    (request.referrer !== '' && isStudioPath(new URL(request.referrer).pathname)))

const isPageData = ({ request, url, sameOrigin }: RouteMatchCallbackOptions) =>
  sameOrigin && request.headers.get('RSC') === '1' && !url.pathname.startsWith('/_next/')

// pages opened through client navigation are cached by the window with plain requests, not navigations
const isPage = ({ request, url, sameOrigin }: RouteMatchCallbackOptions) =>
  sameOrigin &&
  (request.mode === 'navigate' ||
    (request.destination === '' &&
      !request.headers.has('RSC') &&
      !url.pathname.startsWith('/_next/') &&
      !/\.[a-z0-9]+$/i.test(url.pathname)))

const pageExpiration = () =>
  new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 7 * DAY_IN_SECONDS })

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    { matcher: isExcluded, handler: new NetworkOnly() },
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/_next/static/'),
      handler: new CacheFirst({
        cacheName: 'next-static',
        plugins: [new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 30 * DAY_IN_SECONDS })],
      }),
    },
    {
      matcher: ({ url }) => url.hostname === 'cdn.sanity.io' && url.pathname.startsWith('/images/'),
      handler: new CacheFirst({
        cacheName: 'sanity-images',
        plugins: [
          // image requests are no-cors, so the cdn answers with opaque responses (status 0)
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 30 * DAY_IN_SECONDS,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    {
      matcher: isPageData,
      handler: new NetworkFirst({
        cacheName: 'pages-rsc',
        networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
        plugins: [pageExpiration()],
      }),
    },
    {
      matcher: isPage,
      handler: new NetworkFirst({
        cacheName: 'pages',
        networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
        plugins: [pageExpiration()],
      }),
    },
  ],
  fallbacks: {
    entries: [{ url: '/offline', matcher: ({ request }) => request.destination === 'document' }],
  },
})

serwist.addEventListeners()
