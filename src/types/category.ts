// types/category.ts - Version compatible avec Prisma
export interface Brand {
  id: string;
  name: string;
  description?: string | null; // Compatible avec Prisma
  logo?: string | null;
  website?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
  material?: string | null;
  sku: string;
  price?: number | null;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  comparePrice?: number | null;
  images: string[];
  categoryId: string;
  brandId?: string | null;
  sku: string;
  stock: number;
  available: boolean;
  featured: boolean;
  isNewIn: boolean;
  tags: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug: string;
  weight?: number | null;
  dimensions?: any; // JSON type
  createdAt: Date;
  updatedAt: Date;
  brand?: Brand | null;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  description?: string | null; // Changé de undefined à null
  slug: string;
  image?: string | null;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  children: Category[];
  products: Product[];
}

export interface CategoryWithFullData extends Category {
  // Ajoute tous les produits des catégories enfants
  allProducts: Product[];
  // Nombre total de produits (direct + enfants)
  totalProductsCount: number;
}

// Type pour la réponse de l'API
export interface CategoryResponse {
  success: boolean;
  data?: CategoryWithFullData;
  error?: string;
}