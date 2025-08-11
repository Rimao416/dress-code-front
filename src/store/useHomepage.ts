// stores/homepage.store.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { HomePageData, HomePageFilters, SliderData } from '@/types/homepage';
import { ProductCardData } from '@/types/product';
import { CategoryWithProducts } from '@/types/homepage';
import { homePageService } from '@/services/homepage.service';
import { cacheService } from '@/services/cache.service';
import { HOMEPAGE_CACHE_KEYS, HOMEPAGE_CACHE_TTL } from '@/types/homepage';

interface HomePageState {
  // Data
  homePageData: HomePageData | null;
  sliders: SliderData[];
  newInProducts: ProductCardData[];
  featuredProducts: ProductCardData[];
  categories: CategoryWithProducts[];
  
  // Loading states
  isLoading: boolean;
  isSlidersLoading: boolean;
  isNewInLoading: boolean;
  isFeaturedLoading: boolean;
  isCategoriesLoading: boolean;
  
  // Error states
  error: string | null;
  slidersError: string | null;
  newInError: string | null;
  featuredError: string | null;
  categoriesError: string | null;
  
  // Actions
  fetchHomePageData: (filters?: HomePageFilters) => Promise<void>;
  fetchSliders: () => Promise<void>;
  fetchNewInProducts: (limit?: number) => Promise<void>;
  fetchFeaturedProducts: (limit?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  
  // Cache management
  invalidateCache: (key?: string) => void;
  prefetchData: () => Promise<void>;
  
  // Utility
  reset: () => void;
}

const initialState = {
  homePageData: null,
  sliders: [],
  newInProducts: [],
  featuredProducts: [],
  categories: [],
  isLoading: false,
  isSlidersLoading: false,
  isNewInLoading: false,
  isFeaturedLoading: false,
  isCategoriesLoading: false,
  error: null,
  slidersError: null,
  newInError: null,
  featuredError: null,
  categoriesError: null,
};

export const useHomePageStore = create<HomePageState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    fetchHomePageData: async (filters: HomePageFilters = {}) => {
      set({ isLoading: true, error: null });
      
      try {
        // Utiliser le cache avec SWR
        const data = await cacheService.getOrFetch(
          HOMEPAGE_CACHE_KEYS.ALL_DATA,
          () => homePageService.getHomePageData(filters),
          {
            ttl: HOMEPAGE_CACHE_TTL.ALL_DATA * 1000, // Convertir en millisecondes
            staleWhileRevalidate: true
          }
        );

        if (data.success && data.data) {
          set({
            homePageData: data.data,
            sliders: data.data.sliders,
            newInProducts: data.data.newInProducts,
            featuredProducts: data.data.featuredProducts,
            categories: data.data.categories,
            isLoading: false,
            error: null
          });
        } else {
          set({
            error: data.error || 'Failed to fetch homepage data',
            isLoading: false
          });
        }
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          isLoading: false
        });
      }
    },

    fetchSliders: async () => {
      set({ isSlidersLoading: true, slidersError: null });
      
      try {
        const data = await cacheService.getOrFetch(
          HOMEPAGE_CACHE_KEYS.SLIDERS,
          () => homePageService.getSliders(),
          {
            ttl: HOMEPAGE_CACHE_TTL.SLIDERS * 1000,
            staleWhileRevalidate: true
          }
        );

        if (data.success && data.data) {
          set({
            sliders: data.data,
            isSlidersLoading: false,
            slidersError: null
          });
        } else {
          set({
            slidersError: data.error || 'Failed to fetch sliders',
            isSlidersLoading: false
          });
        }
      } catch (error) {
        set({
          slidersError: error instanceof Error ? error.message : 'Unknown error occurred',
          isSlidersLoading: false
        });
      }
    },

    fetchNewInProducts: async (limit = 12) => {
      set({ isNewInLoading: true, newInError: null });
      
      try {
        const data = await cacheService.getOrFetch(
          `${HOMEPAGE_CACHE_KEYS.NEW_IN_PRODUCTS}:${limit}`,
          () => homePageService.getNewInProducts(limit),
          {
            ttl: HOMEPAGE_CACHE_TTL.PRODUCTS * 1000,
            staleWhileRevalidate: true
          }
        );

        if (data.success && data.data) {
          set({
            newInProducts: data.data,
            isNewInLoading: false,
            newInError: null
          });
        } else {
          set({
            newInError: data.error || 'Failed to fetch new in products',
            isNewInLoading: false
          });
        }
      } catch (error) {
        set({
          newInError: error instanceof Error ? error.message : 'Unknown error occurred',
          isNewInLoading: false
        });
      }
    },

    fetchFeaturedProducts: async (limit = 24) => {
      set({ isFeaturedLoading: true, featuredError: null });
      
      try {
        const data = await cacheService.getOrFetch(
          `${HOMEPAGE_CACHE_KEYS.FEATURED_PRODUCTS}:${limit}`,
          () => homePageService.getFeaturedProducts(limit),
          {
            ttl: HOMEPAGE_CACHE_TTL.PRODUCTS * 1000,
            staleWhileRevalidate: true
          }
        );

        if (data.success && data.data) {
          set({
            featuredProducts: data.data,
            isFeaturedLoading: false,
            featuredError: null
          });
        } else {
          set({
            featuredError: data.error || 'Failed to fetch featured products',
            isFeaturedLoading: false
          });
        }
      } catch (error) {
        set({
          featuredError: error instanceof Error ? error.message : 'Unknown error occurred',
          isFeaturedLoading: false
        });
      }
    },

    fetchCategories: async () => {
      set({ isCategoriesLoading: true, categoriesError: null });
      
      try {
        const data = await cacheService.getOrFetch(
          HOMEPAGE_CACHE_KEYS.CATEGORIES,
          () => homePageService.getCategoriesWithProductCount(),
          {
            ttl: HOMEPAGE_CACHE_TTL.CATEGORIES * 1000,
            staleWhileRevalidate: true
          }
        );

        if (data.success && data.data) {
          set({
            categories: data.data,
            isCategoriesLoading: false,
            categoriesError: null
          });
        } else {
          set({
            categoriesError: data.error || 'Failed to fetch categories',
            isCategoriesLoading: false
          });
        }
      } catch (error) {
        set({
          categoriesError: error instanceof Error ? error.message : 'Unknown error occurred',
          isCategoriesLoading: false
        });
      }
    },

    invalidateCache: (key?: string) => {
      if (key) {
        cacheService.invalidate(key);
      } else {
        // Invalider tout le cache homepage
        cacheService.invalidatePattern('homepage:');
      }
    },

    prefetchData: async () => {
      // Précharger les données les plus importantes
      const prefetchPromises = [
        cacheService.prefetch(
          HOMEPAGE_CACHE_KEYS.SLIDERS,
          () => homePageService.getSliders(),
          { ttl: HOMEPAGE_CACHE_TTL.SLIDERS * 1000 }
        ),
        cacheService.prefetch(
          `${HOMEPAGE_CACHE_KEYS.NEW_IN_PRODUCTS}:12`,
          () => homePageService.getNewInProducts(12),
          { ttl: HOMEPAGE_CACHE_TTL.PRODUCTS * 1000 }
        )
      ];

      await Promise.allSettled(prefetchPromises);
    },

    reset: () => {
      set(initialState);
      get().invalidateCache();
    }
  }))
);

// Sélecteurs pour optimiser les re-renders
export const useSliders = () => useHomePageStore(state => state.sliders);
export const useNewInProducts = () => useHomePageStore(state => state.newInProducts);
export const useFeaturedProducts = () => useHomePageStore(state => state.featuredProducts);
export const useCategories = () => useHomePageStore(state => state.categories);
export const useHomePageLoading = () => useHomePageStore(state => state.isLoading);
export const useHomePageError = () => useHomePageStore(state => state.error);