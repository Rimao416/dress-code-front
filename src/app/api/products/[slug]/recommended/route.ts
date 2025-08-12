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

    // SOLUTION 1: Séparer les requêtes au lieu d'utiliser OR complexe
    const queries = []

    // Produits de la même marque (si elle existe)
    if (currentProduct.brandId) {
      queries.push(
        prisma.product.findMany({
          where: {
            available: true,
            brandId: currentProduct.brandId,
            id: { not: currentProduct.id },
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
            brand: { select: { name: true } },
            category: { select: { name: true } },
          },
          take: Math.ceil(limit / 2), // Diviser la limite
        })
      )
    }

    // Produits mis en avant et nouveautés
    queries.push(
      prisma.product.findMany({
        where: {
          available: true,
          id: { not: currentProduct.id },
          OR: [
            { featured: true },
            { isNewIn: true },
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
          brand: { select: { name: true } },
          category: { select: { name: true } },
        },
        orderBy: [
          { featured: 'desc' },
          { isNewIn: 'desc' },
          { createdAt: 'desc' },
        ],
        take: Math.ceil(limit / 2),
      })
    )

    // Exécuter les requêtes en parallèle
    const results = await Promise.all(queries)
    
    // Combiner et dédupliquer les résultats
    const allProducts = results.flat()
    const uniqueProducts = Array.from(
      new Map(allProducts.map(product => [product.id, product])).values()
    )

    // Retourner seulement la limite demandée
    return uniqueProducts.slice(0, limit)

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