// lib/email/templates/welcome.tsx
import * as React from 'react';

interface WelcomeEmailProps {
  firstName: string;
  email: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ firstName, email }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style={styles.body}>
      <div style={styles.container}>
        {/* Header avec badge NEW */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>NEW</span>
            <span style={styles.badgeText}>Collection Automne 2025</span>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={styles.content}>
          <h1 style={styles.title}>
            Bienvenue parmi nous, <span style={styles.titleAccent}>{firstName}</span> !
          </h1>

          <div style={styles.decorativeLine}></div>

          <p style={styles.text}>
            Nous sommes ravis de vous accueillir dans notre communauté d'amoureux de la mode et de l'élégance.
          </p>

          <p style={styles.text}>
            Votre compte a été créé avec succès. Vous pouvez dès maintenant :
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>✨ Découvrir nos collections exclusives</li>
            <li style={styles.listItem}>🛍️ Profiter de nos offres spéciales</li>
            <li style={styles.listItem}>📦 Suivre vos commandes en temps réel</li>
            <li style={styles.listItem}>💝 Accéder à votre espace personnel</li>
          </ul>

          {/* Bouton CTA */}
          <div style={styles.ctaContainer}>
            <a href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/collections`} style={styles.button}>
              Découvrir nos collections
            </a>
          </div>

          {/* Offre spéciale */}
          <div style={styles.offerBox}>
            <div style={styles.offerBadge}>-20% OFF</div>
            <p style={styles.offerText}>
              <strong>Cadeau de bienvenue :</strong> Profitez de 20% de réduction sur votre première commande avec le code{' '}
              <span style={styles.promoCode}>BIENVENUE20</span>
            </p>
          </div>

          {/* Statistiques */}
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statNumber}>130+</div>
              <div style={styles.statLabel}>Produits disponibles</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>2k+</div>
              <div style={styles.statLabel}>Avis clients</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Vous recevez cet email car vous venez de créer un compte avec l'adresse <strong>{email}</strong>
          </p>
          <p style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Conditions d'utilisation</a>
            {' · '}
            <a href="#" style={styles.footerLink}>Politique de confidentialité</a>
            {' · '}
            <a href="#" style={styles.footerLink}>Nous contacter</a>
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
    backgroundColor: '#f5f5f4', // stone-100
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
    backgroundColor: '#7f1d1d', // red-900
    padding: '30px 40px',
    textAlign: 'center' as const,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(120, 113, 108, 0.2)',
  },
  badgeIcon: {
    backgroundColor: '#7f1d1d',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: 'bold' as const,
    padding: '4px 8px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  badgeText: {
    color: '#404040',
    fontSize: '12px',
    fontWeight: '500' as const,
    letterSpacing: '0.5px',
  },
  content: {
    padding: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '600' as const,
    color: '#171717', // neutral-900
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  titleAccent: {
    color: '#7f1d1d', // red-900
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
    color: '#525252', // neutral-600
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '24px 0',
  },
  listItem: {
    fontSize: '15px',
    color: '#404040',
    padding: '8px 0',
    lineHeight: '1.5',
  },
  ctaContainer: {
    textAlign: 'center' as const,
    margin: '32px 0',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#7f1d1d',
    color: '#ffffff',
    padding: '14px 32px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600' as const,
    boxShadow: '0 4px 6px rgba(127, 29, 29, 0.3)',
    transition: 'all 0.2s',
  },
  offerBox: {
    backgroundColor: '#fef2f2', // red-50
    border: '2px solid #7f1d1d',
    borderRadius: '8px',
    padding: '20px',
    margin: '32px 0',
    textAlign: 'center' as const,
    position: 'relative' as const,
  },
  offerBadge: {
    position: 'absolute' as const,
    top: '-12px',
    right: '20px',
    backgroundColor: '#7f1d1d',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    padding: '6px 12px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
  },
  offerText: {
    fontSize: '15px',
    color: '#404040',
    margin: 0,
    lineHeight: '1.6',
  },
  promoCode: {
    backgroundColor: '#171717',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '4px',
    fontWeight: 'bold' as const,
    fontSize: '14px',
    letterSpacing: '1px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    marginTop: '40px',
    paddingTop: '32px',
    borderTop: '1px solid #d6d3d1',
  },
  stat: {
    textAlign: 'center' as const,
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 'bold' as const,
    color: '#171717',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#737373',
    letterSpacing: '0.5px',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: '#d6d3d1',
  },
  footer: {
    backgroundColor: '#f5f5f4',
    padding: '32px 40px',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '13px',
    color: '#737373',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  footerLinks: {
    fontSize: '12px',
    color: '#737373',
    marginBottom: '12px',
  },
  footerLink: {
    color: '#7f1d1d',
    textDecoration: 'none',
  },
  footerCopyright: {
    fontSize: '12px',
    color: '#a3a3a3',
    marginTop: '16px',
  },
};