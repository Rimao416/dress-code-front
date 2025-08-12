
// 1. Modifier app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MessageProvider } from "@/context/NotificationContext";
import MessageDisplay from "@/components/MessageDisplay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dresscode.com'), // Remplacez par votre domaine
  title: {
    template: 'DRESSCODE | %s',
    default: 'DRESSCODE - Votre destination mode premium',
  },
  description: "Découvrez les dernières tendances mode sur DRESSCODE. Collections premium, nouveautés exclusives et marques de prestige.",
  keywords: ['mode', 'fashion', 'vêtements', 'premium', 'style', 'tendances'],
  authors: [{ name: 'DRESSCODE' }],
  creator: 'DRESSCODE',
  publisher: 'DRESSCODE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://dresscode.com',
    siteName: 'DRESSCODE',
    title: 'DRESSCODE - Votre destination mode premium',
    description: "Découvrez les dernières tendances mode sur DRESSCODE. Collections premium, nouveautés exclusives et marques de prestige.",
    images: [
      {
        url: '/og-image.jpg', // Ajoutez votre image OG
        width: 1200,
        height: 630,
        alt: 'DRESSCODE - Mode Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRESSCODE - Votre destination mode premium',
    description: "Découvrez les dernières tendances mode sur DRESSCODE. Collections premium, nouveautés exclusives et marques de prestige.",
    images: ['/twitter-image.jpg'], // Ajoutez votre image Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Ajoutez votre code de vérification Google
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
          <MessageProvider>
            <MessageDisplay />
            {children}
          </MessageProvider>
      </body>
    </html>
  );
}