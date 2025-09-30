"use client";
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ProductCardItem } from '@/types/product';
import ProductCard from './ProductCard';

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

  // Produits de démonstration si aucun produit n'est fourni
  const defaultProducts: ProductCardItem[] = [
    {
      id: '1',
      name: 'Robe élégante en soie',
      slug: 'robe-elegante-en-soie',
      price: 199.0,
      comparePrice: 249.0,
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80'],
      brand: { name: 'Maison Laurent' },
      stock: 10,
      isNewIn: true,
      featured: false,
    },
    {
      id: '2',
      name: "Boucles d'oreilles dorées",
      slug: 'boucles-d-oreilles-dorees',
      price: 89.0,
      images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80'],
      brand: { name: 'Bijoux Chic' },
      stock: 15,
      isNewIn: false,
      featured: false,
    },
    {
      id: '3',
      name: 'Sac à main en cuir',
      slug: 'sac-a-main-en-cuir',
      price: 299.0,
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80'],
      brand: { name: 'Luxe Paris' },
      stock: 5,
      isNewIn: true,
      featured: false,
    },
    {
      id: '4',
      name: 'Escarpins élégants',
      slug: 'escarpins-elegants',
      price: 149.0,
      comparePrice: 199.0,
      images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80'],
      brand: { name: 'Chaussures Royale' },
      stock: 8,
      isNewIn: false,
      featured: false,
    },
    {
      id: '5',
      name: 'Collier pendentif perles',
      slug: 'collier-pendentif-perles',
      price: 129.0,
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80'],
      brand: { name: 'Bijoux Chic' },
      stock: 12,
      isNewIn: true,
      featured: false,
    },
    {
      id: '6',
      name: 'Bracelet en argent',
      slug: 'bracelet-en-argent',
      price: 79.0,
      images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80'],
      brand: { name: 'Maison Laurent' },
      stock: 20,
      isNewIn: false,
      featured: false,
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

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
    <section className="py-16 lg:py-20 bg-white">
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
                <button
                  onClick={() => setActiveTab('special-offers')}
                  className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'special-offers'
                      ? 'bg-stone-100 text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-stone-50'
                  }`}
                >
                  Offres spéciales
                </button>
                <button
                  onClick={() => setActiveTab('best-selling')}
                  className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'best-selling'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-stone-50'
                  }`}
                >
                  Meilleures ventes
                </button>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendyCollectionSection;
