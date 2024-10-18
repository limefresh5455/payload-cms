// endpoints/products.js
import Stripe from '@payloadcms/plugin-stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || ''); 

export const createStripeProduct = async (req, res) => {
  try {
    const { name, description, price, billingType, recurringInterval, recurringIntervalCount } = req.body;

    // Create product in Stripe
    const product = await stripe.products.create({
      name,
      description,
    });

    // Create a price for the product
    const priceData = {
      unit_amount: price, // price in cents
      currency: 'usd',
      recurring: billingType === 'recurring' ? { interval: recurringInterval, interval_count: recurringIntervalCount } : undefined,
      product: product.id,
    };

    const priceResponse = await stripe.prices.create(priceData);

    // Return the created product and price data
    res.status(201).json({ product, price: priceResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStripeProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description } = req.body;

  try {
    // Update product in Stripe
    const product = await stripe.products.update(productId, { name, description });

    // Return updated product
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStripeProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    // Delete product from Stripe
    const deletedProduct = await stripe.products.del(productId);

    // Return deleted product confirmation
    res.status(200).json({ deleted: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
