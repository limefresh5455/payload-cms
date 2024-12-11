import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Product } from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { Blocks } from '../../../_components/Blocks'
import { PaywallBlocks } from '../../../_components/PaywallBlocks'
import { ProductHero } from '../../../_heros/Product'
import { generateMeta } from '../../../_utilities/generateMeta'

// Force this page to be dynamic so that Next.js does not cache it
export const dynamic = 'force-dynamic'

export default async function Product({ params: { slug } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null

  try {
    // Fetch product with depth to include variantCombinations relationships
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: isDraftMode,
      depth: 1, // Adjust depth as needed to resolve nested relationships
    })
  } catch (error) {
    console.error('Error fetching product:', error)
  }
  console.log('Fetched product:', JSON.stringify(product, null, 2))

  if (!product) {
    notFound()
  }

  const { layout, relatedProducts, variantCombinations = [] } = product

  return (
    <React.Fragment>
      <ProductHero product={product} />
      {/* Variant Combinations Section */}
      <div className="variant-selector">
        <h3>Select Variant</h3>
        {variantCombinations.length > 0 ? (
          <select>
            <option value="" disabled>
              Select a variant
            </option>
            {variantCombinations.map((variant) => (
              <option key={variant.sku} value={variant.sku}>
                {variant.variantGroup?.title}: {variant.variant?.title} - ${variant.price}
              </option>
            ))}
          </select>
        ) : (
          <p>No variants available for this product.</p>
        )}
      </div>
      <Blocks blocks={layout} />
      {product?.enablePaywall && (
        <PaywallBlocks productSlug={slug as string} disableTopPadding />
      )}
      {/* Related Products Section */}
      <Blocks
        disableTopPadding
        blocks={[
          {
            blockType: 'relatedProducts',
            blockName: 'Related Product',
            relationTo: 'products',
            introContent: [
              {
                type: 'h4',
                children: [
                  {
                    text: 'Related Products',
                  },
                ],
              },
            ],
            docs: relatedProducts,
          },
        ]}
      />
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const products = await fetchDocs('products')
    return products?.map(({ slug }) => slug)
  } catch (error) {
    console.error('Error fetching product slugs:', error)
    return []
  }
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null

  try {
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: isDraftMode,
      depth: 1, // Ensure metadata fetch includes depth
    })
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  return generateMeta({ doc: product })
}
