import type { CollectionConfig } from 'payload/types'

const Variants: CollectionConfig = {
  slug: 'variants',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['variantGroup', 'title'],
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
      name: 'variantGroup',
      type: 'relationship',
      label: 'Group',
      relationTo: 'variant-groups',
      required: true,
      hasMany: false,
    },
    {
      name: 'description',
      type: 'text',
    },
    // {
    //   name: 'sku',
    //   type: 'text',
    //   required: true,
    // },
    // {
    //   name: 'price',
    //   type: 'number',
    //   required: true,
    // },
  ],
}

export default Variants
