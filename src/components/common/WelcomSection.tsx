"use client"
import React from 'react';
import { Sparkles } from 'lucide-react';

const WelcomeSection = () => {
  return (
    <section className="relative py-12 bg-gradient-to-br from-red-950/95 via-red-900/90 to-red-950/95 overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-10px); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(15px, -15px); }
          50% { transform: translate(30px, 0); }
          75% { transform: translate(15px, 15px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes scaleBreath {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
      `}</style>
      {/* Éléments décoratifs asymétriques avec mouvement */}
      <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-red-800/30 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
      
      {/* Forme géométrique cassée sur la gauche */}
      <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-neutral-900/10 transform -skew-x-12"></div>

      {/* Cercles flottants avec mouvements complexes */}
      <div className="absolute left-12 top-1/4 w-20 h-20 border-2 border-stone-200/30 rounded-full" style={{ animation: 'float 6s ease-in-out infinite' }}></div>
      
      <div className="absolute left-16 top-1/3 w-32 h-32 border border-white/20 rounded-full" style={{ animation: 'spin 20s linear infinite, floatReverse 7s ease-in-out infinite' }}></div>
      
      <div className="absolute left-8 bottom-1/4 w-16 h-16 bg-stone-200/10 rounded-full blur-sm" style={{ animation: 'drift 10s ease-in-out infinite, scaleBreath 4s ease-in-out infinite' }}></div>
      
      <div className="absolute left-24 top-1/2 w-12 h-12 border-2 border-red-800/40 rounded-full" style={{ animation: 'float 5s ease-in-out infinite 1s' }}></div>
      
      <div className="absolute left-6 top-2/3 w-8 h-8 bg-white/10 rounded-full" style={{ animation: 'floatReverse 8s ease-in-out infinite' }}></div>
      
      <div className="absolute left-20 bottom-1/3 w-24 h-24 border border-stone-300/20 rounded-full" style={{ animation: 'spin 25s linear infinite reverse, drift 12s ease-in-out infinite' }}></div>
      
      <div className="absolute left-32 top-1/5 w-6 h-6 bg-red-800/30 rounded-full" style={{ animation: 'float 4s ease-in-out infinite 2s' }}></div>
      
      <div className="absolute left-14 bottom-1/2 w-14 h-14 border-2 border-white/15 rounded-full" style={{ animation: 'floatReverse 9s ease-in-out infinite' }}></div>
      
      {/* Nouveaux éléments animés */}
      <div className="absolute left-28 top-3/4 w-10 h-10 border border-stone-200/25 rounded-full" style={{ animation: 'orbit 15s linear infinite' }}></div>
      
      <div className="absolute left-10 top-1/2 w-18 h-18 bg-white/5 rounded-full blur-md" style={{ animation: 'drift 14s ease-in-out infinite, scaleBreath 5s ease-in-out infinite' }}></div>
      
      <div className="absolute left-36 bottom-1/4 w-7 h-7 border-2 border-red-800/30 rounded-full" style={{ animation: 'float 7s ease-in-out infinite 3s' }}></div>
      
      <div className="absolute left-5 top-1/4 w-5 h-5 bg-stone-300/20 rounded-full" style={{ animation: 'floatReverse 6s ease-in-out infinite 1.5s' }}></div>
      
      {/* Cercles avec effet d'orbite */}
      <div className="absolute left-22 top-2/5" style={{ animation: 'drift 16s ease-in-out infinite' }}>
        <div className="w-4 h-4 bg-white/15 rounded-full" style={{ animation: 'pulse 3s ease-in-out infinite' }}></div>
      </div>
      
      <div className="absolute left-30 bottom-2/5 w-26 h-26 border border-stone-200/15 rounded-full" style={{ animation: 'spin 30s linear infinite, floatReverse 11s ease-in-out infinite' }}></div>
      
      {/* Petits points lumineux */}
      <div className="absolute left-18 top-1/6 w-3 h-3 bg-red-900/40 rounded-full" style={{ animation: 'float 5s ease-in-out infinite, pulse 2s ease-in-out infinite' }}></div>
      <div className="absolute left-26 bottom-1/6 w-2 h-2 bg-white/30 rounded-full" style={{ animation: 'floatReverse 7s ease-in-out infinite, pulse 3s ease-in-out infinite' }}></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex justify-end">
          <div className="w-full lg:w-2/3 xl:w-1/2 space-y-4 text-right">
            {/* Badge d'accueil */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-stone-200" />
              <span className="text-xs text-stone-200 font-medium tracking-wide">
                Bienvenue dans l'univers de l'élégance
              </span>
            </div>

            {/* Message principal */}
            <h2 className="text-2xl lg:text-3xl font-serif text-white leading-relaxed">
              Chaque détail compte dans l'art de 
              <span className="relative inline-block mx-2">
                <span className="relative z-10">la mode</span>
                <div className="absolute bottom-1 right-0 w-full h-2 bg-stone-200/20 rotate-1"></div>
              </span>
            </h2>

            {/* Sous-titre élégant */}
            <p className="text-sm text-stone-200/90 leading-relaxed">
              Nous créons des collections qui célèbrent votre individualité et transforment 
              chaque moment en une expression de raffinement intemporel.
            </p>

            {/* Ligne décorative alignée à droite */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <div className="w-12 h-px bg-gradient-to-l from-stone-300/50 via-stone-300/50 to-transparent"></div>
              <div className="w-1.5 h-1.5 bg-stone-200 rounded-full"></div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent via-stone-300/50 to-stone-300/50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Accent décoratif en bas à gauche */}
      <div className="absolute bottom-4 left-8 w-16 h-1 bg-stone-300/30 transform -rotate-45"></div>
      <div className="absolute top-1/3 right-12 w-1 h-12 bg-stone-300/20"></div>
    </section>
  );
};

export default WelcomeSection;