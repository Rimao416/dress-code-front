// types/homepage.ts
import { ProductCardData } from './product';
import { Category } from './category';

export interface SliderData {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  buttonText?: string | null;
  buttonLink?: string | null;
  isActive: boolean;
  sortOrder: number;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithProducts extends Category {
  productCount: number;
}

export interface HomePageData {
  sliders: SliderData[];
  newInProducts: ProductCardData[];
  featuredProducts: ProductCardData[];
  categories: CategoryWithProducts[];
}

export interface HomePageResponse {
  success: boolean;
  data?: HomePageData;
  error?: string;
}

// Types pour les filtres de la page d'accueil
export interface HomePageFilters {
  limit?: number;
  newInLimit?: number;
  featuredLimit?: number;
  categoriesLimit?: number;
  includeInactiveSliders?: boolean;
}

// Types pour le cache
export interface CacheConfig {
  key: string;
  ttl: number; // Time to live en secondes
  staleWhileRevalidate?: boolean;
}

export const HOMEPAGE_CACHE_KEYS = {
  ALL_DATA: 'homepage:all-data',
  SLIDERS: 'homepage:sliders',
  NEW_IN_PRODUCTS: 'homepage:new-in-products',
  FEATURED_PRODUCTS: 'homepage:featured-products',
  CATEGORIES: 'homepage:categories'
} as const;

export const HOMEPAGE_CACHE_TTL = {
  SLIDERS: 5 * 60, // 5 minutes
  PRODUCTS: 2 * 60, // 2 minutes
  CATEGORIES: 10 * 60, // 10 minutes
  ALL_DATA: 2 * 60 // 2 minutes
} as const;