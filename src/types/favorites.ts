// types/favorites.ts
import { ProductWithFullData } from './product';

export interface FavoriteItem {
  id: string; // Unique identifier for the favorite item
  productId: string;
  product: ProductWithFullData;
  addedAt: Date;
}

export interface FavoritesState {
  items: FavoriteItem[];
  totalItems: number;
}

export interface FavoritesActions {
  addItem: (product: ProductWithFullData) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: ProductWithFullData) => boolean; // Returns true if added, false if removed
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
  getFavoritesCount: () => number;
  getFavoriteItem: (productId: string) => FavoriteItem | undefined;
}

export type FavoritesStore = FavoritesState & FavoritesActions;