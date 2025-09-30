// stores/useProductStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ProductWithFullData, ProductCardData } from '@/types/product';

interface ProductStore {
  // State
  currentProduct: ProductWithFullData | null;
  similarProducts: ProductCardData[];
  recommendedProducts: ProductCardData[];
  newInProducts: ProductCardData[]; // AJOUTÉ
  isLoading: boolean;
  isLoadingSimilar: boolean;
  isLoadingRecommended: boolean;
  isLoadingNewIn: boolean; // AJOUTÉ
  error: string | null;
  favorites: Set<string>;
  
  // Actions
  setCurrentProduct: (product: ProductWithFullData | null) => void;
  setSimilarProducts: (products: ProductCardData[]) => void;
  setRecommendedProducts: (products: ProductCardData[]) => void;
  setNewInProducts: (products: ProductCardData[]) => void; // AJOUTÉ
  setLoading: (loading: boolean) => void;
  setLoadingSimilar: (loading: boolean) => void;
  setLoadingRecommended: (loading: boolean) => void;
  setLoadingNewIn: (loading: boolean) => void; // AJOUTÉ
  setError: (error: string | null) => void;
  
  // Favorites actions
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Reset actions
  reset: () => void;
  resetSimilar: () => void;
  resetRecommended: () => void;
  resetNewIn: () => void; // AJOUTÉ
}

const initialState = {
  currentProduct: null,
  similarProducts: [],
  recommendedProducts: [],
  newInProducts: [], // AJOUTÉ
  isLoading: false,
  isLoadingSimilar: false,
  isLoadingRecommended: false,
  isLoadingNewIn: false, // AJOUTÉ
  error: null,
  favorites: new Set<string>(),
};

export const useProductStore = create<ProductStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setCurrentProduct: (product) => {
        set({ currentProduct: product });
      },
      
      setSimilarProducts: (products) => {
        set({ similarProducts: products });
      },
      
      setRecommendedProducts: (products) => {
        set({ recommendedProducts: products });
      },
      
      // AJOUTÉ
      setNewInProducts: (products) => {
        set({ newInProducts: products });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setLoadingSimilar: (loading) => set({ isLoadingSimilar: loading }),
      
      setLoadingRecommended: (loading) => set({ isLoadingRecommended: loading }),
      
      // AJOUTÉ
      setLoadingNewIn: (loading) => set({ isLoadingNewIn: loading }),
      
      setError: (error) => set({ error }),
      
      toggleFavorite: (productId) => {
        const { favorites } = get();
        const newFavorites = new Set(favorites);
        
        if (newFavorites.has(productId)) {
          newFavorites.delete(productId);
        } else {
          newFavorites.add(productId);
        }
        
        set({ favorites: newFavorites });
      },
      
      isFavorite: (productId) => {
        const { favorites } = get();
        return favorites.has(productId);
      },
      
      reset: () => set(initialState),
      
      resetSimilar: () => set({ 
        similarProducts: [], 
        isLoadingSimilar: false 
      }),
      
      resetRecommended: () => set({ 
        recommendedProducts: [], 
        isLoadingRecommended: false 
      }),
      
      // AJOUTÉ
      resetNewIn: () => set({ 
        newInProducts: [], 
        isLoadingNewIn: false 
      }),
    }),
    {
      name: 'product-store',
    }
  )
);