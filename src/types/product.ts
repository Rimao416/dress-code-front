// types/product.ts
export interface ProductVariant {
  id: string;
  productId?: string;
  name?: string;
  sku?: string;
  price?: number; // Prix spécifique au variant, sinon utilise le prix du produit
  comparePrice?: number | null;
  stock: number;
  available?: boolean;
  color?: string;
  size?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images?: string[];
  barcode?: string;
  position?: number; // Pour l'ordre d'affichage
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductWithFullData {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  categoryId: string;
  brandId: string;
  brand?: { 
    id: string;
    name: string;
    slug?: string;
    description?: string;
  };
  category?: {
    id: string;
    name: string;
    slug?: string;
    description?: string;
  };
  sku: string;
  stock: number;
  available: boolean;
  featured: boolean;
  isNewIn: boolean;
  tags: string[];
  slug: string;
  averageRating: number;
  reviewCount: number;
  // Champs supplémentaires pour ProductWithFullData
  variants?: ProductVariant[];
  specifications?: Record<string, any>;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  // Options d'expédition
  requiresShipping?: boolean;
  shippingClass?: string;
  // Gestion des taxes
  taxable?: boolean;
  taxClass?: string;
}

// Types pour le panier
export interface CartItem {
  id: string;
  productId: string;
  product: ProductWithFullData;
  variant: ProductVariant;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: Date;
}

export interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (
    product: ProductWithFullData,
    variant: ProductVariant,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemsCount: () => number;
  getCartTotal: () => number;
}