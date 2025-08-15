// components/Home/ProductSplitSection.tsx
import React, { useMemo } from 'react';
import Link from 'next/link';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  categoryId: string;
  brandId: string;
  brand?: { name: string };
  sku: string;
  stock: number;
  available: boolean;
  featured: boolean;
  isNewIn: boolean;
  tags: string[];
  slug: string;
  averageRating: number;
  reviewCount: number;
}

interface ProductSplitSectionProps {
  products: Product[];
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
  // Layout 4: Grid 2x2 (utilise 4 produits)
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

const ProductSplitSection: React.FC<ProductSplitSectionProps> = ({
  products,
  title,
  subtitle
}) => {
  // Mélanger les produits et choisir un layout aléatoirement à chaque rendu
  const { shuffledProducts, selectedLayout } = useMemo(() => {
    // Fonction pour mélanger un tableau
    const shuffleArray = (array: Product[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Mélanger les produits
    const shuffled = shuffleArray(products);
   
    // Choisir un layout aléatoire en fonction du nombre de produits disponibles
    const availableLayouts = LAYOUT_VARIANTS.filter(layout => {
      return layout.structure.length <= shuffled.length;
    });
   
    const randomLayout = availableLayouts.length > 0
      ? availableLayouts[Math.floor(Math.random() * availableLayouts.length)]
      : LAYOUT_VARIANTS[0]; // Fallback sur le premier layout

    return {
      shuffledProducts: shuffled,
      selectedLayout: randomLayout
    };
  }, [products]);

  if (!shuffledProducts || shuffledProducts.length === 0) {
    return (
      <section className="w-full py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 mb-8">{subtitle}</p>
          <p className="text-gray-500">Aucun produit disponible pour cette section</p>
        </div>
      </section>
    );
  }

  // Prendre seulement le nombre de produits nécessaires pour le layout
  const productsToShow = shuffledProducts.slice(0, selectedLayout.structure.length);

  const ProductBlock = ({
    product,
    span,
    height,
    index
  }: {
    product: Product;
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

    // Image par défaut si pas d'image
    const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwTDI2MCAxNjBIMjIwVjIwMEgxODBWMTYwSDE0MEwyMDAgMTAwWiIgZmlsbD0iIzk0OTRBNCIvPgo8L3N2Zz4K";
   
    // Prendre la première image du produit ou l'image par défaut
    const productImage = product.images && product.images.length > 0 && product.images[0].trim() !== ""
      ? product.images[0]
      : defaultImage;

    // Formatage du prix
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price);
    };

    return (
      <div className={`${span} ${height} relative overflow-hidden group cursor-pointer`}>
        <Link href={`/products/${product.slug}`} className="block h-full">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.src = defaultImage;
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

          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {product.isNewIn && (
              <span className="bg-black text-white px-2 py-1 text-xs font-medium uppercase tracking-wide">
                Nouveau
              </span>
            )}
            {product.featured && (
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium uppercase tracking-wide">
                Coup de coeur
              </span>
            )}
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="bg-green-500 text-white px-2 py-1 text-xs font-medium uppercase tracking-wide">
                Promo
              </span>
            )}
          </div>
         
          {/* Contenu avec positionnement variable */}
          <div className={`absolute ${
            index % 4 === 0 ? 'bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8' :
            index % 4 === 1 ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 text-right' :
            index % 4 === 2 ? 'top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8' :
            'top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 text-right'
          } ${variation.textColor} z-10 max-w-xs sm:max-w-sm md:max-w-md`}>
            <h3 className={`${variation.textSize} font-bold mb-2 sm:mb-3 md:mb-4 tracking-wide uppercase line-clamp-2`}>
              {product.name}
            </h3>
            
            {product.brand && (
              <p className="text-xs sm:text-sm opacity-80 mb-2 uppercase tracking-wide">
                {product.brand.name}
              </p>
            )}
            
            <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-5 opacity-90 leading-relaxed line-clamp-2">
              {product.shortDescription || product.description}
            </p>
            
            <div className="flex flex-col gap-3 items-start">
              {/* Prix */}
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl md:text-2xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm opacity-70 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Rating si disponible */}
              {product.averageRating > 0 && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs opacity-80 ml-1">
                    ({product.reviewCount})
                  </span>
                </div>
              )}

              <span className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium text-sm sm:text-base cursor-pointer">
                Voir le produit
              </span>
            </div>
          </div>
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
      </div>

      {/* Section dynamique */}
      <div className={selectedLayout.containerClass}>
        {productsToShow.map((product, index) => (
          <ProductBlock
            key={`${product.id}-${selectedLayout.name}-${index}`}
            product={product}
            span={selectedLayout.structure[index].span}
            height={selectedLayout.structure[index].height}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductSplitSection;