// lib/email/service.ts
import * as React from 'react';
import { resend, EMAIL_CONFIG } from './resend';
import { WelcomeEmail } from './templates/welcome';

interface SendWelcomeEmailParams {
  email: string;
  firstName: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envoie un email de bienvenue à un nouvel utilisateur
 */
export async function sendWelcomeEmail({ 
  email, 
  firstName 
}: SendWelcomeEmailParams): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: `Bienvenue ${firstName} ! 🎉`,
      react: WelcomeEmail({ firstName, email }) as React.ReactElement,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'envoi de l\'email',
      };
    }

    console.log('Email de bienvenue envoyé avec succès:', data?.id);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Fonction utilitaire pour envoyer l'email de manière asynchrone
 * sans bloquer la réponse de l'API
 */
export async function sendWelcomeEmailAsync(params: SendWelcomeEmailParams): Promise<void> {
  // Envoyer l'email sans attendre le résultat
  sendWelcomeEmail(params).catch((error) => {
    console.error('Erreur lors de l\'envoi asynchrone de l\'email:', error);
  });
}