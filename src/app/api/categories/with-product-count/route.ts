// app/api/categories/with-product-count/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null // Seulement les catégories principales
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        image: true,
        parentId: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
            parentId: true,
            isActive: true,
            sortOrder: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                products: {
                  where: { available: true }
                }
              }
            }
          }
        },
        _count: {
          select: {
            products: {
              where: { available: true }
            }
          }
        }
      }
    });

    // Transformer les données pour inclure le productCount
    const categoriesWithProductCount = categories.map(category => ({
      ...category,
      productCount: category._count.products + 
        category.children.reduce((sum, child) => sum + child._count.products, 0),
      products: [], // Pas besoin des produits complets ici
      children: category.children.map(child => ({
        ...child,
        productCount: child._count.products,
        products: [],
        children: []
      }))
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithProductCount
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' // 10min cache, 20min SWR
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}