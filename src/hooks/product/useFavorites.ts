// hooks/product/useFavorites.ts
import { ProductWithFullData } from '@/types/product';
import { FavoriteItem } from '@/types/favorites';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export const useFavorites = () => {
  const {
    items,
    totalItems,
    addItem,
    removeItem,
    toggleItem,
    clearFavorites,
    isFavorite,
    getFavoritesCount,
    getFavoriteItem
  } = useFavoritesStore();

  // Fonction pour ajouter un produit aux favoris avec validation
  const addToFavorites = (product: ProductWithFullData) => {
    try {
      addItem(product);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'ajout aux favoris' 
      };
    }
  };

  // Fonction pour supprimer un produit des favoris
  const removeFromFavorites = (productId: string) => {
    try {
      removeItem(productId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression des favoris' 
      };
    }
  };

  // Fonction pour basculer le statut favori d'un produit
  const toggleFavorite = (product: ProductWithFullData) => {
    try {
      const wasAdded = toggleItem(product);
      return { 
        success: true, 
        added: wasAdded,
        message: wasAdded ? 'Ajouté aux favoris' : 'Retiré des favoris'
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
    if (items.length === 0) return true;
    
    const confirmed = window.confirm('Êtes-vous sûr de vouloir vider vos favoris ?');
    if (confirmed) {
      clearFavorites();
      return true;
    }
    return false;
  };

  // Fonction pour obtenir les favoris triés par date d'ajout
  const getFavoritesSortedByDate = (ascending: boolean = false): FavoriteItem[] => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.addedAt).getTime();
      const dateB = new Date(b.addedAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  };

  // Fonction pour obtenir les favoris triés par nom
  const getFavoritesSortedByName = (ascending: boolean = true): FavoriteItem[] => {
    return [...items].sort((a, b) => {
      const nameA = a.product.name.toLowerCase();
      const nameB = b.product.name.toLowerCase();
      if (ascending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  };

  // Fonction pour obtenir les favoris triés par prix
  const getFavoritesSortedByPrice = (ascending: boolean = true): FavoriteItem[] => {
    return [...items].sort((a, b) => {
      const priceA = a.product.price;
      const priceB = b.product.price;
      return ascending ? priceA - priceB : priceB - priceA;
    });
  };

  // Fonction pour filtrer les favoris par catégorie
  const getFavoritesByCategory = (categoryId: string): FavoriteItem[] => {
    return items.filter(item => item.product.categoryId === categoryId);
  };

  // Fonction pour filtrer les favoris par marque
  const getFavoritesByBrand = (brandId: string): FavoriteItem[] => {
    return items.filter(item => item.product.brandId === brandId);
  };

  // Fonction pour rechercher dans les favoris
  const searchFavorites = (query: string): FavoriteItem[] => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return items;

    return items.filter(item => {
      const product = item.product;
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.shortDescription?.toLowerCase().includes(searchTerm) ||
        product.brand?.name.toLowerCase().includes(searchTerm) ||
        product.category?.name.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });
  };

  return {
    // État des favoris
    items,
    totalItems,
    favoritesCount: totalItems, // Alias pour compatibilité
    
    // Actions de base
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    clearFavoritesWithConfirmation,
    
    // Fonctions utilitaires
    isFavorite,
    getFavoritesCount,
    getFavoriteItem,
    
    // Fonctions de tri et filtrage
    getFavoritesSortedByDate,
    getFavoritesSortedByName,
    getFavoritesSortedByPrice,
    getFavoritesByCategory,
    getFavoritesByBrand,
    searchFavorites,
    
    // États dérivés
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
    itemsCount: getFavoritesCount()
  };
};