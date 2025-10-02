"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserData, AuthenticatedUser, AuthCheckResponse } from '@/types/auth.type';
import { Gender } from '@/generated/prisma';
import { useOrderStore } from '@/store/useOrderStore';

// Interface pour la validation des étapes
export interface AuthContextType {
  // User data (pour l'inscription)
  userData: UserData;
  updateUserData: (field: keyof UserData, value: string | boolean) => void;
  resetUserData: () => void;
 
  // Authentication state
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  setUser: (user: AuthenticatedUser | null) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>; // Ajout pour permettre un refresh manuel
 
  // Loading states
  loading: boolean;
  setLoading: (loading: boolean) => void;
 
  // Errors
  errors: Record<string, string>;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
}

const initialUserData: UserData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',
  gender: Gender.MALE,
  acceptedTerms: false,
  acceptedMarketing: false,
  country: 'France',
  address: '',
  postalCode: '',
  city: '',
  addressComplement: '',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [loading, setLoading] = useState<boolean>(true); // ✅ Commence par true pour le check initial
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // ✅ Fonction exposée pour permettre un refresh manuel
  const checkAuthStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache', // ✅ Force pas de cache
        }
      });

      console.log('Auth check response status:', response.status);
      
      if (response.ok) {
        const userData: AuthenticatedUser = await response.json();
        console.log('✅ User data from /api/auth/me:', userData);
        
        // ✅ La réponse contient directement l'utilisateur, pas dans une propriété user
        if (userData && userData.id) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log('❌ No valid user data found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('❌ Auth check failed with status:', response.status);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de l\'authentification:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier l'authentification au chargement
  useEffect(() => {
    console.log('🔄 AuthProvider: Initial auth check');
    checkAuthStatus();
  }, []);

  // ✅ Log des changements d'état pour debug
  useEffect(() => {
    console.log('👤 User state changed:', user);
  }, [user]);

  useEffect(() => {
    console.log('🔐 IsAuthenticated changed:', isAuthenticated);
  }, [isAuthenticated]);

  const updateUserData = (field: keyof UserData, value: string | boolean): void => {
    setUserData(prev => ({
      ...prev,
      [field]: value,
    }));
   
    // Clear error when user updates field
    if (errors[field]) {
      clearError(field);
    }
  };

  const resetUserData = (): void => {
    setUserData(initialUserData);
    clearAllErrors();
  };

  const setError = (field: string, error: string): void => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const clearError = (field: string): void => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = (): void => {
    setErrors({});
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
     
      // Appel à votre API de déconnexion
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        console.warn('Erreur lors de la déconnexion côté serveur');
      }
     
      // ✅ Réinitialiser l'état local dans tous les cas
       setUser(null);
      
      // ✅ Reset le store des orders
      useOrderStore.getState().reset();
      
      // router.push('/');
      setIsAuthenticated(false);
      resetUserData();
     
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // On réinitialise quand même l'état local
      setUser(null);
      setIsAuthenticated(false);
      resetUserData();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction helper pour mettre à jour l'utilisateur après inscription/connexion
// ✅ Fonction helper pour mettre à jour l'utilisateur
const updateUserAfterAuth = (newUser: AuthenticatedUser | null) => {
  console.log('🔄 Updating user after auth:', newUser);
  
  if (newUser) {
    setUser(newUser);
    setIsAuthenticated(true);
  } else {
    setUser(null);
    setIsAuthenticated(false);
  }
};

  const value: AuthContextType = {
    userData,
    updateUserData,
    resetUserData,
    isAuthenticated,
    user,
    setUser: updateUserAfterAuth, // ✅ Utilise la fonction helper
    logout,
    checkAuthStatus, // ✅ Expose la fonction
    loading,
    setLoading,
    errors,
    setError,
    clearError,
    clearAllErrors,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};