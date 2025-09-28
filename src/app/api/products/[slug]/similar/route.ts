// app/api/products/[slug]/similar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Récupérer le produit actuel pour obtenir sa catégorie et sa marque
    const currentProduct = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        categoryId: true,
        brandId: true,
        tags: true,
      },
    });

    if (!currentProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Trouver des produits similaires
    const similarProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: currentProduct.id } }, // Exclure le produit actuel
          { available: true },
          {
            OR: [
              { categoryId: currentProduct.categoryId }, // Même catégorie
              { brandId: currentProduct.brandId }, // Même marque
              // Même tags (au moins un en commun)
              currentProduct.tags.length > 0 ? {
                tags: {
                  hasSome: currentProduct.tags,
                },
              } : {},
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
        { createdAt: 'desc' }, // Puis par date de création
      ],
    });

    return NextResponse.json({
      success: true,
      data: similarProducts,
    });

  } catch (error) {
    console.error('Error fetching similar products:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}