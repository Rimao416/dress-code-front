import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Minus, Plus, Heart, ChevronLeft, ChevronRight, Search, ShoppingBag } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

// Composant ProductGallery
const ProductGallery: React.FC<ProductGalleryProps> = ({ 
  images, 
  productName, 
  isFavorite = false, 
  onToggleFavorite 
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  
  const defaultImage: string = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNTAgMTUwTDM1MCAyNTBIMzAwVjM1MEgyMDBWMjUwSDE1MEwyNTAgMTUwWiIgZmlsbD0iIzk0OTRBNCIvPgo8L3N2Zz4K";
  
  // Fonction pour corriger le chemin des images
  const formatImagePath = (imagePath: string): string => {
    // Si l'image commence déjà par /, la retourner telle quelle
    if (imagePath.startsWith('/') || imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    // Sinon, ajouter le / au début
    return `/${imagePath}`;
  };
  
  const displayImages: string[] = images.length > 0 
    ? images.map(image => formatImagePath(image))
    : [defaultImage];
  const currentImage: string = displayImages[currentIndex];

  const goToPrevious = (): void => {
    setCurrentIndex((prev) => prev === 0 ? displayImages.length - 1 : prev - 1);
  };

  const goToNext = (): void => {
    setCurrentIndex((prev) => prev === displayImages.length - 1 ? 0 : prev + 1);
  };

  const goToImage = (index: number): void => {
    setCurrentIndex(index);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    e.currentTarget.src = defaultImage;
  };

  return (
    <div className="flex gap-4">
      {displayImages.length > 1 && (
        <div className="flex flex-col gap-2 w-20">
          {displayImages.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                currentIndex === index ? 'border-black shadow-sm' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Vignette ${index + 1}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
          <img
            src={currentImage}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'group-hover:scale-105'
            }`}
            onError={handleImageError}
          />
          
          {displayImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}

          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200"
            >
              <Heart
                className={`h-5 w-5 transition-all duration-200 ${
                  isFavorite ? "fill-black text-black" : "text-gray-600 hover:text-black"
                }`}
              />
            </button>
          )}

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Search className="h-5 w-5 text-gray-700" />
          </button>

          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;