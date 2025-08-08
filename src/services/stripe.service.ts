// services/stripeService.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export class StripeService {
  static async createPaymentIntent(amount: number, currency = 'eur') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe utilise les centimes
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          integration_check: 'accept_a_payment',
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Erreur création PaymentIntent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  static async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        paymentIntent,
      };
    } catch (error) {
      console.error('Erreur confirmation paiement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  static async createRefund(paymentIntentId: string, amount?: number) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        success: true,
        refund,
      };
    } catch (error) {
      console.error('Erreur remboursement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }
}