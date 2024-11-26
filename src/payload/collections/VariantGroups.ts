import type { CollectionConfig } from 'payload/types'

const VariantGroups: CollectionConfig = {
  slug: 'variant-groups',
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
      name: 'description',
      type: 'text',
    },
    // {
    //   name: 'variants',
    //   type: 'relationship',
    //   relationTo: 'variants',
    //   required: true,
    //   hasMany: true,
    // },
  ],
}

export default VariantGroups
