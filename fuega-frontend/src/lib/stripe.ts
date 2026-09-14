import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error('VITE_STRIPE_PUBLISHABLE_KEY environment variable is not set');
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}