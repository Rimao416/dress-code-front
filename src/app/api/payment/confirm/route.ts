// app/api/payment/confirm/route.ts
import { PaymentStatus } from '@/generated/prisma';

import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/services/stripe.service';

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'PaymentIntent ID manquant' },
        { status: 400 }
      );
    }

    // Vérifier le statut du paiement avec Stripe
    const paymentResult = await StripeService.confirmPayment(paymentIntentId);
   
    if (!paymentResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la vérification du paiement' },
        { status: 400 }
      );
    }

    console.log('Paiement confirmé:', {
      paymentIntentId,
      status: paymentResult.status
    });

    // Optionnel : Envoyer un email de confirmation ici
    // await sendConfirmationEmail(paymentResult.paymentIntent.metadata);

    return NextResponse.json({
      success: true,
      paymentStatus: paymentResult.status,
      paymentIntentId: paymentIntentId,
      // Retourner les métadonnées pour affichage de confirmation
      orderDetails: paymentResult.paymentIntent?.metadata || {}
    });

  } catch (error) {
    console.error('Erreur API confirm:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}