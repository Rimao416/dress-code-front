"use client"
import React, { useState } from 'react';
import { ArrowRight, Package } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  image: string | null;
  productCount?: number;
}

interface CategoriesMasonryProps {
  categories?: Category[];
  onCategoryClick?: (category: Category) => void;
}

const CategoriesMasonry: React.FC<CategoriesMasonryProps> = ({ 
  categories = [],
  onCategoryClick 
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Données de démonstration
  const defaultCategories: Category[] = [
    {
      id: '1',
      name: 'Robes',
      slug: 'robes',
      description: 'Élégance et raffinement',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
      productCount: 45
    },
    {
      id: '2',
      name: 'Bijoux',
      slug: 'bijoux',
      description: 'Brillez de mille feux',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
      productCount: 128
    },
    {
      id: '3',
      name: 'Sacs',
      slug: 'sacs',
      description: 'Accessoires essentiels',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
      productCount: 67
    },
    {
      id: '4',
      name: 'Chaussures',
      slug: 'chaussures',
      description: 'Le confort rencontre le style',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
      productCount: 89
    },
    {
      id: '5',
      name: 'Vêtements',
      slug: 'vetements',
      description: 'Mode contemporaine',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
      productCount: 156
    },
    {
      id: '6',
      name: 'Accessoires',
      slug: 'accessoires',
      description: 'Les détails qui comptent',
      image: 'https://images.unsplash.com/photo-1610652489447-48c57040e6d0?w=600&q=80',
      productCount: 92
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  // Pattern de hauteurs optimisé pour remplir l'espace
  const getRowSpan = (index: number) => {
    const patterns = [3, 4, 3, 5, 4, 3, 4, 5];
    return patterns[index % patterns.length];
  };

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-stone-50">
      <div className="w-full">
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-12 px-6">
          <div className="inline-flex items-center gap-2 bg-red-900/5 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Package className="h-4 w-4 text-red-900" />
            <span className="text-xs text-red-900 font-medium tracking-wide uppercase">
              Explorez nos collections
            </span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-neutral-900 mb-4 leading-tight">
            Découvrez nos
            <br />
            <span className="relative inline-block mt-1">
              catégories
              <div className="absolute -bottom-1 left-0 w-full h-2.5 bg-red-900/15 -rotate-1 rounded-sm"></div>
            </span>
          </h2>
          
          <p className="text-neutral-600 leading-relaxed">
            Parcourez notre sélection soigneusement organisée pour trouver exactement ce que vous cherchez
          </p>
        </div>

        {/* Masonry Grid avec auto-rows */}
        <div className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[80px]">
            {displayCategories.map((category, index) => {
              const isHovered = hoveredId === category.id;
              const rowSpan = getRowSpan(index);
              
              return (
                <div
                  key={category.id}
                  style={{ gridRow: `span ${rowSpan}` }}
                  className={`group relative overflow-hidden cursor-pointer transition-all duration-500 border-r border-b border-stone-200/30 ${
                    isHovered ? 'scale-[1.02] shadow-2xl z-10' : 'hover:shadow-xl'
                  }`}
                  onMouseEnter={() => setHoveredId(category.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onCategoryClick?.(category)}
                >
                  {/* Image de fond */}
                  <div className="absolute inset-0">
                    <img
                      src={category.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80'}
                      alt={category.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    {/* Overlay gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-transparent transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-80'
                    }`}></div>
                  </div>

                  {/* Contenu */}
                  <div className="absolute inset-0 p-4 lg:p-6 flex flex-col justify-end">
                    {/* Badge nombre de produits */}
                    <div className={`absolute top-4 lg:top-6 right-4 lg:right-6 bg-white/95 backdrop-blur-md px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full shadow-lg border border-stone-200/50 transition-all duration-300 ${
                      isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'
                    }`}>
                      <span className="text-neutral-900 font-bold text-[10px] lg:text-xs">
                        {category.productCount || 0} produits
                      </span>
                    </div>

                    {/* Nom de la catégorie */}
                    <h3 className={`text-xl lg:text-2xl xl:text-3xl font-serif text-white mb-1 lg:mb-2 transition-all duration-300 ${
                      isHovered ? 'translate-y-0' : 'translate-y-1'
                    }`}>
                      {category.name}
                    </h3>

                    {/* Description */}
                    {category.description && (
                      <p className={`text-stone-200 text-xs lg:text-sm mb-3 lg:mb-4 transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}>
                        {category.description}
                      </p>
                    )}

                    {/* Bouton CTA */}
                    <div className={`flex items-center gap-2 text-white transition-all duration-300 ${
                      isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}>
                      <span className="text-xs lg:text-sm font-medium">Découvrir</span>
                      <ArrowRight className={`h-3 lg:h-4 w-3 lg:w-4 transition-transform duration-300 ${
                        isHovered ? 'translate-x-1' : 'translate-x-0'
                      }`} />
                    </div>

                    {/* Barre décorative */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-900 to-red-700 transition-all duration-500 ${
                      isHovered ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>

                  {/* Effet de brillance au survol */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ${
                    isHovered ? 'translate-x-full' : '-translate-x-full'
                  }`}></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA pour voir toutes les catégories */}
        <div className="text-center mt-8 lg:mt-12 px-6">
          <button className="group bg-neutral-900 text-white px-6 lg:px-8 py-3 lg:py-3.5 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 mx-auto">
            Voir toutes les catégories
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesMasonry;