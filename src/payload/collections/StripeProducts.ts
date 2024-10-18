import type { CollectionConfig } from 'payload/types'

const StripeProducts: CollectionConfig = {
  slug: 'stripe-products',
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
    },
  ],
}

export default StripeProducts
