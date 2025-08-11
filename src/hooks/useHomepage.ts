// hooks/useHomePage.ts
import { useEffect, useCallback, useMemo } from 'react';
import { HomePageFilters } from '@/types/homepage';
import { useHomePageStore } from '@/store/useHomepage';

interface UseHomePageOptions {
  autoFetch?: boolean;
  filters?: HomePageFilters;
  prefetch?: boolean;
}

export const useHomePage = (options: UseHomePageOptions = {}) => {
  const {
    autoFetch = true,
    filters = {},
    prefetch = true
  } = options;

  const store = useHomePageStore();

  // Memoized selectors pour éviter les re-renders inutiles
  const data = useMemo(() => ({
    sliders: store.sliders,
    newInProducts: store.newInProducts,
    featuredProducts: store.featuredProducts,
    categories: store.categories,
    homePageData: store.homePageData
  }), [
    store.sliders,
    store.newInProducts,
    store.featuredProducts,
    store.categories,
    store.homePageData
  ]);

  const loading = useMemo(() => ({
    isLoading: store.isLoading,
    isSlidersLoading: store.isSlidersLoading,
    isNewInLoading: store.isNewInLoading,
    isFeaturedLoading: store.isFeaturedLoading,
    isCategoriesLoading: store.isCategoriesLoading,
    isAnyLoading: store.isLoading || store.isSlidersLoading || store.isNewInLoading || store.isFeaturedLoading || store.isCategoriesLoading
  }), [
    store.isLoading,
    store.isSlidersLoading,
    store.isNewInLoading,
    store.isFeaturedLoading,
    store.isCategoriesLoading
  ]);

  const errors = useMemo(() => ({
    error: store.error,
    slidersError: store.slidersError,
    newInError: store.newInError,
    featuredError: store.featuredError,
    categoriesError: store.categoriesError,
    hasError: !!(store.error || store.slidersError || store.newInError || store.featuredError || store.categoriesError)
  }), [
    store.error,
    store.slidersError,
    store.newInError,
    store.featuredError,
    store.categoriesError
  ]);

  // Actions memoized
  const actions = useMemo(() => ({
    fetchHomePageData: store.fetchHomePageData,
    fetchSliders: store.fetchSliders,
    fetchNewInProducts: store.fetchNewInProducts,
    fetchFeaturedProducts: store.fetchFeaturedProducts,
    fetchCategories: store.fetchCategories,
    invalidateCache: store.invalidateCache,
    prefetchData: store.prefetchData,
    reset: store.reset
  }), [store]);

  // Fonction pour recharger toutes les données
  const refresh = useCallback(async (newFilters?: HomePageFilters) => {
    const filtersToUse = newFilters || filters;
    await actions.fetchHomePageData(filtersToUse);
  }, [actions, filters]);

  // Fonction pour recharger une section spécifique
  const refreshSection = useCallback(async (section: 'sliders' | 'newIn' | 'featured' | 'categories', limit?: number) => {
    switch (section) {
      case 'sliders':
        await actions.fetchSliders();
        break;
      case 'newIn':
        await actions.fetchNewInProducts(limit);
        break;
      case 'featured':
        await actions.fetchFeaturedProducts(limit);
        break;
      case 'categories':
        await actions.fetchCategories();
        break;
    }
  }, [actions]);

  // Précharger les données au montage du composant
  useEffect(() => {
    if (prefetch && !loading.isAnyLoading && !data.homePageData) {
      actions.prefetchData();
    }
  }, [prefetch, loading.isAnyLoading, data.homePageData, actions]);

  // Charger automatiquement les données au montage si autoFetch est activé
  useEffect(() => {
    if (autoFetch && !loading.isAnyLoading && !data.homePageData) {
      actions.fetchHomePageData(filters);
    }
  }, [autoFetch, loading.isAnyLoading, data.homePageData, actions, filters]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      // Pas de nettoyage automatique pour préserver le cache
      // L'utilisateur peut appeler reset() manuellement si nécessaire
    };
  }, []);

  return {
    // Data
    data,
    loading,
    errors,
    
    // Actions
    refresh,
    refreshSection,
    invalidateCache: actions.invalidateCache,
    reset: actions.reset,
    
    // Utilities
    isEmpty: !loading.isAnyLoading && !data.homePageData,
    isReady: !loading.isAnyLoading && !!data.homePageData && !errors.hasError,
    
    // Individual data access (pour la compatibilité)
    sliders: data.sliders,
    newInProducts: data.newInProducts,
    featuredProducts: data.featuredProducts,
    categories: data.categories,
    
    // Individual loading states
    isLoading: loading.isLoading,
    isSlidersLoading: loading.isSlidersLoading,
    isNewInLoading: loading.isNewInLoading,
    isFeaturedLoading: loading.isFeaturedLoading,
    isCategoriesLoading: loading.isCategoriesLoading,
    isAnyLoading: loading.isAnyLoading
  };
};