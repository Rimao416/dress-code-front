// hooks/cart/useCart.ts
import { ProductWithFullData, ProductVariant } from '@/types/product';
import { CartItem } from '@/types/cart';
import { useCartStore } from '@/store/useCartStore';

export const useCart = () => {
  const {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartTotal
  } = useCartStore();

  // Fonction pour ajouter un produit au panier avec validation
  const addToCart = (
    product: ProductWithFullData,
    variant: ProductVariant,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    try {
      addItem(product, variant, quantity, selectedSize, selectedColor);
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
        item.productId === productId && item.variant.id === variantId
      );
    }
    return items.some(item => item.productId === productId);
  };

  // Fonction pour obtenir tous les variants d'un produit dans le panier
  const getProductVariantsInCart = (productId: string): CartItem[] => {
    return items.filter(item => item.productId === productId);
  };

  // Fonction pour calculer les économies totales
  const getTotalSavings = (): number => {
    return items.reduce((savings, item) => {
      const comparePrice = item.product.comparePrice;
      const currentPrice = item.variant.price || item.product.price;
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
  const clearCartWithConfirmation = (): boolean => {
    if (items.length === 0) return true;
    
    const confirmed = window.confirm('Êtes-vous sûr de vouloir vider votre panier ?');
    if (confirmed) {
      clearCart();
      return true;
    }
    return false;
  };

  return {
    // État du panier
    items,
    totalItems,
    totalPrice,
    
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
    
    // États dérivés
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
    itemsCount: getCartItemsCount(),
    uniqueItemsCount: getUniqueItemsCount(),
    totalSavings: getTotalSavings()
  };
};