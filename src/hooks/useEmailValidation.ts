import { emailSchema } from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { useState, useCallback } from 'react';

export interface UseEmailValidationReturn {
  checkEmail: (email: string) => Promise<{ isValid: boolean; error?: string; exists?: boolean }>;
  isChecking: boolean;
  lastCheckedEmail: string | null;
}

export const useEmailValidation = (): UseEmailValidationReturn => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string | null>(null);

  const checkEmail = useCallback(async (email: string) => {
    if (!email.trim()) {
      return { isValid: false, error: "L'adresse email est obligatoire" };
    }

    // Validation Zod d'abord
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      return {
        isValid: false,
        error: validation.error.issues[0]?.message || "Email invalide"
      };
    }

    // Vérification de l'existence en base
    setIsChecking(true);
    
    try {
      const result = await authService.checkEmailExists(email);
      setLastCheckedEmail(email);
      
      console.log('Service result:', result); // Debug log
      
      if (result.exists) {
        return {
          isValid: false,
          error: "Cette adresse email est déjà utilisée",
          exists: true
        };
      }

      // Email disponible = valide
      return { 
        isValid: true, 
        exists: false,
        error: undefined
      };
      
    } catch (error) {
      console.error('Unexpected error in checkEmail:', error);
      return {
        isValid: false,
        error: "Erreur inattendue lors de la vérification"
      };
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    checkEmail,
    isChecking,
    lastCheckedEmail
  };
};