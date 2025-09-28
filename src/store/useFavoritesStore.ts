// stores/useFavoritesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  favoriteIds: string[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loadFavorites: () => Promise<void>;
  clearFavorites: () => void;
  getFavoritesCount: () => number; // Ajout de la fonction manquante
}

// Service pour les appels API
class FavoritesService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  async addFavorite(productId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to favorites');
    }
  }

  async removeFavorite(productId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/favorites/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove from favorites');
    }
  }

  async getFavorites(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/favorites`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }
    
    const data = await response.json();
    return data.productIds || [];
  }
}

const favoritesService = new FavoritesService();

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      isLoading: false,
      error: null,

      addToFavorites: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Optimistic update
          const currentFavorites = [...get().favoriteIds];
          if (!currentFavorites.includes(productId)) {
            currentFavorites.push(productId);
            set({ favoriteIds: currentFavorites });
          }

          // API call
          await favoritesService.addFavorite(productId);
          
          set({ isLoading: false });
        } catch (error) {
          // Rollback optimistic update
          const currentFavorites = get().favoriteIds.filter(id => id !== productId);
          set({ 
            favoriteIds: currentFavorites, 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to add to favorites' 
          });
        }
      },

      removeFromFavorites: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Optimistic update
          const currentFavorites = get().favoriteIds.filter(id => id !== productId);
          set({ favoriteIds: currentFavorites });

          // API call
          await favoritesService.removeFavorite(productId);
          
          set({ isLoading: false });
        } catch (error) {
          // Rollback optimistic update
          const currentFavorites = [...get().favoriteIds];
          if (!currentFavorites.includes(productId)) {
            currentFavorites.push(productId);
          }
          set({ 
            favoriteIds: currentFavorites, 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to remove from favorites' 
          });
        }
      },

      toggleFavorite: async (productId: string) => {
        const isFav = get().isFavorite(productId);
        if (isFav) {
          await get().removeFromFavorites(productId);
        } else {
          await get().addToFavorites(productId);
        }
      },

      isFavorite: (productId: string) => {
        return get().favoriteIds.includes(productId);
      },

      loadFavorites: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const favoriteIds = await favoritesService.getFavorites();
          set({ favoriteIds, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load favorites' 
          });
        }
      },

      clearFavorites: () => {
        set({ favoriteIds: [], error: null });
      },

      // Ajout de la fonction manquante
      getFavoritesCount: () => {
        return get().favoriteIds.length;
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);