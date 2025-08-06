// services/productService.ts
import { 
  ProductResponse, 
  ProductWithFullData, 
  SimilarProductsResponse,
  RecommendedProductsResponse,
  ProductCardData 
} from '@/types/product';

class ProductService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL+'/products';
  }

  async getProductBySlug(slug: string): Promise<ProductWithFullData> {
    try {
      if (!slug || slug.trim() === '') {
        throw new Error('Slug is required');
      }

      console.log(`Fetching product with slug: ${slug}`);
      
      const url = `${this.baseUrl}/${encodeURIComponent(slug)}`;
      console.log(`Request URL: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal,
          cache: 'no-store'
        });

        clearTimeout(timeoutId);
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            console.warn('Could not parse error response');
          }
          
          throw new Error(errorMessage);
        }

        const result: ProductResponse = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch product');
        }

        if (!result.data) {
          throw new Error('No product data received');
        }

        console.log('Product fetched successfully:', result.data.name);
        return result.data;

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timeout: The server took too long to respond');
        }
        
        throw fetchError;
      }

    } catch (error) {
      console.error('Error fetching product:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server');
      }
      
      throw error;
    }
  }

  async getSimilarProducts(slug: string, limit: number = 5): Promise<ProductCardData[]> {
    try {
      if (!slug || slug.trim() === '') {
        throw new Error('Slug is required');
      }

      console.log(`Fetching similar products for slug: ${slug}`);
      
      const url = `${this.baseUrl}/${encodeURIComponent(slug)}/similar?limit=${limit}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal,
          cache: 'no-store'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: SimilarProductsResponse = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch similar products');
        }

        return result.data || [];

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timeout: The server took too long to respond');
        }
        
        throw fetchError;
      }

    } catch (error) {
      console.error('Error fetching similar products:', error);
      return []; // Return empty array on error instead of throwing
    }
  }

  async getRecommendedProducts(slug: string, limit: number = 5): Promise<ProductCardData[]> {
    try {
      if (!slug || slug.trim() === '') {
        throw new Error('Slug is required');
      }

      console.log(`Fetching recommended products for slug: ${slug}`);
      
      const url = `${this.baseUrl}/${encodeURIComponent(slug)}/recommended?limit=${limit}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal,
          cache: 'no-store'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: RecommendedProductsResponse = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch recommended products');
        }

        return result.data || [];

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timeout: The server took too long to respond');
        }
        
        throw fetchError;
      }

    } catch (error) {
      console.error('Error fetching recommended products:', error);
      return []; // Return empty array on error instead of throwing
    }
  }

  // Méthode utilitaire pour tester la connexion API
  async testConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(`${this.baseUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          cache: 'no-store'
        });

        clearTimeout(timeoutId);
        return response.ok;

      } catch (fetchError) {
        clearTimeout(timeoutId);
        return false;
      }

    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

export const productService = new ProductService();