// app/api/payment/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentMethod } from '@/generated/prisma';
import { OrderService } from '@/services/order.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, formData, shippingMethod, paymentMethod, items, totals } = body;

    // Validation des données
    if (!clientId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Données manquantes: clientId ou items requis' },
        { status: 400 }
      );
    }

    // Validation des totaux
    if (!totals || typeof totals.totalAmount !== 'number') {
      return NextResponse.json(
        { error: 'Totaux invalides' },
        { status: 400 }
      );
    }

    console.log('Création de commande pour:', clientId);
    console.log('Items:', items.length);
    console.log('Total:', totals.totalAmount);

    // 1. Créer la commande dans la base de données
    const orderResult = await OrderService.createOrder({
      clientId,
      formData,
      shippingMethod,
      paymentMethod: paymentMethod as PaymentMethod,
      items,
      totals,
    });

    if (!orderResult.success || !orderResult.order) {
      console.error('Erreur création commande:', orderResult.error);
      return NextResponse.json(
        { error: orderResult.error || 'Erreur lors de la création de la commande' },
        { status: 500 }
      );
    }

    const order = orderResult.order;
    console.log('✅ Commande créée:', order.id, order.orderNumber);

    // 2. Créer l'intention de paiement Stripe
    const amountInCents = Math.round(totals.totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        clientId: clientId,
      },
      description: `Commande ${order.orderNumber}`,
      shipping: {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone || undefined,
        address: {
          line1: formData.address,
          country: formData.country,
        },
      },
    });

    console.log('✅ PaymentIntent créé:', paymentIntent.id);

    // 3. Mettre à jour la commande avec le PaymentIntent ID
    await OrderService.updateOrderWithPaymentIntent(
      order.id,
      paymentIntent.id
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('❌ Erreur create-intent:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur serveur',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}