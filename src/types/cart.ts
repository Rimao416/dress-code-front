// types/cart.ts
import { ProductWithFullData, ProductVariant } from './product';

export interface CartItem {
  id: string; // Unique identifier for the cart item
  productId: string;
  product: ProductWithFullData;
  variant: ProductVariant;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartActions {
  addItem: (product: ProductWithFullData, variant: ProductVariant, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemsCount: () => number;
  getCartTotal: () => number;
}

export type CartStore = CartState & CartActions;