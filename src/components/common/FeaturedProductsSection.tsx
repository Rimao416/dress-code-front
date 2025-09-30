"use client";
import React from 'react';
import { Sparkles, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { ProductCardData } from '@/types/product';
import { useFeaturedProducts } from '@/hooks/product/useFeaturedProducts';

interface FeaturedProductsSectionProps {
  onProductClick?: (product: ProductCardData) => void;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onProductClick
}) => {
  const { products, isLoading, error } = useFeaturedProducts({ 
    limit: 4,
    enabled: true 
  });

  const handleProductClick = (product: ProductCardData) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      window.location.href = `/products/${product.slug}`;
    }
  };

  // Icône pour chaque type de highlight basé sur les propriétés du produit
  const getHighlightIcon = (product: ProductCardData) => {
    if (product.isNewIn) return <Star className="h-3 w-3" />;
    if (product.featured) return <TrendingUp className="h-3 w-3" />;
    return <Sparkles className="h-3 w-3" />;
  };

  const getHighlightText = (product: ProductCardData) => {
    if (product.isNewIn) return 'Nouveau';
    if (product.featured) return 'Tendance';
    return 'Populaire';
  };

  if (error) {
    return (
      <section className="pt-8 pb-16 lg:pt-12 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-red-600">
            Une erreur est survenue lors du chargement des produits.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8 pb-16 lg:pt-12 lg:pb-20 bg-gradient-to-b from-white via-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* En-tête de section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-900/10 to-red-800/10 backdrop-blur-sm px-4 py-2 rounded-full border border-red-900/20">
            <Sparkles className="h-4 w-4 text-red-900" />
            <span className="text-xs text-red-900 font-semibold uppercase tracking-widest">
              Sélection du jour
            </span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-neutral-900 leading-tight">
            Nos produits
            <br />
            <span className="relative inline-block">
              d'exception
              <div className="absolute -bottom-1 left-0 w-full h-3 bg-red-900/10 -rotate-1 rounded-sm"></div>
            </span>
          </h2>
          
          <p className="text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez notre sélection exclusive de pièces qui marquent. 
            Chaque article a été soigneusement choisi pour son excellence et son raffinement.
          </p>
        </div>

        {/* État de chargement */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-stone-200 overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-stone-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-stone-200 rounded w-1/3"></div>
                  <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-6 bg-stone-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Grille de produits vedettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg border border-stone-200 hover:border-neutral-300 transition-all duration-300 overflow-hidden hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image produit avec badges */}
                  <div 
                    className="relative aspect-[3/4] overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges en haut */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                      {/* Badge highlight */}
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-900 to-red-800 text-white px-2.5 py-1 rounded-sm shadow-md">
                        {getHighlightIcon(product)}
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          {getHighlightText(product)}
                        </span>
                      </div>
                      
                      {/* Badge réduction */}
                      {product.comparePrice && product.comparePrice > product.price && (
                        <div className="bg-red-900 text-white text-xs font-bold px-2.5 py-1 rounded-sm shadow-md">
                          -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                        </div>
                      )}
                    </div>

                    {/* Quick actions au hover */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button 
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-2.5 rounded-md text-xs font-semibold shadow-lg flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }}
                      >
                        Aperçu rapide
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contenu produit */}
                  <div className="p-4">
                    {/* Marque */}
                    {product.brand && (
                      <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">
                        {product.brand.name}
                      </p>
                    )}

                    {/* Nom - cliquable */}
                    <h3 
                      className="text-sm font-medium text-neutral-900 line-clamp-2 leading-snug mb-2 cursor-pointer hover:text-red-900 transition-colors"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                    </h3>

                    {/* Prix et action */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-neutral-900">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <span className="text-xs text-neutral-400 line-through">
                              ${product.comparePrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-[10px] text-red-900 font-semibold">
                            Économisez ${(product.comparePrice - product.price).toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Bouton panier */}
                      <button 
                        className="bg-red-900 hover:bg-red-800 text-white p-2.5 rounded-md transition-colors shadow-sm hover:shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Ajouter au panier:', product.id);
                        }}
                        aria-label="Ajouter au panier"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Nombre d'avis */}
                    {product._count && product._count.reviews > 0 && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] text-neutral-600">
                          {product._count.reviews} avis
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton voir plus */}
            {products.length > 0 && (
              <div className="text-center mt-12">
                <button 
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-900 to-red-800 text-white px-8 py-3.5 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                  onClick={() => window.location.href = '/products?featured=true'}
                >
                  Découvrir tous les produits vedettes
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Élément décoratif */}
        <div className="absolute left-0 top-1/2 w-32 h-32 bg-gradient-to-br from-red-900/5 to-red-800/5 rounded-full blur-3xl -z-10" />
        <div className="absolute right-0 bottom-1/4 w-40 h-40 bg-gradient-to-br from-neutral-900/5 to-neutral-800/5 rounded-full blur-3xl -z-10" />
      </div>
    </section>
  );
};

export default FeaturedProductsSection;