"use client";
import BottomSheet from "@/components/common/BottomSheet";
import { useEffect, useState } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  description?: string;
  ctaText: string;
  backgroundImage?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  description,
  ctaText,
  backgroundImage = "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  heroTitle,
  heroSubtitle,
  heroDescription,
}: AuthLayoutProps) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  // Ouvrir automatiquement le bottom sheet sur mobile
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth < 1024) {
        setTimeout(() => setIsSheetOpen(true), 300);
      } else {
        setIsSheetOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Version Desktop */}
      <div className="hidden lg:flex h-screen bg-stone-50 overflow-hidden">
        <div className="w-full bg-white flex h-full">
          {/* Panneau gauche - Formulaire */}
          <div className="w-[45%] p-8 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  {title}
                </h1>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent">
                  {subtitle}
                </h2>
                {description && (
                  <p className="text-gray-600 mt-2 text-sm">
                    {description}
                  </p>
                )}
              </div>

              {/* Le contenu du formulaire sera injecté ici */}
              {children}
            </div>
          </div>

          {/* Panneau droit - Image */}
          <div className="w-[55%] relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${backgroundImage}')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />

            <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-8 w-24 h-24 bg-red-800/20 rounded-full blur-2xl"></div>

            <div className="absolute bottom-0 left-0 right-0 p-12">
              <div className="text-white">
                <h3 className="text-5xl font-bold mb-3 leading-tight">
                  {heroTitle}
                </h3>
                <p className="text-2xl font-light opacity-90 mb-3">
                  {heroSubtitle}
                </p>
                <p className="text-lg opacity-80 max-w-lg leading-relaxed">
                  {heroDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Mobile - Immersive avec Bottom Sheet */}
      <div className="lg:hidden h-screen relative overflow-hidden">
        {/* Image de fond plein écran */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundImage}')`
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

        {/* Éléments décoratifs flottants */}
        <div className="absolute top-20 right-6 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 left-8 w-16 h-16 bg-red-800/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-60 right-12 w-12 h-12 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>

        {/* Contenu principal au-dessus de l'image */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header avec logo/titre */}
          <div className="pt-safe-top px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Fleurs Fraîches
            </h1>
            <p className="text-white/80 text-lg font-light">
              Moments précieux, bouquets parfaits
            </p>
          </div>

          {/* Espace flexible pour pousser le bottom sheet vers le bas */}
          <div className="flex-1" />

          {/* Call to action pour ouvrir le bottom sheet */}
          {!isSheetOpen && (
            <div className="px-6 pb-safe-bottom pb-8">
              <button
                onClick={() => setIsSheetOpen(true)}
                className="w-full bg-white/90 backdrop-blur-md text-gray-900 py-4 px-6 rounded-2xl font-semibold text-lg shadow-2xl border border-white/20 hover:bg-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {ctaText}
              </button>
              <p className="text-center text-white/70 text-sm mt-4">
                Glissez vers le haut pour continuer
              </p>
            </div>
          )}
        </div>

        {/* Bottom Sheet */}
        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          snapLevels={[0, 0.3, 0.7, 1]}
          initialLevel={1}
          maxHeight="90vh"
        >
          <div className="px-6 pb-safe-bottom pb-4">
            {/* En-tête */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent">
                {subtitle}
              </h2>
              {description && (
                <p className="text-gray-600 mt-1">
                  {description}
                </p>
              )}
            </div>

            {/* Le contenu du formulaire sera injecté ici */}
            {children}

            {/* Bouton de retour */}
            <button
              onClick={() => setIsSheetOpen(false)}
              className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              type="button"
            >
              Retour à l&apos;écran d&apos;accueil
            </button>
          </div>
        </BottomSheet>
      </div>
    </>
  );
}