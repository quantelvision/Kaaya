export const sizeScales = {
  apparel: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ethnic: ['S', 'M', 'L', 'XL', 'XXL'],
  footwear: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
} as const

export type SizeScale = keyof typeof sizeScales

export const sizeScaleOptions: { title: string; value: SizeScale }[] = [
  { title: 'Apparel (XS to XXL)', value: 'apparel' },
  { title: 'Ethnic (S to XXL)', value: 'ethnic' },
  { title: 'Footwear (UK 5 to UK 11)', value: 'footwear' },
]

export const genderOptions = [
  { title: 'Women', value: 'women' },
  { title: 'Men', value: 'men' },
  { title: 'Unisex', value: 'unisex' },
] as const

export type Gender = (typeof genderOptions)[number]['value']

export const materials = [
  'Cotton',
  'Denim',
  'Linen',
  'Satin',
  'Polyester blend',
  'Leather',
  'Rayon',
  'Nylon',
] as const

export const fits = ['Relaxed', 'Regular', 'Slim', 'Oversized', 'Flowy'] as const

export function isSizeInScale(size: string, scale: SizeScale): boolean {
  return (sizeScales[scale] as readonly string[]).includes(size)
}
