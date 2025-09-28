// app/api/products/[slug]/route.ts - Route principale optimisée
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ slug: string }>
}

// Configuration pour désactiver le cache
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

// Fonction optimisée pour récupérer un produit
async function getProductData(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        available: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        shortDescription: true,
        price: true,
        comparePrice: true,
        images: true,
        sku: true,
        stock: true,
        featured: true,
        isNewIn: true,
        tags: true,
        slug: true,
        weight: true,
        dimensions: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
          },
        },
        variants: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            size: true,
            color: true,
            colorHex: true,
            material: true,
            sku: true,
            price: true,
            stock: true,
            images: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        // Récupérer seulement les 5 derniers avis
        reviews: {
          where: {
            isVisible: true,
          },
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            verified: true,
            helpful: true,
            createdAt: true,
            client: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        _count: {
          select: {
            reviews: {
              where: {
                isVisible: true,
              },
            },
            favorites: true,
          },
        },
      },
    })

    if (!product) {
      return null
    }

    // Calculer la note moyenne de façon simple
    const averageRating = product.reviews.length > 0
      ? Math.round((product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length) * 10) / 10
      : 0

    return {
      ...product,
      averageRating,
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    throw new Error('Impossible de récupérer le produit')
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Slug requis et valide' 
        },
        { status: 400 }
      )
    }

    const product = await getProductData(slug.trim())

    if (!product) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Produit non trouvé ou indisponible' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: product 
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

  } catch (error) {
    console.error('Erreur API produit:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur interne'
      },
      { status: 500 }
    )
  }
}
