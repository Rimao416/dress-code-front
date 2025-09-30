'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  const handleNavigateToCollections = () => {
    router.push('/collections');
  };

  return (
    <section className="relative h-screen bg-stone-100 overflow-hidden pt-[100px]">
      {/* Arrière-plan décoratif avec formes géométriques */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Rectangle beige en arrière-plan */}
        <div className="absolute top-1/4 right-0 w-2/5 h-96 bg-stone-200 transform rotate-6 opacity-60"></div>
        
        {/* Rectangle bordeaux */}
        <div className="absolute top-1/3 right-10 w-1/3 h-80 bg-gradient-to-br from-red-900 to-red-800 transform -rotate-12 opacity-20"></div>
        
        {/* Rectangle noir */}
        <div className="absolute top-1/2 right-32 w-1/4 h-72 bg-neutral-900 transform rotate-3 opacity-15"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 h-[calc(100%-100px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Contenu texte */}
          <div className="z-10 space-y-6">
            {/* Badge décoratif */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-stone-200/50">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">NEW</span>
              </div>
              <span className="text-xs text-neutral-700 font-medium tracking-wide">Collection Automne 2025</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-neutral-900 leading-[1.1] tracking-tight">
              Nouveau style
              <br />
              <span className="relative inline-block mt-1">
                pour votre
                <div className="absolute -bottom-1 left-0 w-full h-2.5 bg-red-900/15 -rotate-1 rounded-sm"></div>
              </span>
              <br />
              <span className="text-red-900">élégance</span>
            </h1>

            {/* Description */}
            <p className="text-base text-neutral-600 max-w-md leading-relaxed">
              Découvrez l'art des styles uniques, où chaque pièce 
              raconte une histoire d'élégance intemporelle et d'innovation.
            </p>

            {/* Boutons CTA */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button 
                onClick={handleNavigateToCollections}
                className="group bg-gradient-to-r from-red-900 to-red-800 text-white px-7 py-3 rounded-md text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                Voir tout
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Statistiques */}
            <div className="flex gap-8 lg:gap-10 pt-6 border-t border-stone-300/60">
              <div>
                <div className="text-3xl font-bold text-neutral-900 mb-0.5">130+</div>
                <div className="text-xs text-neutral-500 tracking-wide">Produits disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-900 mb-0.5">2k+</div>
                <div className="text-xs text-neutral-500 tracking-wide">Avis clients</div>
              </div>
            </div>
          </div>

          {/* Section image avec cadres décoratifs */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Cadre beige en arrière-plan */}
              <div className="absolute -top-4 -left-4 w-full h-full border-[6px] border-stone-300/80 transform rotate-3 rounded-sm"></div>
              
              {/* Cadre bordeaux */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-[6px] border-red-900/25 transform -rotate-6 rounded-sm"></div>
              
              {/* Cadre noir */}
              <div className="absolute top-6 right-6 w-full h-full border-[6px] border-neutral-900/15 transform rotate-2 rounded-sm"></div>

              {/* Image principale */}
              <div className="relative w-72 h-[400px] lg:w-80 lg:h-[440px] xl:w-96 xl:h-[480px] overflow-hidden rounded-sm shadow-2xl bg-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                  alt="Fashion model"
                  className="w-full h-full object-cover"
                />
                
                {/* Badge flottant */}
                <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-stone-200/50">
                  <span className="text-red-900 font-bold text-xs tracking-wide">-30% OFF</span>
                </div>
              </div>

              {/* Élément décoratif flottant */}
              <div className="absolute -left-8 top-1/3 w-20 h-20 bg-gradient-to-br from-red-900 to-red-700 rounded-full opacity-15 blur-2xl animate-pulse"></div>
              
              {/* Point d'accent */}
              <div className="absolute bottom-12 -left-6 w-3 h-3 bg-red-900 rounded-full shadow-lg"></div>
              <div className="absolute top-16 -right-4 w-2 h-2 bg-neutral-900 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs de scroll */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Découvrir</span>
          <div className="w-5 h-8 border-2 border-neutral-400/60 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-neutral-600 rounded-full mt-1.5 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;