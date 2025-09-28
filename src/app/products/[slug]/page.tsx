// components/pages/SingleProduct.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductVariant, ProductWithFullData, ProductCardData } from '@/types/product';
import ProductGallery from '@/components/product/productGallery';
import ProductInfo from '@/components/product/productInfo';
import ProductRecommendations from '@/components/product/productRecommendations';

interface SingleProductProps {
  slug?: string;
}

// Données statiques fictives
const STATIC_PRODUCTS: Record<string, ProductWithFullData> = {
  'nike-air-max-270': {
    id: '1',
    name: 'Nike Air Max 270',
    description: 'La Nike Air Max 270 offre un confort maximal grâce à sa technologie Air Max révolutionnaire. Conçue pour un usage quotidien, cette chaussure combine style moderne et performance exceptionnelle.',
    shortDescription: 'Baskets confortables avec technologie Air Max',
    price: 149.99,
    comparePrice: 179.99,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
    ],
    categoryId: 'sneakers',
    brandId: 'nike',
    sku: 'NK-AM270-001',
    stock: 25,
    available: true,
    featured: true,
    isNewIn: false,
    tags: ['nike', 'air-max', 'baskets', 'sport', 'confort'],
    metaTitle: 'Nike Air Max 270 - Baskets de sport premium',
    metaDescription: 'Découvrez la Nike Air Max 270, des baskets révolutionnaires qui allient confort et style moderne.',
    slug: 'nike-air-max-270',
    weight: 0.8,
    dimensions: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-09-20'),
    category: {
      id: 'sneakers',
      name: 'Baskets',
      slug: 'baskets',
      parent: {
        id: 'chaussures',
        name: 'Chaussures',
        slug: 'chaussures'
      }
    },
    brand: {
      id: 'nike',
      name: 'Nike',
      description: 'Just Do It',
      logo: 'https://logo.clearbit.com/nike.com',
      isActive: true,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    variants: [
      {
        id: 'v1',
        productId: '1',
        size: '40',
        color: 'Noir',
        colorHex: '#000000',
        material: 'Mesh/Synthétique',
        sku: 'NK-AM270-001-40-BK',
        price: 149.99,
        stock: 5,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-09-20')
      },
      {
        id: 'v2',
        productId: '1',
        size: '41',
        color: 'Noir',
        colorHex: '#000000',
        material: 'Mesh/Synthétique',
        sku: 'NK-AM270-001-41-BK',
        price: 149.99,
        stock: 8,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-09-20')
      },
      {
        id: 'v3',
        productId: '1',
        size: '42',
        color: 'Blanc',
        colorHex: '#FFFFFF',
        material: 'Mesh/Synthétique',
        sku: 'NK-AM270-001-42-WH',
        price: 149.99,
        stock: 12,
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop'],
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-09-20')
      }
    ],
    reviews: [
      {
        id: 'r1',
        productId: '1',
        rating: 5,
        comment: 'Excellente qualité, très confortables pour la course!',
        isVisible: true,
        createdAt: new Date('2024-08-15'),
        client: {
          firstName: 'Marie',
          lastName: 'D.'
        }
      },
      {
        id: 'r2',
        productId: '1',
        rating: 4,
        comment: 'Bon produit, livraison rapide.',
        isVisible: true,
        createdAt: new Date('2024-09-01'),
        client: {
          firstName: 'Thomas',
          lastName: 'M.'
        }
      }
    ],
    averageRating: 4.5,
    _count: {
      reviews: 2,
      favorites: 156
    }
  },
  'adidas-ultraboost-22': {
    id: '2',
    name: 'Adidas Ultraboost 22',
    description: 'Les Adidas Ultraboost 22 redefinissent le confort avec leur technologie Boost révolutionnaire. Parfaites pour le running et l\'usage quotidien.',
    shortDescription: 'Chaussures de running haute performance',
    price: 189.99,
    comparePrice: 219.99,
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&h=600&fit=crop'
    ],
    categoryId: 'running',
    brandId: 'adidas',
    sku: 'AD-UB22-001',
    stock: 18,
    available: true,
    featured: false,
    isNewIn: true,
    tags: ['adidas', 'ultraboost', 'running', 'performance'],
    metaTitle: 'Adidas Ultraboost 22 - Chaussures de running',
    metaDescription: 'Découvrez les Adidas Ultraboost 22, des chaussures de running haute performance.',
    slug: 'adidas-ultraboost-22',
    weight: 0.9,
    dimensions: null,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-09-25'),
    category: {
      id: 'running',
      name: 'Running',
      slug: 'running',
      parent: {
        id: 'chaussures',
        name: 'Chaussures',
        slug: 'chaussures'
      }
    },
    brand: {
      id: 'adidas',
      name: 'Adidas',
      description: 'Impossible is Nothing',
      logo: 'https://logo.clearbit.com/adidas.com',
      isActive: true,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    variants: [
      {
        id: 'v4',
        productId: '2',
        size: '41',
        color: 'Bleu',
        colorHex: '#0000FF',
        material: 'Primeknit',
        sku: 'AD-UB22-001-41-BL',
        price: 189.99,
        stock: 6,
        images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'],
        isActive: true,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-09-25')
      }
    ],
    reviews: [
      {
        id: 'r3',
        productId: '2',
        rating: 5,
        comment: 'Parfaites pour mes sessions de running matinales!',
        isVisible: true,
        createdAt: new Date('2024-09-10'),
        client: {
          firstName: 'Antoine',
          lastName: 'L.'
        }
      }
    ],
    averageRating: 5.0,
    _count: {
      reviews: 1,
      favorites: 89
    }
  }
};

