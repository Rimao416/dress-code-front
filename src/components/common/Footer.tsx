import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 text-white overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl"></div>

      {/* Contenu principal */}
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Colonne 1 - À propos */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-serif text-white mb-2">DressCode</h3>
              <div className="w-12 h-px bg-red-900"></div>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              Votre destination pour l'élégance intemporelle. Découvrez des pièces uniques qui racontent votre histoire.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://www.instagram.com/dress_codevaulx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-red-900/80 rounded-full flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-red-900"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href="https://www.snapchat.com/add/dress_codevaulx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-red-900/80 rounded-full flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-red-900"
              >
                <span className="text-xs font-bold">SC</span>
              </Link>
              <Link
                href="https://www.tiktok.com/@dresscode69120"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-red-900/80 rounded-full flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-red-900"
              >
                <span className="text-xs font-bold">TT</span>
              </Link>
            </div>
          </div>

          {/* Colonne 2 - Navigation */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-stone-200">
              Navigation
            </h4>
            <ul className="space-y-3">
              {['Nouveautés', 'Collections', 'Tendances', 'Offres spéciales', 'Notre histoire'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-stone-400 hover:text-red-900 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-red-900 transition-all duration-200"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 - Service client */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-stone-200">
              Service client
            </h4>
            <ul className="space-y-3">
              {['Contactez-nous', 'Livraison & Retours', 'Guide des tailles', 'FAQ', 'Programme fidélité'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-stone-400 hover:text-red-900 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-red-900 transition-all duration-200"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 - Contact */}
          <div className="space-y-6" id="contact-section">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-stone-200">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-900 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-stone-400 leading-relaxed">
                  14 rue Émile Zola<br />
                  69120 Vaulx-en-Velin, France
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-900 flex-shrink-0" />
                <Link href="tel:0478951007" className="text-sm text-stone-400 hover:text-red-900 transition-colors">
                  04 78 95 10 07
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-900 flex-shrink-0" />
                <Link href="mailto:dresscode69120@yahoo.com" className="text-sm text-stone-400 hover:text-red-900 transition-colors">
                  dresscode69120@yahoo.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-500">
              © {currentYear} DressCode. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-6 text-xs text-stone-500">
              <Link href="/legal?tab=conditions" className="hover:text-red-900 transition-colors">
                Conditions générales
              </Link>
              <Link href="/legal?tab=confidentialite" className="hover:text-red-900 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/legal?tab=mentions" className="hover:text-red-900 transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Accent décoratif en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-900/50 to-transparent"></div>
    </footer>
  );
};

export default Footer;