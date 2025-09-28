// types/cart.ts
export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string; // Première image du produit
    sku: string;
    brand?: string;
    price: number;
    comparePrice?: number;
  };
  variant?: {
    id: string;
    size?: string;
    color?: string;
    colorHex?: string;
    material?: string;
    sku: string;
    images: string[];
    price?: number;
  };
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: Date;
}

export interface CartSummary {
  itemsCount: number;
  uniqueItemsCount: number;
  totalPrice: number;
  totalSavings: number;
  isEmpty: boolean;
  hasItems: boolean;
}

export interface CartActionResult {
  success: boolean;
  error?: string;
}