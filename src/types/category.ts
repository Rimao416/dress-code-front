import { Product } from "./product";

// types/category.ts - Version compatible avec Prisma


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