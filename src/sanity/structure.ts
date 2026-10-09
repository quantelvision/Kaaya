import { ClockIcon } from '@sanity/icons/Clock'
import { CogIcon } from '@sanity/icons/Cog'
import { FolderIcon } from '@sanity/icons/Folder'
import { StarIcon } from '@sanity/icons/Star'
import { TagIcon } from '@sanity/icons/Tag'
import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import { apiVersion } from './env'

function singletonItem(
  S: StructureBuilder,
  schemaType: string,
  title: string,
  icon: typeof CogIcon,
) {
  return S.listItem()
    .title(title)
    .id(schemaType)
    .icon(icon)
    .child(S.document().schemaType(schemaType).documentId(schemaType).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Kaaya')
    .items([
      singletonItem(S, 'siteSettings', 'Site settings', CogIcon),
      singletonItem(S, 'loyaltySettings', 'Loyalty', StarIcon),
      singletonItem(S, 'festiveSale', 'Festive sale', ClockIcon),
      S.divider(),
      S.listItem()
        .title('Products')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Products')
            .items([
              S.listItem()
                .title('All products')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('product')
                    .title('All products')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }]),
                ),
              S.listItem()
                .title('By category')
                .icon(FolderIcon)
                .child(
                  S.documentTypeList('category')
                    .title('Categories')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                    .child((categoryId) =>
                      S.documentList()
                        .title('Products')
                        .schemaType('product')
                        .apiVersion(apiVersion)
                        .filter('_type == "product" && category._ref == $categoryId')
                        .params({ categoryId })
                        .defaultOrdering([{ field: 'title', direction: 'asc' }])
                        .initialValueTemplates([
                          S.initialValueTemplateItem('product-in-category', { categoryId }),
                        ]),
                    ),
                ),
            ]),
        ),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('edit').title('Edits'),
      S.divider(),
      S.documentTypeListItem('heroSlide').title('Hero slides'),
      S.documentTypeListItem('bannerPromo').title('Promos'),
      S.documentTypeListItem('coupon').title('Coupons'),
    ])
