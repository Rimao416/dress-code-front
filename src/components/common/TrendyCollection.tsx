"use client";
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ProductCardItem } from '@/types/product';
import ProductCard from './ProductCard';
import { useNewInProducts } from '@/hooks/product/useNewInProducts';

interface TrendyCollectionSectionProps {
  products?: ProductCardItem[];
  onProductClick?: (product: ProductCardItem) => void;
}

const TrendyCollectionSection: React.FC<TrendyCollectionSectionProps> = ({ 
  products = [],
  onProductClick 
}) => {
  const [activeTab, setActiveTab] = useState<'special-offers' | 'best-selling'>('best-selling');
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Récupération des produits New In depuis l'API
  const { products: newInProducts, isLoading } = useNewInProducts(12);

  // Utiliser les produits fournis ou ceux de l'API
  const displayProducts = products.length > 0 ? products : newInProducts;

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  const handleSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section className="py-8 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Colonne gauche - Titre et CTA */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl lg:text-4xl font-serif text-neutral-900 leading-tight">
                Collection
                <br />
                tendance
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Les nouvelles arrivées pour vos amours. Découvrez les pièces qui feront sensation.
              </p>
            </div>
            <button className="group bg-neutral-900 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-neutral-800 transition-all duration-200 flex items-center gap-2">
              Voir tout
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Colonne droite - Produits avec Swiper */}
          <div className="lg:col-span-9">
            {/* Onglets et Navigation */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
             
              </div>

              {/* Navigation desktop */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={isBeginning}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    isBeginning
                      ? 'border-stone-200 text-neutral-300 cursor-not-allowed'
                      : 'border-stone-300 text-neutral-700 hover:bg-stone-50 hover:border-neutral-400'
                  }`}
                  aria-label="Produit précédent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={isEnd}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    isEnd
                      ? 'border-stone-200 text-neutral-300 cursor-not-allowed'
                      : 'border-stone-300 text-neutral-700 hover:bg-stone-50 hover:border-neutral-400'
                  }`}
                  aria-label="Produit suivant"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && displayProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-900 border-r-transparent"></div>
                <p className="mt-4 text-neutral-500 text-sm">Chargement des produits...</p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500">Aucun produit disponible pour le moment.</p>
              </div>
            ) : (
              <>
                {/* Swiper */}
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={24}
                  slidesPerView={1.5}
                  breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 2.5, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                    1280: { slidesPerView: 4, spaceBetween: 24 },
                  }}
                  onSwiper={handleSwiper}
                  onSlideChange={handleSlideChange}
                  className="!pb-2"
                >
                  {displayProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                      <ProductCard
                        product={product}
                        onClick={onProductClick}
                        showBrand={true}
                        showPrice={true}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Navigation mobile */}
                <div className="flex lg:hidden justify-center gap-2 mt-6">
                  <button
                    onClick={handlePrev}
                    disabled={isBeginning}
                    className={`p-2 rounded-full border transition-all duration-200 ${
                      isBeginning ? 'border-stone-200 text-neutral-300' : 'border-stone-300 text-neutral-700 hover:bg-stone-50'
                    }`}
                    aria-label="Produit précédent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isEnd}
                    className={`p-2 rounded-full border transition-all duration-200 ${
                      isEnd ? 'border-stone-200 text-neutral-300' : 'border-stone-300 text-neutral-700 hover:bg-stone-50'
                    }`}
                    aria-label="Produit suivant"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendyCollectionSection;