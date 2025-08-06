// components/product/ProductRecommendations.tsx
"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCardData } from '@/types/product';
import ProductCard from '../common/ProductCard';

interface ProductRecommendationsProps {
  title: string;
  products: ProductCardData[];
  isLoading?: boolean;
  onProductClick?: (product: ProductCardData) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: (productId: string) => boolean;
  className?: string;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  title,
  products,
  isLoading = false,
  onProductClick,
  onToggleFavorite = () => {},
  isFavorite = () => false,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [visibleCount, setVisibleCount] = React.useState(5);

  // Adapter le nombre de produits visibles selon l'écran
  React.useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 640) {
          setVisibleCount(2);
        } else if (width < 768) {
          setVisibleCount(3);
        } else if (width < 1024) {
          setVisibleCount(4);
        } else {
          setVisibleCount(5);
        }
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex + visibleCount < products.length;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(prev => Math.min(products.length - visibleCount, prev + 1));
    }
  };

  const handleProductClick = (product: ProductCardData) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      // Navigation par défaut vers la page produit
      window.location.href = `/products/${product.slug}`;
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-center w-full">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: visibleCount }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex-1 text-center">{title}</h2>
        
        {/* Navigation desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {Math.max(1, products.length - visibleCount + 1)}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border ${
                canScrollLeft
                  ? 'border-gray-300 hover:border-black hover:bg-black hover:text-white'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              } transition-all duration-200`}
              aria-label="Produits précédents"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border ${
                canScrollRight
                  ? 'border-gray-300 hover:border-black hover:bg-black hover:text-white'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              } transition-all duration-200`}
              aria-label="Produits suivants"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grille de produits */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            width: `${(products.length / visibleCount) * 100}%`
          }}
        >
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="flex-shrink-0"
              style={{ width: `${100 / products.length}%` }}
            >
              <ProductCard
                product={product}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={() => handleProductClick(product)}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation mobile (points) */}
      <div className="md:hidden flex justify-center space-x-2">
        {Array.from({ length: Math.ceil(products.length / visibleCount) }).map((_, index) => {
          const isActive = Math.floor(currentIndex / visibleCount) === index;
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * visibleCount)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                isActive ? 'bg-black' : 'bg-gray-300'
              }`}
              aria-label={`Page ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Navigation mobile (boutons) */}
      <div className="md:hidden flex justify-between items-center px-4">
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
            canScrollLeft
              ? 'border-gray-300 hover:border-black'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          } transition-all duration-200`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">Précédent</span>
        </button>

        <span className="text-sm text-gray-600">
          {Math.floor(currentIndex / visibleCount) + 1} / {Math.ceil(products.length / visibleCount)}
        </span>

        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
            canScrollRight
              ? 'border-gray-300 hover:border-black'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          } transition-all duration-200`}
        >
          <span className="text-sm">Suivant</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductRecommendations;