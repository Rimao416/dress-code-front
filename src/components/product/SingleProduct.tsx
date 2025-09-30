"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductVariant, ProductCardData } from '@/types/product';

import ProductGallery from '@/components/product/productGallery';
import ProductInfo from '@/components/product/productInfo';
import ProductRecommendations from '@/components/product/productRecommendations';
import { useProduct, useProductUtils } from '@/hooks/product/useProduct';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import Footer from '../common/Footer';

interface SingleProductProps {
  slug?: string;
}

const SingleProduct: React.FC<SingleProductProps> = ({ slug: propSlug }) => {
  const params = useParams();
  const router = useRouter();
  const slug = propSlug || (params?.slug as string);

  // États locaux
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Zustand stores
  const {
    isFavorite,
    toggleFavorite,
    loadFavorites,
    isLoading: favoritesLoading,
  } = useFavoritesStore();

  const {
    addToCart,
    isInCart,
    getCartItem,
  } = useCartStore();

  // Utilisation du hook useProduct
  const {
    product,
    similarProducts,
    recommendedProducts,
    breadcrumbs,
    isLoading,
    isLoadingSimilar,
    isLoadingRecommended,
    error,
  } = useProduct(slug);

  // Utilitaires produit
  const productUtils = useProductUtils(product);

  // Charger les données au montage
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Sélectionner la variante par défaut quand le produit est chargé
  useEffect(() => {
    if (product && !selectedVariant) {
      const defaultVariant = productUtils.defaultVariant;
      if (defaultVariant) {
        setSelectedVariant(defaultVariant);
      }
    }
  }, [product, productUtils.defaultVariant, selectedVariant]);

  // Handlers
  const handleAddToBag = async (variant?: ProductVariant) => {
    if (!product) return;
    
    const variantToUse = variant || selectedVariant;
    
    try {
      await addToCart(
        product,
        variantToUse || undefined,
        quantity,
      );
      
      // Réinitialiser la quantité après ajout
      setQuantity(1);
      
      // TODO: Afficher une notification de succès
      console.log('✅ Produit ajouté au panier');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout au panier:', error);
      // TODO: Afficher une notification d'erreur
    }
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // Réinitialiser la quantité lors du changement de variante
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;
    
    const variantToCheck = selectedVariant || productUtils.defaultVariant;
    const maxStock = variantToCheck?.stock || product.stock;
    
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleProductClick = (clickedProduct: ProductCardData) => {
    // Réinitialiser l'état lors de la navigation
    setSelectedVariant(null);
    setQuantity(1);
    router.push(`/products/${clickedProduct.slug}`);
  };

  const handleToggleFavorite = async (productId: string) => {
    try {
      await toggleFavorite(productId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // TODO: Afficher une notification d'erreur
    }
  };

  // Calculs dérivés
  const currentVariant = selectedVariant || productUtils.defaultVariant;
  const effectivePrice = productUtils.getEffectivePrice(currentVariant);
  const maxQuantity = currentVariant?.stock || product?.stock || 0;
  const isProductInCart = product ? isInCart(product.id, currentVariant?.id) : false;
  const cartItem = product && currentVariant ? getCartItem(product.id, currentVariant.id) : null;

  // Skeleton de chargement
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-white pt-26">
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

          {/* Recommendations skeleton */}
          <div className="py-12 space-y-12">
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-square bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // État de chargement
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // État d'erreur
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-26">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {error === 'Product not found' ? 'Produit non trouvé' : 'Erreur'}
          </h1>
          <p className="text-gray-600">
            {error === 'Product not found' 
              ? 'Le produit que vous recherchez n\'existe pas ou n\'est plus disponible.'
              : error || 'Une erreur est survenue lors du chargement du produit.'
            }
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors rounded"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-26">
      {/* Breadcrumbs */}
      <div className="py-6 px-4 max-w-7xl mx-auto">
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
      <div className="pb-8 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galerie d'images */}
          <div>
            <ProductGallery
              images={currentVariant?.images.length ? currentVariant.images : product.images}
              productName={product.name}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={() => handleToggleFavorite(product.id)}
            />
          </div>

          {/* Informations produit */}
          <div>
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
              maxQuantity={maxQuantity}
              effectivePrice={effectivePrice}
              isInCart={isProductInCart}
              cartQuantity={cartItem?.quantity || 0}
              onAddToBag={handleAddToBag}
              onVariantChange={handleVariantChange}
              onQuantityChange={handleQuantityChange}
              productUtils={productUtils}
            />
          </div>
        </div>
      </div>

      {/* Produits recommandés */}
      <div className="py-12 px-4 max-w-7xl mx-auto space-y-12">
        {/* Produits recommandés */}
        <ProductRecommendations
          title="NOUS PENSONS QUE VOUS AIMEREZ"
          products={recommendedProducts}
          isLoading={isLoadingRecommended}
          onProductClick={handleProductClick}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />

        {/* Produits similaires */}
        <ProductRecommendations
          title="STYLES SIMILAIRES"
          products={similarProducts}
          isLoading={isLoadingSimilar}
          onProductClick={handleProductClick}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
      </div>
      <Footer/>
    </div>
  );
};

export default SingleProduct;