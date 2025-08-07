// components/product/ProductRecommendations.tsx
"use client";
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ProductCardData } from '@/types/product';
import ProductCard from '../common/ProductCard';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  const [swiper, setSwiper] = React.useState<any>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isBeginning, setIsBeginning] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);
  const handleProductClick = (product: ProductCardData) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      // Navigation par défaut vers la page produit
      window.location.href = `/products/${product.slug}`;
    }
  };

  const handleSlideChange = (swiper: any) => {
    setCurrentSlide(swiper.activeIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const slidePrev = () => {
    if (swiper && !isBeginning) {
      swiper.slidePrev();
    }
  };

  const slideNext = () => {
    if (swiper && !isEnd) {
      swiper.slideNext();
    }
  };

  // Calcul du nombre total de slides
  const totalSlides = products.length;

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-center w-full">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
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
          {/* <span className="text-sm text-gray-600">
            {currentSlide + 1} / {totalSlides}
          </span> */}
          <div className="flex space-x-1">
            <button
              onClick={slidePrev}
              disabled={isBeginning}
              className={`p-2 rounded-full border ${
                !isBeginning
                  ? 'border-gray-300 hover:border-black hover:bg-black hover:text-white'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              } transition-all duration-200`}
              aria-label="Produits précédents"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={slideNext}
              disabled={isEnd}
              className={`p-2 rounded-full border ${
                !isEnd
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

      {/* Swiper Container */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
          onReachBeginning={() => setIsBeginning(true)}
          onReachEnd={() => setIsEnd(true)}
          pagination={{
            el: '.swiper-pagination-custom',
            clickable: true,
            bulletClass: 'w-2 h-2 rounded-full bg-gray-300 transition-all duration-200 cursor-pointer',
            bulletActiveClass: 'bg-black',
            renderBullet: function (index, className) {
              return `<span class="${className}" aria-label="Page ${index + 1}"></span>`;
            },
          }}
          className="!overflow-visible"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                product={product}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={() => handleProductClick(product)}
                className="h-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation mobile (points) */}
      <div className="md:hidden flex justify-center space-x-2 swiper-pagination-custom"></div>

      {/* Navigation mobile (boutons) */}
      <div className="md:hidden flex justify-between items-center px-4">
        <button
          onClick={slidePrev}
          disabled={isBeginning}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
            !isBeginning
              ? 'border-gray-300 hover:border-black'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          } transition-all duration-200`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">Précédent</span>
        </button>
        <span className="text-sm text-gray-600">
          {currentSlide + 1} / {totalSlides}
        </span>
        <button
          onClick={slideNext}
          disabled={isEnd}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
            !isEnd
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