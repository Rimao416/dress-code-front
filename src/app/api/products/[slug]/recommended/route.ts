// app/api/products/[slug]/recommended/route.ts - Route recommandées optimisée
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function getRecommendedProductsData(productSlug: string, limit = 5) {
  try {
    // Récupérer les info de base du produit actuel
    const currentProduct = await prisma.product.findUnique({
      where: { 
        slug: productSlug,
        available: true 
      },
      select: { 
        id: true, 
        brandId: true 
      },
    })

    if (!currentProduct) {
      return []
    }

    // Stratégie simple : produits populaires + même marque
    const recommendedProducts = await prisma.product.findMany({
      where: {
        available: true,
        id: {
          not: currentProduct.id,
        },
        OR: [
          // Même marque si elle existe
          currentProduct.brandId ? {
            brandId: currentProduct.brandId,
          } : {},
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
      take: Math.min(limit, 10),
    })

    return recommendedProducts
  } catch (error) {
    console.error('Erreur lors de la récupération des produits recommandés:', error)
    return []
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '5', 10), 10)

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Slug requis' 
        },
        { status: 400 }
      )
    }

    const recommendedProducts = await getRecommendedProductsData(slug.trim(), limit)

    return NextResponse.json({
      success: true,
      data: recommendedProducts
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

  } catch (error) {
    console.error('Erreur API produits recommandés:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la récupération des produits recommandés',
        data: [] 
      },
      { status: 200 } // Retourner 200 avec array vide plutôt qu'une erreur
    )
  }
}