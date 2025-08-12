// services/stripeService.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil', // Version API mise à jour
  typescript: true,
});

export class StripeService {
  static async createPaymentIntent(
    amount: number, 
    currency = 'eur',
    metadata: Record<string, string> = {}
  ) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe utilise les centimes
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          integration_check: 'accept_a_payment',
          ...metadata, // Ajouter les métadonnées personnalisées
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

  // Nouvelle méthode pour récupérer les détails d'un paiement
  static async getPaymentDetails(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: true,
        paymentIntent,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      console.error('Erreur récupération détails paiement:', error);
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

  // Webhook handler pour gérer les événements Stripe
  static async handleWebhook(body: string, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }

    try {
      const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      
      return {
        success: true,
        event,
      };
    } catch (error) {
      console.error('Erreur validation webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }
}

// Types pour votre application
export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}