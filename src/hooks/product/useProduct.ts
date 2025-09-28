// hooks/useProduct.ts
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProductWithFullData, ProductCardData } from '@/types/product';
import { productService } from '@/services/product.service';

interface UseProductState {
  product: ProductWithFullData | null;
  similarProducts: ProductCardData[];
  recommendedProducts: ProductCardData[];
  breadcrumbs: Array<{ name: string; href: string }>;
  isLoading: boolean;
  isLoadingSimilar: boolean;
  isLoadingRecommended: boolean;
  error: string | null;
}

interface UseProductActions {
  refetch: () => Promise<void>;
  refetchSimilar: () => Promise<void>;
  refetchRecommended: () => Promise<void>;
}

type UseProductReturn = UseProductState & UseProductActions;

export function useProduct(slug: string): UseProductReturn {
  const [product, setProduct] = useState<ProductWithFullData | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductCardData[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Génération des breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!product) {
      return [
        { name: 'Accueil', href: '/' },
        { name: 'Produits', href: '/products' }
      ];
    }
    return productService.generateBreadcrumbs(product);
  }, [product]);

  // Fonction pour charger le produit principal
  const fetchProduct = async () => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await productService.getProductBySlug(slug);
      
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError(response.error || 'Produit non trouvé');
        setProduct(null);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour charger les produits similaires
  const fetchSimilarProducts = async () => {
    if (!slug) return;
    
    setIsLoadingSimilar(true);

    try {
      const response = await productService.getSimilarProducts(slug, 4);
      
      if (response.success) {
        setSimilarProducts(response.data);
      } else {
        console.error('Error fetching similar products:', response.error);
        setSimilarProducts([]);
      }
    } catch (err) {
      console.error('Error fetching similar products:', err);
      setSimilarProducts([]);
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  // Fonction pour charger les produits recommandés
  const fetchRecommendedProducts = async () => {
    setIsLoadingRecommended(true);

    try {
      const response = await productService.getRecommendedProducts(6, product?.id);
      
      if (response.success) {
        setRecommendedProducts(response.data);
      } else {
        console.error('Error fetching recommended products:', response.error);
        setRecommendedProducts([]);
      }
    } catch (err) {
      console.error('Error fetching recommended products:', err);
      setRecommendedProducts([]);
    } finally {
      setIsLoadingRecommended(false);
    }
  };

  // Effet pour charger le produit principal
  useEffect(() => {
    fetchProduct();
  }, [slug]);

  // Effet pour charger les produits similaires
  useEffect(() => {
    if (product) {
      fetchSimilarProducts();
    }
  }, [product?.id]);

  // Effet pour charger les produits recommandés
  useEffect(() => {
    fetchRecommendedProducts();
  }, [product?.id]);

  // Fonctions de rechargement
  const refetch = async () => {
    await fetchProduct();
  };

  const refetchSimilar = async () => {
    await fetchSimilarProducts();
  };

  const refetchRecommended = async () => {
    await fetchRecommendedProducts();
  };

  return {
    product,
    similarProducts,
    recommendedProducts,
    breadcrumbs,
    isLoading,
    isLoadingSimilar,
    isLoadingRecommended,
    error,
    refetch,
    refetchSimilar,
    refetchRecommended,
  };
}

// Hook pour les utilitaires produit
export function useProductUtils(product: ProductWithFullData | null) {
  const defaultVariant = useMemo(() => {
    if (!product) return null;
    return productService.getDefaultVariant(product);
  }, [product]);

  const isVariantAvailable = (variant: any) => {
    return productService.isVariantAvailable(variant);
  };

  const getEffectivePrice = (variant?: any) => {
    if (!product) return 0;
    return productService.getEffectivePrice(product, variant);
  };

  const getAvailableVariants = () => {
    if (!product) return [];
    return product.variants.filter(variant => isVariantAvailable(variant));
  };

  const getVariantsBySizes = () => {
    if (!product) return new Map();
    
    const sizeMap = new Map();
    product.variants.forEach(variant => {
      if (variant.size && isVariantAvailable(variant)) {
        if (!sizeMap.has(variant.size)) {
          sizeMap.set(variant.size, []);
        }
        sizeMap.get(variant.size).push(variant);
      }
    });
    
    return sizeMap;
  };

  const getVariantsByColors = () => {
    if (!product) return new Map();
    
    const colorMap = new Map();
    product.variants.forEach(variant => {
      if (variant.color && isVariantAvailable(variant)) {
        if (!colorMap.has(variant.color)) {
          colorMap.set(variant.color, []);
        }
        colorMap.get(variant.color).push(variant);
      }
    });
    
    return colorMap;
  };

  return {
    defaultVariant,
    isVariantAvailable,
    getEffectivePrice,
    getAvailableVariants,
    getVariantsBySizes,
    getVariantsByColors,
  };
}