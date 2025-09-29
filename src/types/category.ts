// types/category.ts
export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  children: Category[];
  products: any[]; // Ou Product[] si vous avez le type
  productCount?: number;
}

export interface CategoryWithProducts extends Category {
  productCount: number;
  children: CategoryWithProducts[];
}

export interface CategoryWithFullData extends Category {
  allProducts: any[]; // Ou Product[]
  totalProductsCount: number;
}

// Réponses API
export interface CategoryResponse {
  success: boolean;
  data?: CategoryWithFullData;
  error?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: CategoryWithProducts[];
  error?: string;
}

export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  productCount: number;
}