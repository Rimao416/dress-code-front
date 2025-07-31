import { Gender } from '../generated/prisma';
import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est obligatoire")
    .email("Veuillez saisir une adresse email valide")
    .toLowerCase()
    .trim(),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est obligatoire")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .trim(),
  lastName: z
    .string()
    .min(1, "Le nom est obligatoire")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .trim(),
  phone: z
    .string()
    .min(1, "Le téléphone est obligatoire")
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
  dateOfBirth: z
    .string()
    .optional()
    .refine((date) => !date || new Date(date) < new Date(), {
      message: "La date de naissance doit être dans le passé"
    }),
  gender: z.nativeEnum(Gender).optional(),
});

export const addressSchema = z.object({
  country: z.string().default("France"),
  address: z.string().optional(),
  postalCode: z
    .string()
    .optional()
    .refine((code) => !code || /^\d{5}$/.test(code), {
      message: "Le code postal doit contenir 5 chiffres"
    }),
  city: z.string().optional(),
  addressComplement: z.string().optional(),
});

export const completeRegistrationSchema = emailSchema
  .merge(passwordSchema)
  .merge(personalInfoSchema)
  .merge(addressSchema);
export const simpleRegistrationSchema = emailSchema
  .merge(passwordSchema)
  .merge(z.object({
    firstName: z
      .string()
      .min(1, "Le prénom est obligatoire")
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .trim(),
    lastName: z
      .string()
      .min(1, "Le nom est obligatoire")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .trim(),
  }));

export type SimpleRegistrationData = z.infer<typeof simpleRegistrationSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type CompleteRegistrationData = z.infer<typeof completeRegistrationSchema>;