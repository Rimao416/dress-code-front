// lib/email/resend.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY n\'est pas définie dans les variables d\'environnement');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: 'Votre Boutique <onboarding@resend.dev>', // Change avec ton domaine vérifié
  replyTo: 'support@votreboutique.com', // Change avec ton email
} as const;