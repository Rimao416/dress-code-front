"use client"
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { testimonials } from '@/constant/data';

const TestimonialsSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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

  // Détermine si on utilise le mode "danse" (10+ témoignages)
  const useDanceMode = testimonials.length >= 10;

  // Sépare les témoignages en deux rangées pour le mode danse
  // On prend 5 éléments pour chaque rangée
  const topRowTestimonials = testimonials.slice(0, 5);
  const bottomRowTestimonials = testimonials.slice(5, 10);

  const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
    <div className="group relative bg-white rounded-lg p-6 lg:p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/60 hover:border-red-900/20 flex flex-col w-[280px] lg:w-[320px]">
      {/* Icône quote décorative */}
      <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-red-900 to-red-800 rounded-full flex items-center justify-center shadow-lg opacity-90 group-hover:scale-110 transition-transform duration-300">
        <Quote className="h-5 w-5 text-white" />
      </div>

      {/* Élément décoratif */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-stone-100 rounded-bl-[40px] opacity-50"></div>

      {/* Note étoiles */}
      <div className="flex gap-1 mb-4 relative z-10">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-red-900 fill-red-900" />
        ))}
      </div>

      {/* Texte du témoignage */}
      <p className="text-neutral-700 text-sm lg:text-base leading-relaxed mb-6 flex-grow relative z-10">
        "{testimonial.text}"
      </p>

      {/* Profil client */}
      <div className="flex items-center gap-3 pt-4 border-t border-stone-200/60 relative z-10">
        <div className="relative">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-stone-200"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-900 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-grow">
          <h4 className="font-semibold text-neutral-900 text-sm">
            {testimonial.name}
          </h4>
          <p className="text-xs text-neutral-500">{testimonial.role}</p>
        </div>
        <span className="text-xs text-neutral-400">{testimonial.date}</span>
      </div>

      {/* Accent décoratif en bas */}
      <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );

  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-0 w-1/3 h-64 bg-stone-200 transform rotate-12 opacity-40"></div>
        <div className="absolute bottom-32 left-0 w-1/4 h-80 bg-red-900/5 transform -rotate-6"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-red-900 to-red-700 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* En-tête de section */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-stone-200/60 mb-6">
            <Star className="h-4 w-4 text-red-900 fill-red-900" />
            <span className="text-xs text-neutral-700 font-medium tracking-wide">Avis certifiés</span>
          </div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-neutral-900 mb-4 leading-tight">
            Ce que nos clientes
            <br />
            <span className="relative inline-block">
              disent de nous
              <div className="absolute -bottom-1 left-0 w-full h-2.5 bg-red-900/15 -rotate-1 rounded-sm"></div>
            </span>
          </h2>

          <p className="text-base text-neutral-600 leading-relaxed">
            Découvrez les expériences authentiques de nos clientes satisfaites
          </p>
        </div>

        {/* Mode Swiper (moins de 10 témoignages) */}
        {!useDanceMode && (
          <>
            {/* Navigation desktop */}
            <div className="hidden lg:flex justify-end gap-2 mb-8">
              <button
                onClick={handlePrev}
                disabled={isBeginning}
                className={`p-3 rounded-full border transition-all duration-200 ${
                  isBeginning
                    ? 'border-stone-200 text-neutral-300 cursor-not-allowed'
                    : 'border-stone-300 text-neutral-700 hover:bg-white hover:border-neutral-400 hover:shadow-sm'
                }`}
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={isEnd}
                className={`p-3 rounded-full border transition-all duration-200 ${
                  isEnd
                    ? 'border-stone-200 text-neutral-300 cursor-not-allowed'
                    : 'border-stone-300 text-neutral-700 hover:bg-white hover:border-neutral-400 hover:shadow-sm'
                }`}
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Swiper Testimonials */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 2.5, spaceBetween: 24 },
                1280: { slidesPerView: 3, spaceBetween: 28 },
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              onSwiper={handleSwiper}
              onSlideChange={handleSlideChange}
              className="!pb-4"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation mobile */}
            <div className="flex lg:hidden justify-center gap-2 mt-8">
              <button
                onClick={handlePrev}
                disabled={isBeginning}
                className={`p-3 rounded-full border transition-all duration-200 ${
                  isBeginning
                    ? 'border-stone-200 text-neutral-300'
                    : 'border-stone-300 text-neutral-700 hover:bg-white hover:shadow-sm'
                }`}
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={isEnd}
                className={`p-3 rounded-full border transition-all duration-200 ${
                  isEnd
                    ? 'border-stone-200 text-neutral-300'
                    : 'border-stone-300 text-neutral-700 hover:bg-white hover:shadow-sm'
                }`}
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        )}

        {/* Mode Danse (10+ témoignages) - Disposition en grille décalée */}
        {useDanceMode && (
          <div className="space-y-6">
            <style>{`
              @keyframes scrollRight {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(calc(-280px * 5 - 20px * 5));
                }
              }
              @keyframes scrollLeft {
                0% {
                  transform: translateX(calc(-280px * 5 - 20px * 5));
                }
                100% {
                  transform: translateX(0);
                }
              }
              @media (min-width: 1024px) {
                @keyframes scrollRight {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(calc(-320px * 5 - 20px * 5));
                  }
                }
                @keyframes scrollLeft {
                  0% {
                    transform: translateX(calc(-320px * 5 - 20px * 5));
                  }
                  100% {
                    transform: translateX(0);
                  }
                }
              }
              .animate-scroll-right {
                animation: scrollRight 50s linear infinite;
              }
              .animate-scroll-left {
                animation: scrollLeft 50s linear infinite;
              }
              .testimonial-row:hover .animate-scroll-right,
              .testimonial-row:hover .animate-scroll-left {
                animation-play-state: paused;
              }
            `}</style>

            {/* Rangée du haut - 5 cartes alignées */}
            <div className="testimonial-row overflow-hidden">
              <div className="flex gap-5 animate-scroll-right">
                {[...topRowTestimonials, ...topRowTestimonials].map((testimonial, index) => (
                  <div key={`top-${testimonial.id}-${index}`} className="flex-shrink-0">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>

            {/* Rangée du bas - 5 cartes décalées vers la droite */}
            <div className="testimonial-row overflow-hidden">
              <div className="flex gap-5 animate-scroll-left" style={{ marginLeft: '50px' }}>
                {[...bottomRowTestimonials, ...bottomRowTestimonials].map((testimonial, index) => (
                  <div key={`bottom-${testimonial.id}-${index}`} className="flex-shrink-0">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default TestimonialsSection;