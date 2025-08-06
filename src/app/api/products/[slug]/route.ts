import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ slug: string }>
}

// Fonction helper pour récupérer les données du produit
async function getProductData(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        available: true, // Seulement les produits disponibles
      },
      include: {
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
          orderBy: {
            createdAt: 'asc',
          },
        },
        reviews: {
          where: {
            isVisible: true,
          },
          include: {
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
          take: 10, // Limiter à 10 avis récents
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

    // Calcul de la note moyenne
    const averageRating = product.reviews.length > 0
      ? Math.round((product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length) * 10) / 10
      : 0

    return {
      ...product,
      averageRating,
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    throw error
  }
}

// GET: Récupérer un produit par slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Slug requis' },
        { status: 400 }
      )
    }

    const product = await getProductData(slug)

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: product 
    })

  } catch (error) {
    console.error('Erreur API produit:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
