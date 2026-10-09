'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId, studioBasePath } from './src/sanity/env'
import { schemaTypes, singletonTypes } from './src/sanity/schema'
import { structure } from './src/sanity/structure'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'kaaya',
  title: 'Kaaya',
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
      {
        id: 'product-in-category',
        title: 'Product in category',
        schemaType: 'product',
        parameters: [{ name: 'categoryId', type: 'string' }],
        value: (parameters: { categoryId: string }) => ({
          category: { _type: 'reference', _ref: parameters.categoryId },
        }),
      },
    ],
  },
  document: {
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType)
        ? actions.filter(({ action }) => action && singletonActions.has(action))
        : actions,
    newDocumentOptions: (options, context) =>
      context.creationContext.type === 'global'
        ? options.filter(({ templateId }) => templateId !== 'product-in-category')
        : options,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
