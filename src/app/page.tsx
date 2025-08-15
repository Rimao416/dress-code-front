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
import Nouveaute from '@/components/common/Nouveaute';
import ProductSplitSection from '@/components/common/SplitSection';
export interface Category {
  name: string;
  count: string;
  color: string;
  image: string | null;
}

const splitSectionTitles = [
  {
    title: "Collections Exclusives",
    subtitle: "Découvrez nos sélections uniques et tendances du moment"
  },
  {
    title: "Style & Élégance",
    subtitle: "Des pièces soigneusement choisies pour votre garde-robe"
  },
  {
    title: "Nouveautés & Tendances",
    subtitle: "Les dernières créations qui définissent le style de demain"
  },
  {
    title: "Incontournables",
    subtitle: "Les essentiels qui ne se démodent jamais"
  }
];

const HomePage = () => {
  const featuredProducts = productsData.filter(product => product.featured);
  const newProducts = productsData.filter(product => product.isNewIn);
 
  const handleProductClick = (product: Product) => {
    console.log("Product clicked:", product.name);
  };

  // Fonction pour diviser les produits en groupes de 4
  const chunkProducts = (products: Product[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < products.length; i += chunkSize) {
      chunks.push(products.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Diviser tous les produits (pas seulement les featured) en groupes de 4
  const allProducts = productsData;
  const productChunks = chunkProducts(allProducts, 8);

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

      {/* Section Produits avec ProductSplitSections intercalées */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs sm:text-sm font-medium text-black tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-4">
              Notre Sélection Complète
            </div>
          </div>
         
          {productChunks.map((chunk, chunkIndex) => (
            <React.Fragment key={chunkIndex}>
              {/* Grille de 4 produits */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {chunk.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
             
              {/* ProductSplitSection après chaque groupe de 4, sauf le dernier */}
              {chunkIndex < productChunks.length - 1 && (
                <div className="mb-16">
                  <ProductSplitSection
                    products={allProducts} // Passer tous les produits
                    title={splitSectionTitles[chunkIndex % splitSectionTitles.length].title}
                    subtitle={splitSectionTitles[chunkIndex % splitSectionTitles.length].subtitle}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Section Nouveautés */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3 text-center lg:text-left">
              <div className="text-sm text-gray-600 mb-2 tracking-wider uppercase">
                {newProducts.length} NOUVEAUTÉS
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif text-black mb-6">
                Nouveautés
              </h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Nouveautés disponibles dès maintenant - découvrez les dernières sorties
                et les pièces tendances qui viennent enrichir notre collection
              </p>
            </div>
           
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {newProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section avec ProductSplitSection pour les nouveautés */}


      {/* Section Engagement/Valeurs */}
      <Nouveaute />

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

export default HomePage;