// components/product/ProductGallery.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Search } from 'lucide-react';

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

  // Image par défaut
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
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={currentImage}
          alt={`${productName} - Image ${currentIndex + 1}`}
          fill
          className={`object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'group-hover:scale-105'
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Bouton favori */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200"
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-200 ${
                isFavorite
                  ? "fill-black text-black"
                  : "text-gray-600 hover:text-black"
              }`}
            />
          </button>
        )}

        {/* Bouton zoom */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label={isZoomed ? "Dézoomer" : "Zoomer"}
        >
          <Search className="h-5 w-5 text-gray-700" />
        </button>

        {/* Indicateur de position */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Vignettes */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                currentIndex === index
                  ? 'border-black shadow-sm'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Vignette ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 10vw"
                onError={(e) => {
                  e.currentTarget.src = defaultImage;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;