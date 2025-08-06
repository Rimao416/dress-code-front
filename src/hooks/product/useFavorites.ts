import { useState, useCallback, useEffect } from 'react';

interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

export const useFavorites = (initialFavorites: string[] = []): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);

  // Charger les favoris depuis le localStorage au montage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      }
    }
  }, []);

  // Sauvegarder les favoris dans le localStorage quand ils changent
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback((productId: string): boolean => {
    return favorites.includes(productId);
  }, [favorites]);

  const toggleFavorite = useCallback((productId: string): void => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const addFavorite = useCallback((productId: string): void => {
    setFavorites(prev => 
      prev.includes(productId) ? prev : [...prev, productId]
    );
  }, []);

  const removeFavorite = useCallback((productId: string): void => {
    setFavorites(prev => prev.filter(id => id !== productId));
  }, []);

  const clearFavorites = useCallback((): void => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
};