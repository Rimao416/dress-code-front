// app/api/payment/create-intent/route.ts
import { StripeService } from '@/services/stripe.service';
import { NextRequest, NextResponse } from 'next/server';

interface CreatePaymentRequest {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    country: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    productId: string;
    variantId?: string;
    variantInfo?: any;
  }>;
  totals: {
    subtotal: number;
    shippingCost: number;
    taxAmount: number;
    totalAmount: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentRequest = await request.json();
   
    console.log('Création du PaymentIntent pour:', {
      email: body.formData.email,
      montant: body.totals.totalAmount,
      items: body.items.length
    });

    // Utiliser StripeService au lieu de stripe directement
    const paymentResult = await StripeService.createPaymentIntent(
      body.totals.totalAmount,
      'eur',
      {
        // Stocker les informations de commande dans les métadonnées Stripe
        customer_email: body.formData.email,
        customer_name: `${body.formData.firstName} ${body.formData.lastName}`,
        customer_phone: body.formData.phone || '',
        shipping_address: body.formData.address,
        shipping_country: body.formData.country,
        shipping_method: body.shippingMethod,
        items_count: body.items.length.toString(),
        subtotal: body.totals.subtotal.toString(),
        shipping_cost: body.totals.shippingCost.toString(),
        tax_amount: body.totals.taxAmount.toString(),
        // Stripe limite les métadonnées, on stocke les items essentiels
        items_summary: body.items.map(item => `${item.name}(${item.quantity})`).join(', ').substring(0, 500)
      }
    );

    if (!paymentResult.success) {
      console.error('Erreur PaymentIntent:', paymentResult.error);
      return NextResponse.json(
        { error: paymentResult.error || 'Erreur lors de la création du paiement' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
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