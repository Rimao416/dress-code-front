// pages/api/categories/[slug].ts ou app/api/categories/[slug]/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { CategoryResponse, CategoryWithFullData, Category, Product } from '@/types/category';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // Le type params est maintenant Promise
) {
  try {
    const { slug } = await params; // Ajout d'await pour accéder aux paramètres
    
    if (!slug) {
      return Response.json({
        success: false,
        error: 'Category slug is required'
      }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: {
        slug,
        isActive: true
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                children: {
                  where: { isActive: true },
                  orderBy: { sortOrder: 'asc' }
                },
                products: {
                  where: { available: true },
                  include: {
                    brand: true,
                    variants: {
                      where: { isActive: true },
                      orderBy: { createdAt: 'desc' }
                    }
                  },
                  orderBy: [
                    { featured: 'desc' },
                    { isNewIn: 'desc' },
                    { createdAt: 'desc' }
                  ]
                }
              }
            },
            products: {
              where: { available: true },
              include: {
                brand: true,
                variants: {
                  where: { isActive: true },
                  orderBy: { createdAt: 'desc' }
                }
              },
              orderBy: [
                { featured: 'desc' },
                { isNewIn: 'desc' },
                { createdAt: 'desc' }
              ]
            }
          }
        },
        products: {
          where: { available: true },
          include: {
            brand: true,
            variants: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: [
            { featured: 'desc' },
            { isNewIn: 'desc' },
            { createdAt: 'desc' }
          ]
        }
      }
    }) as Category | null;

    if (!category) {
      return Response.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    // Collecter tous les produits avec typage strict (sans any)
    const collectAllProducts = (cat: Category): Product[] => {
      let allProducts: Product[] = [...cat.products];
     
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach((child: Category) => {
          allProducts.push(...collectAllProducts(child));
        });
      }
     
      return allProducts;
    };

    const allProducts = collectAllProducts(category);
    
    // Supprimer les doublons avec typage strict
    const uniqueProductsMap = new Map<string, Product>();
    allProducts.forEach(product => {
      uniqueProductsMap.set(product.id, product);
    });
    const uniqueProducts = Array.from(uniqueProductsMap.values());

    const categoryWithFullData: CategoryWithFullData = {
      ...category,
      allProducts: uniqueProducts,
      totalProductsCount: uniqueProducts.length
    };

    return Response.json({
      success: true,
      data: categoryWithFullData
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}