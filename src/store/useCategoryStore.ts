// stores/useCategoryStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CategoryWithFullData } from '@/types/category';

interface CategoryStore {
  // State
  currentCategory: CategoryWithFullData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentCategory: (category: CategoryWithFullData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentCategory: null,
  isLoading: false,
  error: null,
};

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setCurrentCategory: (category) => {
        set({ currentCategory: category });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: 'category-store',
    }
  )
);