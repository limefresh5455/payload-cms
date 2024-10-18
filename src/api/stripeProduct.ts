// src/api/stripeProduct.ts
import { Request, Response } from 'express';
import Stripe from 'stripe';
import payload from 'payload';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
});

// Create a product in Stripe
export const createStripeProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    billingType,
    recurringInterval,
    recurringIntervalCount,
    image, // Assuming you want to use this later for something
  } = req.body;

  try {
    // Create the product in Stripe
    const product = await stripe.products.create({
      name,
      description,
      images: image ? [image] : [], // Add image if provided
    });

    let priceObject;

    if (billingType === 'oneoff') {
      // Create a one-time price
      priceObject = await stripe.prices.create({
        unit_amount: price,
        currency: 'usd', // Adjust currency if necessary
        product: product.id,
      });
    } else if (billingType === 'recurring') {
      // Create a recurring price
      priceObject = await stripe.prices.create({
        unit_amount: price,
        currency: 'usd', // Adjust currency if necessary
        product: product.id,
        recurring: {
          interval: recurringInterval,
          interval_count: recurringIntervalCount || 1, // Default to 1 if not provided
        },
      });
    }

    // Optionally, save the product and priceObject IDs in Payload
    await payload.create({
      collection: 'stripeproducts', // Your collection slug
      data: {
        name,
        description,
        price,
        stripeProductId: product.id, // Store Stripe product ID
        image,
        billingType,
        recurringInterval,
        recurringIntervalCount,
      },
    });

    return res.status(200).json({ product, price: priceObject });
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    return res.status(500).json({ error: error.message });
  }
};
