import sharp from 'sharp'

type Rgb = [number, number, number]

const BACKGROUND_DISTANCE = 38
const CLUSTERS = 4
const ITERATIONS = 12

function distance(a: Rgb, b: Rgb): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

function toHex(color: Rgb): string {
  return `#${color
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

function average(pixels: Rgb[]): Rgb {
  const sum = pixels.reduce<Rgb>(
    (total, pixel) => [total[0] + pixel[0], total[1] + pixel[1], total[2] + pixel[2]],
    [0, 0, 0],
  )
  return [sum[0] / pixels.length, sum[1] / pixels.length, sum[2] / pixels.length]
}

function nearestCenter(pixel: Rgb, centers: Rgb[]): number {
  let best = 0
  centers.forEach((center, index) => {
    const bestCenter = centers[best]
    if (bestCenter && distance(pixel, center) < distance(pixel, bestCenter)) best = index
  })
  return best
}

// product shots sit on a plain background, so the corners give the color to ignore
export async function sampleDominantHex(filePath: string): Promise<string> {
  const { data, info } = await sharp(filePath)
    .removeAlpha()
    .resize(80, 100, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels: Rgb[] = []
  for (let index = 0; index < data.length; index += 3) {
    pixels.push([data[index] ?? 0, data[index + 1] ?? 0, data[index + 2] ?? 0])
  }

  const cornerIndexes = [0, info.width - 1, (info.height - 1) * info.width, pixels.length - 1]
  const background = average(cornerIndexes.map((index) => pixels[index] ?? [255, 255, 255]))
  const garment = pixels.filter((pixel) => distance(pixel, background) > BACKGROUND_DISTANCE)
  const source = garment.length > 50 ? garment : pixels

  let centers: Rgb[] = Array.from(
    { length: CLUSTERS },
    (_, index) => source[Math.floor(((index + 0.5) * source.length) / CLUSTERS)] ?? [0, 0, 0],
  )
  let assignment: number[] = []
  for (let iteration = 0; iteration < ITERATIONS; iteration++) {
    assignment = source.map((pixel) => nearestCenter(pixel, centers))
    centers = centers.map((center, index) => {
      const members = source.filter((_, pixelIndex) => assignment[pixelIndex] === index)
      return members.length > 0 ? average(members) : center
    })
  }

  const counts = centers.map((_, index) => assignment.filter((value) => value === index).length)
  const largest = counts.indexOf(Math.max(...counts))
  return toHex(centers[largest] ?? [0, 0, 0])
}
