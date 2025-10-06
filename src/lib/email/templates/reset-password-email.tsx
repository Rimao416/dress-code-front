// lib/email/templates/reset-password.tsx
import * as React from 'react';

interface ResetPasswordEmailProps {
  firstName?: string;
  email: string;
  resetUrl: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({ 
  firstName, 
  email, 
  resetUrl 
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>🔐</div>
        </div>

        {/* Contenu principal */}
        <div style={styles.content}>
          <h1 style={styles.title}>
            Réinitialisation de votre mot de passe
          </h1>

          <div style={styles.decorativeLine}></div>

          <p style={styles.text}>
            {firstName ? `Bonjour ${firstName},` : 'Bonjour,'}
          </p>

          <p style={styles.text}>
            Vous avez demandé à réinitialiser votre mot de passe pour votre compte associé à l'adresse <strong>{email}</strong>.
          </p>

          <p style={styles.text}>
            Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
          </p>

          {/* Bouton CTA */}
          <div style={styles.ctaContainer}>
            <a href={resetUrl} style={styles.button}>
              Réinitialiser mon mot de passe
            </a>
          </div>

          {/* Informations de sécurité */}
          <div style={styles.warningBox}>
            <div style={styles.warningIcon}>⚠️</div>
            <div>
              <p style={styles.warningTitle}>Important :</p>
              <ul style={styles.warningList}>
                <li style={styles.warningItem}>Ce lien est valide pendant <strong>1 heure</strong></li>
                <li style={styles.warningItem}>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                <li style={styles.warningItem}>Ne partagez jamais ce lien avec qui que ce soit</li>
              </ul>
            </div>
          </div>

          {/* Lien alternatif */}
          <div style={styles.alternativeLink}>
            <p style={styles.alternativeLinkText}>
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            <div style={styles.linkBox}>
              <a href={resetUrl} style={styles.linkText}>{resetUrl}</a>
            </div>
          </div>

          {/* Support */}
          <div style={styles.supportBox}>
            <p style={styles.supportText}>
              Besoin d'aide ? Notre équipe est là pour vous.
            </p>
            <a href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/contact`} style={styles.supportLink}>
              Contactez-nous
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Cet email a été envoyé à <strong>{email}</strong> suite à une demande de réinitialisation de mot de passe.
          </p>
          <p style={styles.footerText}>
            Si vous n'avez pas effectué cette demande, vous pouvez ignorer cet email en toute sécurité.
          </p>
          <p style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Conditions d'utilisation</a>
            {' · '}
            <a href="#" style={styles.footerLink}>Politique de confidentialité</a>
            {' · '}
            <a href="#" style={styles.footerLink}>Centre d'aide</a>
          </p>
          <p style={styles.footerCopyright}>
            © 2025 Votre Boutique. Tous droits réservés.
          </p>
        </div>
      </div>
    </body>
  </html>
);

// Styles inline pour compatibilité email
const styles = {
  body: {
    backgroundColor: '#f5f5f4',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: '40px 20px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    backgroundColor: '#7f1d1d',
    padding: '40px',
    textAlign: 'center' as const,
  },
  headerIcon: {
    fontSize: '48px',
    lineHeight: '1',
  },
  content: {
    padding: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600' as const,
    color: '#171717',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  decorativeLine: {
    width: '60px',
    height: '4px',
    backgroundColor: '#7f1d1d',
    opacity: 0.2,
    marginBottom: '30px',
    borderRadius: '2px',
  },
  text: {
    fontSize: '16px',
    color: '#525252',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  ctaContainer: {
    textAlign: 'center' as const,
    margin: '32px 0',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#7f1d1d',
    color: '#ffffff',
    padding: '16px 40px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600' as const,
    boxShadow: '0 4px 6px rgba(127, 29, 29, 0.3)',
  },
  warningBox: {
    backgroundColor: '#fffbeb',
    border: '2px solid #fbbf24',
    borderRadius: '8px',
    padding: '20px',
    margin: '32px 0',
    display: 'flex',
    gap: '16px',
  },
  warningIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  warningTitle: {
    fontSize: '15px',
    fontWeight: '600' as const,
    color: '#92400e',
    margin: '0 0 8px 0',
  },
  warningList: {
    margin: '0',
    paddingLeft: '20px',
  },
  warningItem: {
    fontSize: '14px',
    color: '#78350f',
    marginBottom: '4px',
    lineHeight: '1.5',
  },
  alternativeLink: {
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '1px solid #d6d3d1',
  },
  alternativeLinkText: {
    fontSize: '13px',
    color: '#737373',
    marginBottom: '12px',
  },
  linkBox: {
    backgroundColor: '#f5f5f4',
    padding: '12px',
    borderRadius: '4px',
    wordBreak: 'break-all' as const,
  },
  linkText: {
    fontSize: '12px',
    color: '#7f1d1d',
    textDecoration: 'none',
  },
  supportBox: {
    textAlign: 'center' as const,
    marginTop: '40px',
    paddingTop: '32px',
    borderTop: '1px solid #d6d3d1',
  },
  supportText: {
    fontSize: '14px',
    color: '#525252',
    marginBottom: '12px',
  },
  supportLink: {
    color: '#7f1d1d',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  footer: {
    backgroundColor: '#f5f5f4',
    padding: '32px 40px',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '13px',
    color: '#737373',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  footerLinks: {
    fontSize: '12px',
    color: '#737373',
    marginTop: '20px',
    marginBottom: '12px',
  },
  footerLink: {
    color: '#7f1d1d',
    textDecoration: 'none',
  },
  footerCopyright: {
    fontSize: '12px',
    color: '#a3a3a3',
    marginTop: '12px',
  },
};