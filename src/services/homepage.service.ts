// services/homepage.service.ts
import { HomePageData, HomePageFilters, HomePageResponse, SliderData } from '@/types/homepage';
import { ProductCardData } from '@/types/product';
import { CategoryWithProducts } from '@/types/homepage';

class HomePageService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  /**
   * Récupère toutes les données nécessaires pour la page d'accueil en une seule requête
   */
  async getHomePageData(filters: HomePageFilters = {}): Promise<HomePageResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.newInLimit) params.append('newInLimit', filters.newInLimit.toString());
      if (filters.featuredLimit) params.append('featuredLimit', filters.featuredLimit.toString());
      if (filters.categoriesLimit) params.append('categoriesLimit', filters.categoriesLimit.toString());
      if (filters.includeInactiveSliders) params.append('includeInactiveSliders', 'true');

      const response = await fetch(`${this.baseUrl}/homepage?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // On gère le cache côté service
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Récupère uniquement les sliders
   */
  async getSliders(): Promise<{ success: boolean; data?: SliderData[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sliders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching sliders:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Récupère uniquement les nouveaux produits
   */
  async getNewInProducts(limit = 12): Promise<{ success: boolean; data?: ProductCardData[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/products/new-in?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching new in products:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Récupère uniquement les produits mis en avant
   */
  async getFeaturedProducts(limit = 24): Promise<{ success: boolean; data?: ProductCardData[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/products/featured?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Récupère les catégories avec le nombre de produits
   */
  async getCategoriesWithProductCount(): Promise<{ success: boolean; data?: CategoryWithProducts[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/with-product-count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const homePageService = new HomePageService();