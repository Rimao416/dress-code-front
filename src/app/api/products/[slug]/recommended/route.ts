import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

async function getRecommendedProductsData(productSlug: string, limit = 5) {
  try {
    // Récupérer le produit actuel pour obtenir ses infos
    const currentProduct = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: { id: true, categoryId: true, brandId: true },
    })

    if (!currentProduct) {
      return []
    }

    return await prisma.product.findMany({
      where: {
        available: true,
        id: {
          not: currentProduct.id,
        },
        OR: [
          // Produits de la même marque
          currentProduct.brandId ? {
            brandId: currentProduct.brandId,
          } : {},
          // Produits populaires (avec beaucoup d'avis positifs)
          {
            reviews: {
              some: {
                isVisible: true,
                rating: {
                  gte: 4, // Avis >= 4 étoiles
                },
              },
            },
          },
          // Produits mis en avant
          {
            featured: true,
          },
          // Nouveautés
          {
            isNewIn: true,
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
        featured: true,
        isNewIn: true,
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
      orderBy: [
        { featured: 'desc' },
        { isNewIn: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des produits recommandés:', error)
    return []
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Slug requis' },
        { status: 400 }
      )
    }

    const recommendedProducts = await getRecommendedProductsData(slug, limit)

    return NextResponse.json({
      success: true,
      data: recommendedProducts
    })

  } catch (error) {
    console.error('Erreur API produits recommandés:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}