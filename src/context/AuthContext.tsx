"use client";

import { Gender } from '../generated/prisma';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types basés sur le schema Prisma
export interface UserData {
  // Authentication information
  email: string;
  password: string;
 
  // Personal information (step 3)
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: Gender;
 
  // User preferences
  acceptedTerms: boolean;
  acceptedMarketing: boolean;
 
  // Address (step 4 - optional)
  country?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  addressComplement?: string;
}

// Interface pour la validation des étapes
export interface StepValidation {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
}

export interface AuthContextType {
  // User data
  userData: UserData;
  updateUserData: (field: keyof UserData, value: string | boolean) => void;
  resetUserData: () => void;
 
  // Loading states
  loading: boolean;
  setLoading: (loading: boolean) => void;
 
  // Errors
  errors: Record<string, string>;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
 
  // Current step for multi-step forms
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Step validation
  stepValidation: StepValidation;
  updateStepValidation: (step: keyof StepValidation, isValid: boolean) => void;
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

const initialStepValidation: StepValidation = {
  step1: false,
  step2: false,
  step3: false,
  step4: true, // L'étape 4 est optionnelle
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
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepValidation, setStepValidation] = useState<StepValidation>(initialStepValidation);

  const updateUserData = (field: keyof UserData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value,
    }));
   
    // Clear error when user updates field
    if (errors[field]) {
      clearError(field);
    }
  };

  const resetUserData = () => {
    setUserData(initialUserData);
    setCurrentStep(1);
    setStepValidation(initialStepValidation);
    clearAllErrors();
  };

  const setError = (field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const updateStepValidation = (step: keyof StepValidation, isValid: boolean) => {
    setStepValidation(prev => ({
      ...prev,
      [step]: isValid,
    }));
  };

  const value: AuthContextType = {
    userData,
    updateUserData,
    resetUserData,
    loading,
    setLoading,
    errors,
    setError,
    clearError,
    clearAllErrors,
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    stepValidation,
    updateStepValidation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};