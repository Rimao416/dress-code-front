// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession, isLoggedIn } from '@/lib/auth/session';
import { OrderService } from '@/services/order.service';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Vérifier la session
    const session = await getSession();
    
    if (!isLoggedIn(session) || !session.userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer le clientId depuis la session
    // Comme la session contient userId, on doit d'abord récupérer le client
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        client: {
          select: { id: true }
        }
      }
    });

    if (!user?.client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les commandes du client
    const result = await OrderService.getClientOrders(user.client.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de la récupération des commandes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: result.orders || []
    });

  } catch (error) {
    console.error('❌ Erreur API orders:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}