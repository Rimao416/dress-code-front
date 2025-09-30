// hooks/useFeaturedProducts.ts
import { useEffect } from 'react';
import { productService } from '@/services/product.service';
import { useProductStore } from '@/store/useProductStore';

interface UseFeaturedProductsOptions {
  limit?: number;
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useFeaturedProducts(options: UseFeaturedProductsOptions = {}) {
  const {
    limit = 4,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const {
    featuredProducts,
    isLoadingFeatured,
    setFeaturedProducts,
    setLoadingFeatured,
    setError,
  } = useProductStore();

  useEffect(() => {
    if (!enabled) return;

    const fetchFeaturedProducts = async () => {
      try {
        setLoadingFeatured(true);
        setError(null);

        const response = await productService.getFeaturedProducts(limit);

        if (response.success && response.data) {
          setFeaturedProducts(response.data);
          onSuccess?.();
        } else {
          const errorMsg = response.error || 'Failed to fetch featured products';
          setError(errorMsg);
          onError?.(errorMsg);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit, enabled]);

  return {
    products: featuredProducts,
    isLoading: isLoadingFeatured,
    error: useProductStore(state => state.error),
  };
}