// store/useCategoryStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CategoryWithProducts, CategoryWithFullData } from '@/types/category';

interface CategoryStore {
  // State
  categories: CategoryWithProducts[];
  currentCategory: CategoryWithFullData | null;
  isLoading: boolean;
  isLoadingCurrent: boolean;
  error: string | null;
  lastFetch: number | null;
  
  // Actions
  setCategories: (categories: CategoryWithProducts[]) => void;
  setCurrentCategory: (category: CategoryWithFullData | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingCurrent: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateLastFetch: () => void;
  
  // Utility actions
  getCategoryBySlug: (slug: string) => CategoryWithProducts | null;
  getMainCategories: () => CategoryWithProducts[];
  getCategoryById: (id: string) => CategoryWithProducts | null;
  shouldRefetch: (maxAge?: number) => boolean;
  
  // Reset actions
  reset: () => void;
  resetCurrent: () => void;
}

const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  isLoadingCurrent: false,
  error: null,
  lastFetch: null,
};

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setCategories: (categories) => {
          set({ categories });
        },
        
        setCurrentCategory: (category) => {
          set({ currentCategory: category });
        },
        
        setLoading: (loading) => {
          set({ isLoading: loading });
        },
        
        setLoadingCurrent: (loading) => {
          set({ isLoadingCurrent: loading });
        },
        
        setError: (error) => {
          set({ error });
        },
        
        updateLastFetch: () => {
          set({ lastFetch: Date.now() });
        },
        
        getCategoryBySlug: (slug) => {
          const { categories } = get();
          
          const findBySlug = (cats: CategoryWithProducts[]): CategoryWithProducts | null => {
            for (const cat of cats) {
              if (cat.slug === slug) {
                return cat;
              }
              if (cat.children && cat.children.length > 0) {
                const found = findBySlug(cat.children);
                if (found) return found;
              }
            }
            return null;
          };
          
          return findBySlug(categories);
        },
        
        getMainCategories: () => {
          const { categories } = get();
          return categories.filter(cat => !cat.parentId);
        },
        
        getCategoryById: (id) => {
          const { categories } = get();
          
          const findById = (cats: CategoryWithProducts[]): CategoryWithProducts | null => {
            for (const cat of cats) {
              if (cat.id === id) {
                return cat;
              }
              if (cat.children && cat.children.length > 0) {
                const found = findById(cat.children);
                if (found) return found;
              }
            }
            return null;
          };
          
          return findById(categories);
        },
        
        shouldRefetch: (maxAge = 600000) => { // 10 minutes par défaut
          const { lastFetch } = get();
          if (!lastFetch) return true;
          return Date.now() - lastFetch > maxAge;
        },
        
        reset: () => set(initialState),
        
        resetCurrent: () => set({ 
          currentCategory: null, 
          isLoadingCurrent: false 
        }),
      }),
      {
        name: 'category-storage',
        partialize: (state) => ({
          categories: state.categories,
          lastFetch: state.lastFetch,
        }),
      }
    ),
    {
      name: 'category-store',
    }
  )
);