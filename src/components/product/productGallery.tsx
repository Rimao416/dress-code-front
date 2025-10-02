// components/product/ProductGallery.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNTAgMTUwTDM1MCAyNTBIMzAwVjM1MEgyMDBWMjUwSDE1MEwyNTAgMTUwWiIgZmlsbD0iIzk0OTRBNCIvPgo8L3N2Zz4K";

  const displayImages = images.length > 0 ? images : [defaultImage];
  const currentImage = displayImages[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  return (
    <div className="flex gap-6">
      {/* Vignettes à gauche */}
      {displayImages.length > 1 && (
        <div className="flex flex-col gap-3 w-20">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-square bg-stone-100 rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                currentIndex === index
                  ? 'border-red-900 shadow-md ring-2 ring-red-900/20'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Vignette ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={(e) => {
                  e.currentTarget.src = defaultImage;
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image principale avec cadres décoratifs */}
      <div className="flex-1 relative">
        {/* Cadres décoratifs en arrière-plan */}
        <div className="absolute -top-3 -left-3 w-full h-full border-4 border-stone-300/60 transform rotate-2 rounded-sm -z-10"></div>
        <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-red-900/15 transform -rotate-3 rounded-sm -z-10"></div>
        
        <div className="relative aspect-square bg-stone-50 rounded-sm overflow-hidden group shadow-xl">
          <Image
            src={currentImage}
            alt={`${productName} - Image ${currentIndex + 1}`}
            fill
            className={`object-cover transition-all duration-500 ${
              isZoomed ? 'scale-150' : 'group-hover:scale-105'
            }`}
            sizes="(max-width: 640px) calc(100vw - 100px), (max-width: 1024px) calc(50vw - 100px), calc(40vw - 100px)"
            priority
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
          />
          
          {/* Contrôles de navigation */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/95 backdrop-blur-md rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg border border-stone-200/50"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-5 w-5 text-neutral-900" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/95 backdrop-blur-md rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg border border-stone-200/50"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-5 w-5 text-neutral-900" />
              </button>
            </>
          )}

          {/* Bouton favori */}
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-md rounded-full hover:bg-white transition-all duration-200 shadow-lg border border-stone-200/50"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart
                className={`h-5 w-5 transition-all duration-200 ${
                  isFavorite
                    ? "fill-red-900 text-red-900"
                    : "text-neutral-600 hover:text-red-900"
                }`}
              />
            </button>
          )}

          {/* Bouton zoom */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 left-4 p-2.5 bg-white/95 backdrop-blur-md rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg border border-stone-200/50"
            aria-label={isZoomed ? "Dézoomer" : "Zoomer"}
          >
            <ZoomIn className="h-5 w-5 text-neutral-900" />
          </button>

          {/* Indicateur de position élégant */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-white/10">
              {currentIndex + 1} / {displayImages.length}
            </div>
          )}

          {/* Points d'accent décoratifs */}
          <div className="absolute top-8 right-8 w-2 h-2 bg-red-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-stone-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;