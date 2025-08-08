// app/api/payment/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PaymentStatus } from '@/generated/prisma';
import { OrderService } from '@/services/order.service';
import { StripeService } from '@/services/stripe.service';
export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, orderId } = await request.json();

    // Confirmer le paiement avec Stripe
    const paymentResult = await StripeService.confirmPayment(paymentIntentId);
    
    if (!paymentResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la confirmation du paiement' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut de la commande
    const paymentStatus = paymentResult.status === 'succeeded' 
      ? PaymentStatus.COMPLETED 
      : PaymentStatus.FAILED;

    const orderResult = await OrderService.updateOrderPaymentStatus(
      orderId,
      paymentStatus,
      paymentIntentId
    );

    if (!orderResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la commande' },
        { status: 400 }
      );
    }

    // Si le paiement est réussi, vider le panier
    if (paymentStatus === PaymentStatus.COMPLETED && orderResult.order) {
      await OrderService.clearCart(orderResult.order.clientId);
    }

    return NextResponse.json({
      success: true,
      paymentStatus: paymentResult.status,
      order: orderResult.order,
    });

  } catch (error) {
    console.error('Erreur API confirm:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
