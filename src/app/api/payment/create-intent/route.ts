// app/api/payment/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderRequest } from '@/types/payment';
import { OrderService } from '@/services/order.service';
import { StripeService } from '@/services/stripe.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { totals, formData, items } = body;

    // Créer le PaymentIntent Stripe directement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totals.totalAmount * 100), // Montant en centimes
      currency: 'eur',
      metadata: {
        // Stocker les informations importantes dans les métadonnées
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone || '',
        shippingAddress: JSON.stringify({
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        }),
        orderItems: JSON.stringify(items),
        subtotal: totals.subtotal.toString(),
        shipping: totals.shippingCost.toString(),
        tax: totals.taxAmount.toString(),
        total: totals.totalAmount.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Erreur API create-intent:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}

