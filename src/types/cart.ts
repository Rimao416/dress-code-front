// types/cart.ts

// Type pour la marque
export interface Brand {
  id: string;
  name: string;
  logo?: string;
  website?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string; // Première image du produit
    sku: string;
    brand?: Brand | string; // Peut être un objet Brand ou une string
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

// Helper type guard pour vérifier si brand est un objet
export const isBrandObject = (brand: Brand | string | undefined): brand is Brand => {
  return typeof brand === 'object' && brand !== null && 'name' in brand;
};

// Helper pour obtenir le nom de la marque
export const getBrandName = (brand: Brand | string | undefined): string | undefined => {
  if (!brand) return undefined;
  return typeof brand === 'string' ? brand : brand.name;
};