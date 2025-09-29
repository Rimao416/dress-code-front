// services/category.service.ts
import { 
  CategoryResponse, 
  CategoriesResponse, 
  CategoryWithProducts,
  CategoryWithFullData,
  Category
} from '@/types/category';

class CategoryService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Récupère toutes les catégories avec leur nombre de produits
   */
  async getCategoriesWithProducts(): Promise<CategoriesResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/categories/with-product-count`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          next: { 
            revalidate: 600, // Cache pendant 10 minutes
            tags: ['categories-with-products'],
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transformer les dates en objets Date
      if (data.success && data.data) {
        data.data = data.data.map((cat: any) => this.transformCategoryDates(cat));
      }

      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      };
    }
  }

  /**
   * Récupère une catégorie par son slug avec tous ses produits
   */
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/categories/${slug}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          next: { 
            revalidate: 300, // Cache pendant 5 minutes
            tags: [`category-${slug}`],
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Category not found',
          } as CategoryResponse;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transformer les dates
      if (data.success && data.data) {
        data.data = this.transformCategoryDates(data.data);
      }

      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch category',
      } as CategoryResponse;
    }
  }

  /**
   * Récupère les catégories principales (sans parent)
   */
  async getMainCategories(): Promise<CategoriesResponse> {
    const response = await this.getCategoriesWithProducts();
    
    if (response.success) {
      // Filtrer uniquement les catégories principales
      const mainCategories = response.data.filter(cat => !cat.parentId);
      return {
        success: true,
        data: mainCategories,
      };
    }
    
    return response;
  }

  /**
   * Récupère les sous-catégories d'une catégorie
   */
  async getSubCategories(parentSlug: string): Promise<CategoriesResponse> {
    const response = await this.getCategoryBySlug(parentSlug);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.children as CategoryWithProducts[],
      };
    }
    
    return {
      success: false,
      data: [],
      error: response.error,
    };
  }

  /**
   * Cherche des catégories par nom
   */
  async searchCategories(query: string): Promise<CategoriesResponse> {
    const response = await this.getCategoriesWithProducts();
    
    if (!response.success) {
      return response;
    }

    const searchInCategories = (categories: CategoryWithProducts[], searchQuery: string): CategoryWithProducts[] => {
      const results: CategoryWithProducts[] = [];
      const lowerQuery = searchQuery.toLowerCase();

      categories.forEach(category => {
        // Vérifier si la catégorie correspond
        if (category.name.toLowerCase().includes(lowerQuery) || 
            category.description?.toLowerCase().includes(lowerQuery)) {
          results.push(category);
        }

        // Chercher dans les enfants
        if (category.children && category.children.length > 0) {
          const childResults = searchInCategories(category.children, searchQuery);
          results.push(...childResults);
        }
      });

      return results;
    };

    const filteredCategories = searchInCategories(response.data, query);

    return {
      success: true,
      data: filteredCategories,
    };
  }

  /**
   * Génère le breadcrumb pour une catégorie
   */
  generateCategoryBreadcrumbs(category: CategoryWithFullData | CategoryWithProducts) {
    const breadcrumbs = [
      { name: 'Accueil', href: '/' },
      { name: 'Collections', href: '/collections' }
    ];

    // Fonction récursive pour construire le chemin
    const buildPath = (cat: any): void => {
      if (cat.parent) {
        buildPath(cat.parent);
      }
      breadcrumbs.push({
        name: cat.name,
        href: `/collections/${cat.slug}`
      });
    };

    // Si la catégorie a un parent dans les données, l'utiliser
    // Sinon, juste ajouter la catégorie actuelle
    breadcrumbs.push({
      name: category.name,
      href: `/collections/${category.slug}`
    });

    return breadcrumbs;
  }

  /**
   * Compte le nombre total de produits dans une catégorie (incluant sous-catégories)
   */
  countTotalProducts(category: CategoryWithProducts): number {
    let total = category.productCount || 0;

    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        total += this.countTotalProducts(child);
      });
    }

    return total;
  }

  /**
   * Aplatit l'arbre des catégories en liste
   */
  flattenCategories(categories: CategoryWithProducts[]): CategoryWithProducts[] {
    const flattened: CategoryWithProducts[] = [];

    const flatten = (cats: CategoryWithProducts[]) => {
      cats.forEach(cat => {
        flattened.push(cat);
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children);
        }
      });
    };

    flatten(categories);
    return flattened;
  }

  /**
   * Trouve une catégorie par ID dans l'arbre
   */
  findCategoryById(categories: CategoryWithProducts[], id: string): CategoryWithProducts | null {
    for (const category of categories) {
      if (category.id === id) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = this.findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Transformer les chaînes de date en objets Date
   */
  private transformCategoryDates(category: any): CategoryWithProducts {
    const transformed = {
      ...category,
      createdAt: new Date(category.createdAt),
      updatedAt: new Date(category.updatedAt),
    };

    if (category.children && Array.isArray(category.children)) {
      transformed.children = category.children.map((child: any) => 
        this.transformCategoryDates(child)
      );
    }

    return transformed;
  }

  /**
   * Trie les catégories par sortOrder puis par nom
   */
  sortCategories(categories: CategoryWithProducts[]): CategoryWithProducts[] {
    return [...categories].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });
  }
}

// Instance singleton
export const categoryService = new CategoryService();
export default categoryService;