// app/api/homepage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HomePageData, HomePageFilters } from '@/types/homepage';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
   
    // Extraire les paramètres avec valeurs par défaut
    const filters: HomePageFilters = {
      limit: parseInt(searchParams.get('limit') || '50'),
      newInLimit: parseInt(searchParams.get('newInLimit') || '12'),
      featuredLimit: parseInt(searchParams.get('featuredLimit') || '24'),
      categoriesLimit: parseInt(searchParams.get('categoriesLimit') || '20'),
      includeInactiveSliders: searchParams.get('includeInactiveSliders') === 'true'
    };

    // Exécuter toutes les requêtes en parallèle pour optimiser les performances
    const [sliders, newInProducts, featuredProducts, categories] = await Promise.all([
      // Récupérer les sliders actifs
      prisma.slider.findMany({
        where: {
          isActive: filters.includeInactiveSliders ? undefined : true,
          ...(filters.includeInactiveSliders ? {} : {
            OR: [
              { startDate: null },
              { startDate: { lte: new Date() } }
            ]
          }),
          ...(filters.includeInactiveSliders ? {} : {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          })
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          name: true,
          subtitle: true,
          image: true,
          buttonText: true,
          buttonLink: true,
          isActive: true,
          sortOrder: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          updatedAt: true
        }
      }),

      // Récupérer les nouveaux produits
      prisma.product.findMany({
        where: {
          available: true,
          isNewIn: true,
          stock: { gt: 0 }
        },
        take: filters.newInLimit,
        orderBy: { createdAt: 'desc' },
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
      }),

      // Récupérer les produits mis en avant
      prisma.product.findMany({
        where: {
          available: true,
          featured: true,
          stock: { gt: 0 }
        },
        take: filters.featuredLimit,
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
      }),

      // Récupérer TOUTES les catégories actives avec leur hiérarchie complète
      prisma.category.findMany({
        where: {
          isActive: true
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
            where: { 
              isActive: true 
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
                where: { 
                  isActive: true 
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
                  _count: {
                    select: {
                      products: {
                        where: { 
                          available: true 
                        }
                      }
                    }
                  }
                }
              },
              _count: {
                select: {
                  products: {
                    where: { 
                      available: true 
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              products: {
                where: { 
                  available: true 
                }
              }
            }
          }
        }
      })
    ]);

    // Fonction récursive pour calculer le nombre total de produits dans une catégorie et ses enfants
    const calculateTotalProductCount = (category: any): number => {
      let totalCount = category._count.products;
      
      if (category.children && category.children.length > 0) {
        category.children.forEach((child: any) => {
          totalCount += calculateTotalProductCount(child);
        });
      }
      
      return totalCount;
    };

    // Transformer les catégories pour inclure le nombre total de produits et structure hiérarchique
    const transformCategory = (category: any): any => ({
      ...category,
      productCount: calculateTotalProductCount(category),
      children: category.children?.map((child: any) => transformCategory(child)) || []
    });

    // Séparer les catégories principales et transformer toutes les catégories
    const allCategoriesTransformed = categories.map(transformCategory);
    
    // Filtrer seulement les catégories principales pour la réponse (si nécessaire)
    const mainCategories = allCategoriesTransformed.filter(cat => !cat.parentId);
    
    // Optionnel : Limiter le nombre de catégories principales si un filtre est appliqué
    const limitedMainCategories = filters.categoriesLimit 
      ? mainCategories.slice(0, filters.categoriesLimit)
      : mainCategories;

    const homePageData: HomePageData = {
      sliders,
      newInProducts,
      featuredProducts,
      categories: limitedMainCategories, // Catégories principales avec leurs enfants
      // Optionnel : retourner aussi toutes les catégories si besoin
      // allCategories: allCategoriesTransformed
    };

    return NextResponse.json({
      success: true,
      data: homePageData,
      meta: {
        totalCategories: categories.length,
        mainCategories: mainCategories.length,
        limitedCategories: limitedMainCategories.length
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' // Cache 2min, SWR 5min
      }
    });

  } catch (error) {
    console.error('Error fetching homepage data:', error);
   
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch homepage data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache' // Pas de cache en cas d'erreur
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}