// stores/useCartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProductVariant, ProductWithFullData } from '@/types/product';
import { CartItem } from '@/types/cart';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  // Computed values
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addToCart: (
    product: ProductWithFullData,
    variant?: ProductVariant,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  
  // Helpers
  getCartItem: (productId: string, variantId?: string) => CartItem | undefined;
  isInCart: (productId: string, variantId?: string) => boolean;
}

// Service pour les appels API
class CartService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  async addToCart(params: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }): Promise<CartItem> {
    const response = await fetch(`${this.baseUrl}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }

    return await response.json();
  }

  async removeFromCart(itemId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/cart/items/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove from cart');
    }
  }

  async updateQuantity(itemId: string, quantity: number): Promise<CartItem> {
    const response = await fetch(`${this.baseUrl}/api/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to update quantity');
    }

    return await response.json();
  }

  async getCart(): Promise<CartItem[]> {
    const response = await fetch(`${this.baseUrl}/api/cart`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    
    const data = await response.json();
    return data.items || [];
  }

  async clearCart(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/cart`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  }
}

const cartService = new CartService();

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      // Computed values
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      get totalPrice() {
        return get().items.reduce((total, item) => {
          const price = item.variant?.price || item.product.price || 0;
          return total + (price * item.quantity);
        }, 0);
      },

      addToCart: async (
        product: ProductWithFullData,
        variant?: ProductVariant,
        quantity = 1,
        selectedSize?: string,
        selectedColor?: string
      ) => {
        try {
          set({ isLoading: true, error: null });

          // Calculer le prix effectif (gérer null en le convertissant en undefined)
          const effectivePrice = variant?.price ?? product.price;

          // Créer l'item temporaire pour l'optimistic update
          const tempItem: CartItem = {
            id: `temp-${Date.now()}`,
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
              // Convertir null en undefined pour le prix
              price: variant.price ?? undefined,
            } : undefined,
          };

          // Vérifier si l'item existe déjà
          const existingItem = get().getCartItem(product.id, variant?.id);
          
          if (existingItem) {
            // Mettre à jour la quantité
            const newQuantity = existingItem.quantity + quantity;
            await get().updateItemQuantity(existingItem.id, newQuantity);
          } else {
            // Optimistic update
            set(state => ({
              items: [...state.items, tempItem]
            }));

            // API call
            const newItem = await cartService.addToCart({
              productId: product.id,
              variantId: variant?.id,
              quantity,
              price: effectivePrice,
            });

            // Remplacer l'item temporaire par l'item réel
            set(state => ({
              items: state.items.map(item => 
                item.id === tempItem.id ? newItem : item
              )
            }));
          }

          set({ isLoading: false });
        } catch (error) {
          // Rollback optimistic update
          set(state => ({
            items: state.items.filter(item => !item.id.startsWith('temp-')),
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add to cart'
          }));
        }
      },

      removeFromCart: async (itemId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Optimistic update
          const currentItems = get().items;
          set({ items: currentItems.filter(item => item.id !== itemId) });

          // API call
          await cartService.removeFromCart(itemId);
          
          set({ isLoading: false });
        } catch (error) {
          // Rollback
          set(state => ({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to remove from cart'
          }));
          await get().loadCart(); // Recharger le panier
        }
      },

      updateItemQuantity: async (itemId: string, quantity: number) => {
        try {
          set({ isLoading: true, error: null });
          
          if (quantity <= 0) {
            await get().removeFromCart(itemId);
            return;
          }

          // Optimistic update
          set(state => ({
            items: state.items.map(item =>
              item.id === itemId ? { ...item, quantity } : item
            )
          }));

          // API call
          const updatedItem = await cartService.updateQuantity(itemId, quantity);
          
          // Update with server response
          set(state => ({
            items: state.items.map(item =>
              item.id === itemId ? updatedItem : item
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update quantity'
          });
          await get().loadCart(); // Recharger le panier
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Optimistic update
          set({ items: [] });

          // API call
          await cartService.clearCart();
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to clear cart'
          });
          await get().loadCart(); // Recharger le panier
        }
      },

      loadCart: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const items = await cartService.getCart();
          set({ items, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load cart'
          });
        }
      },

      getCartItem: (productId: string, variantId?: string) => {
        return get().items.find(item => 
          item.productId === productId && item.variant?.id === variantId
        );
      },

      isInCart: (productId: string, variantId?: string) => {
        return !!get().getCartItem(productId, variantId);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Persister seulement certaines propriétés
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);