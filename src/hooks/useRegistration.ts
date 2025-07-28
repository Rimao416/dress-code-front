import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFormValidation } from './useFormValidation';
import { useMessages } from './useMessage';
import { authService } from '@/services/auth.service';
import { completeRegistrationSchema, CompleteRegistrationData } from '@/schemas/auth.schema';

export interface UseRegistrationReturn {
  register: (userData: CompleteRegistrationData) => Promise<boolean>;
  isRegistering: boolean;
  registrationError: string | null;
  validate: (data: CompleteRegistrationData) => boolean;
  errors: Record<string, string>;
  clearErrors: () => void;
}

export const useRegistration = (): UseRegistrationReturn => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const router = useRouter();

  // Intégration du système de messages globaux
  const { setMessage } = useMessages();

  const { validate, errors, clearAllErrors, setFieldError } = useFormValidation(completeRegistrationSchema);

  const register = useCallback(async (userData: CompleteRegistrationData): Promise<boolean> => {
    setRegistrationError(null);
   
    // Validation des données
    if (!validate(userData)) {
      // Afficher le premier message d'erreur de validation dans le système global
      const firstErrorField = Object.keys(errors)[0];
      const firstErrorMessage = errors[firstErrorField];
      if (firstErrorMessage) {
        setMessage(`${firstErrorField}: ${firstErrorMessage}`, 'error');
      } else {
        setMessage('Veuillez corriger les erreurs dans le formulaire', 'error');
      }
      return false;
    }

    setIsRegistering(true);

    try {
      const result = await authService.register(userData);
     
      if (result.success) {
        clearAllErrors();
        
        // Message de succès dans le système global
        setMessage('Compte créé avec succès ! Bienvenue !', 'success');
        
        // **NOUVELLE PARTIE : Redirection automatique après succès**
        // Petit délai pour laisser voir le message de succès
        setTimeout(() => {
          // Rediriger vers la page principale
          router.push('/'); // ou '/dashboard' selon votre structure
        }, 1500);
        
        return true;
      } else {
        const errorMessage = result.message || 'Erreur lors de l\'inscription';
        setRegistrationError(errorMessage);
       
        // Afficher l'erreur dans le système de messages globaux
        setMessage(errorMessage, 'error');
       
        // Gestion des erreurs de champs spécifiques
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, error]) => {
            setFieldError(field, error);
          });
         
          // Afficher la première erreur de champ dans le système global
          const firstFieldError = Object.entries(result.errors)[0];
          if (firstFieldError) {
            setMessage(`${firstFieldError[0]}: ${firstFieldError[1]}`, 'error');
          }
        }
       
        return false;
      }
    } catch (error) {
      const errorMessage = 'Une erreur inattendue est survenue';
      setRegistrationError(errorMessage);
     
      // Afficher l'erreur dans le système de messages globaux
      setMessage(errorMessage, 'error');
     
      console.error('Erreur lors de l\'inscription:', error);
      return false;
    } finally {
      setIsRegistering(false);
    }
  }, [validate, errors, clearAllErrors, setFieldError, setMessage, router]);

  return {
    register,
    isRegistering,
    registrationError,
    validate,
    errors,
    clearErrors: clearAllErrors
  };
};