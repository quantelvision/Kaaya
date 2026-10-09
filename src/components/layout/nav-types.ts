import type { CategoryIconKey } from '@/components/icons/category-icon-paths'

export type NavCategory = {
  title: string
  slug: string
  iconKey: CategoryIconKey
}

export type NavEdit = {
  title: string
  slug: string
}

export type StoreHelpSettings = {
  freeShippingThreshold: number
  shippingFee: number
  codFee: number
  returnWindowDays: number
}
