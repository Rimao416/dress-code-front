
// app/api/orders/[id]/route.ts
import { OrderService } from '@/services/order.service';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await OrderService.getOrderById(params.id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.order,
    });

  } catch (error) {
    console.error('Erreur API get order:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}