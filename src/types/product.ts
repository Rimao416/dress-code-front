// types/product.ts - Types étendus pour la page produit
import { Brand } from "./brand";

export interface ProductReview {
  id: string;
  productId: string;
  rating: number;
  comment?: string;
  isVisible: boolean;
  createdAt: Date;
  client: {
    firstName: string;
    lastName: string;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  } | null;
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

export interface ProductWithFullData {
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
  dimensions?: any;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  category: ProductCategory;
  brand?: Brand | null;
  variants: ProductVariant[];
  reviews: ProductReview[];
  averageRating: number;
  
  // Counts
  _count: {
    reviews: number;
    favorites: number;
  };
}

export interface ProductResponse {
  success: boolean;
  data: ProductWithFullData;
  error?: string;
}

export interface SimilarProductsResponse {
  success: boolean;
  data: ProductCardData[];
  error?: string;
}

export interface RecommendedProductsResponse {
  success: boolean;
  data: ProductCardData[];
  error?: string;
}

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  brand?: {
    name: string;
  } | null;
  category?: {
    name: string;
  } | null;
  _count?: {
    reviews: number;
  };
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
  dimensions?: any;
  createdAt: Date;
  updatedAt: Date;
  brand?: Brand | null;
  variants: ProductVariant[];
}

export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  images: string[];
  brand?: Pick<Brand, 'name'> | null;
  stock?: number;
  comparePrice?: number | null;
  featured?: boolean;
  isNewIn?: boolean;
}

export type ProductCardItem = Product | ProductCardData;

export function isFullProduct(item: ProductCardItem): item is Product {
  return 'description' in item && 'sku' in item && 'categoryId' in item;
}

// Fonction utilitaire pour normaliser les données
export function normalizeProductForCard(item: ProductCardItem): {
  id: string;
  name: string;
  price: number;
  images: string[];
  brand?: { name: string } | null;
  stock: number;
  comparePrice?: number | null;
  featured: boolean;
  isNewIn: boolean;
} {
  if (isFullProduct(item)) {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      images: item.images,
      brand: item.brand,
      stock: item.stock,
      comparePrice: item.comparePrice,
      featured: item.featured,
      isNewIn: item.isNewIn,
    };
  } else {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      images: item.images,
      brand: item.brand,
      stock: item.stock ?? 10,
      comparePrice: item.comparePrice,
      featured: item.featured ?? false,
      isNewIn: item.isNewIn ?? false,
    };
  }
}

// Fonction utilitaire pour convertir les anciennes données vers le nouveau format
export function convertLegacyProductData(data: {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: string;
  alt: string;
}): ProductCardData {
  return {

    id: String(data.id),
    name: data.name,
    slug: data.name.replace(/\s+/g, '-').toLowerCase(),
    price: data.price,
    images: [data.image], // Convertir image vers images[]
    brand: { name: data.brand }, // Convertir string vers objet
    stock: 10, // valeur par défaut
    comparePrice: null,
    featured: false,
    isNewIn: false,
  };
}