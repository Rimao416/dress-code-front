// hooks/product/useFavorites.ts
import { ProductWithFullData, ProductCardItem, isFullProduct } from '@/types/product';
import { useFavoritesStore } from '@/store/useFavoritesStore';

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

  // Note: Les fonctions de tri et filtrage nécessiteraient les données complètes des produits
  // qui ne sont pas stockées dans le store actuel (seulement les IDs)
  // Vous devriez récupérer les données complètes depuis votre API ou store de produits

  return {
    // État des favoris
    favoriteIds,
    totalItems: getFavoritesCount(),
    favoritesCount: getFavoritesCount(),
    isLoading,
    error,
    
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
    
    // États dérivés
    isEmpty: favoriteIds.length === 0,
    hasItems: favoriteIds.length > 0,
    itemsCount: getFavoritesCount()
  };
};