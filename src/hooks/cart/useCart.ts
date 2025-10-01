// hooks/cart/useCart.ts
import { ProductWithFullData, ProductVariant } from '@/types/product';
import { CartActionResult, CartSummary } from '@/types/cart';
import { useCartStore } from '@/store/useCartStore';

export const useCart = () => {
  const {
    items,
    addToCart: addItemToStore,
    removeFromCart,
    updateItemQuantity,
    clearCart,
  } = useCartStore();

  // Fonction pour calculer le nombre total d'articles
  const getCartItemsCount = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Fonction pour calculer le total du panier
  const getCartTotal = (): number => {
    return items.reduce((total, item) => {
      const price = item.variant?.price || item.product.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Fonction pour ajouter un produit au panier avec validation
  const addToCart = async (
    product: ProductWithFullData,
    variant?: ProductVariant,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ): Promise<CartActionResult> => {
    try {
      addItemToStore(product, variant, quantity, selectedSize, selectedColor);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'ajout au panier' 
      };
    }
  };

  // Fonction pour obtenir la quantité totale d'un produit spécifique
  const getProductQuantityInCart = (productId: string): number => {
    return items
      .filter(item => item.productId === productId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  // Fonction pour vérifier si un produit est déjà dans le panier
  const isProductInCart = (productId: string, variantId?: string): boolean => {
    if (variantId) {
      return items.some(item => 
        item.productId === productId && item.variant?.id === variantId
      );
    }
    return items.some(item => item.productId === productId);
  };

  // Fonction pour obtenir tous les variants d'un produit dans le panier
  const getProductVariantsInCart = (productId: string) => {
    return items.filter(item => item.productId === productId);
  };

  // Fonction pour calculer les économies totales
  const getTotalSavings = (): number => {
    return items.reduce((savings, item) => {
      const comparePrice = item.product.comparePrice;
      const currentPrice = item.variant?.price || item.product.price || 0;
      
      if (comparePrice && comparePrice > currentPrice) {
        return savings + (comparePrice - currentPrice) * item.quantity;
      }
      return savings;
    }, 0);
  };

  // Fonction pour obtenir le nombre d'articles uniques (pas la quantité totale)
  const getUniqueItemsCount = (): number => {
    return items.length;
  };

  // Fonction pour vider le panier avec confirmation
  const clearCartWithConfirmation = async (): Promise<boolean> => {
    if (items.length === 0) return true;
    
    const confirmed = window.confirm('Êtes-vous sûr de vouloir vider votre panier ?');
    if (confirmed) {
      try {
        clearCart();
        return true;
      } catch (error) {
        console.error('Erreur lors du vidage du panier:', error);
        return false;
      }
    }
    return false;
  };

  // Fonction pour supprimer un article
  const removeItem = async (itemId: string): Promise<CartActionResult> => {
    try {
      removeFromCart(itemId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression' 
      };
    }
  };

  // Fonction pour mettre à jour la quantité
  const updateQuantity = async (itemId: string, quantity: number): Promise<CartActionResult> => {
    try {
      updateItemQuantity(itemId, quantity);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour' 
      };
    }
  };

  // Calculer le résumé du panier
  const getCartSummary = (): CartSummary => {
    const itemsCount = getCartItemsCount();
    const uniqueItemsCount = getUniqueItemsCount();
    const totalPrice = getCartTotal();
    const totalSavings = getTotalSavings();
    const isEmpty = items.length === 0;
    const hasItems = items.length > 0;

    return {
      itemsCount,
      uniqueItemsCount,
      totalPrice,
      totalSavings,
      isEmpty,
      hasItems,
    };
  };

  return {
    // État du panier
    items,
    totalItems: getCartItemsCount(),
    totalPrice: getCartTotal(),
    
    // Actions de base
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    clearCartWithConfirmation,
    
    // Fonctions utilitaires
    getCartItemsCount,
    getCartTotal,
    getProductQuantityInCart,
    isProductInCart,
    getProductVariantsInCart,
    getTotalSavings,
    getUniqueItemsCount,
    getCartSummary,
    
    // États dérivés
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
    itemsCount: getCartItemsCount(),
    uniqueItemsCount: getUniqueItemsCount(),
    totalSavings: getTotalSavings()
  };
};