import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import opentype, { type Font, type RenderOptions } from 'opentype.js'
import sharp from 'sharp'
import wawoff2 from 'wawoff2'
import { splashFileName, splashScreens } from '../src/lib/brand/splash-screens'
import { kaayaPreset } from '../src/lib/theme/presets'

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')

const colors = {
  brand: kaayaPreset.tokens.brand,
  ivory: kaayaPreset.tokens.bg,
  onBrand: kaayaPreset.tokens.onPrimary,
  muted: kaayaPreset.tokens.muted,
}

const wordmarkRender: RenderOptions = {
  kerning: true,
  letterSpacing: -0.01,
  variation: { wght: 600, opsz: 144, SOFT: 50, WONK: 0 },
}

const bodyRender: RenderOptions = {
  kerning: true,
  variation: { wght: 450, wdth: 100 },
}

type Shape = {
  d: string
  x: number
  y: number
  width: number
  height: number
}

async function loadWoff2Font(
  packagePath: string,
  { shouldSkipSubstitutions = false } = {},
): Promise<Font> {
  const woff2 = await readFile(path.join(rootDir, 'node_modules', packagePath))
  const ttf = await wawoff2.decompress(woff2)
  const font = opentype.parse(new Uint8Array(ttf).buffer)
  // opentype.js cannot read some contextual lookups in this font, and plain latin text needs none
  if (shouldSkipSubstitutions) delete font.tables.gsub
  return font
}

// glyphs are drawn at a large size so the path data keeps detail after scaling
function textShape(font: Font, text: string, options: RenderOptions): Shape {
  const glyphPath = font.getPath(text, 0, 0, 1000, options)
  const box = glyphPath.getBoundingBox()
  return {
    d: glyphPath.toPathData(1),
    x: box.x1,
    y: box.y1,
    width: box.x2 - box.x1,
    height: box.y2 - box.y1,
  }
}

type Placement = {
  centerX: number
  centerY: number
  fill: string
} & ({ width: number } | { height: number })

function placeShape(shape: Shape, placement: Placement): string {
  const scale =
    'width' in placement ? placement.width / shape.width : placement.height / shape.height
  const left = placement.centerX - (shape.width * scale) / 2 - shape.x * scale
  const top = placement.centerY - (shape.height * scale) / 2 - shape.y * scale
  return `<path d="${shape.d}" fill="${placement.fill}" transform="translate(${left.toFixed(2)} ${top.toFixed(2)}) scale(${scale.toFixed(5)})"/>`
}

function svgDocument(width: number, height: number, background: string | null, body: string) {
  const backgroundRect = background
    ? `<rect width="${width}" height="${height}" fill="${background}"/>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${backgroundRect}${body}</svg>`
}

async function writePng(relativePath: string, svg: string): Promise<string> {
  const outputPath = path.join(publicDir, relativePath)
  await mkdir(path.dirname(outputPath), { recursive: true })
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outputPath)
  return relativePath
}

async function writeSvg(relativePath: string, svg: string): Promise<string> {
  const outputPath = path.join(publicDir, relativePath)
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${svg}\n`)
  return relativePath
}

function appIcon(letter: Shape, size: number, letterHeightRatio: number): string {
  return svgDocument(
    size,
    size,
    colors.brand,
    placeShape(letter, {
      centerX: size / 2,
      centerY: size / 2,
      height: size * letterHeightRatio,
      fill: colors.onBrand,
    }),
  )
}

function readCopyTarget(): string | null {
  const flagIndex = process.argv.indexOf('--copy-to')
  const target = flagIndex === -1 ? undefined : process.argv[flagIndex + 1]
  return target ? path.resolve(rootDir, target) : null
}

async function main() {
  const fraunces = await loadWoff2Font(
    '@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2',
  )
  const instrumentSans = await loadWoff2Font(
    '@fontsource-variable/instrument-sans/files/instrument-sans-latin-standard-normal.woff2',
    { shouldSkipSubstitutions: true },
  )

  const letterK = textShape(fraunces, 'K', wordmarkRender)
  const wordmark = textShape(fraunces, 'Kaaya', wordmarkRender)
  const ogTagline = textShape(instrumentSans, 'A demo store by Quantel Vision', bodyRender)
  const splashCredit = textShape(instrumentSans, 'Built by Quantel Vision', bodyRender)

  const written: string[] = []

  written.push(
    await writeSvg(
      'favicon.svg',
      svgDocument(
        64,
        64,
        null,
        placeShape(letterK, { centerX: 32, centerY: 32, height: 50, fill: colors.brand }),
      ),
    ),
  )
  written.push(await writePng('apple-touch-icon.png', appIcon(letterK, 180, 0.56)))
  written.push(await writePng('icons/icon-192.png', appIcon(letterK, 192, 0.56)))
  written.push(await writePng('icons/icon-512.png', appIcon(letterK, 512, 0.56)))
  // maskable icons are cropped to a circle of 80% diameter, so the letter stays well inside it
  written.push(await writePng('icons/icon-maskable-512.png', appIcon(letterK, 512, 0.42)))

  const ogWordmarkWidth = 500
  const ogWordmarkHeight = (wordmark.height / wordmark.width) * ogWordmarkWidth
  written.push(
    await writePng(
      'og-image.png',
      svgDocument(
        1200,
        630,
        colors.ivory,
        placeShape(wordmark, {
          centerX: 600,
          centerY: 290,
          width: ogWordmarkWidth,
          fill: colors.brand,
        }) +
          placeShape(ogTagline, {
            centerX: 600,
            centerY: 290 + ogWordmarkHeight / 2 + 70,
            height: 28,
            fill: colors.muted,
          }),
      ),
    ),
  )

  for (const screen of splashScreens) {
    const width = screen.cssWidth * screen.pixelRatio
    const height = screen.cssHeight * screen.pixelRatio
    const wordmarkWidth = Math.min(screen.cssWidth * 0.44, 260) * screen.pixelRatio
    const creditHeight = 10 * screen.pixelRatio
    written.push(
      await writePng(
        `splash/${splashFileName(screen)}`,
        svgDocument(
          width,
          height,
          colors.ivory,
          placeShape(wordmark, {
            centerX: width / 2,
            centerY: height * 0.47,
            width: wordmarkWidth,
            fill: colors.brand,
          }) +
            placeShape(splashCredit, {
              centerX: width / 2,
              centerY: height - 56 * screen.pixelRatio,
              height: creditHeight,
              fill: colors.muted,
            }),
        ),
      ),
    )
  }

  const copyTarget = readCopyTarget()
  if (copyTarget) {
    for (const relativePath of written) {
      const destination = path.join(copyTarget, relativePath)
      await mkdir(path.dirname(destination), { recursive: true })
      await copyFile(path.join(publicDir, relativePath), destination)
    }
  }

  process.stdout.write(
    `Wrote ${written.length} brand assets to public/${copyTarget ? ` and copied them to ${path.relative(rootDir, copyTarget)}` : ''}\n`,
  )
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
  )
  process.exit(1)
})
