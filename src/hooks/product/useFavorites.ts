// hooks/product/useFavorites.ts
import { ProductWithFullData, ProductCardItem, isFullProduct } from '@/types/product';
import { FavoriteItem } from '@/types/favorites';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useMemo } from 'react';

export const useFavorites = () => {
  const {
    favoriteIds,
    isLoading,
    error,
    addToFavorites: addToFavoritesStore,
    removeFromFavorites: removeFromFavoritesStore,
    toggleFavorite: toggleFavoriteStore,
    isFavorite,
    loadFavorites,
    clearFavorites,
    getFavoritesCount
  } = useFavoritesStore();

  // TODO: Remplacez cette partie par une vraie requête pour récupérer les produits
  // Cette fonction devrait récupérer les données complètes des produits depuis favoriteIds
  const getFavoriteItems = (): FavoriteItem[] => {
    // Placeholder - vous devrez implémenter la logique pour récupérer
    // les données complètes des produits depuis une API ou un autre store
    return favoriteIds.map(id => ({
      id: `fav-${id}`,
      productId: id,
      addedAt: new Date(),
      // product: getProductById(id) // À implémenter
      product: {} as ProductWithFullData // Placeholder
    }));
  };

  // Fonction pour ajouter un produit aux favoris avec validation
  const addToFavorites = async (product: ProductCardItem) => {
    try {
      await addToFavoritesStore(product.id);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'ajout aux favoris' 
      };
    }
  };

  // Fonction pour supprimer un produit des favoris
  const removeFromFavorites = async (productId: string) => {
    try {
      await removeFromFavoritesStore(productId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression des favoris' 
      };
    }
  };

  // Fonction pour basculer le statut favori d'un produit
  const toggleFavorite = async (product: ProductCardItem) => {
    try {
      const wasAlreadyFavorite = isFavorite(product.id);
      await toggleFavoriteStore(product.id);
      const isNowFavorite = !wasAlreadyFavorite;
      
      return { 
        success: true, 
        added: isNowFavorite,
        message: isNowFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors du basculement des favoris' 
      };
    }
  };

  // Fonction pour vider les favoris avec confirmation
  const clearFavoritesWithConfirmation = (): boolean => {
    if (favoriteIds.length === 0) return true;
    
    const confirmed = window.confirm('Êtes-vous sûr de vouloir vider vos favoris ?');
    if (confirmed) {
      clearFavorites();
      return true;
    }
    return false;
  };

  // Fonctions de tri (nécessitent les données complètes des produits)
  const getFavoritesSortedByDate = (ascending: boolean = false): FavoriteItem[] => {
    const items = getFavoriteItems();
    return items.sort((a, b) => {
      const dateA = new Date(a.addedAt).getTime();
      const dateB = new Date(b.addedAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  };

  const getFavoritesSortedByName = (ascending: boolean = true): FavoriteItem[] => {
    const items = getFavoriteItems();
    return items.sort((a, b) => {
      const nameA = a.product.name?.toLowerCase() || '';
      const nameB = b.product.name?.toLowerCase() || '';
      const comparison = nameA.localeCompare(nameB);
      return ascending ? comparison : -comparison;
    });
  };

  const getFavoritesSortedByPrice = (ascending: boolean = true): FavoriteItem[] => {
    const items = getFavoriteItems();
    return items.sort((a, b) => {
      const priceA = a.product.price || 0;
      const priceB = b.product.price || 0;
      return ascending ? priceA - priceB : priceB - priceA;
    });
  };

  // Fonction de recherche dans les favoris
  const searchFavorites = (query: string): FavoriteItem[] => {
    if (!query.trim()) return getFavoriteItems();
    
    const items = getFavoriteItems();
    const searchTerm = query.toLowerCase().trim();
    
    return items.filter(item => {
      const productName = item.product.name?.toLowerCase() || '';
      const brandName = item.product.brand?.name?.toLowerCase() || '';
      const description = item.product.description?.toLowerCase() || '';
      
      return productName.includes(searchTerm) || 
             brandName.includes(searchTerm) || 
             description.includes(searchTerm);
    });
  };

  // Items mémorisés
  const items = useMemo(() => getFavoriteItems(), [favoriteIds]);

  return {
    // État des favoris
    favoriteIds,
    totalItems: getFavoritesCount(),
    favoritesCount: getFavoritesCount(),
    isLoading,
    error,
    items,
    
    // Actions de base
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    clearFavoritesWithConfirmation,
    loadFavorites,
    
    // Fonctions utilitaires
    isFavorite,
    getFavoritesCount,
    
    // Fonctions de tri et filtrage
    getFavoritesSortedByDate,
    getFavoritesSortedByName,
    getFavoritesSortedByPrice,
    searchFavorites,
    
    // États dérivés
    isEmpty: favoriteIds.length === 0,
    hasItems: favoriteIds.length > 0,
    itemsCount: getFavoritesCount()
  };
};