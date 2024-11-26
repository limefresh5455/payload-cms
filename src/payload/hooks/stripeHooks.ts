import { Stripe } from 'stripe'; // Correctly import Stripe
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Instantiate the Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-08-01',
});

export const beforeChangeHook = async ({ data, operation }) => {
  try {
    if (operation === 'create') {
      // Create Stripe product and price when a new product is added
      const product = await stripe.products.create({
        name: data.name,
        description: data.description,
        images: data.image ? [data.image.url] : [], // Optional: use the uploaded image URL
      });

      const price = await stripe.prices.create({
        unit_amount: data.price,
        currency: 'usd', // Set your currency here
        product: product.id,
        recurring: data.billingType === 'recurring' ? {
          interval: data.recurringInterval,
          interval_count: data.recurringIntervalCount || 1,
        } : undefined,
      });

      data.stripeProductId = product.id; // Store Stripe product ID
    } else if (operation === 'update') {
      // Update Stripe product and price when a product is updated
      await stripe.products.update(data.stripeProductId, {
        name: data.name,
        description: data.description,
        images: data.image ? [data.image.url] : [],
      });

    }      // Create a new price instead of updating an existing one
      await stripe.prices.create({
        unit_amount: data.price,
        currency: 'usd',
        product: data.stripeProductId,
        recurring: data.billingType === 'recurring' ? {
          interval: data.recurringInterval,
          interval_count: data.recurringIntervalCount || 1,
        } : undefined,
      });

  } catch (error) {
    console.error("Error interacting with Stripe:", error);
  }
};

export const afterDeleteHook = async ({ data }) => {
  try {
    // Delete Stripe product when deleted in CMS
    await stripe.products.del(data.stripeProductId);
  } catch (error) {
    console.error("Error deleting Stripe product:", error);
  }
};
