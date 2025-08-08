// stores/checkoutStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CheckoutFormData {
  // Contact
  email: string;
  emailOptIn: boolean;
  
  // Adresse de livraison
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  postalCode: string;
  city: string;
  phone: string;
  smsOptIn: boolean;
  
  // Codes promo et options
  discountCode: string;
  
  // Informations de livraison (pour l'étape suivante)
  deliveryMethod?: 'standard' | 'express' | 'pickup';
  deliveryDate?: string;
  deliveryTime?: string;
  
  // Informations de paiement (pour l'étape suivante)
  paymentMethod?: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  cardName?: string;
  billingAddressSameAsShipping?: boolean;
  billingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    postalCode: string;
    city: string;
    country: string;
  };
}

export interface CheckoutState {
  // État du formulaire
  formData: CheckoutFormData;
  currentStep: number;
  isLoading: boolean;
  errors: Record<string, string>;
  
  // Actions
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setLoading: (loading: boolean) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  validateStep: (step: number) => boolean;
  resetCheckout: () => void;
  
  // Getters calculés
  getStepTitle: (step: number) => string;
  getStepProgress: () => number;
  isStepValid: (step: number) => boolean;
  canProceedToNextStep: () => boolean;
}

const initialFormData: CheckoutFormData = {
  email: '',
  emailOptIn: false,
  country: 'France',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  postalCode: '',
  city: '',
  phone: '',
  smsOptIn: false,
  discountCode: '',
  billingAddressSameAsShipping: true,
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 1,
      isLoading: false,
      errors: {},

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setCurrentStep: (step) =>
        set(() => ({
          currentStep: Math.max(1, Math.min(3, step)),
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(3, state.currentStep + 1),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1),
        })),

      setLoading: (loading) =>
        set(() => ({
          isLoading: loading,
        })),

      setError: (field, error) =>
        set((state) => ({
          errors: { ...state.errors, [field]: error },
        })),

      clearError: (field) =>
        set((state) => {
          const { [field]: _, ...restErrors } = state.errors;
          return { errors: restErrors };
        }),

      clearAllErrors: () =>
        set(() => ({
          errors: {},
        })),

      validateStep: (step) => {
        const { formData } = get();
        const errors: Record<string, string> = {};

        switch (step) {
          case 1: // Informations
            if (!formData.email) errors.email = 'L\'email est requis';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) {
              errors.email = 'L\'email n\'est pas valide';
            }
            
            if (!formData.firstName) errors.firstName = 'Le prénom est requis';
            if (!formData.lastName) errors.lastName = 'Le nom est requis';
            if (!formData.address) errors.address = 'L\'adresse est requise';
            if (!formData.postalCode) errors.postalCode = 'Le code postal est requis';
            if (!formData.city) errors.city = 'La ville est requise';
            if (!formData.phone) errors.phone = 'Le téléphone est requis';
            break;

          case 2: // Livraison
            if (!formData.deliveryMethod) {
              errors.deliveryMethod = 'Veuillez choisir un mode de livraison';
            }
            break;

          case 3: // Paiement
            if (!formData.paymentMethod) {
              errors.paymentMethod = 'Veuillez choisir un mode de paiement';
            }
            
            if (formData.paymentMethod === 'card') {
              if (!formData.cardNumber) errors.cardNumber = 'Le numéro de carte est requis';
              if (!formData.cardExpiry) errors.cardExpiry = 'La date d\'expiration est requise';
              if (!formData.cardCVV) errors.cardCVV = 'Le CVV est requis';
              if (!formData.cardName) errors.cardName = 'Le nom sur la carte est requis';
            }
            break;
        }

        set(() => ({ errors }));
        return Object.keys(errors).length === 0;
      },

      resetCheckout: () =>
        set(() => ({
          formData: initialFormData,
          currentStep: 1,
          isLoading: false,
          errors: {},
        })),

      getStepTitle: (step) => {
        const titles = {
          1: 'Informations',
          2: 'Livraison',
          3: 'Paiement',
        };
        return titles[step as keyof typeof titles] || '';
      },

      getStepProgress: () => {
        const { currentStep } = get();
        return (currentStep / 3) * 100;
      },

      isStepValid: (step) => {
        const { validateStep } = get();
        return validateStep(step);
      },

      canProceedToNextStep: () => {
        const { currentStep, validateStep } = get();
        return validateStep(currentStep);
      },
    }),
    {
      name: 'checkout-storage',
      // Optionnel: ne persister que certaines données
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);