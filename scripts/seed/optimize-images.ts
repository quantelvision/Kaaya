import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp, { type OverlayOptions } from 'sharp'
import {
  heroVariantProducts,
  originalImages,
  seedImageFileName,
  variantFilePattern,
} from './image-map'
import {
  LOOK_BACKGROUND,
  LOOK_HEIGHT,
  LOOK_WIDTH,
  lookImageFileName,
  lookLayouts,
} from './look-layouts'

const rootDir = process.cwd()
const imagesDir = path.join(rootDir, 'scripts', 'seed', 'images')
const MAX_SIDE = 2000
const QUALITY = 85

function readSourceDir(): string {
  const flagIndex = process.argv.indexOf('--source')
  const source = flagIndex === -1 ? undefined : process.argv[flagIndex + 1]
  if (!source) throw new Error('Pass the folder with the original images: --source <dir>')
  return path.resolve(rootDir, source)
}

async function optimize(sourcePath: string, outputName: string): Promise<void> {
  await sharp(sourcePath)
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(path.join(imagesDir, outputName))
}

// product shots sit on white, so trimming the margin lets each piece fill its box in the flat lay
async function renderLook(editSlug: string): Promise<void> {
  const layers: OverlayOptions[] = []
  for (const piece of lookLayouts[editSlug] ?? []) {
    const sourcePath = path.join(imagesDir, seedImageFileName(piece.productSlug, piece.colorSlug))
    const trimmed = await sharp(sourcePath)
      .trim({ background: '#FFFFFF', threshold: 18 })
      .toBuffer()
    const fitted = await sharp(trimmed)
      .resize({
        width: piece.box.width,
        height: piece.box.height,
        fit: 'contain',
        background: '#FFFFFF',
      })
      .flatten({ background: '#FFFFFF' })
      .toBuffer()
    layers.push({ input: fitted, left: piece.box.x, top: piece.box.y, blend: 'multiply' })
  }

  await sharp({
    create: { width: LOOK_WIDTH, height: LOOK_HEIGHT, channels: 3, background: LOOK_BACKGROUND },
  })
    .composite(layers)
    .webp({ quality: QUALITY })
    .toFile(path.join(imagesDir, lookImageFileName(editSlug)))
}

async function main() {
  const sourceDir = readSourceDir()
  await mkdir(imagesDir, { recursive: true })

  for (const entry of originalImages) {
    await optimize(
      path.join(sourceDir, entry.sourceFile),
      seedImageFileName(entry.productSlug, entry.colorSlug),
    )
  }

  const variantFiles = (await readdir(sourceDir)).filter((fileName) => {
    const match = variantFilePattern.exec(fileName)
    return match?.[1] !== undefined && heroVariantProducts.includes(match[1])
  })
  for (const fileName of variantFiles) {
    await optimize(path.join(sourceDir, fileName), fileName.replace(/\.(png|webp)$/, '.webp'))
  }

  for (const editSlug of Object.keys(lookLayouts)) {
    await renderLook(editSlug)
  }

  process.stdout.write(
    `Optimized ${originalImages.length} product images and ${variantFiles.length} variant images, rendered ${Object.keys(lookLayouts).length} looks into scripts/seed/images\n`,
  )
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
  )
  process.exit(1)
})
