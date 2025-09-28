// app/api/products/recommended/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const excludeId = searchParams.get('excludeId'); // ID du produit à exclure

    // Récupérer les produits recommandés basés sur:
    // 1. Produits vedettes
    // 2. Produits les mieux notés
    // 3. Produits populaires (avec le plus de favoris)
    const recommendedProducts = await prisma.product.findMany({
      where: {
        AND: [
          { available: true },
          excludeId ? { id: { not: excludeId } } : {},
          {
            OR: [
              { featured: true },
              { isNewIn: true },
              // Produits avec des bonnes notes (au moins 1 avis avec note >= 4)
              {
                reviews: {
                  some: {
                    rating: { gte: 4 },
                    isVisible: true,
                  },
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: true,
        brand: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            reviews: {
              where: {
                isVisible: true,
              },
            },
          },
        },
      },
      take: limit,
      orderBy: [
        { featured: 'desc' }, // Produits vedettes en premier
        { isNewIn: 'desc' }, // Puis nouveautés
        { createdAt: 'desc' }, // Puis par date
      ],
    });

    return NextResponse.json({
      success: true,
      data: recommendedProducts,
    });

  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}