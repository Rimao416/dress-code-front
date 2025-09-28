// services/product.service.ts
import { 
  ProductWithFullData, 
  ProductCardData, 
  ProductResponse, 
  SimilarProductsResponse, 
  RecommendedProductsResponse 
} from '@/types/product';

class ProductService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Récupère un produit par son slug
   */
  async getProductBySlug(slug: string): Promise<ProductResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/products/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { 
          revalidate: 300, // Cache pendant 5 minutes
          tags: [`product-${slug}`],
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Product not found',
          } as ProductResponse;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transformer les dates en objets Date
      if (data.success && data.data) {
        data.data = this.transformProductDates(data.data);
      }

      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product',
      } as ProductResponse;
    }
  }

  /**
   * Récupère les produits similaires
   */
  async getSimilarProducts(slug: string, limit: number = 4): Promise<SimilarProductsResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/products/${slug}/similar?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          next: { 
            revalidate: 600, // Cache pendant 10 minutes
            tags: [`similar-${slug}`],
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching similar products:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch similar products',
      };
    }
  }

  /**
   * Récupère les produits recommandés
   */
  async getRecommendedProducts(limit: number = 6, excludeId?: string): Promise<RecommendedProductsResponse> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (excludeId) {
        params.append('excludeId', excludeId);
      }

      const response = await fetch(
        `${this.baseUrl}/api/products/recommended?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          next: { 
            revalidate: 300, // Cache pendant 5 minutes
            tags: ['recommended-products'],
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recommended products:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch recommended products',
      };
    }
  }

  /**
   * Génère les breadcrumbs pour un produit
   */
  generateBreadcrumbs(product: ProductWithFullData) {
    const breadcrumbs = [
      { name: 'Accueil', href: '/' }
    ];

    // Ajouter la catégorie parent s'il y en a une
    if (product.category.parent) {
      breadcrumbs.push({
        name: product.category.parent.name,
        href: `/categories/${product.category.parent.slug}`
      });
    }

    // Ajouter la catégorie actuelle
    breadcrumbs.push({
      name: product.category.name,
      href: `/categories/${product.category.slug}`
    });

    // Ajouter le produit actuel (non cliquable)
    breadcrumbs.push({
      name: product.name,
      href: `/products/${product.slug}`
    });

    return breadcrumbs;
  }

  /**
   * Transformer les chaînes de date en objets Date
   */
  private transformProductDates(product: any): ProductWithFullData {
    return {
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
      variants: product.variants?.map((variant: any) => ({
        ...variant,
        createdAt: new Date(variant.createdAt),
        updatedAt: new Date(variant.updatedAt),
      })) || [],
      reviews: product.reviews?.map((review: any) => ({
        ...review,
        createdAt: new Date(review.createdAt),
      })) || [],
    };
  }

  /**
   * Valide la disponibilité d'une variante
   */
  isVariantAvailable(variant: any): boolean {
    return variant.isActive && variant.stock > 0;
  }

  /**
   * Trouve la variante par défaut (première variante disponible)
   */
  getDefaultVariant(product: ProductWithFullData) {
    return product.variants.find(variant => this.isVariantAvailable(variant)) || null;
  }

  /**
   * Calcule le prix effectif d'un produit (avec variante si applicable)
   */
  getEffectivePrice(product: ProductWithFullData, variant?: any): number {
    if (variant && variant.price !== null) {
      return variant.price;
    }
    return product.price;
  }
}

// Instance singleton
export const productService = new ProductService();
export default productService;