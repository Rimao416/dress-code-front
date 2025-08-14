"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Star, Heart, ShoppingBag, Plus, Check, X } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SupportSection from '@/components/common/SupportSection';
import { productsData } from '@/constant/data';
import Button from '@/components/ui/button';
import ProductCard, { Product } from '@/components/common/ProductCard';
import Categories from '@/components/common/Category';


// Button Component

// Header Component


export interface Category {
  name: string;
  count: string;
  color: string;
  image: string | null;
}



// Support Section Component



// Footer Component

// Main HomePage Component
const HomePage = () => {
  const featuredProducts = productsData.filter(product => product.featured);
  const newProducts = productsData.filter(product => product.isNewIn);
  
  const handleProductClick = (product: Product) => {
  console.log("Product clicked:", product.name);
};

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6TTM0IDM0djItMlYzNGgyem0wIDJoMnYtMmgtMnYyek0zMCAzNHYySDI4VjM0aDJ6bTAgMmgydi0yaC0ydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
            Style moderne,<br />
            <span className="italic">simplicité absolue</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-neutral-300 max-w-2xl mx-auto">
            Découvrez notre collection soigneusement sélectionnée pour un style contemporain et intemporel
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="white" 
              size="lg" 
              className="text-lg font-medium transform hover:scale-105"
            >
              Découvrir la collection
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg font-medium border-white text-white hover:bg-white hover:text-black"
            >
              Nouveautés
            </Button>
          </div>
        </div>
      </section>

      {/* Section Produits mis en avant */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs sm:text-sm font-medium text-black tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-4">
              Les marques qui retiennent notre attention
            </div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Nos favoris
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Une sélection de produits qui définissent notre style et notre vision de la mode contemporaine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                featured={index === 0}
                onClick={handleProductClick}
                showBrand={true}
                showPrice={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Section Nouveautés */}
      

      {/* Section Engagement/Valeurs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Notre engagement
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Chez DressCode, nous croyons en une mode responsable et durable. 
              Chaque produit est sélectionné avec soin pour allier style, qualité et respect de l'environnement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-200">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Mode Éthique
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Partenariat avec des marques respectueuses de l'environnement et des conditions de travail équitables
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Qualité Premium
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sélection rigoureuse de produits durables et intemporels pour un investissement à long terme
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-200">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Livraison Rapide
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Expédition sous 24h et livraison gratuite dès 50€ d'achat avec un packaging éco-responsable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <SupportSection />

      {/* Footer */}
      <Footer />

      {/* Styles personnalisés */}
      <style jsx global>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        /* Focus states pour l'accessibilité */
        button:focus-visible,
        input:focus-visible,
        a:focus-visible {
          outline: 2px solid #000;
          outline-offset: 2px;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Améliorations pour les animations de hover */
        .group:hover .group-hover\:scale-105 {
          transform: scale(1.05);
        }
        
        .group:hover .group-hover\:scale-110 {
          transform: scale(1.1);
        }
        
        .group:hover .group-hover\:translate-x-0\.5 {
          transform: translateX(0.125rem);
        }
      `}</style>
    </div>
  );
};

export default HomePage