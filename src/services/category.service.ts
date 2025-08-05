// services/categoryService.ts
import { CategoryResponse, CategoryWithFullData } from '@/types/category';

class CategoryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/categories';
  }

  async getCategoryBySlug(slug: string): Promise<CategoryWithFullData> {
    try {
      // Validation du slug
      if (!slug || slug.trim() === '') {
        throw new Error('Slug is required');
      }

      console.log(`Fetching category with slug: ${slug}`);
      
      const url = `${this.baseUrl}/${encodeURIComponent(slug)}`;
      console.log(`Request URL: ${url}`);

      // Utiliser une approche compatible pour le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            // Si on ne peut pas parser l'erreur, on garde le message par défaut
          }
          
          throw new Error(errorMessage);
        }

        const result: CategoryResponse = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch category');
        }

        if (!result.data) {
          throw new Error('No category data received');
        }

        console.log('Category fetched successfully:', result.data.name);
        return result.data;

      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }

    } catch (error) {
      console.error('Error fetching category:', error);
      
      // Améliorer les messages d'erreur
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server');
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: The server took too long to respond');
      }
      
      throw error;
    }
  }

  async getAllCategories(): Promise<CategoryWithFullData[]> {
    try {
      console.log('Fetching all categories');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(this.baseUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch categories');
        }

        return result.data || [];

      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }

    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Méthode utilitaire pour tester la connexion API
  async testConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(`${this.baseUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;

      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }

    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

export const categoryService = new CategoryService();