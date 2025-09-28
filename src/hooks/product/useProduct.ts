// hooks/useProduct.ts
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { productService } from '@/services/product.service';

// Hook principal pour un produit - simplifié
export const useProduct = (slug: string) => {
  const {
    currentProduct,
    isLoading,
    error,
    setCurrentProduct,
    setLoading,
    setError,
  } = useProductStore();

  const fetchedSlugRef = useRef<string | null>(null);

  const fetchProduct = useCallback(async (productSlug: string) => {
    if (!productSlug || fetchedSlugRef.current === productSlug) return;
    
    // Marquer comme en cours de fetch
    fetchedSlugRef.current = productSlug;
    
    setLoading(true);
    setError(null);
    
    try {
      const productData = await productService.getProductBySlug(productSlug);
      setCurrentProduct(productData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(errorMessage);
      setCurrentProduct(null);
      fetchedSlugRef.current = null; // Reset on error to allow retry
    } finally {
      setLoading(false);
    }
  }, [setCurrentProduct, setLoading, setError]);

  useEffect(() => {
    if (!slug) return;
    
    // Reset si on change de produit
    if (currentProduct?.slug !== slug) {
      fetchedSlugRef.current = null;
    }
    
    fetchProduct(slug);
  }, [slug, fetchProduct, currentProduct?.slug]);

  return {
    product: currentProduct,
    isLoading,
    error,
    refetch: () => {
      fetchedSlugRef.current = null;
      fetchProduct(slug);
    },
  };
};

// Hook pour les produits similaires - version simple
export const useSimilarProducts = (slug: string, limit: number = 5) => {
  const {
    similarProducts,
    isLoadingSimilar,
    setSimilarProducts,
    setLoadingSimilar,
  } = useProductStore();

  const fetchedDataRef = useRef<{ slug: string; limit: number } | null>(null);

  const fetchSimilarProducts = useCallback(async (productSlug: string, productLimit: number) => {
    if (!productSlug) return;

    // Éviter les requêtes dupliquées
    const currentFetch = { slug: productSlug, limit: productLimit };
    if (fetchedDataRef.current && 
        fetchedDataRef.current.slug === productSlug && 
        fetchedDataRef.current.limit === productLimit) {
      return;
    }

    fetchedDataRef.current = currentFetch;
    setLoadingSimilar(true);
    
    try {
      const products = await productService.getSimilarProducts(productSlug, productLimit);
      setSimilarProducts(products);
    } catch (error) {
      console.error('Error fetching similar products:', error);
      setSimilarProducts([]);
      fetchedDataRef.current = null; // Reset on error
    } finally {
      setLoadingSimilar(false);
    }
  }, [setSimilarProducts, setLoadingSimilar]);

  useEffect(() => {
    if (!slug) {
      setSimilarProducts([]);
      return;
    }

    // Débounce pour éviter les appels trop rapides
    const timer = setTimeout(() => {
      fetchSimilarProducts(slug, limit);
    }, 100);

    return () => clearTimeout(timer);
  }, [slug, limit, fetchSimilarProducts, setSimilarProducts]);

  return {
    similarProducts,
    isLoading: isLoadingSimilar,
    refetch: () => {
      fetchedDataRef.current = null;
      fetchSimilarProducts(slug, limit);
    },
  };
};

// Hook pour les produits recommandés - version simple
export const useRecommendedProducts = (slug: string, limit: number = 5) => {
  const {
    recommendedProducts,
    isLoadingRecommended,
    setRecommendedProducts,
    setLoadingRecommended,
  } = useProductStore();

  const fetchedDataRef = useRef<{ slug: string; limit: number } | null>(null);

  const fetchRecommendedProducts = useCallback(async (productSlug: string, productLimit: number) => {
    if (!productSlug) return;

    // Éviter les requêtes dupliquées
    const currentFetch = { slug: productSlug, limit: productLimit };
    if (fetchedDataRef.current && 
        fetchedDataRef.current.slug === productSlug && 
        fetchedDataRef.current.limit === productLimit) {
      return;
    }

    fetchedDataRef.current = currentFetch;
    setLoadingRecommended(true);
    
    try {
      const products = await productService.getRecommendedProducts(productSlug, productLimit);
      setRecommendedProducts(products);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
      setRecommendedProducts([]);
      fetchedDataRef.current = null; // Reset on error
    } finally {
      setLoadingRecommended(false);
    }
  }, [setRecommendedProducts, setLoadingRecommended]);

  useEffect(() => {
    if (!slug) {
      setRecommendedProducts([]);
      return;
    }

    // Débounce pour éviter les appels trop rapides
    const timer = setTimeout(() => {
      fetchRecommendedProducts(slug, limit);
    }, 100);

    return () => clearTimeout(timer);
  }, [slug, limit, fetchRecommendedProducts, setRecommendedProducts]);

  return {
    recommendedProducts,
    isLoading: isLoadingRecommended,
    refetch: () => {
      fetchedDataRef.current = null;
      fetchRecommendedProducts(slug, limit);
    },
  };
};

// Hook pour la navigation produit - optimisé
export const useProductNavigation = () => {
  const { currentProduct } = useProductStore();
  
  const breadcrumbs = useMemo(() => {
    if (!currentProduct) return [];
    
    const crumbs = [
      { name: 'Home', href: '/' }
    ];

    // Vérifier si les données de catégorie existent avant de les utiliser
    if (currentProduct.category) {
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
    }

    // Ajouter le produit actuel
    crumbs.push({
      name: currentProduct.name,
      href: `/products/${currentProduct.slug}`
    });

    return crumbs;
  }, [currentProduct]);

  return { breadcrumbs };
};

// Hook pour les favoris - simple et efficace
export const useFavorites = () => {
  const { favorites, toggleFavorite, isFavorite } = useProductStore();

  return {
    favorites: Array.from(favorites),
    toggleFavorite: useCallback((productId: string) => {
      toggleFavorite(productId);
    }, [toggleFavorite]),
    isFavorite: useCallback((productId: string) => {
      return isFavorite(productId);
    }, [isFavorite]),
    favoriteCount: favorites.size,
  };
};

// Hook pour les avis produit - optimisé
export const useProductReviews = () => {
  const { currentProduct } = useProductStore();

  const reviews = useMemo(() => {
    return currentProduct?.reviews || [];
  }, [currentProduct?.reviews]);

  const averageRating = useMemo(() => {
    return currentProduct?.averageRating || 0;
  }, [currentProduct?.averageRating]);

  const reviewCount = useMemo(() => {
    return currentProduct?._count?.reviews || 0;
  }, [currentProduct?._count?.reviews]);

  const hasReviews = reviewCount > 0;

  return {
    reviews,
    averageRating,
    reviewCount,
    hasReviews,
  };
};