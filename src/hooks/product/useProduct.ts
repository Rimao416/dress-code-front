// hooks/useProduct.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { productService } from '@/services/product.service';
// Hook principal pour un produit
export const useProduct = (slug: string) => {
  const {
    currentProduct,
    isLoading,
    error,
    setCurrentProduct,
    setLoading,
    setError,
  } = useProductStore();

  const fetchProduct = useCallback(async (productSlug: string) => {
    if (!productSlug) return;

    try {
      setLoading(true);
      setError(null);
      
      const productData = await productService.getProductBySlug(productSlug);
      setCurrentProduct(productData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(errorMessage);
      setCurrentProduct(null);
    } finally {
      setLoading(false);
    }
  }, [setCurrentProduct, setLoading, setError]);

  useEffect(() => {
    // Ne pas faire l'appel si on a déjà le bon produit
    if (currentProduct?.slug === slug) return;
    
    fetchProduct(slug);
  }, [slug, fetchProduct]);

  return {
    product: currentProduct,
    isLoading,
    error,
  };
};

// Hook pour les produits similaires
export const useSimilarProducts = (slug: string, limit: number = 5) => {
  const {
    similarProducts,
    isLoadingSimilar,
    setSimilarProducts,
    setLoadingSimilar,
  } = useProductStore();

  const fetchSimilarProducts = useCallback(async (productSlug: string, productLimit: number) => {
    if (!productSlug) return;

    try {
      setLoadingSimilar(true);
      const products = await productService.getSimilarProducts(productSlug, productLimit);
      setSimilarProducts(products);
    } catch (err) {
      console.error('Error fetching similar products:', err);
      setSimilarProducts([]);
    } finally {
      setLoadingSimilar(false);
    }
  }, [setSimilarProducts, setLoadingSimilar]);

  useEffect(() => {
    fetchSimilarProducts(slug, limit);
  }, [slug, limit, fetchSimilarProducts]);

  return {
    similarProducts,
    isLoading: isLoadingSimilar,
  };
};

// Hook pour les produits recommandés
export const useRecommendedProducts = (slug: string, limit: number = 5) => {
  const {
    recommendedProducts,
    isLoadingRecommended,
    setRecommendedProducts,
    setLoadingRecommended,
  } = useProductStore();

  const fetchRecommendedProducts = useCallback(async (productSlug: string, productLimit: number) => {
    if (!productSlug) return;

    try {
      setLoadingRecommended(true);
      const products = await productService.getRecommendedProducts(productSlug, productLimit);
      setRecommendedProducts(products);
    } catch (err) {
      console.error('Error fetching recommended products:', err);
      setRecommendedProducts([]);
    } finally {
      setLoadingRecommended(false);
    }
  }, [setRecommendedProducts, setLoadingRecommended]);

  useEffect(() => {
    fetchRecommendedProducts(slug, limit);
  }, [slug, limit, fetchRecommendedProducts]);

  return {
    recommendedProducts,
    isLoading: isLoadingRecommended,
  };
};

// Hook pour la navigation produit (breadcrumbs)
export const useProductNavigation = () => {
  const { currentProduct } = useProductStore();
  
  const breadcrumbs = useMemo(() => {
    if (!currentProduct) return [];
    
    const crumbs = [
      { name: 'Home', href: '/' }
    ];

    // Ajouter la catégorie parent s'il y en a une
    if (currentProduct.category.parent) {
      crumbs.push({
        name: currentProduct.category.parent.name,
        href: `/categories/${currentProduct.category.parent.slug}`
      });
    }

    // Ajouter la catégorie actuelle
    crumbs.push({
      name: currentProduct.category.name,
      href: `/categories/${currentProduct.category.slug}`
    });

    // Ajouter le produit actuel
    crumbs.push({
      name: currentProduct.name,
      href: `/products/${currentProduct.slug}`
    });

    return crumbs;
  }, [currentProduct]);

  return { breadcrumbs };
};

// Hook pour les favoris
export const useFavorites = () => {
  const { favorites, toggleFavorite, isFavorite } = useProductStore();

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    favoriteCount: favorites.size,
  };
};

// Hook pour les avis produit
export const useProductReviews = () => {
  const { currentProduct } = useProductStore();

  const reviews = useMemo(() => {
    return currentProduct?.reviews || [];
  }, [currentProduct]);

  const averageRating = useMemo(() => {
    return currentProduct?.averageRating || 0;
  }, [currentProduct]);

  const reviewCount = useMemo(() => {
    return currentProduct?._count.reviews || 0;
  }, [currentProduct]);

  const hasReviews = reviewCount > 0;

  return {
    reviews,
    averageRating,
    reviewCount,
    hasReviews,
  };
};