import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '24');

    const products = await prisma.product.findMany({
      where: {
        available: true,
        featured: true,
        stock: { gt: 0 }
      },
      take: limit,
      orderBy: [
        { createdAt: 'desc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: true,
        stock: true,
        featured: true,
        isNewIn: true,
        brand: {
          select: {
            name: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: products
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' // 2min cache, 5min SWR
      }
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch featured products'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
