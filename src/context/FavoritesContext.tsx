// contexts/FavoritesContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger les favoris depuis le localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavorites = localStorage.getItem('dresscode_favorites');
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Sauvegarder les favoris dans le localStorage quand ils changent
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem('dresscode_favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des favoris:', error);
      }
    }
  }, [favorites, isInitialized]);

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  const toggleFavorite = (productId: string): void => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      // Dispatch custom event pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('favoritesChanged', {
        detail: { favorites: newFavorites, productId, action: prev.includes(productId) ? 'remove' : 'add' }
      }));
      
      return newFavorites;
    });
  };

  const addFavorite = (productId: string): void => {
    setFavorites(prev => {
      if (prev.includes(productId)) return prev;
      const newFavorites = [...prev, productId];
      
      window.dispatchEvent(new CustomEvent('favoritesChanged', {
        detail: { favorites: newFavorites, productId, action: 'add' }
      }));
      
      return newFavorites;
    });
  };

  const removeFavorite = (productId: string): void => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== productId);
      
      window.dispatchEvent(new CustomEvent('favoritesChanged', {
        detail: { favorites: newFavorites, productId, action: 'remove' }
      }));
      
      return newFavorites;
    });
  };

  const clearFavorites = (): void => {
    setFavorites([]);
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { favorites: [], action: 'clear' }
    }));
  };

  const contextValue: FavoritesContextType = {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte des favoris
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites doit être utilisé dans un FavoritesProvider');
  }
  return context;
};