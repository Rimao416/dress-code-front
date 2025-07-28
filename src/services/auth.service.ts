// services/auth.service.ts
import { CompleteRegistrationData } from '@/schemas/auth.schema';

export interface EmailCheckResponse {
  exists: boolean;
  message?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

class AuthService {
  private baseUrl: string;

  constructor() {
    // Configuration de l'URL de base selon l'environnement
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  private async handleApiResponse(response: Response): Promise<ApiResponse> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        // Gestion des erreurs selon le status code
        if (response.status === 400) {
          // Erreur de validation
          const errors: Record<string, string> = {};
          
          if (data.details && Array.isArray(data.details)) {
            // Transformer les erreurs Zod en format utilisable
            data.details.forEach((detail: any) => {
              const fieldName = detail.path?.join('.') || 'unknown';
              errors[fieldName] = detail.message;
            });
          }
          
          return {
            success: false,
            message: data.error || 'Données invalides',
            errors: Object.keys(errors).length > 0 ? errors : undefined
          };
        } else if (response.status === 409) {
          // Conflit - utilisateur existe déjà
          return {
            success: false,
            message: data.error || 'Un compte avec cette adresse email existe déjà'
          };
        } else if (response.status >= 500) {
          // Erreur serveur
          return {
            success: false,
            message: 'Erreur serveur. Veuillez réessayer plus tard.'
          };
        } else {
          // Autres erreurs
          return {
            success: false,
            message: data.error || 'Une erreur inattendue s\'est produite'
          };
        }
      }
      
      // Succès
      return {
        success: true,
        message: data.message || 'Opération réussie',
        data: data.user || data
      };
      
    } catch (error) {
      console.error('Erreur lors du parsing de la réponse:', error);
      return {
        success: false,
        message: 'Erreur de communication avec le serveur'
      };
    }
  }

  async checkEmailExists(email: string): Promise<EmailCheckResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la vérification de l\'email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking email:', error);
      return {
        exists: false,
        message: 'Erreur lors de la vérification de l\'email'
      };
    }
  }

  async register(userData: CompleteRegistrationData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return await this.handleApiResponse(response);
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Erreur réseau ou autre erreur non prévue
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Erreur de connexion. Vérifiez votre connexion internet.'
        };
      }
      
      return {
        success: false,
        message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
      };
    }
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      return await this.handleApiResponse(response);
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        message: 'Une erreur s\'est produite lors de la connexion'
      };
    }
  }
    async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: any }> {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isAuthenticated: true,
          user: data.user,
        };
      }

      return { isAuthenticated: false };
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      return { isAuthenticated: false };
    }
  }

}

export const authService = new AuthService();