const STATIC_RECOMMENDED_PRODUCTS: ProductCardData[] = [
  {
    id: '3',
    name: 'Nike Air Force 1',
    slug: 'nike-air-force-1',
    price: 109.99,
    comparePrice: 129.99,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop'],
    brand: { name: 'Nike' },
    category: { name: 'Baskets' },
    _count: { reviews: 45 }
  },
  {
    id: '4',
    name: 'Adidas Stan Smith',
    slug: 'adidas-stan-smith',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop'],
    brand: { name: 'Adidas' },
    category: { name: 'Baskets' },
    _count: { reviews: 78 }
  },
  {
    id: '5',
    name: 'Converse Chuck Taylor',
    slug: 'converse-chuck-taylor',
    price: 69.99,
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'],
    brand: { name: 'Converse' },
    category: { name: 'Baskets' },
    _count: { reviews: 32 }
  }
];

const STATIC_SIMILAR_PRODUCTS: ProductCardData[] = [
  {
    id: '6',
    name: 'Nike Air Max 90',
    slug: 'nike-air-max-90',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop'],
    brand: { name: 'Nike' },
    category: { name: 'Baskets' },
    _count: { reviews: 67 }
  },
  {
    id: '7',
    name: 'Nike Air Max 95',
    slug: 'nike-air-max-95',
    price: 169.99,
    comparePrice: 189.99,
    images: ['https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop'],
    brand: { name: 'Nike' },
    category: { name: 'Baskets' },
    _count: { reviews: 23 }
  }
];

const STATIC_BREADCRUMBS = [
  { name: 'Accueil', href: '/' },
  { name: 'Chaussures', href: '/chaussures' },
  { name: 'Baskets', href: '/chaussures/baskets' }
];

const SingleProduct: React.FC<SingleProductProps> = ({ slug: propSlug }) => {
  const params = useParams();
  const router = useRouter();
  const slug = propSlug || (params?.slug as string);

  // État local pour les favoris
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false);

  // Récupération du produit depuis les données statiques
  const product = useMemo(() => {
    return STATIC_PRODUCTS[slug as string] || null;
  }, [slug]);

  // Simulation des breadcrumbs avec le produit actuel
  const breadcrumbs = useMemo(() => {
    if (!product) return STATIC_BREADCRUMBS;
    return [...STATIC_BREADCRUMBS, { name: product.name, href: `/products/${product.slug}` }];
  }, [product]);

  // Handlers
  const handleAddToBag = (variant?: ProductVariant) => {
    console.log('Add to bag:', { product: product?.name, variant });
    // Ici vous pouvez implémenter l'ajout au panier
    // Par exemple: addToCart(product.id, variant?.id, quantity)
  };

  const handleProductClick = (clickedProduct: ProductCardData) => {
    router.push(`/products/${clickedProduct.slug}`);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.has(productId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="py-4 px-4 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Gallery skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              
              {/* Info skeleton */}
              <div className="space-y-6">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Produit non trouvé
          </h1>
          <p className="text-gray-600">
            Le produit que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="py-4 px-4 max-w-7xl mx-auto">
        <div className="text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && <span className="mx-2">/</span>}
              <span 
                className={
                  index === breadcrumbs.length - 1 
                    ? 'text-black' 
                    : 'hover:text-black cursor-pointer'
                }
                onClick={() => {
                  if (index < breadcrumbs.length - 1) {
                    router.push(crumb.href);
                  }
                }}
              >
                {crumb.name}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-4 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galerie d'images */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.name}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={() => toggleFavorite(product.id)}
            />
          </div>

          {/* Informations produit */}
          <div>
            <ProductInfo
              product={product}
              onAddToBag={handleAddToBag}
            />
          </div>
        </div>
      </div>

      {/* Produits recommandés */}
      <div className="py-12 px-4 max-w-7xl mx-auto space-y-12">
        {/* We Think You'd Like */}
        <ProductRecommendations
          title="NOUS PENSONS QUE VOUS AIMEREZ"
          products={STATIC_RECOMMENDED_PRODUCTS}
          isLoading={false}
          onProductClick={handleProductClick}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />

        {/* Similar Styles */}
        <ProductRecommendations
          title="STYLES SIMILAIRES"
          products={STATIC_SIMILAR_PRODUCTS}
          isLoading={false}
          onProductClick={handleProductClick}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      </div>
    </div>
  );
};

export default SingleProduct;