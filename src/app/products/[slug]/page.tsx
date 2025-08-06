// components/pages/SingleProduct.tsx
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProduct, 
  useProductNavigation, 
  useSimilarProducts, 
  useRecommendedProducts, 
  useFavorites } from '@/hooks/product/useProduct';
import { ProductVariant } from '@/types/product';
import ProductGallery from '@/components/product/productGallery';
import ProductInfo from '@/components/product/productInfo';
import ProductRecommendations from '@/components/product/productRecommendations';

interface SingleProductProps {
  slug?: string;
}

const SingleProduct: React.FC<SingleProductProps> = ({ slug: propSlug }) => {
  const params = useParams();
  const router = useRouter();
  const slug = propSlug || (params?.slug as string);

  // Hooks pour les données
  const { product, isLoading, error } = useProduct(slug);
  const { breadcrumbs } = useProductNavigation();
  const { similarProducts, isLoading: isLoadingSimilar } = useSimilarProducts(slug, 5);
  const { recommendedProducts, isLoading: isLoadingRecommended } = useRecommendedProducts(slug, 5);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Handlers
  const handleAddToBag = (variant?: ProductVariant) => {
    console.log('Add to bag:', { product: product?.name, variant });
    // Ici vous pouvez implémenter l'ajout au panier
    // Par exemple: addToCart(product.id, variant?.id, quantity)
  };

  const handleProductClick = (clickedProduct: any) => {
    router.push(`/products/${clickedProduct.slug}`);
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
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {error || 'Produit non trouvé'}
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
          title="WE THINK YOU'D LIKE"
          products={recommendedProducts}
          isLoading={isLoadingRecommended}
          onProductClick={handleProductClick}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />

        {/* Similar Styles */}
        <ProductRecommendations
          title="SIMILAR STYLES"
          products={similarProducts}
          isLoading={isLoadingSimilar}
          onProductClick={handleProductClick}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      </div>
    </div>
  );
};

export default SingleProduct;