// app/api/payment/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderRequest } from '@/types/payment';
import { OrderService } from '@/services/order.service';
import { StripeService } from '@/services/stripe.service';

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Créer la commande
    const orderResult = await OrderService.createOrder(body);
    console.log('Commande crée:', orderResult);
    if (!orderResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande'   },
        { status: 400 }
      );
    }

    // Créer le PaymentIntent Stripe
    const paymentResult = await StripeService.createPaymentIntent(
      body.totals.totalAmount
    );

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du paiement' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: orderResult.order?.id,
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
    });

  } catch (error) {
    console.error('Erreur API create-intent:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

