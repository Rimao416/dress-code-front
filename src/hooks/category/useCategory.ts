// hooks/useCategory.ts
'use client';

import { useEffect } from 'react';
import { useCategoryStore } from '@/store/useCategoryStore';
import { categoryService } from '@/services/category.service';

/**
 * Hook principal pour gérer les catégories
 */
export function useCategories() {
  const {
    categories,
    isLoading,
    error,
    setCategories,
    setLoading,
    setError,
    updateLastFetch,
    shouldRefetch,
    getMainCategories,
  } = useCategoryStore();

  const fetchCategories = async (force = false) => {
    // Ne pas refetch si les données sont récentes (sauf si force = true)
    if (!force && categories.length > 0 && !shouldRefetch()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.getCategoriesWithProducts();
      
      if (response.success) {
        setCategories(response.data);
        updateLastFetch();
      } else {
        setError(response.error || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories au montage si nécessaire
  useEffect(() => {
    if (categories.length === 0 || shouldRefetch()) {
      fetchCategories();
    }
  }, []);

  return {
    categories,
    mainCategories: getMainCategories(),
    isLoading,
    error,
    refetch: () => fetchCategories(true),
  };
}

/**
 * Hook pour récupérer une catégorie spécifique par slug
 */
export function useCategory(slug: string) {
  const {
    currentCategory,
    isLoadingCurrent,
    error,
    setCurrentCategory,
    setLoadingCurrent,
    setError,
    getCategoryBySlug,
  } = useCategoryStore();

  const fetchCategory = async () => {
    if (!slug) return;

    // Vérifier d'abord dans le store
    const cachedCategory = getCategoryBySlug(slug);
    if (cachedCategory) {
      // On a la catégorie en cache, mais elle n'a peut-être pas tous les produits
      // On charge quand même la version complète
    }

    setLoadingCurrent(true);
    setError(null);

    try {
      const response = await categoryService.getCategoryBySlug(slug);
      
      if (response.success && response.data) {
        setCurrentCategory(response.data);
      } else {
        setError(response.error || 'Category not found');
        setCurrentCategory(null);
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch category');
      setCurrentCategory(null);
    } finally {
      setLoadingCurrent(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [slug]);

  return {
    category: currentCategory,
    isLoading: isLoadingCurrent,
    error,
    refetch: fetchCategory,
  };
}

/**
 * Hook pour les utilitaires de catégories
 */
export function useCategoryUtils() {
  const { getCategoryBySlug, getCategoryById } = useCategoryStore();

  return {
    getCategoryBySlug,
    getCategoryById,
    generateBreadcrumbs: categoryService.generateCategoryBreadcrumbs,
    countTotalProducts: categoryService.countTotalProducts,
    flattenCategories: categoryService.flattenCategories,
    sortCategories: categoryService.sortCategories,
  };
}

/**
 * Hook pour chercher des catégories
 */
export function useCategorySearch(query: string) {
  const { categories } = useCategoryStore();

  const searchCategories = () => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: any[] = [];

    const search = (cats: any[]) => {
      cats.forEach(cat => {
        if (
          cat.name.toLowerCase().includes(lowerQuery) ||
          cat.description?.toLowerCase().includes(lowerQuery)
        ) {
          results.push(cat);
        }
        if (cat.children && cat.children.length > 0) {
          search(cat.children);
        }
      });
    };

    search(categories);
    return results;
  };

  return {
    results: searchCategories(),
    hasResults: searchCategories().length > 0,
  };
}