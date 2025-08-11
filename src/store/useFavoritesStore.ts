// stores/useFavoritesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FavoritesStore, FavoriteItem } from '@/types/favorites';
import { ProductWithFullData } from '@/types/product';

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      addItem: (product: ProductWithFullData) => {
        const existingItem = get().items.find(item => item.productId === product.id);
        
        if (!existingItem) {
          const newItem: FavoriteItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            product,
            addedAt: new Date()
          };

          set(state => ({
            items: [...state.items, newItem],
            totalItems: state.totalItems + 1
          }));
        }
      },

      removeItem: (productId: string) => {
        const existingItem = get().items.find(item => item.productId === productId);
        
        if (existingItem) {
          set(state => ({
            items: state.items.filter(item => item.productId !== productId),
            totalItems: state.totalItems - 1
          }));
        }
      },

      toggleItem: (product: ProductWithFullData): boolean => {
        const existingItem = get().items.find(item => item.productId === product.id);
        
        if (existingItem) {
          get().removeItem(product.id);
          return false; // Item was removed
        } else {
          get().addItem(product);
          return true; // Item was added
        }
      },

      clearFavorites: () => {
        set({
          items: [],
          totalItems: 0
        });
      },

      isFavorite: (productId: string): boolean => {
        return get().items.some(item => item.productId === productId);
      },

      getFavoritesCount: (): number => {
        return get().totalItems;
      },

      getFavoriteItem: (productId: string): FavoriteItem | undefined => {
        return get().items.find(item => item.productId === productId);
      }
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems
      }),
    }
  )
);