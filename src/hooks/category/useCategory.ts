// hooks/useCategory.ts
import { useEffect } from 'react';
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

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const categoryData = await categoryService.getCategoryBySlug(slug);
        setCurrentCategory(categoryData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category';
        setError(errorMessage);
        setCurrentCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();

    // Cleanup on unmount or slug change
    return () => {
      if (currentCategory?.slug !== slug) {
        reset();
      }
    };
  }, [slug, setCurrentCategory, setLoading, setError, reset, currentCategory?.slug]);

  return {
    category: currentCategory,
    isLoading,
    error,
  };
};

// hooks/useCategoryNavigation.ts
export const useCategoryNavigation = () => {
  const { currentCategory } = useCategoryStore();

  const breadcrumbs = () => {
    if (!currentCategory) return [];
    
    const crumbs = [
      { name: 'Home', href: '/' },
      { name: currentCategory.name, href: `/categories/${currentCategory.slug}` }
    ];
    
    return crumbs;
  };

  const subcategories = currentCategory?.children.filter(child => child.isActive) || [];

  return {
    breadcrumbs: breadcrumbs(),
    subcategories,
    hasSubcategories: subcategories.length > 0
  };
};