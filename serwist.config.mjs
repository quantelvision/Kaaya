import { randomUUID } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { serwist } from '@serwist/next/config'

const appServerDir = '.next/server/app'
const chunkPattern = /static\/chunks\/[\w./~-]+\.(?:js|css)/g

// the embedded studio ships most of the build, so only chunks that store routes reference are precached
function storeChunks() {
  const chunks = new Set()
  for (const entry of readdirSync(appServerDir, { recursive: true, withFileTypes: true })) {
    const file = path.join(entry.parentPath, entry.name)
    const relative = path.relative(appServerDir, file).split(path.sep).join('/')
    if (!entry.isFile() || relative.startsWith('studio/') || !entry.name.includes('manifest')) {
      continue
    }
    const text = readFileSync(file, 'utf8')
    for (const match of text.matchAll(chunkPattern)) chunks.add(`.next/${match[0]}`)
  }
  return chunks
}

export default serwist({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  precachePrerendered: false,
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  globPatterns: [
    '.next/static/**/*.{js,css,woff2}',
    'public/{favicon.svg,apple-touch-icon.png}',
    'public/icons/*.png',
  ],
  manifestTransforms: [
    (entries) => {
      const chunks = storeChunks()
      const manifest = entries.filter(
        (entry) => !entry.url.startsWith('.next/static/chunks/') || chunks.has(entry.url),
      )
      return { manifest, warnings: [] }
    },
  ],
  esbuildOptions: { format: 'iife' },
  additionalPrecacheEntries: [{ url: '/offline', revision: randomUUID() }],
})
