// components/auth/registration-steps/Step2Password.tsx
"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import FormField from "@/components/ui/formfield";
import Input from "@/components/ui/input";
import { motion } from "framer-motion";

interface Step2PasswordProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onValidationChange: (isValid: boolean) => void;
  passwordError?: string;
  confirmPasswordError?: string;
}

// Fonctions de validation personnalisées
const validatePassword = (password: string): string => {
  if (!password) return "";
 
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  }
 
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule";
  }
 
  if (!/[a-z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une minuscule";
  }
 
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre";
  }
 
  return ""; // Pas d'erreur
};

const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return "";
 
  if (password !== confirmPassword) {
    return "Les mots de passe ne correspondent pas";
  }
 
  return ""; // Pas d'erreur
};

export default function Step2Password({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onValidationChange,
  passwordError,
  confirmPasswordError
}: Step2PasswordProps) {
  const [localPasswordError, setLocalPasswordError] = useState<string>("");
  const [localConfirmPasswordError, setLocalConfirmPasswordError] = useState<string>("");

  // Validation du mot de passe
  const validationPasswordError = useMemo(() => {
    return validatePassword(password);
  }, [password]);

  // Validation de la confirmation
  const validationConfirmPasswordError = useMemo(() => {
    return validateConfirmPassword(password, confirmPassword);
  }, [password, confirmPassword]);

  // Mise à jour des erreurs locales
  useEffect(() => {
    // Utiliser les erreurs du parent en priorité, sinon les erreurs de validation
    setLocalPasswordError(passwordError || validationPasswordError);
    setLocalConfirmPasswordError(confirmPasswordError || validationConfirmPasswordError);
  }, [passwordError, confirmPasswordError, validationPasswordError, validationConfirmPasswordError]);

  // Calcul de la validité
  const isValid = useMemo(() => {
    return (
      password !== "" &&
      confirmPassword !== "" &&
      validationPasswordError === "" &&
      validationConfirmPasswordError === ""
    );
  }, [password, confirmPassword, validationPasswordError, validationConfirmPasswordError]);

  // Notification au parent quand la validité change
  const lastValidRef = useRef<boolean>(false);
 
  useEffect(() => {
    if (isValid !== lastValidRef.current) {
      lastValidRef.current = isValid;
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  // Vérifications individuelles pour les indicateurs visuels
  const passwordChecks = useMemo(() => {
    if (!password) return {
      length: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false
    };
   
    return {
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    };
  }, [password]);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      
    >
      <FormField label="Mot de passe" error={localPasswordError}>
        <Input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Créez un mot de passe sécurisé"
          showPasswordToggle
          className="lg:text-base text-lg lg:py-2 py-3"
        />
      </FormField>
     
      <FormField label="Confirmer le mot de passe" error={localConfirmPasswordError}>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          placeholder="Confirmez votre mot de passe"
          showPasswordToggle
          className="lg:text-base text-lg lg:py-2 py-3"
        />
      </FormField>

      {/* Indicateurs de force du mot de passe - uniquement si password n'est pas vide */}
      {password && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Force du mot de passe :</p>
          <div className="grid grid-cols-2 gap-1">
            <div className={`text-xs ${passwordChecks.length ? 'text-green-600' : 'text-gray-400'}`}>
              ✓ Au moins 8 caractères
            </div>
            <div className={`text-xs ${passwordChecks.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
              ✓ Au moins une majuscule
            </div>
            <div className={`text-xs ${passwordChecks.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
              ✓ Au moins une minuscule
            </div>
            <div className={`text-xs ${passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
              ✓ Au moins un chiffre
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}