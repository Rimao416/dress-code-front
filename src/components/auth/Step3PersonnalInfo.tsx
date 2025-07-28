"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import FormField from "@/components/ui/formfield";
import Input from "@/components/ui/input";
import { motion } from "framer-motion";

interface Step3PersonalInfoProps {
  firstName: string;
  lastName: string;
  phone: string;
  onFirstNameChange: (firstName: string) => void;
  onLastNameChange: (lastName: string) => void;
  onPhoneChange: (phone: string) => void;
  onValidationChange: (isValid: boolean) => void;
  errors?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

// Fonctions de validation déplacées à l'extérieur du composant
const validateFirstName = (firstName: string): string => {
  if (!firstName || firstName.trim().length === 0) {
    return "Le prénom est requis";
  }
  if (firstName.trim().length < 2) {
    return "Le prénom doit contenir au moins 2 caractères";
  }
  return "";
};

const validateLastName = (lastName: string): string => {
  if (!lastName || lastName.trim().length === 0) {
    return "Le nom est requis";
  }
  if (lastName.trim().length < 2) {
    return "Le nom doit contenir au moins 2 caractères";
  }
  return "";
};

const validatePhone = (phone: string): string => {
  if (!phone || phone.trim().length === 0) {
    return "Le numéro de téléphone est requis";
  }
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return "Numéro de téléphone invalide";
  }
  return "";
};



export default function Step3PersonalInfo({
  firstName,
  lastName,
  phone,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onValidationChange,
  errors = {}
}: Step3PersonalInfoProps) {
  // États pour suivre si l'utilisateur a touché aux champs
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  
  const [localFirstNameError, setLocalFirstNameError] = useState<string>("");
  const [localLastNameError, setLocalLastNameError] = useState<string>("");
  const [localPhoneError, setLocalPhoneError] = useState<string>("");

  // Validation des champs avec useMemo - seulement si le champ a été touché
  const validationFirstNameError = useMemo(() => {
    return firstNameTouched ? validateFirstName(firstName) : "";
  }, [firstName, firstNameTouched]);

  const validationLastNameError = useMemo(() => {
    return lastNameTouched ? validateLastName(lastName) : "";
  }, [lastName, lastNameTouched]);

  const validationPhoneError = useMemo(() => {
    return phoneTouched ? validatePhone(phone) : "";
  }, [phone, phoneTouched]);

  // Mise à jour des erreurs locales
  useEffect(() => {
    setLocalFirstNameError(errors.firstName || validationFirstNameError);
    setLocalLastNameError(errors.lastName || validationLastNameError);
    setLocalPhoneError(errors.phone || validationPhoneError);
  }, [
    errors.firstName,
    errors.lastName,
    errors.phone,
    validationFirstNameError,
    validationLastNameError,
    validationPhoneError,
  ]);

  // Calcul de la validité - on vérifie la validité réelle même si pas d'erreurs affichées
  const isValid = useMemo(() => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      phone.trim() !== "" &&
      validateFirstName(firstName) === "" &&
      validateLastName(lastName) === "" &&
      validatePhone(phone) === ""
    );
  }, [
    firstName,
    lastName,
    phone,
  ]);

  // Notification au parent quand la validité change (avec useRef pour éviter les boucles)
  const lastValidRef = useRef<boolean>(false);
  useEffect(() => {
    if (isValid !== lastValidRef.current) {
      lastValidRef.current = isValid;
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  // Gestionnaires d'événements avec gestion du "touched"
  const handleFirstNameChange = (value: string) => {
    if (!firstNameTouched) setFirstNameTouched(true);
    onFirstNameChange(value);
  };

  const handleLastNameChange = (value: string) => {
    if (!lastNameTouched) setLastNameTouched(true);
    onLastNameChange(value);
  };

  const handlePhoneChange = (value: string) => {
    if (!phoneTouched) setPhoneTouched(true);
    onPhoneChange(value);
  };

  // Gestionnaires onBlur pour marquer comme "touched" quand l'utilisateur quitte le champ
  const handleFirstNameBlur = () => {
    setFirstNameTouched(true);
  };

  const handleLastNameBlur = () => {
    setLastNameTouched(true);
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormField label="Prénom" error={localFirstNameError}>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => handleFirstNameChange(e.target.value)}
            onBlur={handleFirstNameBlur}
            placeholder="Votre prénom"
            className="lg:text-base text-lg lg:py-2 py-3"
          />
        </FormField>
       
        <FormField label="Nom" error={localLastNameError}>
          <Input
            type="text"
            value={lastName}
            onChange={(e) => handleLastNameChange(e.target.value)}
            onBlur={handleLastNameBlur}
            placeholder="Votre nom"
            className="lg:text-base text-lg lg:py-2 py-3"
          />
        </FormField>
      </div>
     
      <FormField label="Téléphone" error={localPhoneError}>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={handlePhoneBlur}
          placeholder="Votre numéro de téléphone"
          className="lg:text-base text-lg lg:py-2 py-3"
        />
      </FormField>
     
    </motion.div>
  );
}