import type { CollectionConfig } from 'payload/types'

const ProductVariantCombinations: CollectionConfig = {
  slug: 'product-variant-combinations',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'variantCombinations',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'variantGroup',
          type: 'relationship',
          relationTo: 'variant-groups',
        },
        {
          name: 'variant',
          type: 'relationship',
          relationTo: 'variants',
          admin: {
            condition: (_, siblingData) =>
              siblingData.variantGroup !== undefined && siblingData.variantGroup !== null,
          },
          filterOptions: ({ relationTo, data, siblingData, id }) => {
            return {
              variantGroup: {
                equals: siblingData.variantGroup,
              },
            }
          },
        },
      ],
    },
    // {
    //   name: 'variants',
    //   type: 'relationship',
    //   relationTo: 'variants',
    //   required: true,
    //   hasMany: true,
    // },
    {
      name: 'description',
      type: 'text',
    },
  ],
}

export default ProductVariantCombinations
