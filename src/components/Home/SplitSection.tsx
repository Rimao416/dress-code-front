// components/Home/CategorySplitSection.tsx
import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CategoryWithProducts } from '@/types/homepage';



interface CategorySplitSectionProps {
  categories: CategoryWithProducts[];
  title: string;
  subtitle: string;
}

// Différents layouts possibles
const LAYOUT_VARIANTS = [
  // Layout 1: Split classique 50/50
  {
    name: 'split_classic',
    structure: [
      { span: 'md:w-1/2', height: 'h-64 sm:h-80 md:h-screen' },
      { span: 'md:w-1/2', height: 'h-64 sm:h-80 md:h-screen' }
    ],
    containerClass: 'flex flex-col md:flex-row md:h-screen'
  },
  // Layout 2: 70/30
  {
    name: 'split_asymmetric',
    structure: [
      { span: 'md:w-2/3', height: 'h-80 md:h-screen' },
      { span: 'md:w-1/3', height: 'h-64 md:h-screen' }
    ],
    containerClass: 'flex flex-col md:flex-row md:h-screen'
  },
  // Layout 3: Vertical stack avec différentes hauteurs
  {
    name: 'vertical_stack',
    structure: [
      { span: 'w-full', height: 'h-96' },
      { span: 'w-full', height: 'h-64' }
    ],
    containerClass: 'flex flex-col gap-4'
  },
  // Layout 4: Grid 2x2 (utilise 4 catégories)
  {
    name: 'grid_2x2',
    structure: [
      { span: 'w-1/2', height: 'h-64 md:h-80' },
      { span: 'w-1/2', height: 'h-64 md:h-80' },
      { span: 'w-1/2', height: 'h-64 md:h-80' },
      { span: 'w-1/2', height: 'h-64 md:h-80' }
    ],
    containerClass: 'flex flex-wrap'
  },
  // Layout 5: Hero + 2 colonnes
  {
    name: 'hero_columns',
    structure: [
      { span: 'w-full', height: 'h-96' },
      { span: 'md:w-1/2', height: 'h-64' },
      { span: 'md:w-1/2', height: 'h-64' }
    ],
    containerClass: 'flex flex-col md:flex-row md:flex-wrap'
  }
];

const SplitSection: React.FC<CategorySplitSectionProps> = ({ 
  categories, 
  title, 
  subtitle 
}) => {
  // Mélanger les catégories et choisir un layout aléatoirement à chaque rendu
  const { shuffledCategories, selectedLayout } = useMemo(() => {
    // Fonction pour mélanger un tableau
    const shuffleArray = (array: CategoryWithProducts[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Mélanger les catégories
    const shuffled = shuffleArray(categories);
    
    // Choisir un layout aléatoire en fonction du nombre de catégories disponibles
    const availableLayouts = LAYOUT_VARIANTS.filter(layout => {
      return layout.structure.length <= shuffled.length;
    });
    
    const randomLayout = availableLayouts.length > 0 
      ? availableLayouts[Math.floor(Math.random() * availableLayouts.length)]
      : LAYOUT_VARIANTS[0]; // Fallback sur le premier layout

    return {
      shuffledCategories: shuffled,
      selectedLayout: randomLayout
    };
  }, [categories]); // Se recalcule à chaque changement de categories

  if (!shuffledCategories || shuffledCategories.length === 0) {
    return (
      <section className="w-full py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 mb-8">{subtitle}</p>
          <p className="text-gray-500">Aucune catégorie disponible pour cette section</p>
        </div>
      </section>
    );
  }

  // Prendre seulement le nombre de catégories nécessaires pour le layout
  const categoriesToShow = shuffledCategories.slice(0, selectedLayout.structure.length);

  const CategoryBlock = ({ 
    category, 
    span, 
    height,
    index 
  }: { 
    category: CategoryWithProducts; 
    span: string;
    height: string;
    index: number;
  }) => {
    // Variations de style selon l'index
    const variations = [
      { textSize: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl', textColor: 'text-white' },
      { textSize: 'text-lg sm:text-xl md:text-2xl lg:text-3xl', textColor: 'text-white' },
      { textSize: 'text-xl sm:text-2xl md:text-3xl', textColor: 'text-white' },
      { textSize: 'text-lg sm:text-xl md:text-2xl', textColor: 'text-white' }
    ];
    
    const variation = variations[index % variations.length];

    return (
      <div className={`${span} ${height} relative overflow-hidden group cursor-pointer`}>
        <Link href={`/collections/${category.slug}`} className="block h-full">
          <Image
            src={category.image || '/placeholder-category.jpg'}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-category.jpg';
            }}
          />
          
          {/* Overlay avec gradient aléatoire */}
          <div className={`absolute inset-0 ${
            index % 3 === 0 
              ? 'bg-gradient-to-br from-black/40 via-black/10 to-transparent group-hover:from-black/30' 
              : index % 3 === 1 
                ? 'bg-gradient-to-t from-black/50 via-black/15 to-transparent group-hover:from-black/35'
                : 'bg-gradient-to-tr from-black/45 via-transparent to-black/20 group-hover:from-black/30'
          } transition-all duration-300`}></div>
          
          {/* Contenu avec positionnement variable */}
          <div className={`absolute ${
            index % 4 === 0 ? 'bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8' :
            index % 4 === 1 ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 text-right' :
            index % 4 === 2 ? 'top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8' :
            'top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 text-right'
          } ${variation.textColor} z-10`}>
            <h3 className={`${variation.textSize} font-bold mb-2 sm:mb-3 md:mb-4 tracking-wide uppercase`}>
              {category.name}
            </h3>
            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 opacity-90 max-w-xs sm:max-w-sm md:max-w-md leading-relaxed">
              {category.description || `Découvrez notre collection ${category.name.toLowerCase()}`}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <span className="text-xs sm:text-sm opacity-80">
                {category.productCount} produit{category.productCount > 1 ? 's' : ''}
              </span>
              <span className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium text-sm sm:text-base cursor-pointer">
                Explorer
              </span>
            </div>
          </div>

          {/* Badge pour les sous-catégories */}
          {category.children && category.children.length > 0 && (
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white z-20">
              +{category.children.length}
            </div>
          )}
        </Link>
      </div>
    );
  };

  return (
    <section className="w-full">
      {/* En-tête de section */}
      <div className="text-center py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          {title}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
          {subtitle}
        </p>
        {/* Indicateur du layout actuel (optionnel, pour debug) */}
      
      </div>

      {/* Section dynamique */}
      <div className={selectedLayout.containerClass}>
        {categoriesToShow.map((category, index) => (
          <CategoryBlock
            key={`${category.id}-${selectedLayout.name}-${index}`}
            category={category}
            span={selectedLayout.structure[index].span}
            height={selectedLayout.structure[index].height}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default SplitSection;