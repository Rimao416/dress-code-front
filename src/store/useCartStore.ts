// stores/useCartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProductVariant, ProductWithFullData } from '@/types/product';
import { CartItem } from '@/types/cart';

interface CartStore {
  items: CartItem[];
  
  // Actions
  addToCart: (
    product: ProductWithFullData,
    variant?: ProductVariant,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Helpers
  getCartItem: (productId: string, variantId?: string) => CartItem | undefined;
  isInCart: (productId: string, variantId?: string) => boolean;
}

// Fonction helper pour générer un ID unique
const generateId = () => `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (
        product: ProductWithFullData,
        variant?: ProductVariant,
        quantity = 1,
        selectedSize?: string,
        selectedColor?: string
      ) => {
        const state = get();
        
        // Vérifier si l'item existe déjà
        const existingItem = state.getCartItem(product.id, variant?.id);
        
        if (existingItem) {
          // Mettre à jour la quantité
          const newQuantity = existingItem.quantity + quantity;
          state.updateItemQuantity(existingItem.id, newQuantity);
        } else {
          // Créer un nouvel item
          const newItem: CartItem = {
            id: generateId(),
            productId: product.id,
            quantity,
            selectedSize,
            selectedColor,
            addedAt: new Date(),
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              image: variant?.images?.[0] || product.images?.[0] || '',
              sku: product.sku,
              brand: product.brand?.name,
              price: product.price ?? undefined,
              comparePrice: product.comparePrice ?? undefined,
            },
            variant: variant ? {
              id: variant.id,
              size: variant.size || undefined,
              color: variant.color || undefined,
              colorHex: variant.colorHex || undefined,
              material: variant.material || undefined,
              sku: variant.sku,
              images: variant.images || [],
              price: variant.price ?? undefined,
            } : undefined,
          };

          // Ajouter l'item au panier
          set(state => ({
            items: [...state.items, newItem]
          }));
        }
      },

      removeFromCart: (itemId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },

      updateItemQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartItem: (productId: string, variantId?: string) => {
        return get().items.find(item => 
          item.productId === productId && 
          (variantId ? item.variant?.id === variantId : true)
        );
      },

      isInCart: (productId: string, variantId?: string) => {
        return !!get().getCartItem(productId, variantId);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);