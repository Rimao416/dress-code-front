
import React from 'react';

// Skeleton de base
const SkeletonBase = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Skeleton pour le Hero Slider
export const HeroSkeletonLoader = () => {
  return (
    <div className="relative h-screen w-full bg-gray-200 animate-pulse">
      {/* Image skeleton */}
      <div className="absolute inset-0 bg-gray-300" />
      
      {/* Content skeleton */}
      <div className="absolute bottom-8 left-8 z-20 max-w-sm space-y-4">
        <SkeletonBase className="h-10 w-80" />
        <SkeletonBase className="h-6 w-64" />
        <SkeletonBase className="h-12 w-32" />
      </div>
      
      {/* Pagination skeleton */}
      <div className="absolute bottom-8 right-8 flex space-x-2">
        {[1, 2, 3].map((i) => (
          <SkeletonBase key={i} className="w-3 h-3 rounded-full" />
        ))}
      </div>
    </div>
  );
};

// Skeleton pour ProductCard
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
      {/* Image skeleton */}
      <SkeletonBase className="w-full aspect-square" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-2">
        <SkeletonBase className="h-4 w-3/4" />
        <SkeletonBase className="h-4 w-1/2" />
        <SkeletonBase className="h-6 w-1/3" />
      </div>
    </div>
  );
};

// Skeleton pour la section Nouveautés
export const NewInSectionSkeleton = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left content skeleton */}
          <div className="lg:w-1/3 flex flex-col justify-center space-y-4">
            <SkeletonBase className="h-4 w-32" />
            <SkeletonBase className="h-12 w-full" />
            <SkeletonBase className="h-20 w-full" />
            <SkeletonBase className="h-12 w-40" />
          </div>
          
          {/* Products grid skeleton */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Skeleton pour la section Produits mis en avant
export const FeaturedProductsSkeleton = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Title skeleton */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <SkeletonBase className="h-6 w-80 mx-auto" />
        </div>
        
        {/* Products grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Skeleton pour une catégorie dans la grille
const CategoryCardSkeleton = ({ gridArea }: { gridArea?: string }) => {
  return (
    <div 
      className="relative overflow-hidden bg-gray-200 animate-pulse"
      style={{ gridArea }}
    >
      {/* Content skeleton */}
      <div className="absolute left-5 bottom-5 space-y-2">
        <SkeletonBase className="h-6 w-32 bg-gray-300" />
        <SkeletonBase className="h-4 w-24 bg-gray-300" />
        <SkeletonBase className="h-3 w-20 bg-gray-300" />
      </div>
      
      {/* Badge skeleton */}
      <div className="absolute top-3 right-3">
        <SkeletonBase className="h-6 w-8 rounded-full bg-gray-300" />
      </div>
    </div>
  );
};

// Skeleton pour la section Catégories
export const CategoriesSectionSkeleton = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Title skeleton */}
        <div className="text-center mb-12 space-y-4">
          <SkeletonBase className="h-12 w-80 mx-auto" />
          <SkeletonBase className="h-6 w-64 mx-auto" />
        </div>

        {/* Grid skeleton - utilise la même structure que la grille réelle */}
        <div 
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(4, 150px)',
            gridTemplateAreas: `
              "a a b b c c"
              "a a d d e e"  
              "f f g g e e"
              "f f h h i i"
            `
          }}
        >
          <CategoryCardSkeleton gridArea="a" />
          <CategoryCardSkeleton gridArea="b" />
          <CategoryCardSkeleton gridArea="c" />
          <CategoryCardSkeleton gridArea="d" />
          <CategoryCardSkeleton gridArea="e" />
          <CategoryCardSkeleton gridArea="f" />
          <CategoryCardSkeleton gridArea="g" />
          <CategoryCardSkeleton gridArea="h" />
          <CategoryCardSkeleton gridArea="i" />
        </div>
        
        {/* View all button skeleton */}
        <div className="text-center mt-8">
          <SkeletonBase className="h-12 w-48 mx-auto" />
        </div>
      </div>
    </section>
  );
};

// Skeleton pour la section Support
export const SupportSectionSkeleton = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="flex flex-col items-start space-y-4">
                <SkeletonBase className="w-8 h-8" />
                <div className="w-full space-y-2">
                  <SkeletonBase className="h-6 w-3/4" />
                  <SkeletonBase className="h-16 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Skeleton pour la section Newsletter
export const NewsletterSectionSkeleton = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column skeleton */}
          <div className="space-y-8">
            <div className="text-center lg:text-left space-y-4">
              <SkeletonBase className="h-8 w-40" />
              <SkeletonBase className="h-6 w-56" />
            </div>
            
            <SkeletonBase className="h-32 w-full" />
            
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <SkeletonBase className="w-8 h-8 rounded-full" />
                  <SkeletonBase className="h-6 w-3/4" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right column - Form skeleton */}
          <div className="bg-gray-50 p-8 rounded-xl">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <SkeletonBase className="h-4 w-16" />
                  <SkeletonBase className="h-12 w-full" />
                </div>
                <div className="space-y-2">
                  <SkeletonBase className="h-4 w-12" />
                  <SkeletonBase className="h-12 w-full" />
                </div>
              </div>
              
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <SkeletonBase className="h-4 w-20" />
                  <SkeletonBase className="h-12 w-full" />
                </div>
              ))}
              
              <SkeletonBase className="h-20 w-full" />
              <SkeletonBase className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Skeleton pour toute la HomePage
export const HomePageSkeleton = () => {
  return (
    <div className="min-h-screen">
      <HeroSkeletonLoader />
      <NewInSectionSkeleton />
      <FeaturedProductsSkeleton />
      <CategoriesSectionSkeleton />
      <SupportSectionSkeleton />
      <NewsletterSectionSkeleton />
    </div>
  );
};