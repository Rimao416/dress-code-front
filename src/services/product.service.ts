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
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL + '/products';
  }

  // Cache helper
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`Cache hit for: ${key}`);
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Retry helper
  private async withRetry<T>(
    operation: () => Promise<T>, 
    retries = this.MAX_RETRIES
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        console.log(`Retrying... ${this.MAX_RETRIES - retries + 1}/${this.MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.withRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    return error.name === 'AbortError' || 
           error.message?.includes('timeout') ||
           error.message?.includes('fetch');
  }

  async getProductBySlug(slug: string): Promise<ProductWithFullData> {
    if (!slug?.trim()) {
      throw new Error('Slug is required');
    }

    const cacheKey = `product_${slug}`;
    const cached = this.getCachedData<ProductWithFullData>(cacheKey);
    if (cached) return cached;

    return this.withRetry(async () => {
      console.log(`Fetching product: ${slug}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Réduit à 15s

      try {
        const response = await fetch(`${this.baseUrl}/${encodeURIComponent(slug)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          signal: controller.signal,
          cache: 'no-store'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {}
          throw new Error(errorMessage);
        }

        const result: ProductResponse = await response.json();

        if (!result.success || !result.data) {
          throw new Error(result.error || 'No product data received');
        }

        // Cache the result
        this.setCachedData(cacheKey, result.data);
        console.log(`Product cached: ${result.data.name}`);
        
        return result.data;

      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timeout: Server response too slow');
        }
        throw fetchError;
      }
    });
  }

  async getSimilarProducts(slug: string, limit: number = 5): Promise<ProductCardData[]> {
    if (!slug?.trim()) return [];

    const cacheKey = `similar_${slug}_${limit}`;
    const cached = this.getCachedData<ProductCardData[]>(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.withRetry(async () => {
        console.log(`Fetching similar products: ${slug}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // Réduit à 8s

        try {
          const response = await fetch(
            `${this.baseUrl}/${encodeURIComponent(slug)}/similar?limit=${limit}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              signal: controller.signal,
              cache: 'no-store'
            }
          );

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
            throw new Error('Similar products request timeout');
          }
          throw fetchError;
        }
      });

      this.setCachedData(cacheKey, result);
      return result;

    } catch (error) {
      console.warn('Similar products failed:', error);
      return []; // Graceful fallback
    }
  }

  async getRecommendedProducts(slug: string, limit: number = 5): Promise<ProductCardData[]> {
    if (!slug?.trim()) return [];

    const cacheKey = `recommended_${slug}_${limit}`;
    const cached = this.getCachedData<ProductCardData[]>(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.withRetry(async () => {
        console.log(`Fetching recommended products: ${slug}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          const response = await fetch(
            `${this.baseUrl}/${encodeURIComponent(slug)}/recommended?limit=${limit}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              signal: controller.signal,
              cache: 'no-store'
            }
          );

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
            throw new Error('Recommended products request timeout');
          }
          throw fetchError;
        }
      });

      this.setCachedData(cacheKey, result);
      return result;

    } catch (error) {
      console.warn('Recommended products failed:', error);
      return []; // Graceful fallback
    }
  }

  // Clear cache method
  clearCache(): void {
    this.cache.clear();
    console.log('Product service cache cleared');
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}



export const productService = new ProductService();