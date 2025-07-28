"use client";
import { useState, useEffect } from 'react';
import FormField from "@/components/ui/formfield";
import Input from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface Step1EmailProps {
  email: string;
  onEmailChange: (email: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function Step1Email({ email, onEmailChange, onValidationChange }: Step1EmailProps) {
  const { checkEmail, isChecking, lastCheckedEmail } = useEmailValidation();
  const [error, setError] = useState<string>("");
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  // Debounce la validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email && email !== lastCheckedEmail) {
        validateEmail();
      } else if (!email) {
        setError("");
        setIsValid(false);
        setEmailExists(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email, lastCheckedEmail]);

  const validateEmail = async () => {
    const result = await checkEmail(email);
    
    setError(result.error || "");
    setEmailExists(result.exists || false);
    setIsValid(result.isValid);
    onValidationChange(result.isValid);
  };

  const getInputIcon = () => {
    if (isChecking) {
      return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
    }
    if (email && !isChecking) {
      return isValid 
        ? <CheckCircle className="w-5 h-5 text-green-500" />
        : <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return null;
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <FormField label="Adresse email" error={error}>
        <div className="relative">
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="votre.email@exemple.com"
            className={`lg:text-base text-lg lg:py-2 py-3 pr-12 ${
              error ? "border-red-500" : isValid ? "border-green-500" : ""
            }`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getInputIcon()}
          </div>
        </div>
      </FormField>
     
      {emailExists && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm mb-2">
            Cette adresse email est déjà utilisée
          </p>
          <Link
            href="/auth/login"
            className="text-red-800 hover:text-red-900 font-semibold text-sm underline"
          >
            Se connecter avec cet email
          </Link>
        </div>
      )}

      {isValid && !emailExists && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            ✓ Adresse email disponible
          </p>
        </div>
      )}
    </motion.div>
  );
}