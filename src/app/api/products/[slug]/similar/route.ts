// app/api/products/[slug]/similar/route.ts - Route similaires optimisée
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

async function getSimilarProductsData(productSlug: string, limit = 5) {
  try {
    // Récupérer seulement l'ID et categoryId du produit actuel
    const currentProduct = await prisma.product.findUnique({
      where: { 
        slug: productSlug,
        available: true 
      },
      select: { 
        id: true, 
        categoryId: true 
      },
    })

    if (!currentProduct) {
      return []
    }

    // Requête simplifiée pour les produits similaires
    const similarProducts = await prisma.product.findMany({
      where: {
        available: true,
        categoryId: currentProduct.categoryId,
        id: {
          not: currentProduct.id,
        },
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
        { createdAt: 'desc' },
      ],
      take: Math.min(limit, 10), // Limiter à 10 max
    })

    return similarProducts
  } catch (error) {
    console.error('Erreur lors de la récupération des produits similaires:', error)
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

    const similarProducts = await getSimilarProductsData(slug.trim(), limit)

    return NextResponse.json({
      success: true,
      data: similarProducts
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

  } catch (error) {
    console.error('Erreur API produits similaires:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la récupération des produits similaires',
        data: [] 
      },
      { status: 200 } // Retourner 200 avec array vide plutôt qu'une erreur
    )
  }
}
