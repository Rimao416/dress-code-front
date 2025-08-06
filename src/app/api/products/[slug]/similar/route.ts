import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

async function getSimilarProductsData(productSlug: string, limit = 5) {
  try {
    // D'abord récupérer le produit pour obtenir sa catégorie
    const currentProduct = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: { id: true, categoryId: true },
    })

    if (!currentProduct) {
      return []
    }

    // Récupérer les produits similaires
    return await prisma.product.findMany({
      where: {
        available: true,
        id: {
          not: currentProduct.id, // Exclure le produit actuel
        },
        OR: [
          {
            categoryId: currentProduct.categoryId, // Même catégorie
          },
          {
            category: {
              parentId: {
                in: await prisma.category
                  .findUnique({
                    where: { id: currentProduct.categoryId },
                    select: { parentId: true },
                  })
                  .then((cat) => cat?.parentId ? [cat.parentId] : []),
              },
            },
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
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des produits similaires:', error)
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

    const similarProducts = await getSimilarProductsData(slug, limit)

    return NextResponse.json({
      success: true,
      data: similarProducts
    })

  } catch (error) {
    console.error('Erreur API produits similaires:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}