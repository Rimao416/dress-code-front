// app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params avant d'accéder à ses propriétés
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        available: true,
      },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
        brand: true,
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
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculer la note moyenne
    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0;

    // Formatter les données pour correspondre au type ProductWithFullData
    const formattedProduct = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
    };

    return NextResponse.json({
      success: true,
      data: formattedProduct,
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}