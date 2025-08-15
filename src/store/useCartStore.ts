// stores/useCartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartStore, CartItem } from '@/types/cart';
import { ProductWithFullData, ProductVariant } from '@/types/product';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      _hasHydrated: false,

      // Méthode pour marquer comme hydraté
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },

      addItem: (
        product: ProductWithFullData,
        variant: ProductVariant,
        quantity: number = 1,
        selectedSize?: string,
        selectedColor?: string
      ) => {
        const state = get();
        const existingItemIndex = state.items.findIndex(
          item =>
            item.productId === product.id &&
            item.variant.id === variant.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...state.items];
          const existingItem = updatedItems[existingItemIndex];
          const newQuantity = existingItem.quantity + quantity;
         
          // Check stock limit
          if (newQuantity <= variant.stock) {
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity
            };
            
            const priceToAdd = (variant.price || product.price) * quantity;
            
            set({
              items: updatedItems,
              totalItems: state.totalItems + quantity,
              totalPrice: state.totalPrice + priceToAdd
            });
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
          
          const priceToAdd = (variant.price || product.price) * quantity;
          
          set({
            items: [...state.items, newItem],
            totalItems: state.totalItems + quantity,
            totalPrice: state.totalPrice + priceToAdd
          });
        }
      },

      removeItem: (itemId: string) => {
        const state = get();
        const item = state.items.find(item => item.id === itemId);
        if (!item) return;

        const priceToRemove = (item.variant.price || item.product.price) * item.quantity;

        set({
          items: state.items.filter(item => item.id !== itemId),
          totalItems: state.totalItems - item.quantity,
          totalPrice: state.totalPrice - priceToRemove
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const state = get();
        const itemIndex = state.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = state.items[itemIndex];
        const quantityDifference = quantity - item.quantity;

        // Check stock limit
        if (quantity > item.variant.stock) return;

        const updatedItems = [...state.items];
        updatedItems[itemIndex] = { ...item, quantity };

        const priceDifference = (item.variant.price || item.product.price) * quantityDifference;

        set({
          items: updatedItems,
          totalItems: state.totalItems + quantityDifference,
          totalPrice: state.totalPrice + priceDifference
        });
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
      },

      // Recalculer les totaux (utile après hydratation)
      recalculateTotals: () => {
        const state = get();
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = state.items.reduce(
          (sum, item) => sum + (item.variant.price || item.product.price) * item.quantity,
          0
        );

        set({
          totalItems,
          totalPrice
        });
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
      onRehydrateStorage: () => (state) => {
        // Cette fonction est appelée après l'hydratation
        if (state) {
          state.setHasHydrated(true);
          // Recalculer les totaux pour s'assurer de la cohérence
          state.recalculateTotals();
        }
      },
      // Sérialisation personnalisée pour les dates
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          items: state.items.map(item => ({
            ...item,
            addedAt: item.addedAt instanceof Date ? item.addedAt.toISOString() : item.addedAt
          }))
        });
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          items: parsed.items?.map((item: any) => ({
            ...item,
            addedAt: item.addedAt ? new Date(item.addedAt) : new Date()
          })) || []
        };
      }
    }
  )
);