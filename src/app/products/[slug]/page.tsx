"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProductGallery from '@/components/common/ProductGallery';
import ProductInfo from '@/components/common/ProductInfo';
import ProductRecommendations from '@/components/common/ProductRecommandation';
import { productsData } from '@/constant/data';
import Header from '@/components/common/Header';

// Interface Product
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

function SingleProduct() {
  const params = useParams();
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
 
  // Récupération du slug depuis les paramètres de l'URL
  const currentSlug: string = params?.slug as string || "";

  useEffect(() => {
    // Vérification que le slug existe
    if (!currentSlug) {
      setIsLoading(false);
      return;
    }

    // Simulation de chargement des données
    setIsLoading(true);
   
    // Debug : vérifiez vos données
    console.log('Recherche du slug:', currentSlug);
    console.log('Slugs disponibles:', productsData.map(p => p.slug));
   
    // Recherche du produit par slug avec fallback
    let product: Product | undefined = productsData.find((p: Product) => p.slug === currentSlug);
   
    // Si le produit n'est pas trouvé par slug, prendre le 2ème produit par défaut
    if (!product && productsData.length > 1) {
      console.warn(`Slug "${currentSlug}" non trouvé, utilisation du produit par défaut`);
      product = productsData[1]; // 2ème produit (index 1)
    } else if (!product && productsData.length > 0) {
      product = productsData[0]; // Premier produit si moins de 2 produits
    }
   
    console.log('Produit trouvé:', product);
   
    setTimeout(() => {
      setCurrentProduct(product || null);
      setIsLoading(false);
    }, 500);
  }, [currentSlug]);

  // Fonction pour obtenir 4 produits aléatoirement pour les recommandations
  const getRandomProducts = (excludeId: string, count: number = 4): Product[] => {
    const availableProducts: Product[] = productsData.filter((p: Product) => p.id !== excludeId);
    const shuffled: Product[] = [...availableProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleProductClick = (clickedProduct: Product): void => {
    setCurrentProduct(clickedProduct);
    // En vrai, ici vous feriez un router.push(`/products/${clickedProduct.slug}`)
  };

  const handleToggleFavorite = (productId?: string): void => {
    if (!productId) return;
   
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

  const isFavorite = (productId: string): boolean => {
    return favorites.has(productId);
  };

  const handleGoHome = (): void => {
    if (productsData.length > 0) {
      setCurrentProduct(productsData[0]);
    }
  };

  // Loading state avec meilleure structure
  if (isLoading) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-white">
          {/* Padding-top pour compenser le header fixe */}
          <div className="pt-16">
            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="animate-pulse space-y-6">
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
        </div>
      </>
    );
  }

  // Error state avec header
  if (!currentProduct) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-white flex items-center justify-center">
          {/* Padding-top pour compenser le header fixe */}
          <div className="pt-16 flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Produit non trouvé
              </h1>
              <p className="text-gray-600">
                Le produit que vous recherchez n'existe pas ou n'est plus disponible.
              </p>
              <button
                onClick={handleGoHome}
                className="inline-flex items-center justify-center bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors duration-200 rounded-lg font-medium"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const recommendedProducts: Product[] = getRandomProducts(currentProduct.id, 4);
  const similarProducts: Product[] = getRandomProducts(currentProduct.id, 4);

  return (
    <>
      <Header forceScrolledStyle={true} />
      <div className="min-h-screen bg-white">
        {/* Padding-top pour compenser le header fixe */}
        <div className="pt-16">
          {/* Breadcrumbs */}
          <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
              <button
                onClick={handleGoHome}
                className="hover:text-black transition-colors duration-200 flex items-center"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
              </button>
              <button
                onClick={handleGoHome}
                className="hover:text-black cursor-pointer transition-colors duration-200"
              >
                Accueil
              </button>
              <span className="text-gray-400" aria-hidden="true">/</span>
              <span className="hover:text-black cursor-pointer transition-colors duration-200">
                {currentProduct.brand?.name}
              </span>
              <span className="text-gray-400" aria-hidden="true">/</span>
              <span className="text-black font-medium">
                {currentProduct.name}
              </span>
            </nav>
          </div>

          {/* Contenu principal */}
          <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Galerie d'images */}
              <div className="order-1 lg:order-1">
                <ProductGallery
                  images={currentProduct.images}
                  productName={currentProduct.name}
                  isFavorite={isFavorite(currentProduct.id)}
                  onToggleFavorite={() => handleToggleFavorite(currentProduct.id)}
                />
              </div>

              {/* Informations produit */}
              <div className="order-2 lg:order-2">
                <ProductInfo product={currentProduct} />
              </div>
            </div>
          </main>

          {/* Section des recommandations */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
            {/* We Think You'd Like */}
            <div>
              <ProductRecommendations
                title="NOUS PENSONS QUE VOUS AIMEREZ"
                products={recommendedProducts}
                onProductClick={handleProductClick}
              />
            </div>

            {/* Similar Styles */}
            <div>
              <ProductRecommendations
                title="STYLES SIMILAIRES"
                products={similarProducts}
                onProductClick={handleProductClick}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;