import { useState, useCallback } from 'react';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export interface UseFormValidationReturn<T> {
  validate: (data: T) => boolean;
  errors: Record<string, string>;
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  clearAllErrors: () => void;
}

export const useFormValidation = <T>(schema: ZodSchema<T>): UseFormValidationReturn<T> => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((data: T): boolean => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue: ZodIssue) => {
          if (issue.path.length > 0) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema]);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    validate,
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors
  };
};
