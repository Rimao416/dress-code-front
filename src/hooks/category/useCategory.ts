// hooks/useCategory.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useCategoryStore } from '@/store/useCategoryStore';
import { categoryService } from '@/services/category.service';

export const useCategory = (slug: string) => {
  const {
    currentCategory,
    isLoading,
    error,
    setCurrentCategory,
    setLoading,
    setError,
    reset
  } = useCategoryStore();

  // Mémoiser la fonction pour éviter les re-créations inutiles
  const fetchCategory = useCallback(async (categorySlug: string) => {
    if (!categorySlug) return;

    try {
      setLoading(true);
      setError(null);
      
      const categoryData = await categoryService.getCategoryBySlug(categorySlug);
      setCurrentCategory(categoryData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category';
      setError(errorMessage);
      setCurrentCategory(null);
    } finally {
      setLoading(false);
    }
  }, [setCurrentCategory, setLoading, setError]); // Dépendances stables

  useEffect(() => {
    // Ne pas faire l'appel si on a déjà la bonne catégorie
    if (currentCategory?.slug === slug) return;
    
    fetchCategory(slug);
    
    // Pas besoin de cleanup function ici car elle cause des problèmes
  }, [slug, fetchCategory]); // Simplifier les dépendances

  return {
    category: currentCategory,
    isLoading,
    error,
  };
};

// hooks/useCategoryNavigation.ts
export const useCategoryNavigation = () => {
  const { currentCategory } = useCategoryStore();
  
  // Utiliser useMemo pour éviter les recalculs inutiles
  const breadcrumbs = useMemo(() => {
    if (!currentCategory) return [];
    
    return [
      { name: 'Home', href: '/' },
      { name: currentCategory.name, href: `/categories/${currentCategory.slug}` }
    ];
  }, [currentCategory]);

  const subcategories = useMemo(() => 
    currentCategory?.children.filter(child => child.isActive) || []
  , [currentCategory]);

  const hasSubcategories = subcategories.length > 0;

  return {
    breadcrumbs,
    subcategories,
    hasSubcategories
  };
};