// stores/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStore, CartItem } from '@/types/cart';
import { ProductWithFullData, ProductVariant } from '@/types/product';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (
        product: ProductWithFullData, 
        variant: ProductVariant, 
        quantity: number = 1,
        selectedSize?: string,
        selectedColor?: string
      ) => {
        const existingItemIndex = get().items.findIndex(
          item => 
            item.productId === product.id && 
            item.variant.id === variant.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...get().items];
          const existingItem = updatedItems[existingItemIndex];
          const newQuantity = existingItem.quantity + quantity;
          
          // Check stock limit
          if (newQuantity <= variant.stock) {
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity
            };

            set(state => ({
              items: updatedItems,
              totalItems: state.totalItems + quantity,
              totalPrice: state.totalPrice + (variant.price || product.price) * quantity
            }));
          }
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${variant.id}-${selectedSize || ''}-${selectedColor || ''}-${Date.now()}`,
            productId: product.id,
            product,
            variant,
            quantity,
            selectedSize,
            selectedColor,
            addedAt: new Date()
          };

          set(state => ({
            items: [...state.items, newItem],
            totalItems: state.totalItems + quantity,
            totalPrice: state.totalPrice + (variant.price || product.price) * quantity
          }));
        }
      },

      removeItem: (itemId: string) => {
        const item = get().items.find(item => item.id === itemId);
        if (!item) return;

        set(state => ({
          items: state.items.filter(item => item.id !== itemId),
          totalItems: state.totalItems - item.quantity,
          totalPrice: state.totalPrice - (item.variant.price || item.product.price) * item.quantity
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const itemIndex = get().items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = get().items[itemIndex];
        const quantityDifference = quantity - item.quantity;

        // Check stock limit
        if (quantity > item.variant.stock) return;

        const updatedItems = [...get().items];
        updatedItems[itemIndex] = { ...item, quantity };

        set(state => ({
          items: updatedItems,
          totalItems: state.totalItems + quantityDifference,
          totalPrice: state.totalPrice + (item.variant.price || item.product.price) * quantityDifference
        }));
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0
        });
      },

      getCartItemsCount: () => {
        return get().totalItems;
      },

      getCartTotal: () => {
        return get().totalPrice;
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice
      }),
    }
  )
);